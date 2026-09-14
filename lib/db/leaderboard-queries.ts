import { getPool, getSupabase } from './client';
import {
	getStartOfISTDay,
	getEndOfISTDay,
	formatISTDateString,
	getISTParts,
	createISTDate,
	getDaysAgoInIST,
} from '@/lib/ist-date';
import { getSystemSettingsMap } from './settings-queries';

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
			COALESCE(NULLIF(TRIM(u.image), ''), '/icons/default-icon.webp') AS avatar_url,
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
			COALESCE(NULLIF(TRIM(u.image), ''), '/icons/default-icon.webp') AS avatar_url,
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
		const getBounds = (minKey: string, maxKey: string, defMin: number, defMax: number) => {
			const rawMin = Number(settings[minKey]);
			const rawMax = Number(settings[maxKey]);
			const valMin = Number.isFinite(rawMin) ? rawMin : defMin;
			const valMax = Number.isFinite(rawMax) ? rawMax : defMax;
			return {
				min: Math.min(valMin, valMax),
				max: Math.max(valMin, valMax),
			};
		};
		const p1 = getBounds('daily_podium_1_min_coins', 'daily_podium_1_max_coins', 70, 99);
		const p2 = getBounds('daily_podium_2_min_coins', 'daily_podium_2_max_coins', 40, 69);
		const p3 = getBounds('daily_podium_3_min_coins', 'daily_podium_3_max_coins', 15, 39);

		const podiumAwards = [
			{
				rank: 1,
				title: 'Daily Leaderboard Champion',
				badge: 'PODIUM_GOLD',
				themeColor: '#FFD700',
				minCoins: p1.min,
				maxCoins: p1.max,
			},
			{
				rank: 2,
				title: 'Daily Leaderboard Runner-Up',
				badge: 'PODIUM_SILVER',
				themeColor: '#C0C0C0',
				minCoins: p2.min,
				maxCoins: p2.max,
			},
			{
				rank: 3,
				title: 'Daily Leaderboard 3rd Place',
				badge: 'PODIUM_BRONZE',
				themeColor: '#CD7F32',
				minCoins: p3.min,
				maxCoins: p3.max,
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
		const getBounds = (minKey: string, maxKey: string, defMin: number, defMax: number) => {
			const rawMin = Number(settings[minKey]);
			const rawMax = Number(settings[maxKey]);
			const valMin = Number.isFinite(rawMin) ? rawMin : defMin;
			const valMax = Number.isFinite(rawMax) ? rawMax : defMax;
			return {
				min: Math.min(valMin, valMax),
				max: Math.max(valMin, valMax),
			};
		};
		const p1 = getBounds('weekly_podium_1_min_coins', 'weekly_podium_1_max_coins', 250, 400);
		const p2 = getBounds('weekly_podium_2_min_coins', 'weekly_podium_2_max_coins', 120, 200);
		const p3 = getBounds('weekly_podium_3_min_coins', 'weekly_podium_3_max_coins', 60, 100);

		const podiumAwards = [
			{
				rank: 1,
				title: 'Weekly Leaderboard Champion',
				badge: 'PODIUM_WEEKLY_GOLD',
				themeColor: '#FFD700',
				minCoins: p1.min,
				maxCoins: p1.max,
			},
			{
				rank: 2,
				title: 'Weekly Leaderboard Runner-Up',
				badge: 'PODIUM_WEEKLY_SILVER',
				themeColor: '#C0C0C0',
				minCoins: p2.min,
				maxCoins: p2.max,
			},
			{
				rank: 3,
				title: 'Weekly Leaderboard 3rd Place',
				badge: 'PODIUM_WEEKLY_BRONZE',
				themeColor: '#CD7F32',
				minCoins: p3.min,
				maxCoins: p3.max,
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
		const getBounds = (minKey: string, maxKey: string, defMin: number, defMax: number) => {
			const rawMin = Number(settings[minKey]);
			const rawMax = Number(settings[maxKey]);
			const valMin = Number.isFinite(rawMin) ? rawMin : defMin;
			const valMax = Number.isFinite(rawMax) ? rawMax : defMax;
			return {
				min: Math.min(valMin, valMax),
				max: Math.max(valMin, valMax),
			};
		};
		const p1 = getBounds('monthly_podium_1_min_coins', 'monthly_podium_1_max_coins', 800, 1200);
		const p2 = getBounds('monthly_podium_2_min_coins', 'monthly_podium_2_max_coins', 400, 600);
		const p3 = getBounds('monthly_podium_3_min_coins', 'monthly_podium_3_max_coins', 200, 350);

		const podiumAwards = [
			{
				rank: 1,
				title: 'Monthly Smile Legend',
				badge: 'PODIUM_MONTHLY_GOLD',
				themeColor: '#FFD700',
				minCoins: p1.min,
				maxCoins: p1.max,
			},
			{
				rank: 2,
				title: 'Monthly Grand Master',
				badge: 'PODIUM_MONTHLY_SILVER',
				themeColor: '#C0C0C0',
				minCoins: p2.min,
				maxCoins: p2.max,
			},
			{
				rank: 3,
				title: 'Monthly Smile Master',
				badge: 'PODIUM_MONTHLY_BRONZE',
				themeColor: '#CD7F32',
				minCoins: p3.min,
				maxCoins: p3.max,
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
