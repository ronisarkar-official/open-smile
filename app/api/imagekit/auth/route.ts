import { NextResponse } from "next/server"
import { getImageKitAuthParams, isImageKitConfigured } from "@/lib/imagekit"

export async function GET() {
  try {
    if (!isImageKitConfigured()) {
      return NextResponse.json(
        {
          error: "ImageKit credentials are not configured.",
          isConfigured: false,
          message:
            "Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in your .env.local file.",
        },
        { status: 500 }
      )
    }

    const authParams = getImageKitAuthParams()
    return NextResponse.json({
      ...authParams,
      isConfigured: true,
    })
  } catch (error) {
    console.error("ImageKit auth error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate auth parameters",
        isConfigured: false,
      },
      { status: 500 }
    )
  }
}
