import crypto from 'crypto';
import { getPool, getSupabase } from './client';
import { ensureIndexes } from './indexes';
import { deleteFromImageKitByUrl } from '../services/imagekit';
import {
	getStartOfISTDay,
	getEndOfISTDay,
	formatISTDateString,
	getISTParts,
	createISTDate,
	getDaysAgoInIST,
} from '@/lib/ist-date';
import { DEFAULT_DRAWING_SPEC } from '@/lib/mediapipe-drawing';

function generateSessionToken(): string {
	return crypto.randomBytes(32).toString('base64url');
}

function generateId(): string {
	return crypto.randomUUID().replace(/-/g, '');
}

export async function createSessionForUser(
	userId: string,
	req?: { headers?: { get?: (name: string) => string | null } },
): Promise<{ id: string; token: string; expiresAt: Date }> {
	const id = generateId();
	const token = generateSessionToken();
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
	const ipAddress =
		req?.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() || '';
	const userAgent = req?.headers?.get?.('user-agent') || '';

	await getPool().query(
		`INSERT INTO "session" (id, token, "expiresAt", "userId", "ipAddress", "userAgent", "createdAt", "updatedAt")
		 VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
		[id, token, expiresAt, userId, ipAddress, userAgent],
	);

	return { id, token, expiresAt };
}

export async function createUserWithAccount(params: {
	name: string;
	email: string;
	passwordHash: string;
	image?: string;
}): Promise<{ id: string; name: string; email: string }> {
	const pool = getPool();
	const userId = generateId();
	const accountId = generateId();

	await pool.query(
		`INSERT INTO "user" (id, name, email, image, "emailVerified", "createdAt", "updatedAt")
		 VALUES ($1, $2, $3, $4, true, NOW(), NOW())`,
		[
			userId,
			params.name,
			params.email,
			params.image || '/icons/default-icon.webp',
		],
	);

	await pool.query(
		`INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
		 VALUES ($1, $2, $3, 'credential', $4, NOW(), NOW())`,
		[accountId, userId, userId, params.passwordHash],
	);

	return { id: userId, name: params.name, email: params.email };
}

export async function findUserByEmail(email: string) {
	const { rows } = await getPool().query(
		'SELECT * FROM "user" WHERE LOWER(email) = LOWER($1) LIMIT 1',
		[email],
	);
	return rows[0] ?? null;
}

export async function findUserWithPasswordByEmail(email: string) {
	const { rows } = await getPool().query(
		`SELECT 
			u.*,
			COALESCE(a.password, u.password_hash) AS password_hash
		 FROM "user" u
		 LEFT JOIN "account" a 
		   ON a."userId" = u.id 
		   AND (a."providerId" = 'credential' OR a."providerId" = 'email')
		 WHERE LOWER(u.email) = LOWER($1)
		 LIMIT 1`,
		[email],
	);
	return rows[0] ?? null;
}

export async function updateUserEmailVerified(email: string) {
	await getPool().query(
		'UPDATE "user" SET "emailVerified" = true WHERE LOWER(email) = LOWER($1)',
		[email],
	);
}

export interface BetaWaitlistRow {
	email: string;
	created_at: Date;
}

export async function findBetaWaitlistByEmail(
	email: string,
): Promise<BetaWaitlistRow | null> {
	const { rows } = await getPool().query(
		'SELECT * FROM beta_waitlist WHERE email = $1 LIMIT 1',
		[email],
	);
	return rows[0] ?? null;
}

export async function insertBetaWaitlist(email: string) {
	await getPool().query(
		'INSERT INTO beta_waitlist (email, created_at) VALUES ($1, NOW()) ON CONFLICT (email) DO NOTHING',
		[email],
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
	expiresAt: Date,
) {
	await getPool().query(
		`INSERT INTO otp_codes (email, otp_hash, attempts, created_at, expires_at)
		 VALUES ($1, $2, 0, NOW(), $3)
		 ON CONFLICT (email) DO UPDATE SET
		   otp_hash = EXCLUDED.otp_hash,
		   attempts = 0,
		   created_at = NOW(),
		   expires_at = EXCLUDED.expires_at`,
		[email, otpHash, expiresAt],
	);
}

export async function findOtpCode(email: string): Promise<OtpCodeRow | null> {
	const { rows } = await getPool().query(
		'SELECT * FROM otp_codes WHERE email = $1 LIMIT 1',
		[email],
	);
	return rows[0] ?? null;
}

export async function incrementOtpAttempts(email: string) {
	await getPool().query(
		'UPDATE otp_codes SET attempts = attempts + 1 WHERE email = $1',
		[email],
	);
}

export async function deleteOtpCode(email: string) {
	await getPool().query('DELETE FROM otp_codes WHERE email = $1', [email]);
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
	expiresAt: Date,
): Promise<RateLimitRow> {
	const { rows } = await getPool().query(
		`INSERT INTO rate_limits (id, count, window_start, expires_at)
		 VALUES ($1, 1, $2, $3)
		 ON CONFLICT (id) DO UPDATE SET
		   count = rate_limits.count + 1
		 RETURNING *`,
		[key, windowStart, expiresAt],
	);
	return rows[0];
}

export async function resetRateLimit(
	key: string,
	windowStart: number,
	expiresAt: Date,
) {
	await getPool().query(
		`UPDATE rate_limits SET count = 1, window_start = $2, expires_at = $3 WHERE id = $1`,
		[key, windowStart, expiresAt],
	);
}

export async function cleanupExpiredOtpCodes() {
	await getPool().query('DELETE FROM otp_codes WHERE expires_at <= NOW()');
}

export async function cleanupExpiredRateLimits() {
	await getPool().query('DELETE FROM rate_limits WHERE expires_at <= NOW()');
}

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

export interface StreakDayItem {
	date: string;
	dayLabel: string;
	dayNumber: number;
	isToday: boolean;
	isPast: boolean;
	isFuture: boolean;
	completed: boolean;
	score?: number;
}

export interface MonthlyCaptureItem {
	date: string;
	count: number;
	maxScore: number;
	totalCoins: number;
}

export interface UserStreakFullDetails {
	streak: number;
	streakCount: number;
	multiplier: number;
	multiplierLabel: string;
	lastCaptureAt: string | null;
	isTodayCompleted: boolean;
	weekDays: StreakDayItem[];
	monthlyCaptures: MonthlyCaptureItem[];
	stats: {
		currentStreak: number;
		longestStreak: number;
		totalSmiles: number;
		bestScore: number;
		activeDaysThisMonth: number;
		totalDaysInMonth: number;
	};
	streakSociety: {
		isMember: boolean;
		daysRequired: number;
		daysLeft: number;
	};
	recentSmiles: RecentSmileItem[];
}

function calculateStreakMultiplier(streakCount: number): {
	multiplier: number;
	multiplierLabel: string;
} {
	if (streakCount <= 1) return { multiplier: 1.0, multiplierLabel: '1.0x' };
	if (streakCount === 2) return { multiplier: 1.2, multiplierLabel: '1.2x' };
	if (streakCount < 7) return { multiplier: 1.5, multiplierLabel: '1.5x' };
	if (streakCount < 30) return { multiplier: 1.8, multiplierLabel: '1.8x' };
	return { multiplier: 2.0, multiplierLabel: '2.0x' };
}

export async function recordCaptureStreak(
	userId: string,
): Promise<{ streakCount: number; streakMultiplier: number }> {
	const pool = getPool();

	const checkTodayRes = await pool.query(
		`SELECT EXISTS (
			SELECT 1 FROM smile_captures 
			WHERE user_id = $1 
			  AND (created_at AT TIME ZONE 'Asia/Kolkata')::date = (NOW() AT TIME ZONE 'Asia/Kolkata')::date
			  AND (flagged IS NULL OR flagged = false)
		) AS already_captured_today`,
		[userId],
	);
	const alreadyCapturedToday = Boolean(
		checkTodayRes.rows[0]?.already_captured_today,
	);

	let streakCount = 1;
	if (alreadyCapturedToday) {
		const current = await getUserStreak(userId);
		streakCount = Math.max(1, current);
	} else {
		const checkYesterdayRes = await pool.query(
			`SELECT EXISTS (
				SELECT 1 FROM smile_captures 
				WHERE user_id = $1 
				  AND (created_at AT TIME ZONE 'Asia/Kolkata')::date = ((NOW() AT TIME ZONE 'Asia/Kolkata')::date - INTERVAL '1 day')
				  AND (flagged IS NULL OR flagged = false)
			) AS captured_yesterday`,
			[userId],
		);
		const capturedYesterday = Boolean(
			checkYesterdayRes.rows[0]?.captured_yesterday,
		);

		if (capturedYesterday) {
			const prevStreak = await getUserStreak(userId);
			streakCount = prevStreak + 1;
		} else {
			const freezeRes = await pool.query(
				`SELECT freeze_used_at FROM streaks WHERE user_id = $1`,
				[userId],
			);
			const freezeUsedAt =
				freezeRes.rows[0]?.freeze_used_at ?
					new Date(freezeRes.rows[0].freeze_used_at)
				:	null;
			const isFrozen =
				freezeUsedAt ?
					Date.now() - freezeUsedAt.getTime() <= 48 * 3600 * 1000
				:	false;

			if (isFrozen) {
				const prevStreak = await getUserStreak(userId);
				streakCount = Math.max(1, prevStreak);
			} else {
				streakCount = 1;
			}
		}
	}

	await pool.query(
		`INSERT INTO streaks (user_id, streak_count, last_capture_at, freeze_available)
		 VALUES ($1, $2, NOW(), true)
		 ON CONFLICT (user_id) DO UPDATE SET streak_count = $2, last_capture_at = NOW()`,
		[userId, streakCount],
	);

	await pool.query(
		`UPDATE "user" SET streak_count = $1, last_streak_at = NOW() WHERE id = $2`,
		[streakCount, userId],
	);

	let streakMultiplier = 1.0;
	if (streakCount === 2) streakMultiplier = 1.2;
	else if (streakCount >= 3 && streakCount < 7) streakMultiplier = 1.5;
	else if (streakCount >= 7)
		streakMultiplier = Math.min(2.0, 1.5 + (streakCount - 3) * 0.1);

	return { streakCount, streakMultiplier };
}

export async function getUserStreakFullDetails(
	userId: string,
): Promise<UserStreakFullDetails> {
	const pool = getPool();
	const now = new Date();

	const settings = await getSystemSettingsMap();
	const streakResetAt =
		settings.streak_reset_at ? new Date(settings.streak_reset_at) : null;

	const istDateStr = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Kolkata',
	}).format(now);
	const [currYear, currMonth, currDay] = istDateStr.split('-').map(Number);
	const istMidnight = new Date(Date.UTC(currYear, currMonth - 1, currDay));
	const dayOfWeek = istMidnight.getUTCDay();
	const daysSinceMonday = (dayOfWeek + 6) % 7;
	const monday = new Date(
		Date.UTC(currYear, currMonth - 1, currDay - daysSinceMonday),
	);

	const [
		calculatedStreak,
		streaksRowRes,
		todayCheckRes,
		longestStreakRes,
		totalsRes,
		monthCapturesRes,
		recentSmiles,
	] = await Promise.all([
		getUserStreak(userId),
		pool.query(
			`SELECT streak_count, last_capture_at FROM streaks WHERE user_id = $1`,
			[userId],
		),
		pool.query(
			`SELECT EXISTS (
				SELECT 1 FROM smile_captures 
				WHERE user_id = $1 
				  AND (created_at AT TIME ZONE 'Asia/Kolkata')::date = (NOW() AT TIME ZONE 'Asia/Kolkata')::date
				  AND (flagged IS NULL OR flagged = false)
				  AND ($2::timestamptz IS NULL OR created_at >= $2::timestamptz)
			) AS is_today_completed`,
			[userId, streakResetAt],
		),
		pool.query(
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
				SELECT COUNT(*)::int AS length
				FROM ranked
				GROUP BY grp
			)
			SELECT COALESCE(MAX(length), 0)::int AS longest_streak
			FROM streak_groups`,
			[userId, streakResetAt],
		),
		pool.query(
			`SELECT 
				COUNT(*)::int AS total_captures,
				COALESCE(MAX(smile_score), 0)::int AS best_score
			 FROM smile_captures
			 WHERE user_id = $1 AND (flagged IS NULL OR flagged = false)`,
			[userId],
		),
		pool.query(
			`SELECT 
				(created_at AT TIME ZONE 'Asia/Kolkata')::date::text AS capture_date,
				COUNT(*)::int AS count,
				MAX(smile_score)::int AS max_score,
				SUM(coins_awarded)::int AS total_coins
			 FROM smile_captures
			 WHERE user_id = $1 
			   AND (created_at AT TIME ZONE 'Asia/Kolkata')::date >= LEAST(date_trunc('month', NOW() AT TIME ZONE 'Asia/Kolkata')::date, $2::date)
			   AND (flagged IS NULL OR flagged = false)
			   AND ($3::timestamptz IS NULL OR created_at >= $3::timestamptz)
			 GROUP BY (created_at AT TIME ZONE 'Asia/Kolkata')::date
			 ORDER BY capture_date ASC`,
			[userId, monday.toISOString().slice(0, 10), streakResetAt],
		),
		getUserRecentSmiles(userId, 8),
	]);

	const dbStreak = Number(streaksRowRes.rows[0]?.streak_count) || 0;
	const streakCount = calculatedStreak;

	if (dbStreak !== calculatedStreak) {
		pool
			.query(
				`INSERT INTO streaks (user_id, streak_count, last_capture_at, freeze_available)
			 VALUES ($1, $2, NOW(), true)
			 ON CONFLICT (user_id) DO UPDATE SET streak_count = $2`,
				[userId, calculatedStreak],
			)
			.catch(() => {});

		pool
			.query(`UPDATE "user" SET streak_count = $1 WHERE id = $2`, [
				calculatedStreak,
				userId,
			])
			.catch(() => {});
	}

	const lastCaptureAt =
		streaksRowRes.rows[0]?.last_capture_at ?
			new Date(streaksRowRes.rows[0].last_capture_at).toISOString()
		:	null;
	const isTodayCompleted = Boolean(todayCheckRes.rows[0]?.is_today_completed);
	const longestStreak = Math.max(
		streakCount,
		Number(longestStreakRes.rows[0]?.longest_streak) || 0,
	);
	const totalSmiles = Number(totalsRes.rows[0]?.total_captures) || 0;
	const bestScore = Number(totalsRes.rows[0]?.best_score) || 0;

	const monthStartStr = `${currYear}-${currMonth.toString().padStart(2, '0')}-01`;
	const monthlyCaptures: MonthlyCaptureItem[] = monthCapturesRes.rows
		.filter((r) => String(r.capture_date) >= monthStartStr)
		.map((r) => ({
			date: String(r.capture_date),
			count: Number(r.count) || 0,
			maxScore: Number(r.max_score) || 0,
			totalCoins: Number(r.total_coins) || 0,
		}));

	const captureDateMap = new Map<string, MonthlyCaptureItem>();
	for (const r of monthCapturesRes.rows) {
		captureDateMap.set(String(r.capture_date), {
			date: String(r.capture_date),
			count: Number(r.count) || 0,
			maxScore: Number(r.max_score) || 0,
			totalCoins: Number(r.total_coins) || 0,
		});
	}

	const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const todayDateStr = istDateStr;

	const weekDays: StreakDayItem[] = [];
	for (let i = 0; i < 7; i++) {
		const targetDate = new Date(
			Date.UTC(
				monday.getUTCFullYear(),
				monday.getUTCMonth(),
				monday.getUTCDate() + i,
			),
		);
		const dateStr = targetDate.toISOString().slice(0, 10);
		const isToday = dateStr === todayDateStr;
		const isPast = dateStr < todayDateStr;
		const isFuture = dateStr > todayDateStr;
		const dayItem = captureDateMap.get(dateStr);
		const completed = Boolean(dayItem && dayItem.count > 0);

		weekDays.push({
			date: dateStr,
			dayLabel: weekDayLabels[i],
			dayNumber: targetDate.getUTCDate(),
			isToday,
			isPast,
			isFuture,
			completed,
			score: dayItem?.maxScore,
		});
	}

	const daysInMonth = new Date(Date.UTC(currYear, currMonth, 0)).getUTCDate();
	const activeDaysThisMonth = monthlyCaptures.length;

	const { multiplier, multiplierLabel } =
		calculateStreakMultiplier(streakCount);

	return {
		streak: streakCount,
		streakCount,
		multiplier,
		multiplierLabel,
		lastCaptureAt,
		isTodayCompleted,
		weekDays,
		monthlyCaptures,
		stats: {
			currentStreak: streakCount,
			longestStreak,
			totalSmiles,
			bestScore,
			activeDaysThisMonth,
			totalDaysInMonth: daysInMonth,
		},
		streakSociety: {
			isMember: streakCount >= 7,
			daysRequired: 7,
			daysLeft: Math.max(0, 7 - streakCount),
		},
		recentSmiles,
	};
}

