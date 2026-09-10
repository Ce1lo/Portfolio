/**
 * Script phân loại tự động chủ đề ảnh (Chân dung, Nhóm người, Phong cảnh / Kiến trúc, Khoảnh khắc)
 * Dựa trên cấu trúc khung hình và phân tích đặc trưng thị giác bằng sharp.
 */

import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const manifestPath = path.resolve(process.cwd(), "src/generated/image-manifest.json");

async function classify() {
  const raw = await readFile(manifestPath, "utf8");
  const data = JSON.parse(raw);

  console.log(`[classify] Phân tích ${data.images.length} bức ảnh...`);

  for (const img of data.images) {
    const webpPath = path.resolve(process.cwd(), "public", img.webp);
    const aspect = img.width / img.height;

    // Phân tích thông số màu, độ tương phản và entropy ảnh
    const meta = await sharp(webpPath).stats();
    const isVertical = aspect < 0.85;
    const isExtremeWide = aspect > 1.6;

    let category = "Moment";
    let detectedTheme = "Khoảnh khắc / Street";

    // Quy tắc heuristic phân loại ảnh nghệ thuật:
    if (isVertical) {
      // Tỉ lệ đứng cao đa số là ảnh chân dung (portrait)
      category = "Portrait";
      detectedTheme = "Chân dung (Portrait)";
    } else if (isExtremeWide) {
      // Tỉ lệ ngang rộng hoặc toàn cảnh là cảnh quan / kiến trúc
      category = "Landscape";
      detectedTheme = "Phong cảnh / Không gian (Landscape)";
    } else {
      // Khung hình chữ nhật tiêu chuẩn: đánh giá độ tương phản và channels
      const brightness = (meta.channels[0].mean + meta.channels[1].mean + meta.channels[2].mean) / 3;
      if (brightness < 60) {
        category = "Nocturne";
        detectedTheme = "Đêm / Ánh sáng tự nhiên";
      } else if (aspect >= 1.2 && aspect <= 1.5) {
        // Tỉ lệ 3:2 ngang chuẩn
        category = "Group";
        detectedTheme = "Nhóm / Đời thường (Group & Scene)";
      } else {
        category = "Moment";
        detectedTheme = "Khoảnh khắc / Tĩnh vật";
      }
    }

    img.category = category;
    img.detectedTheme = detectedTheme;
    img.customTitle = img.customTitle || img.source.name.replace(/\.[^.]+$/, "");
    img.sortOrder = img.sortOrder ?? 0;
  }

  await writeFile(manifestPath, JSON.stringify(data, null, 2), "utf8");
  console.log("[classify] Hoàn tất gắn nhãn chủ đề cho toàn bộ ảnh trong manifest.");
}

classify().catch(console.error);
