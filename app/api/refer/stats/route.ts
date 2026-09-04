import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/lib/db/client';
import { requireServerUser } from '@/lib/auth/session';

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

		const { getSystemSettingsMap } = await import('@/lib/db');
		const settings = await getSystemSettingsMap();
		const referrerMaxCoins = Number(settings.referral_referrer_max_coins) || 200;
		const refereeMaxCoins = Number(settings.referral_referee_max_coins) || 50;
		const maxDaily = Math.max(1, Number(settings.max_daily_referral_rewards) || 5);

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
				`SELECT COALESCE(SUM(coins), 0) FROM (
					SELECT coins FROM scratch_cards WHERE user_id = $1 AND source = 'Referral Reward' AND is_scratched = true
					UNION ALL
					SELECT coins FROM coin_ledger WHERE user_id = $1 AND reason = 'referral_bonus'
				) AS combined_bonuses`,
				[user.id]
			),
			pool.query(
				"SELECT COUNT(*) FROM scratch_cards WHERE user_id = $1 AND source = 'Referral Reward' AND created_at AT TIME ZONE 'Asia/Kolkata' >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date",
				[user.id]
			),
		]);

		const friendsReferred = parseInt(completedRes.rows[0]?.count || '0', 10);
		const pendingReferrals = parseInt(pendingRes.rows[0]?.count || '0', 10);
		const bonusCoinsEarned = parseInt(bonusRes.rows[0]?.coalesce || '0', 10);
		const dailyCount = parseInt(dailyRes.rows[0]?.count || '0', 10);
		const remainingToday = Math.max(0, maxDaily - dailyCount);

		const origin = _request.nextUrl.origin || process.env.BETTER_AUTH_URL || 'https://opensmile.app';
		const referralLink = `${origin}/join/${referralCode}`;

		return NextResponse.json({
			referral_code: referralCode,
			referral_link: referralLink,
			referrer_max_coins: referrerMaxCoins,
			referee_max_coins: refereeMaxCoins,
			max_daily_rewards: maxDaily,
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