export async function getUserDailyRank(
	userId: string,
): Promise<{ rank: number | null; totalUsers: number }> {
	const pool = getPool();

	const { rows } = await pool.query(
		`WITH daily_scores AS (
			SELECT 
				user_id,
				MAX(smile_score) AS max_score
			FROM smile_captures
			WHERE (created_at AT TIME ZONE 'Asia/Kolkata')::date = (NOW() AT TIME ZONE 'Asia/Kolkata')::date
			GROUP BY user_id
		),
		ranked AS (
			SELECT 
				user_id,
				max_score,
				DENSE_RANK() OVER (ORDER BY max_score DESC) as rk
			FROM daily_scores
			WHERE max_score > 0
		)
		SELECT rk FROM ranked WHERE user_id = $1`,
		[userId],
	);

	const totalUsersRes = await pool.query(`SELECT COUNT(*) FROM "user"`);
	const totalUsers = parseInt(totalUsersRes.rows[0]?.count || '1', 10);

	if (rows.length > 0) {
		return { rank: Number(rows[0].rk), totalUsers };
	}

	const overallRes = await pool.query(
		`WITH overall_scores AS (
			SELECT 
				user_id,
				MAX(smile_score) AS max_score
			FROM smile_captures
			GROUP BY user_id
		),
		ranked AS (
			SELECT 
				user_id,
				max_score,
				DENSE_RANK() OVER (ORDER BY max_score DESC) as rk
			FROM overall_scores
			WHERE max_score > 0
		)
		SELECT rk FROM ranked WHERE user_id = $1`,
		[userId],
	);

	if (overallRes.rows.length > 0) {
		return { rank: Number(overallRes.rows[0].rk), totalUsers };
	}

	return { rank: null, totalUsers };
}

export interface LeaderboardSmileUserRow {
	user_id: string;
	user_name: string;
	avatar_url: string | null;
	streak_count: number;
	primary_value: number;
}

export async function getLeaderboardSmileRankings(
	startDate: Date,
	limit = 50,
	endDate?: Date,
): Promise<LeaderboardSmileUserRow[]> {
	const pool = getPool();
	const settings = await getSystemSettingsMap();
	const lbResetAt =
		settings.leaderboard_reset_at ?
			new Date(settings.leaderboard_reset_at)
		:	null;
	const effectiveStartDate =
		lbResetAt && lbResetAt > startDate ? lbResetAt : startDate;

	if (endDate && effectiveStartDate >= endDate) {
		return [];
	}

	const query =
		endDate ?
			`WITH daily_user_points AS (
			SELECT 
				sc.user_id,
				(sc.created_at AT TIME ZONE 'Asia/Kolkata')::date AS capture_date,
				MAX(sc.smile_score)::int AS daily_points,
				MIN(sc.created_at) AS first_capture_at
			FROM smile_captures sc
			WHERE sc.created_at >= $1 AND sc.created_at <= $2
			  AND (sc.flagged IS NULL OR sc.flagged = false)
			GROUP BY sc.user_id, (sc.created_at AT TIME ZONE 'Asia/Kolkata')::date
		)
		SELECT 
			u.id AS user_id,
			COALESCE(u.name, 'Smiler') AS user_name,
			COALESCE(u.image, '/icons/default-icon.webp') AS avatar_url,
			COALESCE(u.streak_count, 0) AS streak_count,
			SUM(dup.daily_points)::int AS primary_value
		 FROM "user" u
		 JOIN daily_user_points dup ON dup.user_id = u.id
		 GROUP BY u.id, u.name, u.image, u.streak_count
		 ORDER BY primary_value DESC, MIN(dup.first_capture_at) ASC
		 LIMIT $3`
		:	`WITH daily_user_points AS (
			SELECT 
				sc.user_id,
				(sc.created_at AT TIME ZONE 'Asia/Kolkata')::date AS capture_date,
				MAX(sc.smile_score)::int AS daily_points,
				MIN(sc.created_at) AS first_capture_at
			FROM smile_captures sc
			WHERE sc.created_at >= $1
			  AND (sc.flagged IS NULL OR sc.flagged = false)
			GROUP BY sc.user_id, (sc.created_at AT TIME ZONE 'Asia/Kolkata')::date
		)
		SELECT 
			u.id AS user_id,
			COALESCE(u.name, 'Smiler') AS user_name,
			COALESCE(u.image, '/icons/default-icon.webp') AS avatar_url,
			COALESCE(u.streak_count, 0) AS streak_count,
			SUM(dup.daily_points)::int AS primary_value
		 FROM "user" u
		 JOIN daily_user_points dup ON dup.user_id = u.id
		 GROUP BY u.id, u.name, u.image, u.streak_count
		 ORDER BY primary_value DESC, MIN(dup.first_capture_at) ASC
		 LIMIT $2`;

	const params =
		endDate ?
			[effectiveStartDate, endDate, limit]
		:	[effectiveStartDate, limit];
	const res = await pool.query(query, params);
	return res.rows || [];
}

export interface UserLeaderboardRankResult {
	rank: number;
	primary_value: number;
}

export async function getUserLeaderboardRank(
	userId: string,
	startDate: Date,
	endDate?: Date,
): Promise<UserLeaderboardRankResult | null> {
	const pool = getPool();
	const settings = await getSystemSettingsMap();
	const lbResetAt =
		settings.leaderboard_reset_at ?
			new Date(settings.leaderboard_reset_at)
		:	null;
	const effectiveStartDate =
		lbResetAt && lbResetAt > startDate ? lbResetAt : startDate;

	if (endDate && effectiveStartDate >= endDate) {
		return null;
	}

	const query =
		endDate ?
			`WITH daily_user_points AS (
			SELECT 
				sc.user_id,
				(sc.created_at AT TIME ZONE 'Asia/Kolkata')::date AS capture_date,
				MAX(sc.smile_score)::int AS daily_points,
				MIN(sc.created_at) AS first_capture_at
			FROM smile_captures sc
			WHERE sc.created_at >= $1 AND sc.created_at <= $2
			  AND (sc.flagged IS NULL OR sc.flagged = false)
			GROUP BY sc.user_id, (sc.created_at AT TIME ZONE 'Asia/Kolkata')::date
		),
		user_totals AS (
			SELECT 
				u.id AS user_id,
				SUM(dup.daily_points)::int AS primary_value,
				MIN(dup.first_capture_at) AS first_capture_at,
				ROW_NUMBER() OVER (ORDER BY SUM(dup.daily_points) DESC, MIN(dup.first_capture_at) ASC) as rank
			 FROM "user" u
			 JOIN daily_user_points dup ON dup.user_id = u.id
			 GROUP BY u.id
		)
		SELECT rank, primary_value FROM user_totals WHERE user_id = $3`
		:	`WITH daily_user_points AS (
			SELECT 
				sc.user_id,
				(sc.created_at AT TIME ZONE 'Asia/Kolkata')::date AS capture_date,
				MAX(sc.smile_score)::int AS daily_points,
				MIN(sc.created_at) AS first_capture_at
			FROM smile_captures sc
			WHERE sc.created_at >= $1
			  AND (sc.flagged IS NULL OR sc.flagged = false)
			GROUP BY sc.user_id, (sc.created_at AT TIME ZONE 'Asia/Kolkata')::date
		),
		user_totals AS (
			SELECT 
				u.id AS user_id,
				SUM(dup.daily_points)::int AS primary_value,
				MIN(dup.first_capture_at) AS first_capture_at,
				ROW_NUMBER() OVER (ORDER BY SUM(dup.daily_points) DESC, MIN(dup.first_capture_at) ASC) as rank
			 FROM "user" u
			 JOIN daily_user_points dup ON dup.user_id = u.id
			 GROUP BY u.id
		)
		SELECT rank, primary_value FROM user_totals WHERE user_id = $2`;

	const params =
		endDate ?
			[effectiveStartDate, endDate, userId]
		:	[effectiveStartDate, userId];
	const res = await pool.query(query, params);

	if (res.rows && res.rows.length > 0) {
		return {
			rank: Number(res.rows[0].rank),
			primary_value: Number(res.rows[0].primary_value),
		};
	}

	return null;
}

export interface DailySettlementResult {
	date: string;
	settled: boolean;
	alreadySettled?: boolean;
	podium: Array<{
		rank: number;
		userId: string;
		userName: string;
		score: number;
		coins: number;
		cardId?: string;
	}>;
}

