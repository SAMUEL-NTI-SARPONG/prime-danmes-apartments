import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isAdminRequest } from "@/lib/admin-auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadedExtension = file.name.split(".").pop()?.toLowerCase() || "";
    const hasAllowedMimeType = ALLOWED_TYPES.includes(file.type);
    const hasSafeFallbackType =
      (!file.type || file.type === "application/octet-stream") &&
      ALLOWED_EXTENSIONS.includes(uploadedExtension);
    if (!hasAllowedMimeType && !hasSafeFallbackType) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and AVIF images are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5 MB limit" },
        { status: 400 },
      );
    }

    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
    };
    const ext = extensions[file.type] || uploadedExtension;
    const safeName = `uploads/${crypto.randomBytes(16).toString("hex")}.${ext}`;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Image storage is not configured on this deployment." },
          { status: 503 },
        );
      }
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(
        path.join(process.cwd(), "public", safeName),
        Buffer.from(await file.arrayBuffer()),
      );
      return NextResponse.json({ url: `/${safeName}` }, { status: 201 });
    }

    const blob = await put(safeName, file, { access: "public" });

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
