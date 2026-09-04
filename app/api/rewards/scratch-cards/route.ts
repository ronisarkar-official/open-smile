import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/lib/db/client';
import { requireServerUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatCardDate(dt: Date | string | null): string {
	if (!dt) return 'Today';
	const now = new Date();
	const cardDate = new Date(dt);
	const diffDays = Math.floor(
		(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
			new Date(cardDate.getFullYear(), cardDate.getMonth(), cardDate.getDate()).getTime()) /
			86400000
	);
	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	return cardDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function GET(_request: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const pool = getPool();

		const { rows } = await pool.query(
			`SELECT id, title, source, coins, voucher_id, voucher_title, voucher_code, voucher_brand, is_scratched, theme_color, badge, created_at, scratched_at
			 FROM scratch_cards
			 WHERE user_id = $1
			 ORDER BY is_scratched ASC, created_at DESC`,
			[user.id]
		);

		let totalUnscratched = 0;
		let totalScratched = 0;
		let totalWon = 0;

		const cards = rows.map((r) => {
			const isScratched = Boolean(r.is_scratched);
			const coinsVal = Number(r.coins) || 0;
			if (isScratched) {
				totalScratched++;
				totalWon += coinsVal;
			} else {
				totalUnscratched++;
			}

			return {
				id: String(r.id),
				title: r.title,
				source: r.source,
				date: formatCardDate(r.created_at),
				coins: coinsVal,
				isScratched,
				themeColor: r.theme_color || '#FF2D78',
				badge: r.badge || undefined,
				voucherId: r.voucher_id || undefined,
				voucherTitle: r.voucher_title || undefined,
				voucherCode: r.voucher_code || undefined,
				voucherBrand: r.voucher_brand || undefined,
			};
		});

		return NextResponse.json({
			cards,
			total_unscratched: totalUnscratched,
			total_scratched: totalScratched,
			total_won: totalWon,
		});
	} catch (err) {
		console.error('Scratch cards fetch error:', err);
		return NextResponse.json({ error: 'Failed to fetch scratch cards', cards: [] }, { status: 500 });
	}
}