export async function settleDailyLeaderboard(
	targetDate?: Date,
): Promise<DailySettlementResult> {
	const now = new Date();
	const istTarget = targetDate ? getStartOfISTDay(targetDate) : undefined;
	const startOfDay = istTarget ?? getDaysAgoInIST(1, now);
	const endOfDay = getEndOfISTDay(startOfDay);
	const dateStr = formatISTDateString(startOfDay);

	const pool = getPool();
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const existing = await client.query(
			`SELECT rank, user_id, score, coins_awarded, card_id
			 FROM leaderboard_settlements
			 WHERE period = 'daily' AND period_date = $1
			 ORDER BY rank ASC`,
			[dateStr],
		);

		if (existing.rows && existing.rows.length > 0) {
			await client.query('COMMIT');
			return {
				date: dateStr,
				settled: true,
				alreadySettled: true,
				podium: existing.rows.map((r) => ({
					rank: r.rank,
					userId: r.user_id,
					userName: 'Smiler',
					score: r.score,
					coins: r.coins_awarded,
					cardId: r.card_id,
				})),
			};
		}

		const topRows = await client.query(
			`SELECT 
				u.id AS user_id,
				COALESCE(u.name, 'Smiler') AS user_name,
				MAX(sc.smile_score)::int AS primary_value
			 FROM "user" u
			 JOIN smile_captures sc ON sc.user_id = u.id
			 WHERE sc.created_at >= $1 AND sc.created_at <= $2
			   AND (sc.flagged IS NULL OR sc.flagged = false)
			   AND (sc.created_at AT TIME ZONE 'Asia/Kolkata')::date = $3
			 GROUP BY u.id, u.name
			 ORDER BY primary_value DESC, MIN(sc.created_at) ASC
			 LIMIT 3`,
			[startOfDay, endOfDay, dateStr],
		);

		if (!topRows.rows || topRows.rows.length === 0) {
			await client.query('COMMIT');
			return {
				date: dateStr,
				settled: false,
				podium: [],
			};
		}

		const settings = await getSystemSettingsMap();
		const podiumAwards = [
			{
				rank: 1,
				title: 'Daily Leaderboard Champion',
				badge: 'PODIUM_GOLD',
				themeColor: '#FFD700',
				minCoins: Number(settings.daily_podium_1_min_coins) || 70,
				maxCoins: Number(settings.daily_podium_1_max_coins) || 99,
			},
			{
				rank: 2,
				title: 'Daily Leaderboard Runner-Up',
				badge: 'PODIUM_SILVER',
				themeColor: '#C0C0C0',
				minCoins: Number(settings.daily_podium_2_min_coins) || 40,
				maxCoins: Number(settings.daily_podium_2_max_coins) || 69,
			},
			{
				rank: 3,
				title: 'Daily Leaderboard 3rd Place',
				badge: 'PODIUM_BRONZE',
				themeColor: '#CD7F32',
				minCoins: Number(settings.daily_podium_3_min_coins) || 15,
				maxCoins: Number(settings.daily_podium_3_max_coins) || 39,
			},
		];

		const awarded: Array<{
			rank: number;
			userId: string;
			userName: string;
			score: number;
			coins: number;
			cardId?: string;
		}> = [];

		for (let i = 0; i < topRows.rows.length; i++) {
			const winner = topRows.rows[i];
			const award = podiumAwards[i];
			const randomCoins =
				Math.floor(Math.random() * (award.maxCoins - award.minCoins + 1)) +
				award.minCoins;

			const cardRes = await client.query(
				`INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
				 VALUES ($1, $2, 'Daily Leaderboard', $3, false, $4, $5, NOW())
				 RETURNING id`,
				[
					winner.user_id,
					award.title,
					randomCoins,
					award.themeColor,
					award.badge,
				],
			);

			const cardId = cardRes.rows[0]?.id;

			await client.query(
				`INSERT INTO leaderboard_settlements (period, period_date, rank, user_id, score, coins_awarded, card_id, settled_at)
				 VALUES ('daily', $1, $2, $3, $4, $5, $6, NOW())
				 ON CONFLICT (period, period_date, rank) DO NOTHING`,
				[
					dateStr,
					award.rank,
					winner.user_id,
					winner.primary_value,
					randomCoins,
					cardId,
				],
			);

			awarded.push({
				rank: award.rank,
				userId: winner.user_id,
				userName: winner.user_name,
				score: winner.primary_value,
				coins: randomCoins,
				cardId,
			});
		}

		await client.query('COMMIT');
		return {
			date: dateStr,
			settled: true,
			alreadySettled: false,
			podium: awarded,
		};
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function settleWeeklyLeaderboard(
	targetDate?: Date,
): Promise<DailySettlementResult> {
	const now = new Date();
	const istTarget = targetDate ? getStartOfISTDay(targetDate) : undefined;
	const startOfWeek = istTarget ?? getDaysAgoInIST(7, now);
	const endOfWeek =
		targetDate ? getDaysAgoInIST(-7, startOfWeek) : getStartOfISTDay(now);
	const dateStr = formatISTDateString(startOfWeek);

	const pool = getPool();
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const existing = await client.query(
			`SELECT rank, user_id, score, coins_awarded, card_id
			 FROM leaderboard_settlements
			 WHERE period = 'weekly' AND period_date = $1
			 ORDER BY rank ASC`,
			[dateStr],
		);

		if (existing.rows && existing.rows.length > 0) {
			await client.query('COMMIT');
			return {
				date: dateStr,
				settled: true,
				alreadySettled: true,
				podium: existing.rows.map((r) => ({
					rank: r.rank,
					userId: r.user_id,
					userName: 'Smiler',
					score: r.score,
					coins: r.coins_awarded,
					cardId: r.card_id,
				})),
			};
		}

		const topRows = await client.query(
			`WITH daily_user_points AS (
				SELECT 
					sc.user_id,
					(sc.created_at AT TIME ZONE 'Asia/Kolkata')::date AS capture_date,
					MAX(sc.smile_score)::int AS daily_points,
					MIN(sc.created_at) AS first_capture_at
				FROM smile_captures sc
				WHERE sc.created_at >= $1 AND sc.created_at < $2
				  AND (sc.flagged IS NULL OR sc.flagged = false)
				GROUP BY sc.user_id, (sc.created_at AT TIME ZONE 'Asia/Kolkata')::date
			)
			SELECT 
				u.id AS user_id,
				COALESCE(u.name, 'Smiler') AS user_name,
				SUM(dup.daily_points)::int AS primary_value
			 FROM "user" u
			 JOIN daily_user_points dup ON dup.user_id = u.id
			 GROUP BY u.id, u.name
			 ORDER BY primary_value DESC, MIN(dup.first_capture_at) ASC
			 LIMIT 3`,
			[startOfWeek, endOfWeek],
		);

		if (!topRows.rows || topRows.rows.length === 0) {
			await client.query('COMMIT');
			return {
				date: dateStr,
				settled: false,
				podium: [],
			};
		}

		const settings = await getSystemSettingsMap();
		const podiumAwards = [
			{
				rank: 1,
				title: 'Weekly Leaderboard Champion',
				badge: 'PODIUM_WEEKLY_GOLD',
				themeColor: '#FFD700',
				minCoins: Number(settings.weekly_podium_1_min_coins) || 250,
				maxCoins: Number(settings.weekly_podium_1_max_coins) || 400,
			},
			{
				rank: 2,
				title: 'Weekly Leaderboard Runner-Up',
				badge: 'PODIUM_WEEKLY_SILVER',
				themeColor: '#C0C0C0',
				minCoins: Number(settings.weekly_podium_2_min_coins) || 120,
				maxCoins: Number(settings.weekly_podium_2_max_coins) || 200,
			},
			{
				rank: 3,
				title: 'Weekly Leaderboard 3rd Place',
				badge: 'PODIUM_WEEKLY_BRONZE',
				themeColor: '#CD7F32',
				minCoins: Number(settings.weekly_podium_3_min_coins) || 60,
				maxCoins: Number(settings.weekly_podium_3_max_coins) || 100,
			},
		];

		const awarded: Array<{
			rank: number;
			userId: string;
			userName: string;
			score: number;
			coins: number;
			cardId?: string;
		}> = [];

		for (let i = 0; i < topRows.rows.length; i++) {
			const winner = topRows.rows[i];
			const award = podiumAwards[i];
			const randomCoins =
				Math.floor(Math.random() * (award.maxCoins - award.minCoins + 1)) +
				award.minCoins;

			const cardRes = await client.query(
				`INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
				 VALUES ($1, $2, 'Weekly Leaderboard', $3, false, $4, $5, NOW())
				 RETURNING id`,
				[
					winner.user_id,
					award.title,
					randomCoins,
					award.themeColor,
					award.badge,
				],
			);

			const cardId = cardRes.rows[0]?.id;

			await client.query(
				`INSERT INTO leaderboard_settlements (period, period_date, rank, user_id, score, coins_awarded, card_id, settled_at)
				 VALUES ('weekly', $1, $2, $3, $4, $5, $6, NOW())
				 ON CONFLICT (period, period_date, rank) DO NOTHING`,
				[
					dateStr,
					award.rank,
					winner.user_id,
					winner.primary_value,
					randomCoins,
					cardId,
				],
			);

			awarded.push({
				rank: award.rank,
				userId: winner.user_id,
				userName: winner.user_name,
				score: winner.primary_value,
				coins: randomCoins,
				cardId,
			});
		}

		await client.query('COMMIT');
		return {
			date: dateStr,
			settled: true,
			alreadySettled: false,
			podium: awarded,
		};
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function settleMonthlyLeaderboard(
	targetDate?: Date,
): Promise<DailySettlementResult> {
	const now = new Date();
	let startOfMonth: Date;
	let endOfMonth: Date;
	if (targetDate) {
		const targetParts = getISTParts(targetDate);
		startOfMonth = createISTDate(
			targetParts.year,
			targetParts.month,
			1,
			0,
			0,
			0,
			0,
		);
		endOfMonth = createISTDate(
			targetParts.year,
			targetParts.month + 1,
			1,
			0,
			0,
			0,
			0,
		);
	} else {
		const nowParts = getISTParts(now);
		startOfMonth = createISTDate(
			nowParts.year,
			nowParts.month - 1,
			1,
			0,
			0,
			0,
			0,
		);
		endOfMonth = createISTDate(nowParts.year, nowParts.month, 1, 0, 0, 0, 0);
	}
	const dateStr = formatISTDateString(startOfMonth);

	const pool = getPool();
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const existing = await client.query(
			`SELECT rank, user_id, score, coins_awarded, card_id
			 FROM leaderboard_settlements
			 WHERE period = 'monthly' AND period_date = $1
			 ORDER BY rank ASC`,
			[dateStr],
		);

		if (existing.rows && existing.rows.length > 0) {
			await client.query('COMMIT');
			return {
				date: dateStr,
				settled: true,
				alreadySettled: true,
				podium: existing.rows.map((r) => ({
					rank: r.rank,
					userId: r.user_id,
					userName: 'Smiler',
					score: r.score,
					coins: r.coins_awarded,
					cardId: r.card_id,
				})),
			};
		}

		const topRows = await client.query(
			`WITH daily_user_points AS (
				SELECT 
					sc.user_id,
					(sc.created_at AT TIME ZONE 'Asia/Kolkata')::date AS capture_date,
					MAX(sc.smile_score)::int AS daily_points,
					MIN(sc.created_at) AS first_capture_at
				FROM smile_captures sc
				WHERE sc.created_at >= $1 AND sc.created_at < $2
				  AND (sc.flagged IS NULL OR sc.flagged = false)
				GROUP BY sc.user_id, (sc.created_at AT TIME ZONE 'Asia/Kolkata')::date
			)
			SELECT 
				u.id AS user_id,
				COALESCE(u.name, 'Smiler') AS user_name,
				SUM(dup.daily_points)::int AS primary_value
			 FROM "user" u
			 JOIN daily_user_points dup ON dup.user_id = u.id
			 GROUP BY u.id, u.name
			 ORDER BY primary_value DESC, MIN(dup.first_capture_at) ASC
			 LIMIT 3`,
			[startOfMonth, endOfMonth],
		);

		if (!topRows.rows || topRows.rows.length === 0) {
			await client.query('COMMIT');
			return {
				date: dateStr,
				settled: false,
				podium: [],
			};
		}

		const settings = await getSystemSettingsMap();
		const podiumAwards = [
			{
				rank: 1,
				title: 'Monthly Smile Legend',
				badge: 'PODIUM_MONTHLY_GOLD',
				themeColor: '#FFD700',
				minCoins: Number(settings.monthly_podium_1_min_coins) || 800,
				maxCoins: Number(settings.monthly_podium_1_max_coins) || 1200,
			},
			{
				rank: 2,
				title: 'Monthly Grand Master',
				badge: 'PODIUM_MONTHLY_SILVER',
				themeColor: '#C0C0C0',
				minCoins: Number(settings.monthly_podium_2_min_coins) || 400,
				maxCoins: Number(settings.monthly_podium_2_max_coins) || 600,
			},
			{
				rank: 3,
				title: 'Monthly Smile Master',
				badge: 'PODIUM_MONTHLY_BRONZE',
				themeColor: '#CD7F32',
				minCoins: Number(settings.monthly_podium_3_min_coins) || 200,
				maxCoins: Number(settings.monthly_podium_3_max_coins) || 350,
			},
		];

		const awarded: Array<{
			rank: number;
			userId: string;
			userName: string;
			score: number;
			coins: number;
			cardId?: string;
		}> = [];

		for (let i = 0; i < topRows.rows.length; i++) {
			const winner = topRows.rows[i];
			const award = podiumAwards[i];
			const randomCoins =
				Math.floor(Math.random() * (award.maxCoins - award.minCoins + 1)) +
				award.minCoins;

			const cardRes = await client.query(
				`INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
				 VALUES ($1, $2, 'Monthly Leaderboard', $3, false, $4, $5, NOW())
				 RETURNING id`,
				[
					winner.user_id,
					award.title,
					randomCoins,
					award.themeColor,
					award.badge,
				],
			);

			const cardId = cardRes.rows[0]?.id;

			await client.query(
				`INSERT INTO leaderboard_settlements (period, period_date, rank, user_id, score, coins_awarded, card_id, settled_at)
				 VALUES ('monthly', $1, $2, $3, $4, $5, $6, NOW())
				 ON CONFLICT (period, period_date, rank) DO NOTHING`,
				[
					dateStr,
					award.rank,
					winner.user_id,
					winner.primary_value,
					randomCoins,
					cardId,
				],
			);

			awarded.push({
				rank: award.rank,
				userId: winner.user_id,
				userName: winner.user_name,
				score: winner.primary_value,
				coins: randomCoins,
				cardId,
			});
		}

		await client.query('COMMIT');
		return {
			date: dateStr,
			settled: true,
			alreadySettled: false,
			podium: awarded,
		};
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export interface LeaderboardSettledItem {
	rank: number;
	userId: string;
	userName: string;
	avatarUrl: string;
	score: number;
	coinsAwarded: number;
	cardId?: string;
	periodDate: string;
	settledAt: string;
}

export async function getLatestLeaderboardSettlement(
	period: string = 'daily',
): Promise<LeaderboardSettledItem[]> {
	const pool = getPool();
	const res = await pool.query(
		`WITH latest_date AS (
			SELECT MAX(period_date) as max_date
			FROM leaderboard_settlements
			WHERE period = $1
		)
		SELECT 
			ls.rank,
			ls.user_id,
			COALESCE(u.name, 'Smiler') AS user_name,
			COALESCE(u.image, '/icons/default-icon.webp') AS avatar_url,
			ls.score,
			ls.coins_awarded,
			ls.card_id,
			ls.period_date,
			ls.settled_at
		FROM leaderboard_settlements ls
		JOIN latest_date ld ON ls.period_date = ld.max_date
		LEFT JOIN "user" u ON u.id = ls.user_id
		WHERE ls.period = $1
		ORDER BY ls.rank ASC`,
		[period],
	);

	return (res.rows || []).map((r) => ({
		rank: Number(r.rank),
		userId: r.user_id,
		userName: r.user_name,
		avatarUrl: r.avatar_url,
		score: Number(r.score),
		coinsAwarded: Number(r.coins_awarded),
		cardId: r.card_id,
		periodDate:
			r.period_date instanceof Date ?
				r.period_date.toISOString().split('T')[0]
			:	String(r.period_date),
		settledAt: r.settled_at ? new Date(r.settled_at).toISOString() : '',
	}));
}

export async function logAdminAction(
	adminId: string,
	adminEmail: string,
	action: string,
	targetType: string,
	targetId?: string | null,
	details?: Record<string, any>,
): Promise<void> {
	const pool = getPool();
	await pool.query(
		`INSERT INTO admin_audit_logs (admin_id, admin_email, action, target_type, target_id, details, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW())`,
		[
			adminId,
			adminEmail,
			action,
			targetType,
			targetId || null,
			JSON.stringify(details || {}),
		],
	);
}

export async function getAdminDashboardStats() {
	const pool = getPool();
	const [
		aggregatedStatsRes,
		recentCapturesRes,
		recentLogsRes,
		recentSignupsRes,
	] = await Promise.all([
		pool.query(`
			SELECT
				(SELECT COUNT(*)::int FROM "user") AS total_users,
				(SELECT COUNT(*)::int FROM smile_captures) AS total_captures,
				(SELECT AVG(smile_score)::numeric(10,1) FROM smile_captures) AS avg_score,
				(SELECT COUNT(*)::int FROM smile_captures WHERE created_at >= CURRENT_DATE) AS captures_today,
				(SELECT COUNT(DISTINCT user_id)::int FROM smile_captures WHERE created_at >= CURRENT_DATE) AS active_today,
				(SELECT COALESCE(SUM(CASE WHEN coins > 0 THEN coins ELSE 0 END), 0)::bigint FROM coin_ledger) AS minted,
				(SELECT COALESCE(SUM(CASE WHEN coins < 0 THEN ABS(coins) ELSE 0 END), 0)::bigint FROM coin_ledger) AS spent,
				(SELECT COUNT(*)::int FROM rewards) AS total_claims,
				(SELECT COUNT(*)::int FROM smile_captures WHERE flagged = true) AS total_flags;
		`),
		pool.query(`SELECT sc.id, sc.smile_score, sc.coins_awarded, sc.created_at, sc.flagged, u.id as user_id, u.name as user_name, u.email as user_email, COALESCE(u.image, '/icons/default-icon.webp') as user_image
			FROM smile_captures sc
			JOIN "user" u ON sc.user_id = u.id
			ORDER BY sc.created_at DESC LIMIT 6`),
		pool.query(`SELECT id, admin_email, action, target_type, target_id, details, created_at
			FROM admin_audit_logs ORDER BY created_at DESC LIMIT 6`),
		pool.query(`SELECT id, name, email, COALESCE(image, '/icons/default-icon.webp') as image, COALESCE(role, 'user') as role, created_at
			FROM "user" ORDER BY created_at DESC LIMIT 5`),
	]);

	const agg = aggregatedStatsRes.rows[0] || {};

	return {
		totalUsers: agg.total_users || 0,
		totalCaptures: agg.total_captures || 0,
		averageScore: Number(agg.avg_score) || 0,
		capturesToday: agg.captures_today || 0,
		activeUsersToday: agg.active_today || 0,
		totalCoinsMinted: Number(agg.minted) || 0,
		totalCoinsSpent: Number(agg.spent) || 0,
		totalVoucherClaims: agg.total_claims || 0,
		totalFlaggedCaptures: agg.total_flags || 0,
		recentCaptures: recentCapturesRes.rows,
		recentAuditLogs: recentLogsRes.rows,
		recentSignups: recentSignupsRes.rows,
	};
}

export async function getAdminUsers(params: {
	search?: string;
	role?: string;
	banned?: string;
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 20, 1), 100);
	const offset = Math.max(params.offset || 0, 0);

	const whereClauses: string[] = ['1=1'];
	const values: any[] = [];
	let paramIndex = 1;

	if (params.search && params.search.trim()) {
		whereClauses.push(
			`(u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.id ILIKE $${paramIndex})`,
		);
		values.push(`%${params.search.trim()}%`);
		paramIndex++;
	}

	if (params.role && params.role !== 'all') {
		whereClauses.push(`COALESCE(u.role, 'user') = $${paramIndex}`);
		values.push(params.role);
		paramIndex++;
	}

	if (params.banned === 'true') {
		whereClauses.push(`u.banned = true`);
	} else if (params.banned === 'false') {
		whereClauses.push(`(u.banned = false OR u.banned IS NULL)`);
	}

	const whereSql = whereClauses.join(' AND ');

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS count FROM "user" u WHERE ${whereSql}`,
		values,
	);
	const total = countRes.rows[0]?.count || 0;

	values.push(limit, offset);
	const listRes = await pool.query(
		`WITH page_users AS (
			SELECT 
				u.id,
				u.name,
				u.email,
				COALESCE(u.image, '/icons/default-icon.webp') AS image,
				COALESCE(u.role, 'user') AS role,
				COALESCE(u.banned, false) AS banned,
				u."banReason",
				u."banExpires",
				u.created_at,
				COALESCE(u.streak_count, 0) AS streak_count
			FROM "user" u
			WHERE ${whereSql}
			ORDER BY u.created_at DESC
			LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
		)
		SELECT 
			pu.*,
			COALESCE(cl.balance, 0)::bigint AS coin_balance,
			COALESCE(sc.captures_count, 0)::int AS captures_count
		FROM page_users pu
		LEFT JOIN (
			SELECT user_id, SUM(coins) AS balance
			FROM coin_ledger
			WHERE user_id IN (SELECT id FROM page_users)
			GROUP BY user_id
		) cl ON cl.user_id = pu.id
		LEFT JOIN (
			SELECT user_id, COUNT(*) AS captures_count
			FROM smile_captures
			WHERE user_id IN (SELECT id FROM page_users)
			GROUP BY user_id
		) sc ON sc.user_id = pu.id
		ORDER BY pu.created_at DESC`,
		values,
	);

	return {
		users: listRes.rows,
		total,
		limit,
		offset,
	};
}

export async function getAdminUserDetail(userId: string) {
	const pool = getPool();
	const [
		userRes,
		balance,
		capturesRes,
		ledgerRes,
		rewardsRes,
		scratchCardsRes,
	] = await Promise.all([
		pool.query(
			`SELECT u.id, u.name, u.email, COALESCE(u.image, '/icons/default-icon.webp') AS image, COALESCE(u.role, 'user') AS role,
				COALESCE(u.banned, false) AS banned, u."banReason", u."banExpires",
				u.created_at, COALESCE(u.streak_count, 0) AS streak_count,
				u.referral_code, u.referred_by
			 FROM "user" u WHERE u.id = $1`,
			[userId],
		),
		getUserCoinBalance(userId),
		pool.query(
			`SELECT id, smile_score, coins_awarded, COALESCE(flagged, false) AS flagged, flag_reason, created_at
			 FROM smile_captures WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
			[userId],
		),
		pool.query(
			`SELECT id, coins, reason, created_at
			 FROM coin_ledger WHERE user_id = $1 ORDER BY created_at DESC LIMIT 25`,
			[userId],
		),
		pool.query(
			`SELECT id, tier, provider, voucher_code, coins_spent, claimed_at
			 FROM rewards WHERE user_id = $1 ORDER BY claimed_at DESC LIMIT 10`,
			[userId],
		),
		pool.query(
			`SELECT id, title, source, coins, is_scratched, theme_color, badge, created_at, scratched_at
			 FROM scratch_cards WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
			[userId],
		),
	]);

	if (!userRes.rows[0]) return null;

	return {
		user: userRes.rows[0],
		balance,
		captures: capturesRes.rows,
		ledger: ledgerRes.rows,
		rewards: rewardsRes.rows,
		scratchCards: scratchCardsRes.rows,
	};
}

export async function adminGrantUserScratchCard(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
	coins: number,
	title?: string,
	badge?: string,
	themeColor?: string,
) {
	const pool = getPool();
	const sanitizedTitle = (title && title.trim()) || 'Admin Surprise Reward';
	const sanitizedBadge = (badge && badge.trim()) || '🎁';
	const sanitizedTheme = (themeColor && themeColor.trim()) || '#FF2D78';

	const res = await pool.query(
		`INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
		 VALUES ($1, $2, 'Admin Grant', $3, false, $4, $5, NOW())
		 RETURNING id, user_id, title, source, coins, is_scratched, theme_color, badge, created_at`,
		[targetUserId, sanitizedTitle, coins, sanitizedTheme, sanitizedBadge],
	);

	const card = res.rows[0];

	await logAdminAction(
		adminId,
		adminEmail,
		'grant_scratch_card',
		'user',
		targetUserId,
		{
			cardId: card?.id,
			coins,
			title: sanitizedTitle,
			badge: sanitizedBadge,
			themeColor: sanitizedTheme,
		},
	);

	return card;
}

export async function adminAdjustUserCoins(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
	amount: number,
	reason: string,
) {
	const pool = getPool();
	const sanitizedReason = reason.trim() || 'Admin manual adjustment';
	await pool.query(
		`INSERT INTO coin_ledger (user_id, coins, reason, created_at)
		 VALUES ($1, $2, $3, NOW())`,
		[targetUserId, amount, `admin_adjustment: ${sanitizedReason}`],
	);
	const newBalance = await getUserCoinBalance(targetUserId);

	await logAdminAction(
		adminId,
		adminEmail,
		'adjust_coins',
		'user',
		targetUserId,
		{
			amount,
			reason: sanitizedReason,
			newBalance,
		},
	);

	return newBalance;
}

export async function adminSetUserRole(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
	role: string,
) {
	const pool = getPool();
	const validRole = role === 'admin' ? 'admin' : 'user';
	await pool.query(`UPDATE "user" SET role = $1 WHERE id = $2`, [
		validRole,
		targetUserId,
	]);

	await logAdminAction(adminId, adminEmail, 'set_role', 'user', targetUserId, {
		newRole: validRole,
	});

	return { success: true, role: validRole };
}

export async function adminSetUserBan(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
	banned: boolean,
	banReason?: string | null,
	banExpires?: Date | null,
) {
	const pool = getPool();
	await pool.query(
		`UPDATE "user"
		 SET banned = $1, "banReason" = $2, "banExpires" = $3
		 WHERE id = $4`,
		[
			banned,
			banned ? banReason || 'Violating platform guidelines' : null,
			banned ? banExpires || null : null,
			targetUserId,
		],
	);

	if (banned) {
		await pool
			.query(`DELETE FROM "session" WHERE "userId" = $1`, [targetUserId])
			.catch(() => {});
		await pool
			.query(`DELETE FROM "sessions" WHERE user_id = $1`, [targetUserId])
			.catch(() => {});
	}

	await logAdminAction(
		adminId,
		adminEmail,
		banned ? 'ban_user' : 'unban_user',
		'user',
		targetUserId,
		{
			banned,
			banReason,
			banExpires,
		},
	);

	return { success: true, banned };
}

export async function getAdminCaptures(params: {
	search?: string;
	minScore?: number;
	maxScore?: number;
	flaggedOnly?: boolean;
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 25, 1), 100);
	const offset = Math.max(params.offset || 0, 0);

	const where: string[] = ['1=1'];
	const values: any[] = [];
	let idx = 1;

	if (params.search && params.search.trim()) {
		where.push(
			`(u.name ILIKE $${idx} OR u.email ILIKE $${idx} OR sc.user_id ILIKE $${idx})`,
		);
		values.push(`%${params.search.trim()}%`);
		idx++;
	}

	if (typeof params.minScore === 'number' && !isNaN(params.minScore)) {
		where.push(`sc.smile_score >= $${idx}`);
		values.push(params.minScore);
		idx++;
	}

	if (typeof params.maxScore === 'number' && !isNaN(params.maxScore)) {
		where.push(`sc.smile_score <= $${idx}`);
		values.push(params.maxScore);
		idx++;
	}

	if (params.flaggedOnly) {
		where.push(`sc.flagged = true`);
	}

	const whereSql = where.join(' AND ');

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS count
		 FROM smile_captures sc
		 JOIN "user" u ON sc.user_id = u.id
		 WHERE ${whereSql}`,
		values,
	);

	values.push(limit, offset);
	const listRes = await pool.query(
		`SELECT 
			sc.id,
			sc.user_id,
			u.name AS user_name,
			u.email AS user_email,
			COALESCE(u.image, '/icons/default-icon.webp') AS user_image,
			sc.smile_score,
			sc.coins_awarded,
			COALESCE(sc.flagged, false) AS flagged,
			sc.flag_reason,
			sc.flagged_at,
			sc.flagged_by,
			sc.created_at
		 FROM smile_captures sc
		 JOIN "user" u ON sc.user_id = u.id
		 WHERE ${whereSql}
		 ORDER BY sc.created_at DESC
		 LIMIT $${idx} OFFSET $${idx + 1}`,
		values,
	);

	return {
		captures: listRes.rows,
		total: countRes.rows[0]?.count || 0,
		limit,
		offset,
	};
}

export async function adminFlagCapture(
	adminId: string,
	adminEmail: string,
	captureId: string,
	reason: string,
	deductCoins = true,
) {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const captureRes = await client.query(
			`SELECT user_id, coins_awarded, flagged FROM smile_captures WHERE id = $1 FOR UPDATE`,
			[captureId],
		);
		if (!captureRes.rows[0]) {
			await client.query('ROLLBACK');
			return { success: false, error: 'Capture not found' };
		}
		const capture = captureRes.rows[0];
		const alreadyFlagged = Boolean(capture.flagged);

		await client.query(
			`UPDATE smile_captures
			 SET flagged = true, flag_reason = $1, flagged_at = NOW(), flagged_by = $2
			 WHERE id = $3`,
			[reason, adminEmail, captureId],
		);

		let clawedBackCoins = 0;
		if (deductCoins && !alreadyFlagged && Number(capture.coins_awarded) > 0) {
			clawedBackCoins = Number(capture.coins_awarded);
			await client.query(
				`INSERT INTO coin_ledger (user_id, coins, reason, created_at)
				 VALUES ($1, $2, $3, NOW())`,
				[capture.user_id, -clawedBackCoins, `anti_cheat_clawback: ${reason}`],
			);
		}

		await client.query('COMMIT');

		await logAdminAction(
			adminId,
			adminEmail,
			'flag_capture',
			'capture',
			captureId,
			{
				reason,
				clawedBackCoins,
				userId: capture.user_id,
			},
		);

		return { success: true, clawedBackCoins };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function getAdminVouchers() {
	const pool = getPool();
	const inventoryRes = await pool.query(
		`SELECT voucher_id, brand_name, title, status, COUNT(*)::int as count
		 FROM voucher_inventory
		 GROUP BY voucher_id, brand_name, title, status`,
	);

	const claimsRes = await pool.query(
		`SELECT COUNT(*)::int as total_claims, COALESCE(SUM(coins_spent), 0)::bigint as total_spent
		 FROM rewards`,
	);

	let catalogRows = [];
	try {
		const catalogRes = await pool.query(
			`SELECT id, brand_name as "brandName", title, description, details, category, image_url as "imageUrl",
			        numeric_value as "numericValue", coins_cost as "coinsCost", highlight_tag as "highlightTag",
			        is_active as "isActive",
			        COALESCE(voucher_type, 'gift_card') as "voucherType",
			        COALESCE(value_formatted, '₹' || numeric_value::text) as "valueFormatted",
			        created_at as "createdAt"
			 FROM vouchers_catalog
			 ORDER BY created_at DESC`,
		);
		catalogRows = catalogRes.rows;
	} catch (err) {
		console.warn('Failed to query vouchers_catalog with details, falling back:', err);
		try {
			const fallbackRes = await pool.query(
				`SELECT id, brand_name as "brandName", title, description, category, image_url as "imageUrl",
				        numeric_value as "numericValue", coins_cost as "coinsCost", highlight_tag as "highlightTag",
				        is_active as "isActive",
				        COALESCE(voucher_type, 'gift_card') as "voucherType",
				        COALESCE(value_formatted, '₹' || numeric_value::text) as "valueFormatted",
				        created_at as "createdAt"
				 FROM vouchers_catalog
				 ORDER BY created_at DESC`,
			);
			catalogRows = fallbackRes.rows.map((r: any) => ({ ...r, details: null }));
		} catch (fallbackErr) {
			console.error('Failed fallback query vouchers_catalog:', fallbackErr);
		}
	}

	return {
		inventorySummary: inventoryRes.rows,
		catalog: catalogRows,
		totalClaims: claimsRes.rows[0]?.total_claims || 0,
		totalCoinsSpent: Number(claimsRes.rows[0]?.total_spent) || 0,
	};
}

export async function createAdminVoucher(params: {
	adminId: string;
	adminEmail: string;
	brandName: string;
	title: string;
	description?: string;
	details?: string;
	category?: string;
	imageUrl?: string;
	voucherType?: string;
	valueFormatted?: string;
	numericValue: number;
	coinsCost: number;
	highlightTag?: string;
	codes?: string[];
}) {
	const pool = getPool();
	const cleanBrand =
		params.brandName
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '')
			.slice(0, 4) || 'vouc';
	const id = `${cleanBrand}-${params.numericValue || 'rew'}-${Date.now().toString(36).slice(-4)}`;

	await pool.query(
		`INSERT INTO vouchers_catalog (id, brand_name, title, description, details, category, image_url, numeric_value, coins_cost, highlight_tag, is_active, voucher_type, value_formatted, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, $11, $12, NOW())
		 ON CONFLICT (id) DO UPDATE SET
		 	brand_name = EXCLUDED.brand_name,
		 	title = EXCLUDED.title,
		 	description = EXCLUDED.description,
		 	details = EXCLUDED.details,
		 	category = EXCLUDED.category,
		 	image_url = EXCLUDED.image_url,
		 	numeric_value = EXCLUDED.numeric_value,
		 	coins_cost = EXCLUDED.coins_cost,
		 	highlight_tag = EXCLUDED.highlight_tag,
		 	voucher_type = EXCLUDED.voucher_type,
		 	value_formatted = EXCLUDED.value_formatted`,
		[
			id,
			params.brandName,
			params.title,
			params.description || `Redeem ${params.title} with smile coins.`,
			params.details || null,
			params.category || 'ecommerce',
			params.imageUrl || null,
			params.numericValue,
			params.coinsCost,
			params.highlightTag || null,
			params.voucherType || 'gift_card',
			params.valueFormatted ||
				(params.numericValue ? `₹${params.numericValue}` : params.title),
		],
	);

	let insertedCodes = 0;
	if (params.codes && params.codes.length > 0) {
		const cleanCodes = Array.from(
			new Set(params.codes.map((c) => c.trim()).filter(Boolean)),
		);
		for (const code of cleanCodes) {
			const res = await pool.query(
				`INSERT INTO voucher_inventory (voucher_id, brand_name, title, code, status, created_at)
				 VALUES ($1, $2, $3, $4, 'available', NOW())
				 ON CONFLICT (code) DO NOTHING`,
				[id, params.brandName, params.title, code],
			);
			if (res.rowCount && res.rowCount > 0) insertedCodes++;
		}
	}

	await logAdminAction(
		params.adminId,
		params.adminEmail,
		'create_voucher',
		'voucher',
		id,
		{
			brandName: params.brandName,
			title: params.title,
			numericValue: params.numericValue,
			coinsCost: params.coinsCost,
			voucherType: params.voucherType,
			valueFormatted: params.valueFormatted,
			codesCount: insertedCodes,
		},
	);

	return { success: true, voucherId: id, insertedCodes };
}

export async function updateAdminVoucher(params: {
	adminId: string;
	adminEmail: string;
	voucherId: string;
	brandName: string;
	title: string;
	description?: string;
	details?: string | null;
	category?: string;
	imageUrl?: string | null;
	voucherType?: string;
	valueFormatted?: string | null;
	numericValue: number;
	coinsCost: number;
	highlightTag?: string | null;
	isActive?: boolean;
}) {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		const vRes = await client.query(
			`UPDATE vouchers_catalog
			 SET brand_name = $2,
			     title = $3,
			     description = $4,
			     details = $5,
			     category = $6,
			     image_url = $7,
			     numeric_value = $8,
			     coins_cost = $9,
			     highlight_tag = $10,
			     is_active = COALESCE($11, is_active),
			     voucher_type = COALESCE($12, voucher_type),
			     value_formatted = COALESCE($13, value_formatted)
			 WHERE id = $1
			 RETURNING id, brand_name as "brandName", title, description, details, category, image_url as "imageUrl",
			           numeric_value as "numericValue", coins_cost as "coinsCost", highlight_tag as "highlightTag",
			           is_active as "isActive", voucher_type as "voucherType", value_formatted as "valueFormatted"`,
			[
				params.voucherId,
				params.brandName,
				params.title,
				params.description !== undefined ? params.description : null,
				params.details !== undefined ? params.details : null,
				params.category || 'ecommerce',
				params.imageUrl !== undefined ? params.imageUrl : null,
				params.numericValue,
				params.coinsCost,
				params.highlightTag !== undefined ? params.highlightTag : null,
				params.isActive !== undefined ? params.isActive : null,
				params.voucherType !== undefined ? params.voucherType : null,
				params.valueFormatted !== undefined ? params.valueFormatted : null,
			],
		);

		if (vRes.rowCount === 0) {
			throw new Error('Voucher not found');
		}

		await client.query(
			`UPDATE voucher_inventory
			 SET brand_name = $2, title = $3
			 WHERE voucher_id = $1`,
			[params.voucherId, params.brandName, params.title],
		);

		await client.query('COMMIT');

		await logAdminAction(
			params.adminId,
			params.adminEmail,
			'update_voucher',
			'voucher',
			params.voucherId,
			{
				brandName: params.brandName,
				title: params.title,
				numericValue: params.numericValue,
				coinsCost: params.coinsCost,
				voucherType: params.voucherType,
				valueFormatted: params.valueFormatted,
				isActive: params.isActive,
			},
		);

		return { success: true, voucher: vRes.rows[0] };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function deleteAdminVoucher(params: {
	adminId: string;
	adminEmail: string;
	voucherId: string;
}) {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		const vRes = await client.query(
			`SELECT brand_name, title FROM vouchers_catalog WHERE id = $1`,
			[params.voucherId],
		);
		const voucher = vRes.rows[0];
		if (!voucher) {
			throw new Error('Voucher not found');
		}

		const invRes = await client.query(
			`DELETE FROM voucher_inventory WHERE voucher_id = $1 AND status = 'available'`,
			[params.voucherId],
		);

		await client.query(`DELETE FROM vouchers_catalog WHERE id = $1`, [
			params.voucherId,
		]);

		await client.query('COMMIT');

		await logAdminAction(
			params.adminId,
			params.adminEmail,
			'delete_voucher',
			'voucher',
			params.voucherId,
			{
				brandName: voucher.brand_name,
				title: voucher.title,
				deletedAvailableCodes: invRes.rowCount || 0,
			},
		);

		return { success: true, deletedAvailableCodes: invRes.rowCount || 0 };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function adminSeedVoucherCodes(
	adminId: string,
	adminEmail: string,
	voucherId: string,
	brandName: string,
	title: string,
	codes: string[],
) {
	const pool = getPool();
	const cleanCodes = Array.from(
		new Set(codes.map((c) => c.trim()).filter(Boolean)),
	);
	if (cleanCodes.length === 0) {
		return { success: false, inserted: 0, total: 0 };
	}

	let inserted = 0;
	for (const code of cleanCodes) {
		const res = await pool.query(
			`INSERT INTO voucher_inventory (voucher_id, brand_name, title, code, status, created_at)
			 VALUES ($1, $2, $3, $4, 'available', NOW())
			 ON CONFLICT (code) DO NOTHING`,
			[voucherId, brandName, title, code],
		);
		if (res.rowCount && res.rowCount > 0) inserted++;
	}

	await logAdminAction(
		adminId,
		adminEmail,
		'seed_vouchers',
		'voucher',
		voucherId,
		{
			brandName,
			title,
			codesCount: cleanCodes.length,
			inserted,
		},
	);

	return { success: true, inserted, total: cleanCodes.length };
}

export async function getAdminVoucherClaims(params: {
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 25, 1), 100);
	const offset = Math.max(params.offset || 0, 0);

	const countRes = await pool.query(
		`SELECT COUNT(*)::int as count FROM rewards`,
	);
	const claimsRes = await pool.query(
		`SELECT r.id, r.user_id, u.name as user_name, u.email as user_email,
				r.tier, r.provider, r.voucher_code, r.coins_spent, r.claimed_at
		 FROM rewards r
		 JOIN "user" u ON r.user_id = u.id
		 ORDER BY r.claimed_at DESC
		 LIMIT $1 OFFSET $2`,
		[limit, offset],
	);

	return {
		claims: claimsRes.rows,
		total: countRes.rows[0]?.count || 0,
		limit,
		offset,
	};
}

export async function getAdminExplorePosts(params: {
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 24, 1), 100);
	const offset = Math.max(params.offset || 0, 0);

	const countRes = await pool.query(
		`SELECT COUNT(*)::int as count FROM explore_posts`,
	);
	const postsRes = await pool.query(
		`SELECT ep.id, ep.user_id, u.name as user_name, u.email as user_email,
				ep.image_url, ep.smile_score, ep.caption, ep.likes_count, ep.created_at
		 FROM explore_posts ep
		 JOIN "user" u ON ep.user_id = u.id
		 ORDER BY ep.created_at DESC
		 LIMIT $1 OFFSET $2`,
		[limit, offset],
	);

	return {
		posts: postsRes.rows,
		total: countRes.rows[0]?.count || 0,
		limit,
		offset,
	};
}

export async function adminDeleteExplorePost(
	adminId: string,
	adminEmail: string,
	postId: string,
) {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		await client.query(`DELETE FROM explore_likes WHERE post_id = $1`, [
			postId,
		]);
		const del = await client.query(
			`DELETE FROM explore_posts WHERE id = $1 RETURNING user_id`,
			[postId],
		);
		await client.query('COMMIT');

		await logAdminAction(
			adminId,
			adminEmail,
			'delete_explore_post',
			'explore_post',
			postId,
			{
				deleted: (del.rowCount || 0) > 0,
				authorUserId: del.rows[0]?.user_id,
			},
		);

		return { success: true, deleted: (del.rowCount || 0) > 0 };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function getSystemSettings() {
	const pool = getPool();
	const { rows } = await pool.query(
		`SELECT key, value, description, updated_at, updated_by FROM system_settings ORDER BY key ASC`,
	);
	const settings: Record<string, any> = {};
	for (const row of rows) {
		settings[row.key] = {
			value: row.value,
			description: row.description,
			updatedAt: row.updated_at,
			updatedBy: row.updated_by,
		};
	}
	return settings;
}

export async function getSystemSettingsMap(): Promise<Record<string, any>> {
	const pool = getPool();
	const { rows } = await pool.query(`SELECT key, value FROM system_settings`);
	const defaults: Record<string, any> = {
		maintenance_mode: false,
		signup_enabled: true,
		beta_waitlist_mode: false,
		marketplace_enabled: true,
		explore_feed_enabled: true,
		explore_posting_enabled: true,
		leaderboard_enabled: true,
		scratch_cards_enabled: true,
		email_otp_required: true,
		liveness_detection_enabled: true,
		image_hash_check_enabled: true,
		auto_flag_anomalies_enabled: true,
		max_daily_captures_per_user: 10,
		min_smile_score_threshold: 11,
		coin_multiplier: 1.0,
		referral_reward_coins: 200,
		referee_bonus_coins: 50,
		referral_referrer_min_coins: 50,
		referral_referrer_max_coins: 200,
		referral_referee_min_coins: 20,
		referral_referee_max_coins: 50,
		max_daily_referral_rewards: 5,
		daily_streak_coins: 5,
		scratch_min_coins: 5,
		scratch_max_coins: 100,
		daily_podium_1_min_coins: 70,
		daily_podium_1_max_coins: 99,
		daily_podium_2_min_coins: 40,
		daily_podium_2_max_coins: 69,
		daily_podium_3_min_coins: 15,
		daily_podium_3_max_coins: 39,
		weekly_podium_1_min_coins: 250,
		weekly_podium_1_max_coins: 400,
		weekly_podium_2_min_coins: 120,
		weekly_podium_2_max_coins: 200,
		weekly_podium_3_min_coins: 60,
		weekly_podium_3_max_coins: 100,
		monthly_podium_1_min_coins: 800,
		monthly_podium_1_max_coins: 1200,
		monthly_podium_2_min_coins: 400,
		monthly_podium_2_max_coins: 600,
		monthly_podium_3_min_coins: 200,
		monthly_podium_3_max_coins: 350,
		palm_shutter_enabled: true,
		mediapipe_drawing_spec: DEFAULT_DRAWING_SPEC,
	};
	for (const row of rows) {
		defaults[row.key] = row.value;
	}
	return defaults;
}

export async function updateSystemSetting(
	adminId: string,
	adminEmail: string,
	key: string,
	value: any,
	description?: string,
) {
	const pool = getPool();
	await pool.query(
		`INSERT INTO system_settings (key, value, description, updated_at, updated_by)
		 VALUES ($1, $2::jsonb, $3, NOW(), $4)
		 ON CONFLICT (key) DO UPDATE
		 SET value = EXCLUDED.value,
			 description = COALESCE(EXCLUDED.description, system_settings.description),
			 updated_at = NOW(),
			 updated_by = EXCLUDED.updated_by`,
		[key, JSON.stringify(value), description || null, adminEmail],
	);

	await logAdminAction(
		adminId,
		adminEmail,
		'update_setting',
		'system_setting',
		key,
		{
			key,
			value,
		},
	);

	return { success: true, key, value };
}

export async function getAdminAuditLogs(params: {
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 30, 1), 100);
	const offset = Math.max(params.offset || 0, 0);

	const countRes = await pool.query(
		`SELECT COUNT(*)::int as count FROM admin_audit_logs`,
	);
	const logsRes = await pool.query(
		`SELECT id, admin_id, admin_email, action, target_type, target_id, details, created_at
		 FROM admin_audit_logs
		 ORDER BY created_at DESC
		 LIMIT $1 OFFSET $2`,
		[limit, offset],
	);

	return {
		logs: logsRes.rows,
		total: countRes.rows[0]?.count || 0,
		limit,
		offset,
	};
}

export async function bootstrapAdminUser(userId: string, email: string) {
	const pool = getPool();
	const adminEmails = (process.env.ADMIN_EMAILS || 'ronisarkar10938@gmail.com')
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);

	const isAuthorized =
		adminEmails.includes(email.toLowerCase()) ||
		process.env.NODE_ENV !== 'production';
	if (!isAuthorized) {
		return { success: false, error: 'Unauthorized email' };
	}

	await pool.query(`UPDATE "user" SET role = 'admin' WHERE id = $1`, [userId]);

	await logAdminAction(userId, email, 'bootstrap_admin', 'user', userId, {
		email,
	});

	return { success: true, role: 'admin' };
}

