import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireServerUser } from '@/lib/auth';
import {
	insertSmileCapture,
	getUserCoinBalance,
	getSystemSettingsMap,
	recordCaptureStreak,
	createNotification,
	isUserEligibleForTryConversion,
	processReferralRewardOnFirstCapture,
} from '@/lib/db';

import { calculateSmileCoins } from '@/lib/reward-calculator';

export async function POST(request: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const body = await request.json();
		const smileScore = body.smile_score;
		const phash = typeof body.phash === 'string' ? body.phash : null;
		const isTryConversion = Boolean(body.is_try_conversion);

		if (isTryConversion) {
			const eligible = await isUserEligibleForTryConversion(user.id);
			if (!eligible) {
				return NextResponse.json(
					{ error: 'Try demo conversion is only available for brand new signups.', not_eligible: true },
					{ status: 403 }
				);
			}
		}

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

		const rewardConfig = settings.capture_reward_config || {
			min_smile_score_threshold: Number(settings.min_smile_score_threshold) || 11,
			coin_multiplier: Math.max(0.1, Number(settings.coin_multiplier) || 1.0),
			scratch_min_coins: Number(settings.scratch_min_coins) || 5,
			scratch_max_coins: Number(settings.scratch_max_coins) || 100,
		};

		const coinsCalculation = calculateSmileCoins(smileScore, streakMultiplier, undefined, rewardConfig);
		const coinsAwarded = coinsCalculation.totalCoins;

		const captureRow = await insertSmileCapture(user.id, smileScore, coinsAwarded);
		if (phash && captureRow?.id) {
			await pool.query(
				`UPDATE smile_captures SET phash = $1 WHERE id = $2`,
				[phash, captureRow.id]
			).catch(() => {});
		}

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
			const refResult = await processReferralRewardOnFirstCapture({
				userId: user.id,
				reqCookieRefCode: request.cookies.get('ref_code')?.value,
			});
			referralBonusUnlocked = refResult.referralBonusUnlocked;
			welcomeCardId = refResult.welcomeCardId;
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
