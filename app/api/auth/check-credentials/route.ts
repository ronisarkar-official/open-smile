import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "better-auth/crypto";
import { findUserWithPasswordByEmail } from "@/lib/db";
import { rateLimit } from "@/lib/services";
import { generateOTP, saveOTP, createAuthTicket } from "@/lib/auth";
import { sendOTPEmail } from "@/lib/mailer";

const WINDOW = 15 * 60 * 1000;
const MAX_PER_EMAIL = 10;
const MAX_PER_IP = 30;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const ip = getClientIp(req);

    const [byEmail, byIp] = await Promise.all([
      rateLimit(`check-credentials:${normalizedEmail}`, MAX_PER_EMAIL, WINDOW),
      rateLimit(`check-credentials-ip:${ip}`, MAX_PER_IP, WINDOW),
    ]);
    if (!byEmail.allowed || !byIp.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.max(byEmail.retryAfter, byIp.retryAfter)) } }
      );
    }

    const existingUser = await findUserWithPasswordByEmail(normalizedEmail);
    const passwordHash = existingUser?.password_hash || existingUser?.password;

    if (!existingUser || typeof passwordHash !== "string") {
      return invalidCredentials();
    }

    const passwordValid = await verifyPassword({
      hash: passwordHash,
      password,
    });
    if (!passwordValid) {
      return invalidCredentials();
    }

    const otp = generateOTP();
    await saveOTP(normalizedEmail, otp);
    await sendOTPEmail(normalizedEmail, otp);

    const loginTicket = createAuthTicket({
      email: normalizedEmail,
      type: "login",
      userId: existingUser.id,
    });

    return NextResponse.json(
      { success: true, loginTicket },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in check-credentials route:", error);
    return invalidCredentials();
  }
}

function invalidCredentials() {
  return NextResponse.json(
    { error: "Invalid email or password" },
    { status: 400 }
  );
}