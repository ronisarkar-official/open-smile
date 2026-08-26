import { getPool } from "./client";

export async function findUserByEmail(email: string) {
	const { rows } = await getPool().query(
		'SELECT * FROM "user" WHERE LOWER(email) = LOWER($1) LIMIT 1',
		[email]
	);
	return rows[0] ?? null;
}

export async function updateUserEmailVerified(email: string) {
	await getPool().query(
		'UPDATE "user" SET "emailVerified" = true WHERE LOWER(email) = LOWER($1)',
		[email]
	);
}

export interface BetaWaitlistRow {
	email: string;
	created_at: Date;
}

export async function findBetaWaitlistByEmail(email: string): Promise<BetaWaitlistRow | null> {
	const { rows } = await getPool().query(
		"SELECT * FROM beta_waitlist WHERE email = $1 LIMIT 1",
		[email]
	);
	return rows[0] ?? null;
}

export async function insertBetaWaitlist(email: string) {
	await getPool().query(
		"INSERT INTO beta_waitlist (email, created_at) VALUES ($1, NOW()) ON CONFLICT (email) DO NOTHING",
		[email]
	);
}

export interface OtpCodeRow {
	email: string;
	otp_hash: string;
	attempts: number;
	created_at: Date;
	expires_at: Date;
}

export async function upsertOtpCode(
	email: string,
	otpHash: string,
	expiresAt: Date
) {
	await getPool().query(
		`INSERT INTO otp_codes (email, otp_hash, attempts, created_at, expires_at)
		 VALUES ($1, $2, 0, NOW(), $3)
		 ON CONFLICT (email) DO UPDATE SET
		   otp_hash = EXCLUDED.otp_hash,
		   attempts = 0,
		   created_at = NOW(),
		   expires_at = EXCLUDED.expires_at`,
		[email, otpHash, expiresAt]
	);
}

export async function findOtpCode(email: string): Promise<OtpCodeRow | null> {
	const { rows } = await getPool().query(
		"SELECT * FROM otp_codes WHERE email = $1 LIMIT 1",
		[email]
	);
	return rows[0] ?? null;
}

export async function incrementOtpAttempts(email: string) {
	await getPool().query(
		"UPDATE otp_codes SET attempts = attempts + 1 WHERE email = $1",
		[email]
	);
}

export async function deleteOtpCode(email: string) {
	await getPool().query("DELETE FROM otp_codes WHERE email = $1", [email]);
}

export interface RateLimitRow {
	id: string;
	count: number;
	window_start: number;
	expires_at: Date;
}

export async function upsertRateLimit(
	key: string,
	windowStart: number,
	expiresAt: Date
): Promise<RateLimitRow> {
	const { rows } = await getPool().query(
		`INSERT INTO rate_limits (id, count, window_start, expires_at)
		 VALUES ($1, 1, $2, $3)
		 ON CONFLICT (id) DO UPDATE SET
		   count = rate_limits.count + 1
		 RETURNING *`,
		[key, windowStart, expiresAt]
	);
	return rows[0];
}

export async function resetRateLimit(
	key: string,
	windowStart: number,
	expiresAt: Date
) {
	await getPool().query(
		`UPDATE rate_limits SET count = 1, window_start = $2, expires_at = $3 WHERE id = $1`,
		[key, windowStart, expiresAt]
	);
}

export async function cleanupExpiredOtpCodes() {
	await getPool().query("DELETE FROM otp_codes WHERE expires_at <= NOW()");
}

export async function cleanupExpiredRateLimits() {
	await getPool().query("DELETE FROM rate_limits WHERE expires_at <= NOW()");
}

export async function insertSmileCapture(
	userId: string,
	smileScore: number,
	coinsAwarded: number
) {
	const { rows } = await getPool().query(
		`INSERT INTO smile_captures (user_id, smile_score, coins_awarded)
		 VALUES ($1, $2, $3)
		 RETURNING *`,
		[userId, smileScore, coinsAwarded]
	);
	return rows[0];
}

export async function getLastCaptureTime(userId: string): Promise<Date | null> {
	const { rows } = await getPool().query(
		`SELECT created_at FROM smile_captures
		 WHERE user_id = $1
		 ORDER BY created_at DESC
		 LIMIT 1`,
		[userId]
	);
	return rows[0]?.created_at ?? null;
}

export async function insertCoinLedgerEntry(
	userId: string,
	coins: number,
	reason: string
) {
	const { rows } = await getPool().query(
		`INSERT INTO coin_ledger (user_id, coins, reason)
		 VALUES ($1, $2, $3)
		 RETURNING *`,
		[userId, coins, reason]
	);
	return rows[0];
}

export async function getUserCoinBalance(userId: string): Promise<number> {
	const { rows } = await getPool().query(
		`SELECT COALESCE(SUM(coins), 0)::int AS balance
		 FROM coin_ledger
		 WHERE user_id = $1`,
		[userId]
	);
	return rows[0].balance;
}