export async function adminDeleteUser(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
) {
	if (adminId === targetUserId) {
		throw new Error('Cannot delete your own admin account');
	}

	const pool = getPool();
	const deleteQuery = `
		WITH 
		  d_el1 AS (DELETE FROM explore_likes WHERE user_id = $1),
		  d_l1 AS (DELETE FROM likes WHERE user_id = $1),
		  d_el2 AS (DELETE FROM explore_likes WHERE post_id IN (SELECT id FROM explore_posts WHERE user_id = $1)),
		  d_ep AS (DELETE FROM explore_posts WHERE user_id = $1),
		  d_l2 AS (DELETE FROM likes WHERE post_id IN (SELECT id FROM posts WHERE user_id = $1)),
		  d_p AS (DELETE FROM posts WHERE user_id = $1),
		  d_ih AS (DELETE FROM image_hashes WHERE user_id = $1),
		  d_sc AS (DELETE FROM smile_captures WHERE user_id = $1),
		  d_cl AS (DELETE FROM coin_ledger WHERE user_id = $1),
		  d_st AS (DELETE FROM streaks WHERE user_id = $1),
		  d_rw AS (DELETE FROM rewards WHERE user_id = $1),
		  d_vc AS (DELETE FROM vouchers WHERE user_id = $1),
		  d_cards AS (DELETE FROM scratch_cards WHERE user_id = $1),
		  d_ls AS (DELETE FROM leaderboard_settlements WHERE user_id = $1),
		  d_ref AS (DELETE FROM referrals WHERE referrer_id = $1 OR referred_id = $1),
		  u_vi AS (UPDATE voucher_inventory SET status = 'available', claimed_by = NULL, claimed_at = NULL WHERE claimed_by = $1),
		  d_s1 AS (DELETE FROM session WHERE "userId" = $1),
		  d_s2 AS (DELETE FROM sessions WHERE user_id = $1),
		  d_a1 AS (DELETE FROM account WHERE "userId" = $1),
		  d_a2 AS (DELETE FROM accounts WHERE user_id = $1),
		  d_tf AS (DELETE FROM "twoFactor" WHERE "userId" = $1),
		  d_mem AS (DELETE FROM member WHERE "userId" = $1),
		  d_inv AS (DELETE FROM invitation WHERE "inviterId" = $1)
		DELETE FROM "user" WHERE id = $1
		RETURNING id, name, email, role;
	`;

	const res = await pool.query(deleteQuery, [targetUserId]);
	if (!res.rows[0]) {
		return { success: false, error: 'User not found' };
	}

	const targetUser = res.rows[0];

	await logAdminAction(
		adminId,
		adminEmail,
		'delete_user',
		'user',
		targetUserId,
		{
			deletedUserName: targetUser.name,
			deletedUserEmail: targetUser.email,
			deletedUserRole: targetUser.role,
		},
	);

	return { success: true, deletedUserId: targetUserId };
}

