import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "better-auth/crypto";
import { generateOTP, saveOTP, createAuthTicket } from "@/backend/auth";
import { sendOTPEmail } from "@/backend/mailer";
import { rateLimit } from "@/backend/services";
import { findUserByEmail } from "@/backend/db";

const WINDOW = 15 * 60 * 1000;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 5;
const MIN_PASSWORD_LENGTH = 8;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { email, type, name, password, referral_code } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (type === "signup") {
      if (!password || typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json(
          { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` },
          { status: 400 }
        );
      }

      if (Boolean(process.env.DATABASE_URL)) {
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
    }

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

    if (type === "signup") {
      const hashedPw = await hashPassword(password);
      const signupTicket = createAuthTicket({
        email: normalizedEmail,
        type: "signup",
        name: name || normalizedEmail.split("@")[0],
        passwordHash: hashedPw,
        referralCode: typeof referral_code === "string" && referral_code.trim() ? referral_code.trim().toUpperCase() : undefined,
      });

      return NextResponse.json(
        { success: true, signupTicket },
        { status: 200 }
      );
    }

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