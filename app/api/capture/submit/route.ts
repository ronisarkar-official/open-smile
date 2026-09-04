import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireServerUser } from '@/lib/auth';
import {
	insertSmileCapture,
	getUserCoinBalance,
	getSystemSettingsMap,
	recordCaptureStreak,
	createNotification,
} from '@/lib/db';

import { calculateSmileCoins } from '@/lib/reward-calculator';

export async function POST(request: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const body = await request.json();
		const smileScore = body.smile_score;
		const phash = typeof body.phash === 'string' ? body.phash : null;

		if (
			typeof smileScore !== 'number' ||
			smileScore < 0 ||
			smileScore > 100 ||
			!Number.isInteger(smileScore)
		) {
			return NextResponse.json(
				{ error: 'Invalid smile score. Must be integer 0-100.' },
				{ status: 400 }
			);
		}

		const settings = await getSystemSettingsMap();
		if (settings.maintenance_mode === true) {
			return NextResponse.json(
				{ error: 'Platform maintenance mode is active. Captures are temporarily paused.' },
				{ status: 503 }
			);
		}

		const { getPool } = await import('@/lib/db/client');
		const pool = getPool();

		const maxDailyCaptures = Math.max(1, Number(settings.max_daily_captures_per_user) || 10);
		const dailyCapturesRes = await pool.query(
			`SELECT COUNT(*) FROM smile_captures 
			 WHERE user_id = $1 AND created_at AT TIME ZONE 'Asia/Kolkata' >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date`,
			[user.id]
		);
		const dailyCapturesUsed = parseInt(dailyCapturesRes.rows[0]?.count || '0', 10);
		if (dailyCapturesUsed >= maxDailyCaptures) {
			const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
			const istNow = new Date(Date.now() + istOffsetMs);
			const nextIstMidnightUtc = Date.UTC(
				istNow.getUTCFullYear(),
				istNow.getUTCMonth(),
				istNow.getUTCDate() + 1,
				0,
				0,
				0,
				0
			);
			const nextMidnight = new Date(nextIstMidnightUtc - istOffsetMs);
			return NextResponse.json(
				{
					error: `Daily capture limit reached (${dailyCapturesUsed}/${maxDailyCaptures}). Limit refreshes tonight at 12:00 AM IST (midnight).`,
					daily_limit_reached: true,
					daily_captures_used: dailyCapturesUsed,
					max_daily_captures: maxDailyCaptures,
					resets_at: nextMidnight.toISOString(),
				},
				{ status: 429 }
			);
		}

		let streakCount = 1;
		let streakMultiplier = 1.0;

		try {
			const streakData = await recordCaptureStreak(user.id);
			streakCount = streakData.streakCount;
			streakMultiplier = streakData.streakMultiplier;
		} catch (e) {
			console.error('Streak update error:', e);
		}

		const minScore = Number(settings.min_smile_score_threshold) || 11;
		const multiplier = Math.max(0.1, Number(settings.coin_multiplier) || 1.0);

		const coinsCalculation = calculateSmileCoins(smileScore, streakMultiplier, undefined, minScore);
		const coinsAwarded = Math.round(coinsCalculation.totalCoins * multiplier);

		const captureRow = await insertSmileCapture(user.id, smileScore, coinsAwarded);
		if (phash && captureRow?.id) {
			await pool.query(
				`UPDATE smile_captures SET phash = $1 WHERE id = $2`,
				[phash, captureRow.id]
			).catch(() => {});
		}

		void createNotification({
			userId: user.id,
			title: `${coinsAwarded} Coins Earned! 📸`,
			description: `You scored a ${smileScore}% genuine smile and continued your streak.`,
			category: 'rewards',
			iconType: 'sparkles',
			actionLabel: 'View Dashboard',
			actionUrl: '/dashboard',
		}).catch(() => {});

		let cardId: string | null = null;
		if (settings.scratch_cards_enabled !== false) {
			try {
				const themeColor = smileScore >= 85 ? '#C6F135' : smileScore >= 70 ? '#7B61FF' : '#FF2D78';
				const insertRes = await pool.query(
					`INSERT INTO scratch_cards (user_id, title, source, coins, voucher_id, is_scratched, theme_color, created_at)
					 VALUES ($1, $2, 'Live Smile Check', $3, $4, false, $5, NOW())
					 RETURNING id`,
					[user.id, 'Smile Check Reward', coinsAwarded, captureRow?.id ? String(captureRow.id) : null, themeColor]
				);
				cardId = insertRes.rows[0]?.id ? String(insertRes.rows[0].id) : null;
			} catch {}
		}

		let referralBonusUnlocked = false;
		let welcomeCardId: string | null = null;
		try {
			const countRes = await pool.query(
				`SELECT COUNT(*) FROM smile_captures WHERE user_id = $1`,
				[user.id]
			);
			if (parseInt(countRes.rows[0]?.count || '0', 10) === 1) {
				const refRes = await pool.query(
					`SELECT id, referrer_id FROM referrals WHERE referred_id = $1 AND status = 'pending' LIMIT 1`,
					[user.id]
				);
				if (refRes.rows.length > 0) {
					const referrerId = refRes.rows[0].referrer_id;
					const referrerMin = Math.max(5, Number(settings.referral_referrer_min_coins) || 50);
					const referrerMax = Math.max(referrerMin, Number(settings.referral_referrer_max_coins) || 200);
					const refereeMin = Math.max(5, Number(settings.referral_referee_min_coins || settings.referee_bonus_coins) || 20);
					const refereeMax = Math.max(refereeMin, Number(settings.referral_referee_max_coins) || 50);
					const maxDailyRewards = Math.max(1, Number(settings.max_daily_referral_rewards) || 5);

					const referrerCoinsWon = Math.floor(Math.random() * (referrerMax - referrerMin + 1)) + referrerMin;
					const refereeCoinsWon = Math.floor(Math.random() * (refereeMax - refereeMin + 1)) + refereeMin;

					// Check referrer daily cap
					const referrerDailyRes = await pool.query(
						`SELECT COUNT(*) FROM scratch_cards
						 WHERE user_id = $1 AND source = 'Referral Reward'
						   AND created_at AT TIME ZONE 'Asia/Kolkata' >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date`,
						[referrerId]
					);
					const referrerDailyCount = parseInt(referrerDailyRes.rows[0]?.count || '0', 10);

					// Award Mystery Scratch Card to Referrer if under cap
					if (referrerDailyCount < maxDailyRewards) {
						await pool.query(
							`INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
							 VALUES ($1, 'Referral Bonus Card', 'Referral Reward', $2, false, '#FF2D78', '🎁', NOW())`,
							[referrerId, referrerCoinsWon]
						);
					}

					// Award Welcome Scratch Card to Newly Referred Friend
					const friendCardRes = await pool.query(
						`INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
						 VALUES ($1, 'Welcome Bonus Card', 'Friend Referral', $2, false, '#C6F135', '🎉', NOW())
						 RETURNING id`,
						[user.id, refereeCoinsWon]
					);
					welcomeCardId = friendCardRes.rows[0]?.id ? String(friendCardRes.rows[0].id) : null;

					// Mark referral completed
					await pool.query(
						`UPDATE referrals SET status = 'completed', completed_at = NOW() WHERE id = $1`,
						[refRes.rows[0].id]
					);
					referralBonusUnlocked = true;

					void createNotification({
						userId: referrerId,
						title: 'Friend Joined & Smiled! 🎁',
						description: 'Your friend just completed their first smile! A referral bonus scratch card was awarded.',
						category: 'social',
						iconType: 'gift',
						actionLabel: 'Claim Scratch Card',
						actionUrl: '/rewards',
					}).catch(() => {});
				}
			}
		} catch (e) {
			console.error('Referral bonus error:', e);
		}

		const balance = await getUserCoinBalance(user.id);
		const updatedDailyCapturesUsed = dailyCapturesUsed + 1;
		const capturesRemaining = Math.max(0, maxDailyCaptures - updatedDailyCapturesUsed);
		const limitReached = updatedDailyCapturesUsed >= maxDailyCaptures;

		return NextResponse.json({
			coins_awarded: coinsAwarded,
			reward: coinsCalculation,
			streak_multiplier: streakMultiplier,
			streak_count: streakCount,
			smile_score: smileScore,
			balance,
			card_id: cardId,
			is_scratched: false,
			first_capture_bonus_unlocked: referralBonusUnlocked,
			welcome_card_id: welcomeCardId,
			daily_captures_used: updatedDailyCapturesUsed,
			max_daily_captures: maxDailyCaptures,
			captures_remaining: capturesRemaining,
			limit_reached: limitReached,
		});
	} catch (err) {
		console.error('Capture submit error:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
