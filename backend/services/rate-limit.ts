import { upsertRateLimit, resetRateLimit, ensureIndexes, cleanupExpiredRateLimits, cleanupExpiredOtpCodes } from "../db";

export interface RateLimitResult {
	allowed: boolean;
	retryAfter: number;
}

const isDbConfigured = () => Boolean(process.env.DATABASE_URL);

const memoryStores = new Map<string, { count: number; windowStart: number }>();

export async function rateLimit(
	key: string,
	limit: number,
	windowMs: number,
	now = Date.now(),
): Promise<RateLimitResult> {
	if (isDbConfigured()) {
		try {
			await ensureIndexes();
			const record = await upsertRateLimit(
				key,
				now,
				new Date(now + windowMs),
			);

			if (!record?.count || record.window_start == null) {
				return { allowed: true, retryAfter: 0 };
			}

			const windowStart = Number(record.window_start);
			if (windowStart + windowMs <= now) {
				await resetRateLimit(key, now, new Date(now + windowMs));
				return { allowed: true, retryAfter: 0 };
			}

			return {
				allowed: record.count <= limit,
				retryAfter: Math.max(
					0,
					Math.ceil((windowStart + windowMs - now) / 1000),
				),
			};
		} catch (err) {
			console.error(`[rate-limit] DB limiter failed for "${key}":`, err);
		}

		if (Math.random() < 0.01) {
			void Promise.all([
				cleanupExpiredRateLimits(),
				cleanupExpiredOtpCodes(),
			]).catch((err) => console.error("[rate-limit] Opportunistic cleanup failed:", err));
		}
	}

	const entry = memoryStores.get(key);
	if (!entry || entry.windowStart + windowMs <= now) {
		memoryStores.set(key, { count: 1, windowStart: now });
		return { allowed: true, retryAfter: 0 };
	}
	entry.count += 1;
	return {
		allowed: entry.count <= limit,
		retryAfter: Math.max(
			0,
			Math.ceil((entry.windowStart + windowMs - now) / 1000),
		),
	};
}
