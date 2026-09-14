import { getPool, getSupabase } from './client';
import { deleteFromImageKitByUrl } from '../services/imagekit';
import { RecentSmileItem } from './capture-queries';
import {
	MonthlyCaptureItem,
	getUserStreakFullDetails,
	getUserDailyRank,
} from './streak-queries';
import { logAdminAction } from './admin-queries';

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
