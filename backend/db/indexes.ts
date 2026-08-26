import { getPool } from "./client";

const globalForIndexes = globalThis as typeof globalThis & {
	__indexesPromise?: Promise<void>;
};

export function ensureIndexes(): Promise<void> {
	const g = globalForIndexes;
	if (!g.__indexesPromise) {
		g.__indexesPromise = (async () => {
			try {
				const pool = getPool();
				await pool.query(`
					CREATE TABLE IF NOT EXISTS otp_codes (
						email TEXT PRIMARY KEY,
						otp_hash TEXT NOT NULL,
						attempts INTEGER NOT NULL DEFAULT 0,
						created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
						expires_at TIMESTAMPTZ NOT NULL
					);

					CREATE TABLE IF NOT EXISTS rate_limits (
						id TEXT PRIMARY KEY,
						count INTEGER NOT NULL DEFAULT 0,
						window_start BIGINT NOT NULL,
						expires_at TIMESTAMPTZ NOT NULL
					);

					CREATE TABLE IF NOT EXISTS beta_waitlist (
						email TEXT PRIMARY KEY,
						created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
					);

					-- Cleanup expired records (replaces MongoDB TTL indexes)
					DELETE FROM otp_codes WHERE expires_at <= NOW();
					DELETE FROM rate_limits WHERE expires_at <= NOW();
				`);
				console.log("✓ PostgreSQL tables ensured");
			} catch (err) {
				console.error("✗ PostgreSQL table setup failed:", err);
			}
		})();
	}
	return g.__indexesPromise;
}
