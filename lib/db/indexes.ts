import { getDb } from "./client";

const globalForIndexes = globalThis as typeof globalThis & {
	__indexesPromise?: Promise<void>;
};

/**
 * ── Idempotent Index Bootstrapping ────────────────────────
 *
 * Ensures the TTL + lookup indexes this app relies on exist.
 * Safe to call from any route; runs exactly once per process.
 * TTL indexes auto-delete expired OTP / rate-limit records.
 */
export function ensureIndexes(): Promise<void> {
	const g = globalForIndexes;
	if (!g.__indexesPromise) {
		g.__indexesPromise = (async () => {
			try {
				const db = getDb();
				await Promise.all([
					db.collection("otpCodes").createIndex({ email: 1 }, { unique: true }),
					db.collection("otpCodes").createIndex(
						{ expiresAt: 1 },
						{ expireAfterSeconds: 0 }
					),
					db.collection("rateLimits").createIndex(
						{ expiresAt: 1 },
						{ expireAfterSeconds: 0 }
					),
					db.collection("betaWaitlist").createIndex(
						{ email: 1 },
						{ unique: true }
					),
				]);
				console.log("✓ MongoDB indexes ensured");
			} catch (err) {
				// Non-fatal: indexes are an optimization. If creation fails
				// (e.g. duplicates already exist), the app still works.
				console.error("✗ MongoDB index creation failed:", err);
			}
		})();
	}
	return g.__indexesPromise;
}