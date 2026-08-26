"use client"

import * as React from "react"
import Image from "next/image"
import {
  UploadCloud,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Copy,
  ExternalLink,
  ImageIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ImageKitUploadedFile {
  fileId: string
  name: string
  url: string
  thumbnailUrl?: string
  height?: number
  width?: number
  size?: number
}

interface ImageUploadProps {
  onUploadSuccess?: (file: ImageKitUploadedFile) => void
  onUploadError?: (error: string) => void
  onFileRemove?: (fileId: string) => void
  folder?: string
  accept?: string
  maxSizeMB?: number
  value?: string // Existing image URL if controlled
  className?: string
  disabled?: boolean
}

export function ImageUpload({
  onUploadSuccess,
  onUploadError,
  onFileRemove,
  folder = "/uploads",
  accept = "image/*",
  maxSizeMB = 5,
  value,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [currentFile, setCurrentFile] = React.useState<ImageKitUploadedFile | null>(
    value ? { fileId: "", name: "Uploaded Image", url: value } : null
  )
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value && (!currentFile || currentFile.url !== value)) {
      setCurrentFile({ fileId: "", name: "Uploaded Image", url: value })
    }
  }, [value])

  const handleUploadFile = async (file: File) => {
    setErrorMsg(null)

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      const msg = `File size exceeds maximum limit of ${maxSizeMB}MB`
      setErrorMsg(msg)
      onUploadError?.(msg)
      return
    }

    setIsUploading(true)
    setUploadProgress(20)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", file.name)
      formData.append("folder", folder)

      setUploadProgress(50)

      const response = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to upload image")
      }

      setUploadProgress(100)
      const uploaded: ImageKitUploadedFile = data.file
      setCurrentFile(uploaded)
      onUploadSuccess?.(uploaded)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed"
      setErrorMsg(message)
      onUploadError?.(message)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || isUploading) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleUploadFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleUploadFile(files[0])
    }
  }

  const handleRemove = async () => {
    if (currentFile?.fileId) {
      try {
        await fetch(`/api/imagekit/upload?fileId=${currentFile.fileId}`, {
          method: "DELETE",
        })
        onFileRemove?.(currentFile.fileId)
      } catch (err) {
        console.error("Failed to delete from ImageKit server:", err)
      }
    }
    setCurrentFile(null)
    setErrorMsg(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const copyUrlToClipboard = () => {
    if (currentFile?.url) {
      navigator.clipboard.writeText(currentFile.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      {currentFile ? (
        <div className="brutal-surface relative group bg-card p-3 transition-[box-shadow,transform]">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
              {currentFile.url ? (
                <Image
                  src={currentFile.url}
                  alt={currentFile.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-sm font-medium text-foreground truncate">
                  {currentFile.name}
                </p>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {currentFile.url}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyUrlToClipboard}
                  className="h-7 text-xs px-2.5"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <a
                  href={currentFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Original
                </a>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={disabled}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center border-[length:var(--border-width)] border-dashed border-border rounded-xl bg-card p-6 text-center shadow-brutal transition-[background-color,border-color,box-shadow,transform] duration-150 cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            disabled && "opacity-50 cursor-not-allowed",
            isUploading && "cursor-wait"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">
                Uploading to ImageKit...
              </p>
              <div className="mt-1 h-1.5 w-48 overflow-hidden bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3 border-[length:var(--border-width)] border-border rounded-lg bg-primary p-3 text-primary-foreground">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Click to upload <span className="font-normal text-muted-foreground">or drag and drop</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP, GIF up to {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  )
}
