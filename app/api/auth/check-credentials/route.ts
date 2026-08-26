import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "better-auth/crypto";
import { findUserByEmail } from "@/backend/db";
import { rateLimit } from "@/backend/services";

const WINDOW = 15 * 60 * 1000;
const MAX_PER_EMAIL = 10;
const MAX_PER_IP = 30;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

/**
 * Step 1 of the two-step login flow.
 *
 * Verifies the email + password WITHOUT creating a session — the OTP
 * check happens separately, and only a successful OTP verification
 * ever calls `signIn.email` (see /verify-otp).
 *
 * Deliberately returns the same error for "no account" and "wrong
 * password" to prevent email enumeration.
 */
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

    // Rate-limit brute-force attempts, keyed by both email and IP.
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

    // Verify credentials against the stored scrypt hash — no session is
    // created here. `verifyPassword` matches Better Auth's default hash
    // format (`salt:key`).
    const existingUser = await findUserByEmail(normalizedEmail);

    if (!existingUser || typeof existingUser.password !== "string") {
      return invalidCredentials();
    }

    const passwordValid = await verifyPassword({
      hash: existingUser.password,
      password,
    });
    if (!passwordValid) {
      return invalidCredentials();
    }

    // Credentials are valid. The client now proceeds to send-otp; the
    // real session is only created after OTP verification.
    return NextResponse.json({ success: true }, { status: 200 });
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