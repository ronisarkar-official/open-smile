import { getPool } from './client';
import { deleteFromImageKitByUrl } from '../services/imagekit';
import { getStartOfISTDay, getDaysAgoInIST } from '@/lib/ist-date';
import { getSystemSettingsMap } from './settings-queries';

export async function cleanupExpiredExplorePosts(): Promise<{
	deletedCount: number;
	deletedImages: string[];
}> {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const res = await client.query(`
			WITH expired AS (
				SELECT id, image_url FROM explore_posts WHERE created_at <= NOW() - INTERVAL '24 hours'
			),
			del_likes AS (
				DELETE FROM explore_likes WHERE post_id IN (SELECT id FROM expired)
			),
			del_posts AS (
				DELETE FROM posts WHERE id IN (SELECT id FROM expired)
			)
			DELETE FROM explore_posts WHERE id IN (SELECT id FROM expired)
			RETURNING id, image_url;
		`);
		await client.query('COMMIT');

		const rows = res.rows || [];
		const deletedImages = rows.map((r: any) => r.image_url).filter(Boolean);

		for (const imgUrl of deletedImages) {
			if (typeof imgUrl === 'string' && imgUrl.includes('ik.imagekit.io')) {
				deleteFromImageKitByUrl(imgUrl).catch(() => {});
			}
		}

		return { deletedCount: rows.length, deletedImages };
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('[cleanupExpiredExplorePosts] Error:', error);
		return { deletedCount: 0, deletedImages: [] };
	} finally {
		client.release();
	}
}

export async function insertSmileCapture(
	userId: string,
	smileScore: number,
	coinsAwarded: number,
) {
	const { rows } = await getPool().query(
		`INSERT INTO smile_captures (user_id, smile_score, coins_awarded)
		 VALUES ($1, $2, $3)
		 RETURNING *`,
		[userId, smileScore, coinsAwarded],
	);
	return rows[0];
}

export async function getLastCaptureTime(userId: string): Promise<Date | null> {
	const { rows } = await getPool().query(
		`SELECT created_at FROM smile_captures
		 WHERE user_id = $1
		 ORDER BY created_at DESC
		 LIMIT 1`,
		[userId],
	);
	return rows[0]?.created_at ?? null;
}

export async function insertCoinLedgerEntry(
	userId: string,
	coins: number,
	reason: string,
) {
	const { rows } = await getPool().query(
		`INSERT INTO coin_ledger (user_id, coins, reason)
		 VALUES ($1, $2, $3)
		 RETURNING *`,
		[userId, coins, reason],
	);
	return rows[0];
}

export async function getUserCoinBalance(userId: string): Promise<number> {
	const { rows } = await getPool().query(
		`SELECT COALESCE(SUM(coins), 0)::int AS balance
		 FROM coin_ledger
		 WHERE user_id = $1`,
		[userId],
	);
	return rows[0].balance;
}

export async function getUserStreak(userId: string): Promise<number> {
	const settings = await getSystemSettingsMap();
	const streakResetAt =
		settings.streak_reset_at ? new Date(settings.streak_reset_at) : null;

	const { rows } = await getPool().query(
		`WITH daily_captures AS (
			SELECT DISTINCT (created_at AT TIME ZONE 'Asia/Kolkata')::date AS capture_date
			FROM smile_captures
			WHERE user_id = $1 
			  AND (flagged IS NULL OR flagged = false)
			  AND ($2::timestamptz IS NULL OR created_at >= $2::timestamptz)
		),
		ranked AS (
			SELECT 
				capture_date,
				capture_date - (ROW_NUMBER() OVER (ORDER BY capture_date ASC) * INTERVAL '1 day') AS grp
			FROM daily_captures
		),
		streak_groups AS (
			SELECT 
				COUNT(*)::int AS length, 
				MAX(capture_date) AS max_date
			FROM ranked
			GROUP BY grp
		)
		SELECT COALESCE(length, 0)::int AS streak
		FROM streak_groups
		WHERE max_date >= ((NOW() AT TIME ZONE 'Asia/Kolkata')::date - INTERVAL '1 day')
		ORDER BY max_date DESC
		LIMIT 1`,
		[userId, streakResetAt],
	);
	return rows[0]?.streak ?? 0;
}

export interface RecentSmileItem {
	id: string;
	score: number;
	coins: number;
	time: string;
	quality: string;
	createdAt: Date;
}

export function getSmileQualityLabel(score: number): string {
	if (score >= 95) return 'Duchenne Smile';
	if (score >= 88) return 'Radiant Smile';
	if (score >= 80) return 'Great Smile';
	if (score >= 70) return 'Warm Smile';
	return 'Gentle Smile';
}

function formatActivityTime(date: Date | string | null): string {
	if (!date) return 'Recently';
	const dt = new Date(date);
	const now = new Date();
	const isToday = dt.toDateString() === now.toDateString();

	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	const isYesterday = dt.toDateString() === yesterday.toDateString();

	const timeStr = dt.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});

	if (isToday) return `Today, ${timeStr}`;
	if (isYesterday) return `Yesterday, ${timeStr}`;
	return `${dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`;
}

export async function getUserRecentSmiles(
	userId: string,
	limit = 5,
): Promise<RecentSmileItem[]> {
	const { rows } = await getPool().query(
		`SELECT id, smile_score, coins_awarded, created_at
		 FROM smile_captures
		 WHERE user_id = $1
		 ORDER BY created_at DESC
		 LIMIT $2`,
		[userId, limit],
	);

	return rows.map((r) => {
		const score = Number(r.smile_score) || 0;
		return {
			id: String(r.id),
			score,
			coins: Number(r.coins_awarded) || 0,
			time: formatActivityTime(r.created_at),
			quality: getSmileQualityLabel(score),
			createdAt: r.created_at,
		};
	});
}
