import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireServerUser } from '@/backend/auth';
import {
	insertSmileCapture,
	getLastCaptureTime,
	getUserCoinBalance,
	getSystemSettingsMap,
} from '@/backend/db';

import { calculateSmileCoins } from '@/lib/reward-calculator';

export async function POST(request: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const body = await request.json();
		const smileScore = body.smile_score;

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

		const { getPool } = await import('@/backend/db/client');
		const pool = getPool();

		const maxDailyCaptures = Math.max(1, Number(settings.max_daily_captures_per_user) || 10);
		const dailyCapturesRes = await pool.query(
			`SELECT COUNT(*) FROM smile_captures 
			 WHERE user_id = $1 AND created_at >= (NOW() AT TIME ZONE 'UTC')::date`,
			[user.id]
		);
		const dailyCapturesUsed = parseInt(dailyCapturesRes.rows[0]?.count || '0', 10);
		if (dailyCapturesUsed >= maxDailyCaptures) {
			const now = new Date();
			const nextMidnight = new Date(
				Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
			);
			return NextResponse.json(
				{
					error: `Daily capture limit reached (${dailyCapturesUsed}/${maxDailyCaptures}). Limit refreshes tonight at 12:00 AM (midnight).`,
					daily_limit_reached: true,
					daily_captures_used: dailyCapturesUsed,
					max_daily_captures: maxDailyCaptures,
					resets_at: nextMidnight.toISOString(),
				},
				{ status: 429 }
			);
		}

		const cooldownMinutes = Math.max(0, Number(settings.min_capture_cooldown_minutes) ?? 60);
		if (cooldownMinutes > 0) {
			const cooldownMs = cooldownMinutes * 60 * 1000;
			const lastCapture = await getLastCaptureTime(user.id);
			if (lastCapture) {
				const elapsed = Date.now() - new Date(lastCapture).getTime();
				if (elapsed < cooldownMs) {
					const remainingMs = cooldownMs - elapsed;
					const remainingMin = Math.ceil(remainingMs / 60000);
					return NextResponse.json(
						{
							error: `Cooldown active. Try again in ${remainingMin} minute${remainingMin === 1 ? '' : 's'}.`,
							cooldown_remaining_ms: remainingMs,
						},
						{ status: 429 }
					);
				}
			}
		}

		let streakCount = 1;
		let streakMultiplier = 1.0;

		try {
			const streakRes = await pool.query(
				`SELECT streak_count, last_capture_at FROM streaks WHERE user_id = $1`,
				[user.id]
			);
			const now = new Date();
			if (streakRes.rows.length === 0) {
				await pool.query(
					`INSERT INTO streaks (user_id, streak_count, last_capture_at, freeze_available)
					 VALUES ($1, 1, NOW(), true)
					 ON CONFLICT (user_id) DO UPDATE SET streak_count = 1, last_capture_at = NOW()`,
					[user.id]
				);
				streakCount = 1;
			} else {
				const lastAt = streakRes.rows[0].last_capture_at ? new Date(streakRes.rows[0].last_capture_at) : null;
				const prevStreak = Number(streakRes.rows[0].streak_count) || 0;
				if (lastAt) {
					const elapsedHours = (now.getTime() - lastAt.getTime()) / (3600 * 1000);
					if (elapsedHours < 20) {
						streakCount = Math.max(1, prevStreak);
					} else if (elapsedHours <= 48) {
						streakCount = prevStreak + 1;
					} else {
						streakCount = 1;
					}
				} else {
					streakCount = Math.max(1, prevStreak);
				}
				await pool.query(
					`UPDATE streaks SET streak_count = $1, last_capture_at = NOW() WHERE user_id = $2`,
					[streakCount, user.id]
				);
			}

			await pool.query(
				`UPDATE "user" SET streak_count = $1, last_streak_at = NOW() WHERE id = $2`,
				[streakCount, user.id]
			);

			if (streakCount === 2) streakMultiplier = 1.2;
			else if (streakCount >= 3 && streakCount < 7) streakMultiplier = 1.5;
			else if (streakCount >= 7) streakMultiplier = Math.min(2.0, 1.5 + (streakCount - 3) * 0.1);
		} catch (e) {
			console.error('Streak update error:', e);
		}

		const minScore = Number(settings.min_smile_score_threshold) || 50;
		const multiplier = Math.max(0.1, Number(settings.coin_multiplier) || 1.0);

		const coinsCalculation = calculateSmileCoins(smileScore, streakMultiplier);
		const baseAwarded = smileScore >= minScore ? coinsCalculation.totalCoins : 0;
		const coinsAwarded = Math.round(baseAwarded * multiplier);

		const captureRow = await insertSmileCapture(user.id, smileScore, coinsAwarded);

		let cardId: string | null = null;
		if (settings.scratch_cards_enabled !== false) {
			try {
				const themeColor = smileScore >= 85 ? '#C6F135' : smileScore >= 70 ? '#7B61FF' : '#FF2D78';
				const insertRes = await pool.query(
					`INSERT INTO scratch_cards (user_id, title, source, coins, voucher_id, is_scratched, theme_color, created_at)
					 VALUES ($1, $2, 'Live Smile Check', $3, $4, false, $5, NOW())
					 RETURNING id`,
					[user.id, `Smile Check (${smileScore} pts)`, coinsAwarded, captureRow?.id ? String(captureRow.id) : null, themeColor]
				);
				cardId = insertRes.rows[0]?.id ? String(insertRes.rows[0].id) : null;
			} catch {}
		}

		let referralBonusUnlocked = false;
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
					const referrerCoins = Number(settings.referral_reward_coins) || 50;
					const refereeCoins = Number(settings.referee_bonus_coins) || 25;

					await pool.query(
						`INSERT INTO coin_ledger (user_id, coins, reason, created_at) VALUES ($1, $2, 'referral_bonus', NOW())`,
						[referrerId, referrerCoins]
					);
					await pool.query(
						`INSERT INTO coin_ledger (user_id, coins, reason, created_at) VALUES ($1, $2, 'referral_bonus', NOW())`,
						[user.id, refereeCoins]
					);
					await pool.query(
						`UPDATE referrals SET status = 'completed', completed_at = NOW() WHERE id = $1`,
						[refRes.rows[0].id]
					);
					referralBonusUnlocked = true;
				}
			}
		} catch (e) {
			console.error('Referral bonus error:', e);
		}

		const balance = await getUserCoinBalance(user.id);

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
		});
	} catch (err) {
		console.error('Capture submit error:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
