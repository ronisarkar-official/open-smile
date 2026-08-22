import crypto from "crypto";
import { upsertOtpCode, findOtpCode, incrementOtpAttempts, deleteOtpCode } from "@/lib/db";
import { ensureIndexes } from "@/lib/db/indexes";

export const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const OTP_MAX_ATTEMPTS = 5;

interface InMemoryOtpRecord {
  email: string;
  otpHash: string;
  attempts: number;
  expires: number;
}

/**
 * ── OTP Storage ──────────────────────────────────────────
 *
 * **Production**: persisted in PostgreSQL (`otp_codes`) with:
 *  - hashed value only (raw OTP never touches the disk)
 *  - per-user unique key so a new code invalidates the old one
 *  - expiry-based cleanup (checked on read + bootstrap)
 *  - an attempt counter that burns the code after N failures
 *
 * **Development fallback**: in-memory store (survives HMR via
 * `globalThis`). Only used when `DATABASE_URL` is unset.
 */
const isDbConfigured = () => Boolean(process.env.DATABASE_URL);

const globalAny = globalThis as typeof globalThis & { mockOTPs?: InMemoryOtpRecord[] };
if (!globalAny.mockOTPs) {
  globalAny.mockOTPs = [];
}
const mockOTPs: InMemoryOtpRecord[] = globalAny.mockOTPs;

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function generateOTP(): string {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

export async function saveOTP(email: string, otp: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const otpHash = hashOtp(otp);

  if (isDbConfigured()) {
    try {
      await ensureIndexes();
      await upsertOtpCode(
        normalizedEmail,
        otpHash,
        new Date(Date.now() + OTP_TTL_MS)
      );
      return;
    } catch (err) {
      console.error("[otp] DB save failed:", err);
      throw new Error("Failed to save OTP code. Please try again later.");
    }
  }

  const index = mockOTPs.findIndex((r) => r.email === normalizedEmail);
  if (index !== -1) mockOTPs.splice(index, 1);
  mockOTPs.push({
    email: normalizedEmail,
    otpHash,
    attempts: 0,
    expires: Date.now() + OTP_TTL_MS,
  });
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const otpHash = hashOtp(otp);

  if (isDbConfigured()) {
    try {
      await ensureIndexes();
      const record = await findOtpCode(normalizedEmail);
      if (!record) return false;

      const expired = new Date(record.expires_at).getTime() <= Date.now();
      const exhausted = record.attempts >= OTP_MAX_ATTEMPTS;
      if (expired || exhausted) {
        await deleteOtpCode(normalizedEmail);
        return false;
      }

      if (!safeEqual(record.otp_hash, otpHash)) {
        await incrementOtpAttempts(normalizedEmail);
        if (record.attempts + 1 >= OTP_MAX_ATTEMPTS) {
          await deleteOtpCode(normalizedEmail);
        }
        return false;
      }

      await deleteOtpCode(normalizedEmail);
      return true;
    } catch (err) {
      console.error("[otp] DB verify failed:", err);
      throw new Error("Failed to verify OTP code. Please try again later.");
    }
  }

  const index = mockOTPs.findIndex(
    (r) => r.email === normalizedEmail && r.expires > Date.now()
  );
  if (index === -1) return false;

  const record = mockOTPs[index];
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    mockOTPs.splice(index, 1);
    return false;
  }
  if (!safeEqual(record.otpHash, otpHash)) {
    record.attempts += 1;
    if (record.attempts >= OTP_MAX_ATTEMPTS) mockOTPs.splice(index, 1);
    return false;
  }

  mockOTPs.splice(index, 1);
  return true;
}