import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, verifyAuthTicket } from "@/backend/auth";
import {
  updateUserEmailVerified,
  createSessionForUser,
  createUserWithAccount,
  findUserByEmail,
} from "@/backend/db";
import { rateLimit } from "@/backend/services";
import { sendLoginNotificationEmail } from "@/backend/mailer";

const WINDOW = 15 * 60 * 1000;
const MAX_PER_EMAIL = 15;
const MAX_PER_IP = 30;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

function getSessionCookieName(): string {
  const isSecure = process.env.NODE_ENV === "production";
  const prefix = isSecure ? "__Secure-" : "";
  return `${prefix}better-auth.session_token`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp, ticket } = await req.json();

    if (!email || !otp || !ticket) {
      return NextResponse.json(
        { error: "Email, OTP, and ticket are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const ip = getClientIp(req);

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

    const loginResult = verifyAuthTicket(ticket, "login");
    const signupResult = verifyAuthTicket(ticket, "signup");

    if (loginResult.valid && loginResult.payload) {
      const { userId } = loginResult.payload as { userId: string; email: string };

      if (!userId) {
        return NextResponse.json(
          { error: "Invalid login ticket" },
          { status: 400 }
        );
      }

      try {
        await updateUserEmailVerified(normalizedEmail);
      } catch (err) {
        console.error("[verify-otp] Failed to mark email verified:", err);
      }

      const session = await createSessionForUser(userId, req);

      void sendLoginNotification(normalizedEmail, req);

      const response = NextResponse.json(
        { success: true, redirectTo: "/dashboard" },
        { status: 200 }
      );

      setSessionCookie(response, session.token, session.expiresAt);
      return response;
    }

    if (signupResult.valid && signupResult.payload) {
      const { name, passwordHash } = signupResult.payload as {
        name: string;
        email: string;
        passwordHash: string;
      };

      if (!passwordHash) {
        return NextResponse.json(
          { error: "Invalid signup ticket" },
          { status: 400 }
        );
      }

      const existingUser = await findUserByEmail(normalizedEmail);
      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 400 }
        );
      }

      const user = await createUserWithAccount({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        passwordHash,
      });

      const session = await createSessionForUser(user.id, req);

      const response = NextResponse.json(
        { success: true, redirectTo: "/dashboard" },
        { status: 200 }
      );

      setSessionCookie(response, session.token, session.expiresAt);
      return response;
    }

    return NextResponse.json(
      { error: "Invalid or expired ticket" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in verify-otp route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date
) {
  const cookieName = getSessionCookieName();
  const isSecure = process.env.NODE_ENV === "production";

  response.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecure,
    expires: expiresAt,
  });
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
    console.error("[verify-otp] Login notification failed:", err);
  }
}