import { rateLimitsCollection } from '@/lib/db';
import { ensureIndexes } from '@/lib/db/indexes';

export interface RateLimitResult {
	allowed: boolean;
	/** Seconds until the caller may retry (0 when allowed). */
	retryAfter: number;
}

const isDbConfigured = () => Boolean(process.env.MONGODB_DIRECT_URI);

/* In-memory fallback — used only when no database is configured (dev). */
const memoryStores = new Map<string, { count: number; windowStart: number }>();

/**
 * ── DB-backed sliding-window rate limiter ────────────────
 *
 * Atomic single-key implementation (no read-then-write races).
 * Documents self-expire via a TTL index so stale records never
 * accumulate. Falls back to an in-memory store when the database
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
			const col = rateLimitsCollection();
			const doc = await col.findOneAndUpdate(
				{ _id: key },
				{
					$inc: { count: 1 },
					$setOnInsert: {
						windowStart: now,
						expiresAt: new Date(now + windowMs),
					},
				},
				{ upsert: true, returnDocument: 'after' },
			);

			const record = doc as { count?: number; windowStart?: number } | null;
			if (!record?.count || record.windowStart == null) {
				return { allowed: true, retryAfter: 0 };
			}

			if (record.windowStart + windowMs <= now) {
				// Window elapsed — reset and allow.
				await col.updateOne(
					{ _id: key },
					{
						$set: {
							count: 1,
							windowStart: now,
							expiresAt: new Date(now + windowMs),
						},
					},
				);
				return { allowed: true, retryAfter: 0 };
			}

			return {
				allowed: record.count <= limit,
				retryAfter: Math.max(
					0,
					Math.ceil((record.windowStart + windowMs - now) / 1000),
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
