import { NextRequest, NextResponse } from "next/server";

import { generateOTP, saveOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { findUserByEmail } from "@/lib/db";

const WINDOW = 15 * 60 * 1000;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 5;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { email, type } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if account already exists during signup flow before sending OTP
    if (type === "signup" && Boolean(process.env.DATABASE_URL)) {
      try {
        const existingUser = await findUserByEmail(normalizedEmail);
        if (existingUser) {
          return NextResponse.json(
            { error: "An account with this email already exists. Please sign in." },
            { status: 400 }
          );
        }
      } catch (dbErr) {
        console.error("[send-otp] User existence check failed:", dbErr);
      }
    }

    // DB-backed rate limiting — per email and per IP. "Too many" is a
    // deliberate lie to avoid revealing whether the address is registered.
    const [byEmail, byIp] = await Promise.all([
      rateLimit(`otp-send-email:${normalizedEmail}`, MAX_PER_EMAIL, WINDOW),
      rateLimit(`otp-send-ip:${ip}`, MAX_PER_IP, WINDOW),
    ]);
    if (!byEmail.allowed || !byIp.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.max(byEmail.retryAfter, byIp.retryAfter)) } }
      );
    }

    const otp = generateOTP();
    await saveOTP(normalizedEmail, otp);
    await sendOTPEmail(normalizedEmail, otp);

    return NextResponse.json(
      { success: true, message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-otp route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}