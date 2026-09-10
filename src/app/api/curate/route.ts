import { NextResponse } from "next/server";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const manifestPath = path.resolve(process.cwd(), "src/generated/image-manifest.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { images, pin } = body;

    // PIN bảo mật cơ bản cho trang studio cá nhân (mặc định 2026 hoặc set biến môi trường)
    const validPin = process.env.STUDIO_PIN || "1511";
    if (pin !== validPin) {
      return NextResponse.json({ error: "Mã PIN không đúng" }, { status: 401 });
    }

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Dữ liệu images không hợp lệ" }, { status: 400 });
    }

    // Trên Vercel Serverless environment, file system là read-only (EROFS)
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Vercel Serverless có ổ đĩa chỉ đọc (read-only). Để lưu thay đổi vĩnh viễn, bạn hãy mở Studio trên máy tính (localhost:3000/studio) để sắp xếp rồi gõ 'git push', hoặc quản lý trực tiếp bằng cách sắp xếp folder trên Google Drive.",
        },
        { status: 403 }
      );
    }

    const raw = await readFile(manifestPath, "utf8");
    const manifest = JSON.parse(raw);

    // Cập nhật lại danh sách ảnh theo thứ tự và metadata mới
    manifest.images = images;
    manifest.updatedAt = new Date().toISOString();

    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

    return NextResponse.json({ success: true, count: images.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
