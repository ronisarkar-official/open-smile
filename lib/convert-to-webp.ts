/**
 * Convert an image File to WebP format using the browser Canvas API.
 * Falls back to the original file if the browser doesn't support WebP encoding.
 *
 * @param file      - The original image file (PNG, JPG, etc.)
 * @param quality   - WebP quality 0–1 (default 0.82 — good balance of size vs quality)
 * @param maxSize   - Max width/height in px. Images larger than this are downscaled (default 1024)
 * @returns           A new File object in WebP format
 */
export async function convertToWebP(
  file: File,
  quality = 0.82,
  maxSize = 1024
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calculate dimensions (downscale if needed, preserve aspect ratio)
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(file) // fallback
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file) // fallback
            return
          }

          // Build the new filename: strip old extension, add .webp
          const baseName = file.name.replace(/\.[^.]+$/, "")
          const webpFile = new File([blob], `${baseName}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          })

          resolve(webpFile)
        },
        "image/webp",
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image for WebP conversion"))
    }

    img.src = url
  })
}
