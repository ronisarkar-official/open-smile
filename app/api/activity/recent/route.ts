import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/backend/db/client';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(_request: NextRequest) {
	try {
		const pool = getPool();
		const { rows } = await pool.query(
			`SELECT 
				l.id,
				l.coins,
				l.reason,
				l.created_at,
				u.name AS user_name
			 FROM coin_ledger l
			 LEFT JOIN "user" u ON l.user_id = u.id
			 ORDER BY l.created_at DESC
			 LIMIT 20`
		);

		const items = rows.map((r) => {
			const reason = r.reason;
			const coins = Math.abs(Number(r.coins) || 0);
			const name = r.user_name || 'A smiler';
			const firstName = name.split(' ')[0] || 'Someone';

			let text = `${firstName} earned +${coins} smile coins! ⭐`;
			let itemType = 'general';

			if (reason === 'capture') {
				text = `${firstName} scored ${Math.min(100, 75 + coins * 2)}! 🔥 (+${coins} coins)`;
				itemType = 'capture';
			} else if (reason === 'voucher_claim') {
				text = `${firstName} just redeemed a brand gift card! 🎁`;
				itemType = 'voucher';
			} else if (reason === 'referral_bonus') {
				text = `${firstName} earned +${coins} referral bonus coins! 🚀`;
				itemType = 'referral';
			} else if (reason === 'explore_post_bonus') {
				text = `${firstName} shared a smile to the explore feed! 😄`;
				itemType = 'explore';
			} else if (reason === 'signup_bonus') {
				text = `${firstName} joined Open Smile! (+${coins} welcome bonus)`;
				itemType = 'signup';
			}

			return {
				id: String(r.id),
				text,
				timestamp: r.created_at ? new Date(r.created_at).toISOString() : '',
				type: itemType,
			};
		});

		if (items.length === 0) {
			return NextResponse.json({
				items: [
					{ id: '1', text: 'Someone just scored 96! 🔥', timestamp: '', type: 'capture' },
					{ id: '2', text: 'Marcus hit a 7-day streak! 🔥', timestamp: '', type: 'streak' },
					{ id: '3', text: 'A user redeemed an Amazon voucher 🎁', timestamp: '', type: 'voucher' },
					{ id: '4', text: 'Aria Chen earned 18 coins 😄', timestamp: '', type: 'capture' },
					{ id: '5', text: 'Someone just scored 92! 🔥', timestamp: '', type: 'capture' },
				],
			});
		}

		return NextResponse.json({ items });
	} catch (err) {
		console.error('Recent activity error:', err);
		return NextResponse.json({
			items: [
				{ id: '1', text: 'Someone just scored 96! 🔥', timestamp: '', type: 'capture' },
				{ id: '2', text: 'Marcus hit a 7-day streak! 🔥', timestamp: '', type: 'streak' },
				{ id: '3', text: 'A user redeemed an Amazon voucher 🎁', timestamp: '', type: 'voucher' },
			],
		});
	}
}
