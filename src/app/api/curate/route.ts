import { NextResponse } from "next/server";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const manifestPath = path.resolve(process.cwd(), "src/generated/image-manifest.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { images, pin } = body;

    const validPin = process.env.STUDIO_PIN || "1511";
    if (pin !== validPin) {
      return NextResponse.json({ error: "Mã PIN không đúng" }, { status: 401 });
    }

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Dữ liệu images không hợp lệ" }, { status: 400 });
    }

    // Nếu chạy trên Vercel hoặc có GITHUB_TOKEN: commit trực tiếp lên repo
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || "Ce1lo/Portfolio";
    const githubBranch = process.env.GITHUB_BRANCH || "main";
    const targetFilePath = "src/generated/image-manifest.json";

    if (process.env.VERCEL || githubToken) {
      if (!githubToken) {
        return NextResponse.json(
          {
            error:
              "Thiếu GITHUB_TOKEN trên Vercel Environment Variables để lưu dữ liệu.",
          },
          { status: 500 }
        );
      }

      // Lấy file hiện tại trên GitHub để lấy sha
      const getFileRes = await fetch(
        `https://api.github.com/repos/${githubRepo}/contents/${targetFilePath}?ref=${githubBranch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "Portfolio-Studio",
          },
        }
      );

      if (!getFileRes.ok) {
        const errText = await getFileRes.text();
        return NextResponse.json(
          { error: `Không thể đọc manifest từ GitHub: ${errText}` },
          { status: getFileRes.status }
        );
      }

      const fileData = await getFileRes.json();
      const existingContent = JSON.parse(
        Buffer.from(fileData.content, "base64").toString("utf8")
      );

      existingContent.images = images;
      existingContent.updatedAt = new Date().toISOString();

      const newContentBase64 = Buffer.from(
        JSON.stringify(existingContent, null, 2) + "\n",
        "utf8"
      ).toString("base64");

      // Commit file mới lên GitHub
      const putFileRes = await fetch(
        `https://api.github.com/repos/${githubRepo}/contents/${targetFilePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "Portfolio-Studio",
          },
          body: JSON.stringify({
            message: "chore: update portfolio manifest from Studio",
            content: newContentBase64,
            sha: fileData.sha,
            branch: githubBranch,
          }),
        }
      );

      if (!putFileRes.ok) {
        const errPut = await putFileRes.text();
        return NextResponse.json(
          { error: `Lỗi khi commit lên GitHub: ${errPut}` },
          { status: putFileRes.status }
        );
      }

      return NextResponse.json({
        success: true,
        count: images.length,
        persistedVia: "github",
      });
    }

    // Môi trường dev localhost: ghi trực tiếp ổ đĩa
    const raw = await readFile(manifestPath, "utf8");
    const manifest = JSON.parse(raw);

    manifest.images = images;
    manifest.updatedAt = new Date().toISOString();

    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

    return NextResponse.json({ success: true, count: images.length, persistedVia: "local" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