export async function findUserByReferralCode(code: string): Promise<{
	id: string;
	name: string;
	image: string | null;
	referralCode: string;
} | null> {
	if (!code || !code.trim()) return null;
	const pool = getPool();
	const { rows } = await pool.query(
		`SELECT id, name, image, referral_code FROM "user" WHERE UPPER(referral_code) = UPPER($1) AND (banned IS NOT TRUE) LIMIT 1`,
		[code.trim()],
	);
	if (!rows[0]) return null;
	return {
		id: rows[0].id,
		name: rows[0].name || 'Smiler',
		image: rows[0].image || '/icons/default-icon.webp',
		referralCode: rows[0].referral_code,
	};
}

export async function createPendingReferral(params: {
	referrerCode: string;
	newUserId: string;
}): Promise<{ success: boolean; referralId?: string; error?: string }> {
	const { referrerCode, newUserId } = params;
	if (!referrerCode || !newUserId) {
		return { success: false, error: 'Missing referrerCode or newUserId' };
	}

	const referrer = await findUserByReferralCode(referrerCode);
	if (!referrer) {
		return { success: false, error: 'Referrer not found' };
	}

	// Prevent self-referral
	if (referrer.id === newUserId) {
		return { success: false, error: 'Cannot refer oneself' };
	}

	const pool = getPool();
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// Set referred_by on new user
		await client.query(
			`UPDATE "user" SET referred_by = $1 WHERE id = $2 AND (referred_by IS NULL OR referred_by = '')`,
			[referrer.id, newUserId],
		);

		// Insert pending referral
		const res = await client.query(
			`INSERT INTO referrals (id, referrer_id, referred_id, status, created_at)
			 VALUES (gen_random_uuid(), $1, $2, 'pending', NOW())
			 ON CONFLICT (referred_id) DO NOTHING
			 RETURNING id`,
			[referrer.id, newUserId],
		);

		await client.query('COMMIT');
		return {
			success: true,
			referralId: res.rows[0]?.id ? String(res.rows[0].id) : undefined,
		};
	} catch (err: any) {
		await client.query('ROLLBACK');
		console.error('[createPendingReferral] Error:', err);
		return { success: false, error: err.message };
	} finally {
		client.release();
	}
}

