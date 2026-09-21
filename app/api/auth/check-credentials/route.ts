import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "better-auth/crypto";
import { findUserWithPasswordByEmail, createSessionForUser } from "@/lib/db";
import { rateLimit } from "@/lib/services";
import {
  generateOTP,
  saveOTP,
  createAuthTicket,
  setSessionCookie,
} from "@/lib/auth";
import { sendOTPEmail, sendLoginNotificationEmail } from "@/lib/mailer";

const WINDOW = 15 * 60 * 1000;
const MAX_PER_EMAIL = 10;
const MAX_PER_IP = 30;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

function resolveRedirectPath(redirectTo: unknown): string {
  if (
    typeof redirectTo === "string" &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//")
  ) {
    return redirectTo;
  }
  return "/dashboard";
}

async function sendLoginNotification(email: string, req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "Unknown IP";
    const userAgent = req.headers.get("user-agent") || "Browser / Web Client";
    const time = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "UTC",
    });

    await sendLoginNotificationEmail(email, { time, ip, userAgent });
  } catch (err) {
    console.error("[check-credentials] Login notification failed:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, redirectTo } = await req.json();

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

    if (Boolean(existingUser.twoFactorEnabled)) {
      const otp = generateOTP();
      await saveOTP(normalizedEmail, otp);
      await sendOTPEmail(normalizedEmail, otp);

      const loginTicket = createAuthTicket({
        email: normalizedEmail,
        type: "login",
        userId: existingUser.id,
      });

      return NextResponse.json(
        { success: true, twoFactorRequired: true, loginTicket },
        { status: 200 }
      );
    }

    const session = await createSessionForUser(existingUser.id, req);
    await sendLoginNotification(normalizedEmail, req);

    const destination = resolveRedirectPath(redirectTo);
    const response = NextResponse.json(
      { success: true, twoFactorRequired: false, redirectTo: destination },
      { status: 200 }
    );

    setSessionCookie(response, session.token, session.expiresAt);
    return response;
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