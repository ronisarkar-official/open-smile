import { NextRequest, NextResponse } from "next/server";

import { verifyOTP } from "@/backend/auth";
import { updateUserEmailVerified } from "@/backend/db";
import { rateLimit } from "@/backend/services";

const WINDOW = 15 * 60 * 1000;
const MAX_PER_EMAIL = 15;
const MAX_PER_IP = 30;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const ip = getClientIp(req);

    // DB-backed brute-force guard (per code, OTP is additionally
    // self-burning after a handful of failures via attempt counter).
    const [byEmail, byIp] = await Promise.all([
      rateLimit(`otp-verify-email:${normalizedEmail}`, MAX_PER_EMAIL, WINDOW),
      rateLimit(`otp-verify-ip:${ip}`, MAX_PER_IP, WINDOW),
    ]);
    if (!byEmail.allowed || !byIp.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.max(byEmail.retryAfter, byIp.retryAfter)) } }
      );
    }

    const isValid = await verifyOTP(normalizedEmail, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // OTP verified === email verified. Update the Better Auth user row so
    // implicit account linking (GitHub/Google) on later logins is allowed.
    try {
      await updateUserEmailVerified(normalizedEmail);
    } catch (err) {
      console.error("[verify-otp] Failed to mark email verified:", err);
    }

    return NextResponse.json(
      { success: true, message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in verify-otp route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}