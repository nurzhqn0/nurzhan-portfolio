import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdminApi } from "@/lib/auth";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeFileName(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  const baseName = path
    .basename(file.name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "image"}-${crypto.randomUUID()}${extension}`;
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Missing image file" }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return Response.json(
        { error: "Upload a JPEG, PNG, WebP, or GIF image." },
        { status: 400 },
      );
    }

    const fileName = safeFileName(file);

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`portfolio/${fileName}`, file, {
        access: "public",
        addRandomSuffix: false,
      });

      return Response.json({ url: blob.url });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), bytes);

    const url = new URL(`/uploads/${fileName}`, request.url);

    return Response.json({ url: url.toString() });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Upload failed" }, { status: 400 });
  }
}
