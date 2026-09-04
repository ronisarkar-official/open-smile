import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/services";

const WINDOW = 15 * 60 * 1000;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 10;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

/**
 * Step 1 of password reset. Delegates to Better Auth's
 * `requestPasswordReset`, which calls the `sendResetPassword` hook
 * (configured in auth.ts) that emails a signed, expiring reset link.
 *
 * Always returns success for registered-looking addresses — never leaks
 * whether an account exists.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const ip = getClientIp(req);

    const [byEmail, byIp] = await Promise.all([
      rateLimit(`forgot-password:${normalizedEmail}`, MAX_PER_EMAIL, WINDOW),
      rateLimit(`forgot-password-ip:${ip}`, MAX_PER_IP, WINDOW),
    ]);
    if (!byEmail.allowed || !byIp.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.max(byEmail.retryAfter, byIp.retryAfter)) } }
      );
    }

    try {
      await auth.api.requestPasswordReset({
        body: { email: normalizedEmail, redirectTo: "/reset-password" },
      });
    } catch (err) {
      // Better Auth errors when the user doesn't exist (or the email
      // send fails). Both outcomes are "success" to the caller — the
      // response is intentionally identical either way.
      console.error("[forgot-password] requestPasswordReset:", err);
    }

    return NextResponse.json(
      { success: true, message: "If an account exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}