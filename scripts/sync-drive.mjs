/**
 * Google Drive -> static asset sync.
 *
 * Pulls every image out of a Drive folder (recursively), validates it by magic
 * bytes, strips EXIF, re-encodes to AVIF + WebP, writes the result into
 * public/images/ and records a typed manifest at src/generated/image-manifest.json.
 *
 * Runs at build time or on demand. The deployed site never talks to Drive:
 * images are ordinary static files served by the Vercel CDN.
 *
 * Usage:
 *   npm run sync          (local, reads .env if present)
 *   npm run build:sync    (CI/Vercel, sync then next build)
 */

import { google } from "googleapis";
import sharp from "sharp";
import { mkdir, writeFile, readFile, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { createHash } from "node:crypto";

const repoRoot = process.cwd();

function resolveFromRoot(p) {
  return path.isAbsolute(p) ? p : path.resolve(repoRoot, p);
}

const cfg = {
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_FILE ?? "",
  keyJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? "",
  folderId: process.env.DRIVE_FOLDER_ID ?? "",
  scopes: (process.env.DRIVE_SCOPES ?? "https://www.googleapis.com/auth/drive.readonly")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  outDir: resolveFromRoot(process.env.OUT_DIR ?? "./public/images"),
  manifestPath: resolveFromRoot(process.env.MANIFEST_PATH ?? "./src/generated/image-manifest.json"),
  maxWidth: Number(process.env.MAX_WIDTH ?? 1920),
  avifQuality: Number(process.env.AVIF_QUALITY ?? 52),
  webpQuality: Number(process.env.WEBP_QUALITY ?? 78),
  allowSvg: (process.env.ALLOW_SVG ?? "false") === "true",
  pruneOrphans: (process.env.PRUNE_ORPHANS ?? "true") === "true",
  concurrency: Math.max(1, Number(process.env.SYNC_CONCURRENCY ?? 4)),
  failOnError: (process.env.SYNC_FAIL_ON_ERROR ?? "false") === "true",
};

const KEY_FILE_CANDIDATES = [
  cfg.keyFile,
  "./services-account.json",
  "./service-account.json",
  "./secrets/services-account.json",
  "./secrets/service-account.json",
].filter(Boolean);

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const GIF_MAGIC = Buffer.from("GIF8", "ascii");
const BMP_MAGIC = Buffer.from("BM", "ascii");
const TIFF_LE = Buffer.from([0x49, 0x49, 0x2a, 0x00]);
const TIFF_BE = Buffer.from([0x4d, 0x4d, 0x00, 0x2a]);
const AVIF_BRANDS = new Set(["avif", "avis", "mif1", "msf1"]);
const HEIC_BRANDS = new Set(["heic", "heix", "heim", "heis", "hevc", "hevx"]);

/**
 * Identify an image by its magic bytes.
 *
 * Never trust Drive's mimeType or the file extension: both are attacker-controlled
 * and both are routinely wrong for files renamed on a phone or in a chat app.
 * Returns a lowercase type token, or null when the buffer is not a known image.
 */
function detectImageType(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 12) return null;

  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.subarray(0, 8).equals(PNG_MAGIC)) return "png";
  if (buf.subarray(0, 4).equals(GIF_MAGIC)) return "gif";
  if (buf.subarray(0, 2).equals(BMP_MAGIC)) return "bmp";
  if (buf.subarray(0, 4).equals(TIFF_LE) || buf.subarray(0, 4).equals(TIFF_BE)) return "tiff";

  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
    return "webp";
  }

  if (buf.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = buf.subarray(8, 12).toString("ascii");
    if (AVIF_BRANDS.has(brand)) return "avif";
    if (HEIC_BRANDS.has(brand)) return "heic";
  }

  const head = buf.subarray(0, 512).toString("utf8").replace(/^\uFEFF/, "").trimStart().toLowerCase();
  if (head.startsWith("<svg")) return "svg";
  if (head.startsWith("<?xml") && head.includes("<svg")) return "svg";

  return null;
}

/** Transliterate a Drive filename into a URL-safe slug. Handles Vietnamese diacritics. */
function slugify(name) {
  const base = String(name).replace(/\.[^.]+$/, "");
  const slug = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug.length > 0 ? slug : "image";
}

function shortHash(value, len = 10) {
  return createHash("sha1").update(value).digest("hex").slice(0, len);
}