export interface ProfileBadgeItem {
	id: string;
	name: string;
	description: string;
	category: 'streak' | 'quality' | 'social' | 'economy';
	iconName: string;
	thresholdText: string;
	isUnlocked: boolean;
	unlockedAt?: string | null;
	accentColor: string;
}

export interface UserProfileFullDetails {
	id: string;
	name: string;
	username: string;
	email: string;
	image: string | null;
	role: string;
	joinDate: string;
	stats: {
		streakCount: number;
		longestStreak: number;
		multiplier: number;
		multiplierLabel: string;
		isTodayCompleted: boolean;
		totalSmiles: number;
		bestScore: number;
		avgScore: number;
		lifetimeCoinsEarned: number;
		currentCoinsBalance: number;
		dailyRank: number | null;
		totalUsers: number;
		tierName: string;
		tierIcon: string;
		tierLevel: number;
	};
	streakSociety: {
		isMember: boolean;
		daysRequired: number;
		daysLeft: number;
	};
	referral: {
		code: string;
		shareUrl: string;
		totalReferred: number;
		coinsEarned: number;
	};
	badges: ProfileBadgeItem[];
	recentCaptures: RecentSmileItem[];
	monthlyCaptures: MonthlyCaptureItem[];
	publicPosts: Array<{
		id: string;
		smileScore: number;
		likesCount: number;
		createdAt: string;
		timeRemainingHours: number;
	}>;
}

export interface UserPublicProfileDetails {
	id: string;
	name: string;
	username: string;
	image: string | null;
	avatarLetters: string;
	joinDate: string;
	stats: {
		streakCount: number;
		longestStreak: number;
		multiplierLabel: string;
		totalSmiles: number;
		bestScore: number;
		dailyRank: number | null;
		tierName: string;
		tierIcon: string;
		tierLevel: number;
	};
	streakSociety: {
		isMember: boolean;
	};
	badges: ProfileBadgeItem[];
	publicPosts: Array<{
		id: string;
		smileScore: number;
		likesCount: number;
		createdAt: string;
		timeAgo: string;
		bg: string;
	}>;
	referralCode?: string;
}

function getSmilerTier(totalSmiles: number): {
	tierName: string;
	tierIcon: string;
	tierLevel: number;
} {
	if (totalSmiles >= 300)
		return { tierName: 'Smile Grandmaster', tierIcon: '👑', tierLevel: 5 };
	if (totalSmiles >= 100)
		return { tierName: 'Duchenne Master', tierIcon: '🏆', tierLevel: 4 };
	if (totalSmiles >= 30)
		return { tierName: 'Radiant Beamer', tierIcon: '⚡', tierLevel: 3 };
	if (totalSmiles >= 10)
		return { tierName: 'Warm Smiler', tierIcon: '☀️', tierLevel: 2 };
	return { tierName: 'Gentle Grinner', tierIcon: '🌱', tierLevel: 1 };
}

export function computeProfileBadges(params: {
	streakCount: number;
	longestStreak: number;
	bestScore: number;
	totalSmiles: number;
	totalReferred: number;
	vouchersClaimed: number;
	publicPostsCount: number;
	totalLikes: number;
}): ProfileBadgeItem[] {
	const {
		streakCount,
		longestStreak,
		bestScore,
		totalSmiles,
		totalReferred,
		vouchersClaimed,
		publicPostsCount,
		totalLikes,
	} = params;

	const effectiveStreak = Math.max(streakCount, longestStreak);

	return [
		// Streak badges
		{
			id: 'streak-3',
			name: '3-Day Spark',
			description: 'Maintained a 3-day consecutive smile streak',
			category: 'streak',
			iconName: 'Flame',
			thresholdText: '3 Days',
			isUnlocked: effectiveStreak >= 3,
			accentColor: 'bg-amber-400',
		},
		{
			id: 'streak-7',
			name: '7-Day Warrior',
			description: 'Completed a full week of daily smile captures',
			category: 'streak',
			iconName: 'Zap',
			thresholdText: '7 Days',
			isUnlocked: effectiveStreak >= 7,
			accentColor: 'bg-primary',
		},
		{
			id: 'streak-14',
			name: '14-Day Habit Master',
			description: 'Two full weeks of positive facial AI check-ins',
			category: 'streak',
			iconName: 'Award',
			thresholdText: '14 Days',
			isUnlocked: effectiveStreak >= 14,
			accentColor: 'bg-accent',
		},
		{
			id: 'streak-30',
			name: '30-Day Titan',
			description: 'A complete month of uninterrupted daily smiles',
			category: 'streak',
			iconName: 'Trophy',
			thresholdText: '30 Days',
			isUnlocked: effectiveStreak >= 30,
			accentColor: 'bg-secondary',
		},
		{
			id: 'streak-60',
			name: '60-Day Grandmaster',
			description: 'Legendary 60-day smile devotion and maximum coin boost',
			category: 'streak',
			iconName: 'Crown',
			thresholdText: '60 Days',
			isUnlocked: effectiveStreak >= 60,
			accentColor: 'bg-emerald-400',
		},

		// Quality badges
		{
			id: 'quality-first',
			name: 'First Smile',
			description: 'Completed your very first on-device AI smile capture',
			category: 'quality',
			iconName: 'Camera',
			thresholdText: '1 Capture',
			isUnlocked: totalSmiles >= 1,
			accentColor: 'bg-primary',
		},
		{
			id: 'quality-radiant',
			name: 'Radiant Beam',
			description: 'Achieved an AI smile score of 85 or higher',
			category: 'quality',
			iconName: 'Sparkles',
			thresholdText: 'Score 85+',
			isUnlocked: bestScore >= 85,
			accentColor: 'bg-accent',
		},
		{
			id: 'quality-pure',
			name: 'Pure Joy',
			description: 'Achieved an elite AI smile score of 95 or higher',
			category: 'quality',
			iconName: 'Heart',
			thresholdText: 'Score 95+',
			isUnlocked: bestScore >= 95,
			accentColor: 'bg-warning',
		},
		{
			id: 'quality-duchenne',
			name: 'Perfect 100',
			description: 'Maxed out genuine Duchenne facial markers at 100/100',
			category: 'quality',
			iconName: 'Crown',
			thresholdText: 'Score 100',
			isUnlocked: bestScore >= 100,
			accentColor: 'bg-secondary',
		},

		// Social & Explorer
		{
			id: 'social-debut',
			name: 'Public Debut',
			description: 'Opted in to share a capture to the public Explore feed',
			category: 'social',
			iconName: 'Share2',
			thresholdText: '1 Shared Post',
			isUnlocked: publicPostsCount >= 1,
			accentColor: 'bg-info',
		},
		{
			id: 'social-popular',
			name: 'Smile Luminary',
			description: 'Gathered 5+ likes on your public smile posts',
			category: 'social',
			iconName: 'Heart',
			thresholdText: '5 Likes',
			isUnlocked: totalLikes >= 5,
			accentColor: 'bg-pink-400',
		},

		// Economy & Referrals
		{
			id: 'econ-claim',
			name: 'First Cashout',
			description: 'Redeemed your hard-earned smile coins for a real voucher',
			category: 'economy',
			iconName: 'Gift',
			thresholdText: '1 Voucher',
			isUnlocked: vouchersClaimed >= 1,
			accentColor: 'bg-success',
		},
		{
			id: 'econ-scout',
			name: 'Referral Scout',
			description: 'Successfully invited a friend who joined Open Smile',
			category: 'economy',
			iconName: 'Users',
			thresholdText: '1 Referral',
			isUnlocked: totalReferred >= 1,
			accentColor: 'bg-amber-300',
		},
		{
			id: 'econ-ambassador',
			name: 'Super Ambassador',
			description: 'Invited 5+ friends to smile and earn rewards',
			category: 'economy',
			iconName: 'Trophy',
			thresholdText: '5 Referrals',
			isUnlocked: totalReferred >= 5,
			accentColor: 'bg-purple-400',
		},
	];
}

export async function getUserProfileFullDetails(
	userId: string,
): Promise<UserProfileFullDetails> {
	const pool = getPool();

	const [
		userRes,
		streakData,
		coinsCurrentRes,
		coinsLifetimeRes,
		dailyRankData,
		referralsRes,
		referralCoinsRes,
		vouchersClaimedRes,
		avgScoreRes,
		publicPostsRes,
	] = await Promise.all([
		pool.query(
			`SELECT id, name, email, image, role, referral_code, created_at, "createdAt"
			 FROM "user"
			 WHERE id = $1
			 LIMIT 1`,
			[userId],
		),
		getUserStreakFullDetails(userId),
		pool.query(
			`SELECT COALESCE(SUM(coins), 0)::int AS current_balance
			 FROM coin_ledger
			 WHERE user_id = $1`,
			[userId],
		),
		pool.query(
			`SELECT COALESCE(SUM(coins), 0)::int AS lifetime_coins
			 FROM coin_ledger
			 WHERE user_id = $1 AND coins > 0`,
			[userId],
		),
		getUserDailyRank(userId),
		pool.query(
			`SELECT COUNT(*)::int AS total_referred
			 FROM referrals
			 WHERE referrer_id = $1`,
			[userId],
		),
		pool.query(
			`SELECT COALESCE(SUM(coins), 0)::int AS referral_coins
			 FROM coin_ledger
			 WHERE user_id = $1 AND reason ILIKE '%referral%'`,
			[userId],
		),
		pool.query(
			`SELECT COUNT(*)::int AS claimed_count
			 FROM voucher_inventory
			 WHERE claimed_by = $1`,
			[userId],
		),
		pool.query(
			`SELECT COALESCE(ROUND(AVG(smile_score)), 0)::int AS avg_score
			 FROM smile_captures
			 WHERE user_id = $1 AND (flagged IS NULL OR flagged = false)`,
			[userId],
		),
		pool.query(
			`SELECT id, smile_score, likes_count, created_at
			 FROM explore_posts
			 WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '24 hours'
			 ORDER BY created_at DESC
			 LIMIT 12`,
			[userId],
		),
	]);

	const userRow = userRes.rows[0];
	const userName = userRow?.name || 'Smiler';
	const userEmail = userRow?.email || '';
	const userImage = userRow?.image || null;
	const userRole = userRow?.role || 'user';
	const createdDt =
		userRow?.created_at || userRow?.createdAt ?
			new Date(userRow.created_at || userRow.createdAt)
		:	new Date();
	const joinDateStr = createdDt.toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric',
	});

	let referralCode = userRow?.referral_code;
	if (!referralCode) {
		referralCode = `SMILE${userId.slice(0, 5).toUpperCase()}`;
		void pool
			.query(
				`UPDATE "user" SET referral_code = $1 WHERE id = $2 AND referral_code IS NULL`,
				[referralCode, userId],
			)
			.catch(() => {});
	}

	const totalSmiles = streakData.stats.totalSmiles;
	const bestScore = streakData.stats.bestScore;
	const avgScore =
		Number(avgScoreRes.rows[0]?.avg_score) || (bestScore > 0 ? bestScore : 0);
	const currentCoinsBalance =
		Number(coinsCurrentRes.rows[0]?.current_balance) || 0;
	const lifetimeCoinsEarned =
		Number(coinsLifetimeRes.rows[0]?.lifetime_coins) || currentCoinsBalance;
	const totalReferred = Number(referralsRes.rows[0]?.total_referred) || 0;
	const referralCoinsEarned =
		Number(referralCoinsRes.rows[0]?.referral_coins) || 0;
	const vouchersClaimed =
		Number(vouchersClaimedRes.rows[0]?.claimed_count) || 0;

	const now = Date.now();
	const publicPosts = publicPostsRes.rows.map((p) => {
		const postTime = new Date(p.created_at).getTime();
		const elapsedHours = (now - postTime) / (1000 * 60 * 60);
		const timeRemainingHours = Math.max(1, Math.round(24 - elapsedHours));
		return {
			id: String(p.id),
			smileScore: Number(p.smile_score) || 0,
			likesCount: Number(p.likes_count) || 0,
			createdAt: new Date(p.created_at).toISOString(),
			timeRemainingHours,
		};
	});

	const totalLikes = publicPosts.reduce((acc, p) => acc + p.likesCount, 0);
	const tier = getSmilerTier(totalSmiles);

	const badges = computeProfileBadges({
		streakCount: streakData.streakCount,
		longestStreak: streakData.stats.longestStreak,
		bestScore,
		totalSmiles,
		totalReferred,
		vouchersClaimed,
		publicPostsCount: publicPosts.length,
		totalLikes,
	});

	const usernameSlug =
		userName.toLowerCase().replace(/[^a-z0-9]/g, '') ||
		`user${userId.slice(0, 4)}`;

	return {
		id: userId,
		name: userName,
		username: usernameSlug,
		email: userEmail,
		image: userImage,
		role: userRole,
		joinDate: joinDateStr,
		stats: {
			streakCount: streakData.streakCount,
			longestStreak: streakData.stats.longestStreak,
			multiplier: streakData.multiplier,
			multiplierLabel: streakData.multiplierLabel,
			isTodayCompleted: streakData.isTodayCompleted,
			totalSmiles,
			bestScore,
			avgScore,
			lifetimeCoinsEarned,
			currentCoinsBalance,
			dailyRank: dailyRankData.rank,
			totalUsers: dailyRankData.totalUsers,
			tierName: tier.tierName,
			tierIcon: tier.tierIcon,
			tierLevel: tier.tierLevel,
		},
		streakSociety: streakData.streakSociety,
		referral: {
			code: referralCode,
			shareUrl: `/join/${referralCode}`,
			totalReferred,
			coinsEarned: referralCoinsEarned,
		},
		badges,
		recentCaptures: streakData.recentSmiles,
		monthlyCaptures: streakData.monthlyCaptures,
		publicPosts,
	};
}

