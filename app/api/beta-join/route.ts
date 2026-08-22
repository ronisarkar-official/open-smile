import { NextRequest, NextResponse } from "next/server";

import { sendBetaWaitlistEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { findBetaWaitlistByEmail, insertBetaWaitlist, ensureIndexes } from "@/lib/db";

const WINDOW = 60 * 60 * 1000;
const MAX_PER_EMAIL = 3;
const MAX_PER_IP = 10;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

/**
 * POST /api/beta-join
 *
 * Public waitlist signup. Normalizes the email, rate-limits per email
 * and per IP, then persists a unique row in `beta_waitlist`. Re-joining
 * with the same address is idempotent (`alreadyJoined: true`).
 *
 * Body: { email: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const ip = getClientIp(req);

    const [byEmail, byIp] = await Promise.all([
      rateLimit(`beta-join-email:${normalizedEmail}`, MAX_PER_EMAIL, WINDOW),
      rateLimit(`beta-join-ip:${ip}`, MAX_PER_IP, WINDOW),
    ]);
    if (!byEmail.allowed || !byIp.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.max(byEmail.retryAfter, byIp.retryAfter)) } }
      );
    }

    if (Boolean(process.env.DATABASE_URL)) {
      try {
        await ensureIndexes();
        const existing = await findBetaWaitlistByEmail(normalizedEmail);
        if (existing) {
          return NextResponse.json(
            { success: true, alreadyJoined: true },
            { status: 200 }
          );
        }
        await insertBetaWaitlist(normalizedEmail);
      } catch (dbErr) {
        console.error("[beta-join] failed to persist signup:", dbErr);
        return NextResponse.json(
          { error: "Failed to save your request. Please try again." },
          { status: 500 }
        );
      }
    }

    // Fire-and-forget confirmation email — never block on SMTP.
    sendBetaWaitlistEmail(normalizedEmail).catch((err) =>
      console.error("[beta-join] confirmation email failed:", err)
    );

    return NextResponse.json(
      { success: true, alreadyJoined: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in beta-join route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}