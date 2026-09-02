import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/backend/db/client';
import { requireServerUser } from '@/backend/auth/session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_request: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const pool = getPool();

		// Ensure user has referral code
		let referralCode = (user as any).referral_code;
		if (!referralCode) {
			const { rows: userRow } = await pool.query(
				'SELECT referral_code FROM "user" WHERE id = $1',
				[user.id]
			);
			referralCode = userRow[0]?.referral_code;
			if (!referralCode) {
				const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
				referralCode = `SMILE-${user.id.slice(0, 4).toUpperCase()}${randomSuffix}`;
				await pool.query(
					'UPDATE "user" SET referral_code = $1 WHERE id = $2',
					[referralCode, user.id]
				);
			}
		}

		const [completedRes, pendingRes, bonusRes, dailyRes] = await Promise.all([
			pool.query(
				"SELECT COUNT(*) FROM referrals WHERE referrer_id = $1 AND status = 'completed'",
				[user.id]
			),
			pool.query(
				"SELECT COUNT(*) FROM referrals WHERE referrer_id = $1 AND status = 'pending'",
				[user.id]
			),
			pool.query(
				"SELECT COALESCE(SUM(coins), 0) FROM coin_ledger WHERE user_id = $1 AND reason = 'referral_bonus'",
				[user.id]
			),
			pool.query(
				"SELECT COUNT(*) FROM coin_ledger WHERE user_id = $1 AND reason = 'referral_bonus' AND created_at >= (NOW() AT TIME ZONE 'UTC')::date",
				[user.id]
			),
		]);

		const friendsReferred = parseInt(completedRes.rows[0]?.count || '0', 10);
		const pendingReferrals = parseInt(pendingRes.rows[0]?.count || '0', 10);
		const bonusCoinsEarned = parseInt(bonusRes.rows[0]?.coalesce || '0', 10);
		const dailyCount = parseInt(dailyRes.rows[0]?.count || '0', 10);
		const remainingToday = Math.max(0, 5 - dailyCount);

		return NextResponse.json({
			referral_code: referralCode,
			referral_link: `https://opensmile.app/join/${referralCode}`,
			stats: {
				friends_referred: friendsReferred,
				bonus_coins_earned: bonusCoinsEarned,
				pending_referrals: pendingReferrals,
			},
			remaining_today: remainingToday,
		});
	} catch (err) {
		console.error('Referral stats error:', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