export async function getUserPublicProfileByUsername(
	username: string,
): Promise<UserPublicProfileDetails | null> {
	if (!username || !username.trim()) return null;
	const pool = getPool();
	const cleanUsername = username.trim().toLowerCase();

	let userRow = (
		await pool.query(
			`SELECT id, name, image, referral_code, streak_count, created_at, "createdAt"
			 FROM "user"
			 WHERE LOWER(name) = $1 OR LOWER(REPLACE(name, ' ', '')) = $1 OR id = $1 OR LOWER(referral_code) = $1
			 LIMIT 1`,
			[cleanUsername],
		)
	).rows[0];

	if (!userRow) {
		userRow = (
			await pool.query(
				`SELECT id, name, image, referral_code, streak_count, created_at, "createdAt"
				 FROM "user"
				 WHERE LOWER(name) LIKE $1
				 LIMIT 1`,
				[`%${cleanUsername}%`],
			)
		).rows[0];
	}

	if (!userRow) {
		return null;
	}

	const userId = userRow.id;
	const userName = userRow.name || 'Smiler';
	const [
		streakData,
		totalsRes,
		dailyRankData,
		publicPostsRes,
		vouchersClaimedRes,
		referralsRes,
	] = await Promise.all([
		getUserStreakFullDetails(userId),
		pool.query(
			`SELECT COUNT(*)::int AS total_smiles, COALESCE(MAX(smile_score), 0)::int AS best_score
			 FROM smile_captures
			 WHERE user_id = $1 AND (flagged IS NULL OR flagged = false)`,
			[userId],
		),
		getUserDailyRank(userId),
		pool.query(
			`SELECT id, smile_score, likes_count, created_at
			 FROM explore_posts
			 WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '24 hours'
			 ORDER BY created_at DESC
			 LIMIT 8`,
			[userId],
		),
		pool.query(
			`SELECT COUNT(*)::int AS count FROM voucher_inventory WHERE claimed_by = $1`,
			[userId],
		),
		pool.query(
			`SELECT COUNT(*)::int AS count FROM referrals WHERE referrer_id = $1`,
			[userId],
		),
	]);

	const totalSmiles = Number(totalsRes.rows[0]?.total_smiles) || 0;
	const bestScore = Number(totalsRes.rows[0]?.best_score) || 0;
	const vouchersClaimed = Number(vouchersClaimedRes.rows[0]?.count) || 0;
	const totalReferred = Number(referralsRes.rows[0]?.count) || 0;

	const tier = getSmilerTier(totalSmiles);

	const bgClasses = [
		'bg-primary',
		'bg-accent',
		'bg-secondary',
		'bg-success',
		'bg-warning',
	];
	const publicPosts = publicPostsRes.rows.map((p, idx) => ({
		id: String(p.id),
		smileScore: Number(p.smile_score) || 0,
		likesCount: Number(p.likes_count) || 0,
		createdAt: new Date(p.created_at).toISOString(),
		timeAgo: 'today',
		bg: bgClasses[idx % bgClasses.length],
	}));

	const totalLikes = publicPosts.reduce((acc, p) => acc + p.likesCount, 0);

	const badges = computeProfileBadges({
		streakCount: streakData.streakCount,
		longestStreak: streakData.stats.longestStreak,
		bestScore,
		totalSmiles,
		totalReferred,
		vouchersClaimed,
		publicPostsCount: publicPosts.length,
		totalLikes,
	});

	const createdDt =
		userRow.created_at || userRow.createdAt ?
			new Date(userRow.created_at || userRow.createdAt)
		:	new Date();
	const joinDateStr = createdDt.toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric',
	});

	const parts = userName.trim().split(/\s+/);
	const avatarLetters =
		parts.length >= 2 ?
			`${parts[0][0]}${parts[1][0]}`.toUpperCase()
		:	userName.slice(0, 2).toUpperCase() || 'OS';
	const usernameSlug =
		userName.toLowerCase().replace(/[^a-z0-9]/g, '') || cleanUsername;

	return {
		id: userId,
		name: userName,
		username: usernameSlug,
		image: userRow.image || null,
		avatarLetters,
		joinDate: joinDateStr,
		stats: {
			streakCount: streakData.streakCount,
			longestStreak: streakData.stats.longestStreak,
			multiplierLabel: streakData.multiplierLabel,
			totalSmiles,
			bestScore,
			dailyRank: dailyRankData.rank,
			tierName: tier.tierName,
			tierIcon: tier.tierIcon,
			tierLevel: tier.tierLevel,
		},
		streakSociety: {
			isMember: streakData.streakSociety.isMember,
		},
		badges,
		publicPosts,
		referralCode: userRow.referral_code || undefined,
	};
}

export interface AdminResetResult {
	success: boolean;
	scope: 'coins' | 'streaks' | 'leaderboard' | 'all';
	message: string;
	recordsModified?: number;
	details: {
		coinsReset?: boolean;
		streaksReset?: boolean;
		leaderboardReset?: boolean;
		capturesPurged?: boolean;
	};
}

export async function adminResetPlatform(
	adminId: string,
	adminEmail: string,
	scope: 'coins' | 'streaks' | 'leaderboard' | 'all',
	purgeCaptures = false,
): Promise<AdminResetResult> {
	const pool = getPool();
	const client = await pool.connect();
	const nowIso = new Date().toISOString();

	try {
		await client.query('BEGIN');

		const details: AdminResetResult['details'] = {};
		let recordsModified = 0;

		if (scope === 'coins' || scope === 'all') {
			const ledgerRes = await client.query(`
				INSERT INTO coin_ledger (user_id, coins, reason, created_at)
				SELECT user_id, -SUM(coins), 'admin_global_reset: Platform coin balance reset', NOW()
				FROM coin_ledger
				GROUP BY user_id
				HAVING SUM(coins) <> 0
			`);
			recordsModified += ledgerRes.rowCount ?? 0;

			const scratchRes = await client.query(`
				DELETE FROM scratch_cards WHERE is_scratched = false
			`);
			recordsModified += scratchRes.rowCount ?? 0;

			details.coinsReset = true;
		}

		if (scope === 'streaks' || scope === 'all') {
			const streaksRes = await client.query(`
				UPDATE streaks 
				SET streak_count = 0, 
					last_capture_at = NULL, 
					freeze_available = true, 
					freeze_used_at = NULL
			`);
			recordsModified += streaksRes.rowCount ?? 0;

			const userStreakRes = await client.query(`
				UPDATE "user" 
				SET streak_count = 0, 
					last_streak_at = NULL
			`);
			recordsModified += userStreakRes.rowCount ?? 0;

			await client.query(
				`
				INSERT INTO system_settings (key, value, description, updated_at, updated_by)
				VALUES ('streak_reset_at', $1::jsonb, 'Global streak reset cutoff timestamp', NOW(), $2)
				ON CONFLICT (key) DO UPDATE 
				SET value = EXCLUDED.value, 
					updated_at = NOW(), 
					updated_by = EXCLUDED.updated_by
			`,
				[JSON.stringify(nowIso), adminEmail],
			);

			details.streaksReset = true;
		}

		if (scope === 'leaderboard' || scope === 'all') {
			const lbSettleRes = await client.query(`
				DELETE FROM leaderboard_settlements
			`);
			recordsModified += lbSettleRes.rowCount ?? 0;

			await client.query(
				`
				INSERT INTO system_settings (key, value, description, updated_at, updated_by)
				VALUES ('leaderboard_reset_at', $1::jsonb, 'Global leaderboard reset cutoff timestamp', NOW(), $2)
				ON CONFLICT (key) DO UPDATE 
				SET value = EXCLUDED.value, 
					updated_at = NOW(), 
					updated_by = EXCLUDED.updated_by
			`,
				[JSON.stringify(nowIso), adminEmail],
			);

			details.leaderboardReset = true;
		}

		if (
			purgeCaptures &&
			(scope === 'all' || scope === 'leaderboard' || scope === 'streaks')
		) {
			await client.query(`DELETE FROM explore_likes`);
			await client.query(`DELETE FROM explore_posts`);
			await client.query(`DELETE FROM likes`);
			await client.query(`DELETE FROM posts`);
			await client.query(`DELETE FROM image_hashes`);
			const capRes = await client.query(`DELETE FROM smile_captures`);
			recordsModified += capRes.rowCount ?? 0;
			details.capturesPurged = true;
		}

		await client.query('COMMIT');

		await logAdminAction(
			adminId,
			adminEmail,
			`reset_platform_${scope}`,
			'system',
			'global',
			{
				scope,
				purgeCaptures,
				recordsModified,
				timestamp: nowIso,
			},
		);

		let message = 'Platform reset executed successfully.';
		if (scope === 'coins')
			message =
				'All user coin balances have been reset to 0 and pending scratch cards purged.';
		else if (scope === 'streaks')
			message = 'All streaks have been reset to 0 across the platform.';
		else if (scope === 'leaderboard')
			message = 'All leaderboard rankings and settlements have been reset.';
		else if (scope === 'all')
			message = `Full platform reset complete: Coins, streaks, and leaderboards have been reset to 0${purgeCaptures ? ' (and captures purged)' : ''}.`;

		return {
			success: true,
			scope,
			message,
			recordsModified,
			details,
		};
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function pingDatabase(): Promise<{
	success: boolean;
	timestamp: string;
	latencyMs: number;
	postgres: boolean;
	supabaseRest?: boolean;
}> {
	const start = Date.now();
	const pool = getPool();
	const result = await pool.query('SELECT NOW() as now');
	const latencyMs = Date.now() - start;

	let supabaseRest: boolean | undefined;
	if (
		process.env.NEXT_PUBLIC_SUPABASE_URL &&
		process.env.SUPABASE_SERVICE_ROLE_KEY
	) {
		try {
			const supabase = getSupabase();
			const { error } = await supabase.from('rate_limits').select('id').limit(1);
			supabaseRest = !error;
		} catch {
			supabaseRest = false;
		}
	}

	return {
		success: true,
		timestamp: result.rows[0]?.now
			? new Date(result.rows[0].now).toISOString()
			: new Date().toISOString(),
		latencyMs,
		postgres: true,
		...(supabaseRest !== undefined ? { supabaseRest } : {}),
	};
}

export interface DbNotification {
	id: string;
	user_id: string;
	title: string;
	description: string;
	category: string;
	icon_type: string;
	action_label: string | null;
	action_url: string | null;
	read: boolean;
	read_at: string | null;
	created_at: string;
}

export interface UserNotificationPreferences {
	user_id: string;
	security_emails: boolean;
	streak_reminders: boolean;
	leaderboard_alerts: boolean;
	reward_alerts: boolean;
	marketing_emails: boolean;
	in_app_streaks: boolean;
	in_app_rewards: boolean;
	in_app_leaderboard: boolean;
	in_app_system: boolean;
	updated_at: string;
}

export interface DbEmailLog {
	id: string;
	recipient_email: string;
	user_id: string | null;
	template: string;
	subject: string;
	status: string;
	provider: string;
	message_id: string | null;
	error: string | null;
	metadata: Record<string, unknown> | null;
	created_at: string;
}

export interface DbEmailSuppression {
	email: string;
	reason: string;
	category: string;
	created_at: string;
}

export async function getUserNotifications(
	userId: string,
	options?: {
		limit?: number;
		offset?: number;
		category?: string;
		unreadOnly?: boolean;
	},
): Promise<{
	notifications: DbNotification[];
	total: number;
	unreadCount: number;
	categoryCounts: Record<string, number>;
}> {
	await ensureIndexes();
	const pool = getPool();
	const limit = Math.max(1, Math.min(100, options?.limit ?? 30));
	const offset = Math.max(0, options?.offset ?? 0);

	const unreadRes = await pool.query(
		`SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND read = false`,
		[userId],
	);
	const unreadCount = Number(unreadRes.rows[0]?.count ?? 0);

	const catRes = await pool.query(
		`SELECT category, COUNT(*)::int AS count FROM notifications WHERE user_id = $1 GROUP BY category`,
		[userId],
	);
	const categoryCounts: Record<string, number> = {
		rewards: 0,
		streaks: 0,
		leaderboard: 0,
		social: 0,
		system: 0,
	};
	let totalAll = 0;
	for (const row of catRes.rows) {
		const count = Number(row.count);
		categoryCounts[row.category] = count;
		totalAll += count;
	}

	const conditions: string[] = ['user_id = $1'];
	const params: unknown[] = [userId];

	if (options?.unreadOnly) {
		conditions.push('read = false');
	} else if (options?.category && options.category !== 'all') {
		params.push(options.category);
		conditions.push(`category = $${params.length}`);
	}

	const whereClause = conditions.join(' AND ');
	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS total FROM notifications WHERE ${whereClause}`,
		params,
	);
	const total = Number(countRes.rows[0]?.total ?? 0);

	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;

	const { rows } = await pool.query(
		`SELECT id, user_id, title, description, category, icon_type, action_label, action_url, read, read_at, created_at
		 FROM notifications
		 WHERE ${whereClause}
		 ORDER BY created_at DESC
		 LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
		params,
	);

	return {
		notifications: rows,
		total,
		unreadCount,
		categoryCounts,
	};
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
	await ensureIndexes();
	const { rows } = await getPool().query(
		`SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND read = false`,
		[userId],
	);
	return Number(rows[0]?.count ?? 0);
}

export async function markNotificationAsRead(
	userId: string,
	notificationId: string,
): Promise<boolean> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`UPDATE notifications
		 SET read = true, read_at = NOW()
		 WHERE id = $1 AND user_id = $2 AND read = false`,
		[notificationId, userId],
	);
	return Boolean(rowCount && rowCount > 0);
}

export async function markAllNotificationsAsRead(userId: string): Promise<number> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`UPDATE notifications
		 SET read = true, read_at = NOW()
		 WHERE user_id = $1 AND read = false`,
		[userId],
	);
	return rowCount ?? 0;
}

export async function deleteNotification(
	userId: string,
	notificationId: string,
): Promise<boolean> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
		[notificationId, userId],
	);
	return Boolean(rowCount && rowCount > 0);
}

export async function clearReadNotifications(userId: string): Promise<number> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`DELETE FROM notifications WHERE user_id = $1 AND read = true`,
		[userId],
	);
	return rowCount ?? 0;
}

export async function createNotification(params: {
	userId: string;
	title: string;
	description: string;
	category?: string;
	iconType?: string;
	actionLabel?: string;
	actionUrl?: string;
}): Promise<DbNotification | null> {
	await ensureIndexes();
	const pool = getPool();

	const settings = await getSystemSettingsMap();
	if (settings.in_app_notifications_enabled === false) {
		return null;
	}

	const category = params.category ?? 'system';
	const iconType = params.iconType ?? 'bell';

	const { rows } = await pool.query(
		`INSERT INTO notifications (user_id, title, description, category, icon_type, action_label, action_url, read, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW())
		 RETURNING *`,
		[
			params.userId,
			params.title,
			params.description,
			category,
			iconType,
			params.actionLabel ?? null,
			params.actionUrl ?? null,
		],
	);

	return rows[0] ?? null;
}

export async function notifyUnscratchedCard(
	userId: string,
	cardId: string,
): Promise<boolean> {
	await ensureIndexes();
	const pool = getPool();

	const cardRes = await pool.query(
		`SELECT id, is_scratched, created_at
		 FROM scratch_cards
		 WHERE id = $1 AND user_id = $2`,
		[cardId, userId],
	);

	if (!cardRes.rows || cardRes.rows.length === 0) {
		return false;
	}

	const card = cardRes.rows[0];
	if (card.is_scratched) {
		return false;
	}

	const existingRes = await pool.query(
		`SELECT id FROM notifications
		 WHERE user_id = $1
		   AND category = 'rewards'
		   AND action_url = '/rewards'
		   AND created_at >= $2 - INTERVAL '5 seconds'`,
		[userId, card.created_at],
	);

	if (existingRes.rows && existingRes.rows.length > 0) {
		return false;
	}

	const created = await createNotification({
		userId,
		title: 'You won a Scratch Card! 🎁',
		description: 'You have an unscratched reward waiting from your smile check. Scratch it to reveal your prize!',
		category: 'rewards',
		iconType: 'gift',
		actionLabel: 'Scratch Now',
		actionUrl: '/rewards',
	});

	return Boolean(created);
}

