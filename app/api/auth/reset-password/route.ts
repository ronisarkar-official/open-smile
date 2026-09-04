import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/services";

const WINDOW = 15 * 60 * 1000;
const MAX_PER_IP = 20;
const MIN_PASSWORD_LENGTH = 8;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

/**
 * Step 2 of password reset. Validates the emailed reset token via
 * Better Auth's `resetPassword` and sets the new password.
 */
export async function POST(req: NextRequest) {
  try {
    const { newPassword, token } = await req.json();

    if (typeof token !== "string" || !token) {
      return NextResponse.json(
        { error: "Reset link is missing or invalid. Please request a new one." },
        { status: 400 }
      );
    }
    if (typeof newPassword !== "string" || newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const limited = await rateLimit(`reset-password-ip:${ip}`, MAX_PER_IP, WINDOW);
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
      );
    }

    try {
      await auth.api.resetPassword({
        body: { newPassword, token },
      });
    } catch (err) {
      console.error("[reset-password] resetPassword:", err);
      return NextResponse.json(
        { error: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in reset-password route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}