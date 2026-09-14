import { getPool } from './client';
import {
	getStartOfISTDay,
	getEndOfISTDay,
	formatISTDateString,
	getISTParts,
	createISTDate,
} from '@/lib/ist-date';
import {
	getUserStreak,
	RecentSmileItem,
	getUserRecentSmiles,
} from './capture-queries';
import { getSystemSettingsMap } from './settings-queries';

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