/** Fixed-size worker pool. Avoids hammering Drive API quota with unbounded parallelism. */
async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const width = Math.max(1, Math.min(limit, items.length));
  const runners = Array.from({ length: width }, async () => {
    for (;;) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

function loadCredentials() {
  if (cfg.keyJson.trim().length > 0) {
    let parsed;
    try {
      parsed = JSON.parse(cfg.keyJson);
    } catch (err) {
      throw new Error(
        `GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON: ${err.message}. ` +
          `It must be the whole key file on a single line, with no trailing newline.`,
      );
    }
    if (parsed.type !== "service_account" || typeof parsed.private_key !== "string") {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_JSON does not look like a service account key " +
          "(missing type=service_account or private_key).",
      );
    }
    const auth = new google.auth.GoogleAuth({
      credentials: parsed,
      scopes: cfg.scopes,
    });
    return { auth, source: "GOOGLE_SERVICE_ACCOUNT_JSON" };
  }

  for (const candidate of KEY_FILE_CANDIDATES) {
    const abs = resolveFromRoot(candidate);
    if (existsSync(abs)) {
      const auth = new google.auth.GoogleAuth({ keyFile: abs, scopes: cfg.scopes });
      return { auth, source: abs };
    }
  }

  throw new Error(
    "No service account credential found.\n" +
      `Looked for GOOGLE_SERVICE_ACCOUNT_JSON, then these files:\n  ${KEY_FILE_CANDIDATES.join("\n  ")}\n` +
      "See docs/SETUP.md steps 1-8 to create one.",
  );
}

function createDriveClient() {
  if (!cfg.folderId) {
    throw new Error(
      "DRIVE_FOLDER_ID is empty. Open the Drive folder in a browser and copy the ID " +
        "from https://drive.google.com/drive/folders/<ID> into .env. See docs/SETUP.md step 7.",
    );
  }
  const { auth, source } = loadCredentials();
  console.log(`[sync] credential source: ${source}`);
  return google.drive({ version: "v3", auth, timeout: 60_000 });
}

const LIST_FIELDS = [
  "nextPageToken",
  "files(id,name,mimeType,md5Checksum,size,createdTime,modifiedTime,parents)",
  "files(imageMediaMetadata(width,height,rotation))",
].join(",");

/** Depth-first walk of the Drive folder tree. Collects non-folder files with their relative path. */
async function walkFolder(drive, folderId, prefix, acc, depth = 0) {
  if (depth > 8) {
    console.warn(`[sync] folder nesting deeper than 8 at "${prefix}", stopping descent`);
    return;
  }
  let pageToken;
  do {
    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: LIST_FIELDS,
      pageSize: 1000,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    for (const file of data.files ?? []) {
      if (
        file.mimeType === "application/vnd.google-apps.folder" ||
        file.mimeType === "application/vnd.google.folder"
      ) {
        const nextPrefix = prefix ? `${prefix}/${file.name}` : file.name;
        await walkFolder(drive, file.id, nextPrefix, acc, depth + 1);
      } else {
        acc.push({ ...file, folderPath: prefix });
      }
    }
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);
}

async function downloadBuffer(drive, fileId) {
  const res = await drive.files.get(
    { fileId, alt: "media", supportsAllDrives: true },
    { responseType: "arraybuffer", timeout: 120_000 },
  );
  return Buffer.from(res.data);
}

/**
 * Normalise -> strip metadata -> emit AVIF and WebP.
 *
 * `.rotate()` with no argument applies the EXIF orientation flag, then every
 * metadata field is dropped on re-encode. GPS coordinates embedded by a phone
 * camera therefore never reach the published site.
 */
async function encodeVariants(buf) {
  const base = sharp(buf, { failOn: "none", animated: false }).rotate();

  if (cfg.maxWidth > 0) {
    base.resize({ width: cfg.maxWidth, withoutEnlargement: true });
  }

  // PNG as an intermediate keeps the pipeline lossless between the two encodes.
  const normalised = await base.withMetadata({}).png({ compressionLevel: 9, palette: false }).toBuffer();

  const meta = await sharp(normalised).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  const [avif, webp] = await Promise.all([
    sharp(normalised).avif({ quality: cfg.avifQuality, effort: 5, chromaSubsampling: "4:2:0" }).toBuffer(),
    sharp(normalised).webp({ quality: cfg.webpQuality, effort: 5, smartSubsample: true }).toBuffer(),
  ]);

  return { avif, webp, width, height };
}

async function loadManifest() {
  if (!existsSync(cfg.manifestPath)) return { generatedAt: null, count: 0, images: [] };
  try {
    const parsed = JSON.parse(await readFile(cfg.manifestPath, "utf8"));
    if (!parsed || !Array.isArray(parsed.images)) return { generatedAt: null, count: 0, images: [] };
    return parsed;
  } catch {
    console.warn("[sync] existing manifest is not valid JSON, starting fresh");
    return { generatedAt: null, count: 0, images: [] };
  }
}

async function main() {
  const startedAt = Date.now();
  const drive = createDriveClient();

  await mkdir(cfg.outDir, { recursive: true });
  await mkdir(path.dirname(cfg.manifestPath), { recursive: true });

  const previous = await loadManifest();
  const prevByFileId = new Map(previous.images.map((img) => [img.source.fileId, img]));

  console.log(`[sync] listing folder ${cfg.folderId}`);
  const allFiles = [];
  await walkFolder(drive, cfg.folderId, "", allFiles);

  const candidates = allFiles.filter((f) => String(f.mimeType ?? "").startsWith("image/"));
  console.log(`[sync] ${allFiles.length} entries found, ${candidates.length} declared as images`);

  const kept = [];
  const written = [];
  const skipped = [];
  const failed = [];

  const removeStale = async (entry) => {
    if (!entry) return;
    await rm(path.join(cfg.outDir, path.basename(entry.avif)), { force: true });
    await rm(path.join(cfg.outDir, path.basename(entry.webp)), { force: true });
  };

  await pool(candidates, cfg.concurrency, async (file) => {
    const folderPath = file.folderPath ?? "";
    const slug = slugify(file.name);
    // Hash covers folder + name + fileId, so moving or renaming in Drive produces a
    // new filename and the old CDN asset stays valid until it is pruned.
    const stableId = `${folderPath}\u0000${file.name}\u0000${file.id}`;
    const hash = shortHash(stableId);
    const baseName = `${slug}-${hash}`;
    const avifName = `${baseName}.avif`;
    const webpName = `${baseName}.webp`;
    const avifPath = path.join(cfg.outDir, avifName);
    const webpPath = path.join(cfg.outDir, webpName);
    const publicAvif = `images/${avifName}`;
    const publicWebp = `images/${webpName}`;

    const prev = prevByFileId.get(file.id) ?? null;
    const remoteMd5 = file.md5Checksum ?? null;

    const entry = {
      id: hash,
      slug,
      source: {
        fileId: file.id,
        name: file.name,
        folderPath,
        md5: remoteMd5,
        mimeType: file.mimeType ?? null,
        sizeBytes: Number(file.size ?? 0),
        modifiedTime: file.modifiedTime ?? null,
      },
      avif: publicAvif,
      webp: publicWebp,
      width: 0,
      height: 0,
      bytes: { avif: 0, webp: 0 },
      createdAt: file.createdTime ?? new Date().toISOString(),
      syncedAt: new Date().toISOString(),
    };

    const bothExist = (await existsSync(avifPath)) && (await existsSync(webpPath));
    const unchanged = Boolean(
      prev && bothExist && remoteMd5 && prev.source.md5 === remoteMd5 && prev.avif === publicAvif,
    );

    if (unchanged) {
      kept.push({ ...prev, source: { ...prev.source, md5: remoteMd5, modifiedTime: entry.source.modifiedTime } });
      skipped.push(file.name);
      return;
    }

    // Filename or content changed: drop the previous output before writing the new one.
    if (prev) await removeStale(prev);

    let buf;
    try {
      buf = await downloadBuffer(drive, file.id);
    } catch (err) {
      failed.push({ name: file.name, reason: `download failed: ${err.message}` });
      if (prev) kept.push(prev);
      return;
    }

    const detected = detectImageType(buf);
    if (detected === null) {
      failed.push({ name: file.name, reason: "magic bytes are not a recognised image, skipped" });
      if (prev) kept.push(prev);
      return;
    }
    if (detected === "svg" && !cfg.allowSvg) {
      failed.push({
        name: file.name,
        reason: "SVG rejected (XML can carry script, stored-XSS risk). Set ALLOW_SVG=true only if you authored it.",
      });
      if (prev) kept.push(prev);
      return;
    }

    let variants;
    try {
      variants = await encodeVariants(buf);
    } catch (err) {
      failed.push({ name: file.name, reason: `decode/encode failed (${detected}): ${err.message}` });
      if (prev) kept.push(prev);
      return;
    }

    await writeFile(avifPath, variants.avif);
    await writeFile(webpPath, variants.webp);

    entry.width = variants.width;
    entry.height = variants.height;
    entry.bytes = { avif: variants.avif.byteLength, webp: variants.webp.byteLength };

    kept.push(entry);
    const src = file.imageMediaMetadata?.width
      ? `${file.imageMediaMetadata.width}x${file.imageMediaMetadata.height}`
      : `${variants.width}x${variants.height}`;
    const savedKb = ((Number(file.size ?? 0) - variants.avif.byteLength) / 1024).toFixed(0);
    written.push(`${file.name} [${src}] -> avif ${(variants.avif.byteLength / 1024).toFixed(1)} KB (saved ~${savedKb} KB)`);
  });

  kept.sort((a, b) => {
    // Sắp xếp theo Album trước, sau đó theo tên file gốc hoặc thời gian tạo
    const folderCompare = String(a.source.folderPath ?? "").localeCompare(String(b.source.folderPath ?? ""));
    if (folderCompare !== 0) return folderCompare;
    return String(a.source.name).localeCompare(String(b.source.name));
  });

  // Tự động gán Album name, Album slug và STT cho từng ảnh theo thư mục
  const albumCounters = new Map();
  for (const img of kept) {
    const rawFolder = img.source.folderPath ? img.source.folderPath.trim() : "";
    const albumName = rawFolder.length > 0 ? rawFolder.split("/").pop() : "Highlights";
    const albumSlug = slugify(albumName);

    const currentCount = (albumCounters.get(albumSlug) ?? 0) + 1;
    albumCounters.set(albumSlug, currentCount);

    const indexNumber = String(currentCount).padStart(2, "0");

    img.albumName = albumName;
    img.albumSlug = albumSlug;
    img.itemIndex = currentCount;
    img.indexTag = `#${indexNumber}`;
    // Tự động gán tiêu đề có STT nếu chưa đặt tên riêng
    img.customTitle = `${albumName} #${indexNumber}`;
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    count: kept.length,
    albums: Array.from(albumCounters.entries()).map(([slug, count]) => {
      const sample = kept.find((i) => i.albumSlug === slug);
      return {
        slug,
        name: sample?.albumName ?? slug,
        count,
      };
    }),
    source: { provider: "google-drive", folderId: cfg.folderId },
    publicBase: "/images",
    images: kept,
  };

  await writeFile(cfg.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  if (cfg.pruneOrphans) {
    const live = new Set(kept.flatMap((img) => [path.basename(img.avif), path.basename(img.webp)]));
    const onDisk = await readdir(cfg.outDir);
    for (const name of onDisk) {
      if (!/\.(avif|webp)$/i.test(name)) continue;
      if (live.has(name)) continue;
      await rm(path.join(cfg.outDir, name), { force: true });
      console.log(`[prune] removed orphan ${name}`);
    }
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log("");
  console.log(`[sync] done in ${elapsed}s`);
  console.log(`[sync] encoded : ${written.length}`);
  for (const line of written) console.log(`   + ${line}`);
  console.log(`[sync] skipped : ${skipped.length} (unchanged md5)`);
  console.log(`[sync] rejected: ${failed.length}`);
  for (const f of failed) console.log(`   ! ${f.name}: ${f.reason}`);
  console.log(`[sync] manifest: ${path.relative(repoRoot, cfg.manifestPath)} (${kept.length} images)`);

  if (failed.length > 0 && cfg.failOnError) {
    console.error("[sync] SYNC_FAIL_ON_ERROR=true and there were rejections, exiting 1");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("");
  console.error("[sync] FAILED");
  console.error(`[sync] ${err.message}`);
  if (err.code) console.error(`[sync] code=${err.code}`);
  if (err.errors?.length) {
    for (const e of err.errors.slice(0, 5)) console.error(`[sync]   - ${e.message ?? JSON.stringify(e)}`);
  }
  process.exitCode = 1;
});
