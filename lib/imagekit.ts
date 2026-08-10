import crypto from "crypto"

export interface ImageKitUploadResponse {
  fileId: string
  name: string
  url: string
  thumbnailUrl?: string
  height?: number
  width?: number
  size?: number
  filePath?: string
}

export interface ImageKitAuthParams {
  token: string
  expire: number
  signature: string
  publicKey: string
  urlEndpoint: string
}

/**
 * Validates whether ImageKit environment variables are configured.
 */
export function isImageKitConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  )
}

/**
 * Generates authentication signature parameters for client-side ImageKit upload.
 */
export function getImageKitAuthParams(): ImageKitAuthParams {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || ""
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""

  const token = crypto.randomUUID()
  const expire = Math.floor(Date.now() / 1000) + 2400 // 40 minutes expiration

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex")

  return {
    token,
    expire,
    signature,
    publicKey,
    urlEndpoint,
  }
}

/**
 * Upload a file directly from the server to ImageKit.
 */
export async function uploadToImageKit({
  file,
  fileName,
  folder = "/uploads",
  tags = [],
}: {
  file: string | Buffer // Base64 string, URL, or Buffer
  fileName: string
  folder?: string
  tags?: string[]
}): Promise<ImageKitUploadResponse> {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      "ImageKit credentials missing. Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in .env.local"
    )
  }

  // Use ImageKit REST API for server-side upload
  const formData = new FormData()

  if (Buffer.isBuffer(file)) {
    const blob = new Blob([new Uint8Array(file)])
    formData.append("file", blob, fileName)
  } else {
    formData.append("file", file)
  }

  formData.append("fileName", fileName)
  formData.append("useUniqueFileName", "true")
  if (folder) formData.append("folder", folder)
  if (tags.length > 0) formData.append("tags", tags.join(","))

  const authHeader = Buffer.from(`${privateKey}:`).toString("base64")

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`ImageKit upload failed (${response.status}): ${errorText}`)
  }

  const result = await response.json()
  return {
    fileId: result.fileId,
    name: result.name,
    url: result.url,
    thumbnailUrl: result.thumbnailUrl,
    height: result.height,
    width: result.width,
    size: result.size,
    filePath: result.filePath,
  }
}

/**
 * Delete a file by fileId from ImageKit server-side.
 */
export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY

  if (!privateKey) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is missing in environment variables.")
  }

  const authHeader = Buffer.from(`${privateKey}:`).toString("base64")

  const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`ImageKit deletion failed (${response.status}): ${errorText}`)
  }

  return true
}

/**
 * Find and delete an ImageKit file by its URL.
 * Extracts the file path from the URL, searches ImageKit for the matching file,
 * and deletes it. Returns true if deleted, false if file not found or URL is not
 * an ImageKit URL.
 */
export async function deleteFromImageKitByUrl(imageUrl: string): Promise<boolean> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

  if (!privateKey || !urlEndpoint) return false

  // Only process ImageKit-hosted images
  if (!imageUrl.includes("ik.imagekit.io")) return false

  // Extract the file path from the URL
  // URL format: https://ik.imagekit.io/<id>/avatars/avatar_123.webp
  try {
    const url = new URL(imageUrl)
    // pathname is like: /<imagekit_id>/avatars/avatar_123.webp
    // We need just: /avatars/avatar_123.webp
    const pathSegments = url.pathname.split("/")
    // Remove the first empty segment and the imagekit_id segment
    const filePath = "/" + pathSegments.slice(2).join("/")
    const fileName = pathSegments[pathSegments.length - 1]

    if (!fileName) return false

    const authHeader = Buffer.from(`${privateKey}:`).toString("base64")

    // Search for the file by name and path
    const searchUrl = new URL("https://api.imagekit.io/v1/files")
    searchUrl.searchParams.set("searchQuery", `name="${fileName}"`)

    const searchRes = await fetch(searchUrl.toString(), {
      headers: { Authorization: `Basic ${authHeader}` },
    })

    if (!searchRes.ok) return false

    const files = await searchRes.json()
    if (!Array.isArray(files) || files.length === 0) return false

    // Find the exact match by filePath
    const match = files.find(
      (f: { filePath?: string }) => f.filePath === filePath
    ) || files[0]

    if (!match?.fileId) return false

    // Delete the matched file
    return await deleteFromImageKit(match.fileId)
  } catch {
    return false
  }
}
