"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageKitUploadedFile } from "./image-upload"

interface AvatarUploadProps {
  value?: string
  initials?: string
  name?: string
  onUploadSuccess?: (file: ImageKitUploadedFile) => void
  onUploadError?: (error: string) => void
  onAvatarChange?: (url: string) => void
  folder?: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-xl",
  xl: "h-28 w-28 text-2xl",
}

export function AvatarUpload({
  value,
  initials = "U",
  name = "User",
  onUploadSuccess,
  onUploadError,
  onAvatarChange,
  folder = "/avatars",
  className,
  size = "lg",
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(value)
  const [isUploading, setIsUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value !== undefined) {
      setAvatarUrl(value)
    }
  }, [value])

  const triggerSelect = () => {
    if (!isUploading && inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setIsUploading(true)

    // 1. Instant local preview
    const localUrl = URL.createObjectURL(file)
    setAvatarUrl(localUrl)
    onAvatarChange?.(localUrl)

    try {
      // 2. Upload to ImageKit server endpoint
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", `avatar_${Date.now()}_${file.name}`)
      formData.append("folder", folder)

      const response = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.file) {
        const uploaded: ImageKitUploadedFile = data.file
        setAvatarUrl(uploaded.url)
        onAvatarChange?.(uploaded.url)
        onUploadSuccess?.(uploaded)
      } else {
        // Handle unconfigured ImageKit credentials or server error gracefully
        console.warn("ImageKit upload response:", data)
        onUploadSuccess?.({
          fileId: `local_${Date.now()}`,
          name: file.name,
          url: localUrl,
        })
        if (data.error) {
          onUploadError?.(data.message || data.error)
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Avatar upload failed"
      console.error("Avatar upload error:", err)
      onUploadError?.(msg)
    } finally {
      setIsUploading(false)
      // Reset input value so re-selecting same file triggers change event
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="relative inline-block">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      <div
        onClick={triggerSelect}
        title="Click to upload profile picture"
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-full transition-all ring-2 ring-primary/20 hover:ring-primary hover:scale-[1.03]",
          sizeClasses[size],
          className
        )}
      >
        <Avatar className="h-full w-full rounded-full">
          <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Hover / Loading overlay */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100",
            isUploading && "opacity-100 bg-black/60"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </div>
      </div>
    </div>
  )
}
