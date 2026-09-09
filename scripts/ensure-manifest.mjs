/**
 * Guarantees src/generated/image-manifest.json exists and parses.
 *
 * Wired as `predev` and `prebuild` in package.json so a fresh clone builds and
 * renders before the first Google Drive sync has ever run. Never overwrites a
 * manifest that already contains images.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const manifestPath = path.resolve(
  repoRoot,
  process.env.MANIFEST_PATH ?? "./src/generated/image-manifest.json",
);

const EMPTY = {
  generatedAt: null,
  count: 0,
  source: { provider: "google-drive", folderId: process.env.DRIVE_FOLDER_ID ?? "" },
  publicBase: "/images",
  images: [],
};

async function main() {
  await mkdir(path.dirname(manifestPath), { recursive: true });

  if (existsSync(manifestPath)) {
    try {
      const parsed = JSON.parse(await readFile(manifestPath, "utf8"));
      if (parsed && Array.isArray(parsed.images)) {
        console.log(`[manifest] ok, ${parsed.images.length} images`);
        return;
      }
      console.warn("[manifest] file exists but has no images array, resetting to empty");
    } catch (err) {
      console.warn(`[manifest] file exists but is not valid JSON (${err.message}), resetting to empty`);
    }
  } else {
    console.log("[manifest] not found, writing empty manifest");
    console.log("[manifest] run `npm run sync` to pull images from Google Drive");
  }

  await writeFile(manifestPath, `${JSON.stringify(EMPTY, null, 2)}\n`, "utf8");
}

main().catch((err) => {
  console.error(`[manifest] FAILED: ${err.message}`);
  process.exitCode = 1;
});
