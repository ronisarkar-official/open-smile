import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireServerUser } from '@/backend/auth';
import {
	insertSmileCapture,
	getLastCaptureTime,
	getUserCoinBalance,
} from '@/backend/db';

import { calculateSmileCoins } from '@/lib/reward-calculator';

const COOLDOWN_MS = 60 * 60 * 1000;

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

		const lastCapture = await getLastCaptureTime(user.id);
		if (lastCapture) {
			const elapsed = Date.now() - new Date(lastCapture).getTime();
			if (elapsed < COOLDOWN_MS) {
				const remainingMs = COOLDOWN_MS - elapsed;
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

		const streakMultiplier = 1.0;
		const coinsCalculation = calculateSmileCoins(smileScore, streakMultiplier);
		const coinsAwarded = coinsCalculation.totalCoins;

		const captureRow = await insertSmileCapture(user.id, smileScore, coinsAwarded);

		let cardId: string | null = null;
		try {
			const { getPool } = await import('@/backend/db/client');
			const themeColor = smileScore >= 85 ? '#C6F135' : smileScore >= 70 ? '#7B61FF' : '#FF2D78';
			const insertRes = await getPool().query(
				`INSERT INTO scratch_cards (user_id, title, source, coins, voucher_id, is_scratched, theme_color, created_at)
				 VALUES ($1, $2, 'Live Smile Check', $3, $4, false, $5, NOW())
				 RETURNING id`,
				[user.id, `Smile Check (${smileScore} pts)`, coinsAwarded, captureRow?.id ? String(captureRow.id) : null, themeColor]
			);
			cardId = insertRes.rows[0]?.id ? String(insertRes.rows[0].id) : null;
		} catch {}

		const balance = await getUserCoinBalance(user.id);

		return NextResponse.json({
			coins_awarded: coinsAwarded,
			reward: coinsCalculation,
			streak_multiplier: streakMultiplier,
			smile_score: smileScore,
			balance,
			card_id: cardId,
			is_scratched: false,
		});
	} catch (err) {
		console.error('Capture submit error:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