export async function syncUnscratchedCardNotifications(
	userId: string,
): Promise<number> {
	await ensureIndexes();
	const pool = getPool();

	const { rows } = await pool.query(
		`SELECT sc.id, sc.created_at
		 FROM scratch_cards sc
		 WHERE sc.user_id = $1
		   AND sc.is_scratched = false
		   AND sc.created_at <= NOW() - INTERVAL '30 seconds'
		   AND NOT EXISTS (
		     SELECT 1 FROM notifications n
		     WHERE n.user_id = $1
		       AND n.category = 'rewards'
		       AND n.action_url = '/rewards'
		       AND n.created_at >= sc.created_at - INTERVAL '5 seconds'
		   )
		 ORDER BY sc.created_at ASC
		 LIMIT 3`,
		[userId],
	);

	let count = 0;
	for (const row of rows) {
		const created = await createNotification({
			userId,
			title: 'You won a Scratch Card! 🎁',
			description: 'You have an unscratched reward waiting from your smile check. Scratch it to reveal your prize!',
			category: 'rewards',
			iconType: 'gift',
			actionLabel: 'Scratch Now',
			actionUrl: '/rewards',
		});
		if (created) {
			count++;
		}
	}

	return count;
}

export async function createBroadcastNotification(params: {
	target: 'all' | 'active_7d' | 'specific';
	targetUserId?: string;
	title: string;
	description: string;
	category?: string;
	iconType?: string;
	actionLabel?: string;
	actionUrl?: string;
	adminId: string;
	adminEmail: string;
}): Promise<{ count: number }> {
	await ensureIndexes();
	const pool = getPool();
	const category = params.category ?? 'system';
	const iconType = params.iconType ?? 'bell';

	let targetUserIds: string[] = [];

	if (params.target === 'specific' && params.targetUserId) {
		const checkUser = await pool.query(
			`SELECT id FROM "user" WHERE id = $1 OR LOWER(email) = LOWER($1) LIMIT 1`,
			[params.targetUserId.trim()],
		);
		if (checkUser.rows[0]) {
			targetUserIds = [checkUser.rows[0].id];
		}
	} else if (params.target === 'active_7d') {
		const activeRes = await pool.query(
			`SELECT DISTINCT user_id FROM smile_captures WHERE created_at >= NOW() - INTERVAL '7 days'`,
		);
		targetUserIds = activeRes.rows.map((r) => r.user_id);
	} else {
		const allRes = await pool.query(`SELECT id FROM "user" WHERE banned IS NOT TRUE`);
		targetUserIds = allRes.rows.map((r) => r.id);
	}

	if (targetUserIds.length === 0) {
		return { count: 0 };
	}

	const batchSize = 250;
	let insertedCount = 0;

	for (let i = 0; i < targetUserIds.length; i += batchSize) {
		const chunk = targetUserIds.slice(i, i + batchSize);
		const valuePlaceholders: string[] = [];
		const values: unknown[] = [];

		chunk.forEach((uid, index) => {
			const offset = index * 7;
			valuePlaceholders.push(
				`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`,
			);
			values.push(
				uid,
				params.title,
				params.description,
				category,
				iconType,
				params.actionLabel ?? null,
				params.actionUrl ?? null,
			);
		});

		const query = `
			INSERT INTO notifications (user_id, title, description, category, icon_type, action_label, action_url)
			VALUES ${valuePlaceholders.join(', ')}
		`;
		const res = await pool.query(query, values);
		insertedCount += res.rowCount ?? 0;
	}

	await logAdminAction(
		params.adminId,
		params.adminEmail,
		'BROADCAST_NOTIFICATION',
		'notifications',
		params.target,
		{
			title: params.title,
			category,
			targetedCount: targetUserIds.length,
			insertedCount,
		},
	);

	return { count: insertedCount };
}

export async function getAdminNotifications(options?: {
	page?: number;
	limit?: number;
	search?: string;
	category?: string;
}): Promise<{
	notifications: (DbNotification & { user_name?: string; user_email?: string })[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}> {
	await ensureIndexes();
	const pool = getPool();
	const page = Math.max(1, options?.page ?? 1);
	const limit = Math.max(1, Math.min(100, options?.limit ?? 25));
	const offset = (page - 1) * limit;

	const conditions: string[] = [];
	const params: unknown[] = [];

	if (options?.category && options.category !== 'all') {
		params.push(options.category);
		conditions.push(`n.category = $${params.length}`);
	}

	if (options?.search) {
		params.push(`%${options.search.trim().toLowerCase()}%`);
		const pIdx = params.length;
		conditions.push(
			`(LOWER(n.title) LIKE $${pIdx} OR LOWER(n.description) LIKE $${pIdx} OR LOWER(u.email) LIKE $${pIdx} OR LOWER(COALESCE(u.name, '')) LIKE $${pIdx})`,
		);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS total
		 FROM notifications n
		 LEFT JOIN "user" u ON n.user_id = u.id
		 ${whereClause}`,
		params,
	);
	const total = Number(countRes.rows[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / limit));

	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;

	const { rows } = await pool.query(
		`SELECT n.id, n.user_id, n.title, n.description, n.category, n.icon_type, n.action_label, n.action_url, n.read, n.read_at, n.created_at,
		        u.name AS user_name, u.email AS user_email
		 FROM notifications n
		 LEFT JOIN "user" u ON n.user_id = u.id
		 ${whereClause}
		 ORDER BY n.created_at DESC
		 LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
		params,
	);

	return {
		notifications: rows,
		total,
		page,
		limit,
		totalPages,
	};
}

export async function deleteNotificationAdmin(notificationId: string): Promise<boolean> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`DELETE FROM notifications WHERE id = $1`,
		[notificationId],
	);
	return Boolean(rowCount && rowCount > 0);
}

export async function getUserNotificationPreferences(
	userId: string,
): Promise<UserNotificationPreferences> {
	await ensureIndexes();
	const pool = getPool();
	const { rows } = await pool.query(
		`SELECT user_id, security_emails, streak_reminders, leaderboard_alerts, reward_alerts, marketing_emails, in_app_streaks, in_app_rewards, in_app_leaderboard, in_app_system, updated_at
		 FROM user_notification_preferences
		 WHERE user_id = $1
		 LIMIT 1`,
		[userId],
	);

	if (rows[0]) {
		return rows[0];
	}

	const defaultPrefs: UserNotificationPreferences = {
		user_id: userId,
		security_emails: true,
		streak_reminders: true,
		leaderboard_alerts: true,
		reward_alerts: true,
		marketing_emails: false,
		in_app_streaks: true,
		in_app_rewards: true,
		in_app_leaderboard: true,
		in_app_system: true,
		updated_at: new Date().toISOString(),
	};

	await pool.query(
		`INSERT INTO user_notification_preferences (user_id, security_emails, streak_reminders, leaderboard_alerts, reward_alerts, marketing_emails, in_app_streaks, in_app_rewards, in_app_leaderboard, in_app_system, updated_at)
		 VALUES ($1, true, true, true, true, false, true, true, true, true, NOW())
		 ON CONFLICT (user_id) DO NOTHING`,
		[userId],
	);

	return defaultPrefs;
}

export async function upsertUserNotificationPreferences(
	userId: string,
	prefs: Partial<UserNotificationPreferences>,
): Promise<UserNotificationPreferences> {
	await ensureIndexes();
	const current = await getUserNotificationPreferences(userId);
	const updated: UserNotificationPreferences = {
		...current,
		...prefs,
		user_id: userId,
		updated_at: new Date().toISOString(),
	};

	const { rows } = await getPool().query(
		`INSERT INTO user_notification_preferences (
			user_id, security_emails, streak_reminders, leaderboard_alerts, reward_alerts, marketing_emails,
			in_app_streaks, in_app_rewards, in_app_leaderboard, in_app_system, updated_at
		 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
		 ON CONFLICT (user_id) DO UPDATE SET
			security_emails = EXCLUDED.security_emails,
			streak_reminders = EXCLUDED.streak_reminders,
			leaderboard_alerts = EXCLUDED.leaderboard_alerts,
			reward_alerts = EXCLUDED.reward_alerts,
			marketing_emails = EXCLUDED.marketing_emails,
			in_app_streaks = EXCLUDED.in_app_streaks,
			in_app_rewards = EXCLUDED.in_app_rewards,
			in_app_leaderboard = EXCLUDED.in_app_leaderboard,
			in_app_system = EXCLUDED.in_app_system,
			updated_at = NOW()
		 RETURNING *`,
		[
			userId,
			updated.security_emails,
			updated.streak_reminders,
			updated.leaderboard_alerts,
			updated.reward_alerts,
			updated.marketing_emails,
			updated.in_app_streaks,
			updated.in_app_rewards,
			updated.in_app_leaderboard,
			updated.in_app_system,
		],
	);

	return rows[0];
}

export async function insertEmailLog(entry: {
	recipient_email: string;
	user_id?: string | null;
	template: string;
	subject: string;
	status: string;
	provider: string;
	message_id?: string | null;
	error?: string | null;
	metadata?: Record<string, unknown> | null;
}): Promise<DbEmailLog> {
	await ensureIndexes();
	const { rows } = await getPool().query(
		`INSERT INTO email_logs (recipient_email, user_id, template, subject, status, provider, message_id, error, metadata, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
		 RETURNING *`,
		[
			entry.recipient_email.toLowerCase().trim(),
			entry.user_id ?? null,
			entry.template,
			entry.subject,
			entry.status,
			entry.provider,
			entry.message_id ?? null,
			entry.error ?? null,
			entry.metadata ? JSON.stringify(entry.metadata) : null,
		],
	);
	return rows[0];
}

export async function getEmailLogs(options?: {
	page?: number;
	limit?: number;
	status?: string;
	template?: string;
	search?: string;
}): Promise<{
	logs: DbEmailLog[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}> {
	await ensureIndexes();
	const pool = getPool();
	const page = Math.max(1, options?.page ?? 1);
	const limit = Math.max(1, Math.min(100, options?.limit ?? 25));
	const offset = (page - 1) * limit;

	const conditions: string[] = [];
	const params: unknown[] = [];

	if (options?.status && options.status !== 'all') {
		params.push(options.status);
		conditions.push(`status = $${params.length}`);
	}

	if (options?.template && options.template !== 'all') {
		params.push(options.template);
		conditions.push(`template = $${params.length}`);
	}

	if (options?.search) {
		params.push(`%${options.search.trim().toLowerCase()}%`);
		const pIdx = params.length;
		conditions.push(
			`(LOWER(recipient_email) LIKE $${pIdx} OR LOWER(subject) LIKE $${pIdx} OR LOWER(COALESCE(message_id, '')) LIKE $${pIdx})`,
		);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS total FROM email_logs ${whereClause}`,
		params,
	);
	const total = Number(countRes.rows[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / limit));

	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;

	const { rows } = await pool.query(
		`SELECT id, recipient_email, user_id, template, subject, status, provider, message_id, error, metadata, created_at
		 FROM email_logs
		 ${whereClause}
		 ORDER BY created_at DESC
		 LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
		params,
	);

	return {
		logs: rows,
		total,
		page,
		limit,
		totalPages,
	};
}

export async function getEmailLogById(id: string): Promise<DbEmailLog | null> {
	await ensureIndexes();
	const { rows } = await getPool().query(
		`SELECT id, recipient_email, user_id, template, subject, status, provider, message_id, error, metadata, created_at
		 FROM email_logs
		 WHERE id = $1
		 LIMIT 1`,
		[id],
	);
	return rows[0] ?? null;
}

export async function getEmailStats(): Promise<{
	totalSent: number;
	sentToday: number;
	successRate: number;
	activeProvider: string;
	suppressedCount: number;
	totalFailed: number;
}> {
	await ensureIndexes();
	const pool = getPool();

	const totalsRes = await pool.query(
		`SELECT 
			COUNT(*)::int AS total,
			COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END)::int AS today,
			COUNT(CASE WHEN status IN ('sent', 'dev_logged') THEN 1 END)::int AS successful,
			COUNT(CASE WHEN status = 'failed' THEN 1 END)::int AS failed
		 FROM email_logs`,
	);

	const suppRes = await pool.query(`SELECT COUNT(*)::int AS count FROM email_suppressions`);
	const suppressedCount = Number(suppRes.rows[0]?.count ?? 0);

	const row = totalsRes.rows[0] ?? {};
	const total = Number(row.total ?? 0);
	const successful = Number(row.successful ?? 0);
	const failed = Number(row.failed ?? 0);
	const today = Number(row.today ?? 0);
	const successRate = total > 0 ? Math.round((successful / total) * 100) : 100;

	let activeProvider = 'Mock (Development)';
	if (process.env.RESEND_API_KEY) {
		activeProvider = 'Resend (HTTPS)';
	} else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
		activeProvider = 'SMTP (Nodemailer)';
	}

	return {
		totalSent: total,
		sentToday: today,
		successRate,
		activeProvider,
		suppressedCount,
		totalFailed: failed,
	};
}

export async function isEmailSuppressed(
	email: string,
	category?: string,
): Promise<boolean> {
	await ensureIndexes();
	const normalized = email.toLowerCase().trim();
	const pool = getPool();

	const { rows } = await pool.query(
		`SELECT reason, category FROM email_suppressions WHERE email = $1 LIMIT 1`,
		[normalized],
	);

	if (rows.length === 0) return false;
	const entry = rows[0];
	if (entry.category === 'all') return true;
	if (category && entry.category === category) return true;
	return false;
}

export async function addEmailSuppression(
	email: string,
	reason?: string,
	category?: string,
): Promise<void> {
	await ensureIndexes();
	const normalized = email.toLowerCase().trim();
	await getPool().query(
		`INSERT INTO email_suppressions (email, reason, category, created_at)
		 VALUES ($1, $2, $3, NOW())
		 ON CONFLICT (email) DO UPDATE SET
			reason = EXCLUDED.reason,
			category = EXCLUDED.category,
			created_at = NOW()`,
		[normalized, reason ?? 'unsubscribe', category ?? 'all'],
	);
}

export async function removeEmailSuppression(email: string): Promise<boolean> {
	await ensureIndexes();
	const normalized = email.toLowerCase().trim();
	const { rowCount } = await getPool().query(
		`DELETE FROM email_suppressions WHERE email = $1`,
		[normalized],
	);
	return Boolean(rowCount && rowCount > 0);
}

export async function listEmailSuppressions(options?: {
	page?: number;
	limit?: number;
	search?: string;
}): Promise<{
	suppressions: DbEmailSuppression[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}> {
	await ensureIndexes();
	const pool = getPool();
	const page = Math.max(1, options?.page ?? 1);
	const limit = Math.max(1, Math.min(100, options?.limit ?? 25));
	const offset = (page - 1) * limit;

	const conditions: string[] = [];
	const params: unknown[] = [];

	if (options?.search) {
		params.push(`%${options.search.trim().toLowerCase()}%`);
		conditions.push(`(LOWER(email) LIKE $1 OR LOWER(reason) LIKE $1)`);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS total FROM email_suppressions ${whereClause}`,
		params,
	);
	const total = Number(countRes.rows[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / limit));

	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;

	const { rows } = await pool.query(
		`SELECT email, reason, category, created_at
		 FROM email_suppressions
		 ${whereClause}
		 ORDER BY created_at DESC
		 LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
		params,
	);

	return {
		suppressions: rows,
		total,
		page,
		limit,
		totalPages,
	};
}

