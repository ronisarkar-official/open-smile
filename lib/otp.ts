import crypto from "crypto";
import { otpCodesCollection } from "@/lib/db";
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
 * **Production**: persisted in MongoDB (`otpCodes`) with:
 *  - hashed value only (raw OTP never touches the disk)
 *  - per-user unique key so a new code invalidates the old one
 *  - a TTL index that auto-deletes expired codes
 *  - an attempt counter that burns the code after N failures
 *
 * **Development fallback**: in-memory store (survives HMR via
 * `globalThis`). Only used when `MONGODB_DIRECT_URI` is unset.
 */
const isDbConfigured = () => Boolean(process.env.MONGODB_DIRECT_URI);

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
      await otpCodesCollection().updateOne(
        { email: normalizedEmail },
        {
          $set: {
            otpHash,
            attempts: 0,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + OTP_TTL_MS),
          },
        },
        { upsert: true }
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
      const col = otpCodesCollection();
      const record = await col.findOne({ email: normalizedEmail });
      if (!record) return false;

      const expired = record.expiresAt.getTime() <= Date.now();
      const exhausted = record.attempts >= OTP_MAX_ATTEMPTS;
      if (expired || exhausted) {
        await col.deleteOne({ email: normalizedEmail });
        return false;
      }

      if (!safeEqual(record.otpHash, otpHash)) {
        await col.updateOne({ email: normalizedEmail }, { $inc: { attempts: 1 } });
        if (record.attempts + 1 >= OTP_MAX_ATTEMPTS) {
          await col.deleteOne({ email: normalizedEmail });
        }
        return false;
      }

      await col.deleteOne({ email: normalizedEmail });
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