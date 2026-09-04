import { NextRequest, NextResponse } from "next/server"
import { requireServerUser } from "@/lib/auth";
import { uploadToImageKit, deleteFromImageKit, deleteFromImageKitByUrl, isImageKitConfigured } from "@/lib/services";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);
const FOLDER_PATTERN = /^\/[a-zA-Z0-9_\-/]*$/;

/**
 * Upload (POST) and delete (DELETE) are only usable by authenticated
 * users. The server additionally validates file type / size / folder
 * so anonymous callers can't burn ImageKit quota or plant arbitrary
 * files on the CDN.
 */
function sanitizeFolder(value: FormDataEntryValue | null): string {
  if (!value || typeof value !== "string") return "/uploads";
  const folder = value.trim();
  return FOLDER_PATTERN.test(folder) ? folder : "/uploads";
}

function sanitizeFileName(file: File, requested: FormDataEntryValue | null): string {
  const raw = (requested && typeof requested === "string" && requested.trim()) || file.name || "";
  return raw.replace(/[^\w.\-]/g, "_").slice(0, 100);
}

function isImageKitUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "ik.imagekit.io" || host === new URL(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").hostname;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const session = await requireServerUser();
  if (session.error) return session.error;

  try {
    if (!isImageKitConfigured()) {
      return NextResponse.json(
        {
          error: "ImageKit credentials are not configured in environment variables.",
          message: "Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in .env.local",
        },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File is too large. Maximum size is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.` },
        { status: 400 }
      )
    }
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only image files are allowed (JPEG, PNG, WebP, GIF, SVG, AVIF)." },
        { status: 400 }
      )
    }

    const folder = sanitizeFolder(formData.get("folder"))
    const fileName = sanitizeFileName(file, formData.get("fileName"))
    const deleteOldUrl = formData.get("deleteOldUrl")

    // Only remove a previous image when it's actually hosted on our CDN.
    if (deleteOldUrl && typeof deleteOldUrl === "string" && isImageKitUrl(deleteOldUrl)) {
      await deleteFromImageKitByUrl(deleteOldUrl).catch(() => {})
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await uploadToImageKit({
      file: buffer,
      fileName,
      folder,
    })

    return NextResponse.json({
      success: true,
      file: result,
    })
  } catch (error) {
    console.error("ImageKit upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file to ImageKit" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await requireServerUser();
  if (session.error) return session.error;

  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")
    const imageUrl = searchParams.get("imageUrl")

    if (imageUrl && typeof imageUrl === "string" && isImageKitUrl(imageUrl)) {
      const deleted = await deleteFromImageKitByUrl(imageUrl)
      return NextResponse.json({
        success: deleted,
        message: deleted ? "File deleted successfully" : "File not found or not an ImageKit URL",
      })
    }

    if (fileId && /^[a-zA-Z0-9_\-=]+$/.test(fileId)) {
      await deleteFromImageKit(fileId)
      return NextResponse.json({ success: true, message: "File deleted successfully" })
    }

    return NextResponse.json({ error: "Missing fileId or imageUrl parameter" }, { status: 400 })
  } catch (error) {
    console.error("ImageKit delete error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete file from ImageKit" },
      { status: 500 }
    )
  }
}