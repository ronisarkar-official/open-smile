/**
 * Convert an image File or Blob to WebP format using the browser Canvas API.
 * Falls back to the original file if the browser doesn't support WebP encoding.
 *
 * @param file      - The original image file (PNG, JPG, etc.) or Blob
 * @param quality   - WebP quality 0–1 (default 0.85 — optimal balance of size vs quality)
 * @param maxSize   - Max width/height in px. Images larger than this are downscaled (default 1080)
 * @returns           A new File object in WebP format
 */
export async function convertToWebP(
  file: File | Blob,
  quality = 0.85,
  maxSize = 1080
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
        const fallbackName = file instanceof File ? file.name : "image.webp"
        resolve(
          file instanceof File
            ? file
            : new File([file], fallbackName, {
                type: file.type || "image/jpeg",
              })
        )
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            const fallbackName = file instanceof File ? file.name : "image.webp"
            resolve(
              file instanceof File
                ? file
                : new File([file], fallbackName, {
                    type: file.type || "image/jpeg",
                  })
            )
            return
          }

          const originalName =
            file instanceof File ? file.name : "captured_smile.png"
          const baseName = originalName.replace(/\.[^.]+$/, "")
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

/**
 * Convert a base64 Data URL (e.g. from webcam capture) directly to a WebP File.
 *
 * @param dataUrl   - Base64 data URL ('data:image/jpeg;base64,...')
 * @param fileName  - Optional file name prefix (default: 'smile_capture')
 * @param quality   - WebP quality 0–1 (default 0.85)
 * @param maxSize   - Max dimension in px (default 1080)
 * @returns           A new File object in WebP format
 */
export async function dataUrlToWebP(
  dataUrl: string,
  fileName = "smile_capture",
  quality = 0.85,
  maxSize = 1080
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
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
        reject(new Error("Failed to get 2D canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to encode canvas to WebP"))
            return
          }

          const cleanName = fileName.replace(/\.[^.]+$/, "")
          const webpFile = new File([blob], `${cleanName}.webp`, {
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
      reject(new Error("Failed to load image from data URL"))
    }

    img.src = dataUrl
  })
}
