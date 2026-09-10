/**
 * Script cập nhật metadata Album & STT cho các ảnh đã có sẵn trong manifest
 * Dựa trên cấu trúc folderPath thực tế.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const manifestPath = path.resolve(process.cwd(), "src/generated/image-manifest.json");

function slugify(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function run() {
  const raw = await readFile(manifestPath, "utf8");
  const data = JSON.parse(raw);

  // Sắp xếp theo folder -> filename
  data.images.sort((a, b) => {
    const fCompare = String(a.source.folderPath ?? "").localeCompare(String(b.source.folderPath ?? ""));
    if (fCompare !== 0) return fCompare;
    return String(a.source.name).localeCompare(String(b.source.name));
  });

  const albumCounters = new Map();
  for (const img of data.images) {
    const rawFolder = img.source.folderPath ? img.source.folderPath.trim() : "";
    const albumName = rawFolder.length > 0 ? rawFolder.split("/").pop() : "Highlights";
    const albumSlug = slugify(albumName) || "highlights";

    const currentCount = (albumCounters.get(albumSlug) ?? 0) + 1;
    albumCounters.set(albumSlug, currentCount);

    const indexNumber = String(currentCount).padStart(2, "0");

    img.albumName = albumName;
    img.albumSlug = albumSlug;
    img.itemIndex = currentCount;
    img.indexTag = `#${indexNumber}`;
    img.customTitle = `${albumName} #${indexNumber}`;
  }

  data.albums = Array.from(albumCounters.entries()).map(([slug, count]) => {
    const sample = data.images.find((i) => i.albumSlug === slug);
    return {
      slug,
      name: sample?.albumName ?? slug,
      count,
    };
  });

  await writeFile(manifestPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`[album-sync] Đã gán album & STT cho ${data.images.length} ảnh thuộc ${data.albums.length} albums.`);
}

run().catch(console.error);
