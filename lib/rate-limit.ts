import { upsertRateLimit, resetRateLimit } from '@/lib/db';
import { ensureIndexes } from '@/lib/db/indexes';

export interface RateLimitResult {
	allowed: boolean;
	/** Seconds until the caller may retry (0 when allowed). */
	retryAfter: number;
}

const isDbConfigured = () => Boolean(process.env.DATABASE_URL);

/* In-memory fallback — used only when no database is configured (dev). */
const memoryStores = new Map<string, { count: number; windowStart: number }>();

/**
 * ── DB-backed sliding-window rate limiter ────────────────
 *
 * Atomic single-key implementation using INSERT ... ON CONFLICT.
 * Expired records are cleaned up during bootstrap and on window
 * reset. Falls back to an in-memory store when the database
 * isn't configured (local development).
 */
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
				// Window elapsed — reset and allow.
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
