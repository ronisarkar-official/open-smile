import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/backend/db/client';
import { requireServerUser } from '@/backend/auth/session';
import { getUserCoinBalance } from '@/backend/db';

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

export async function POST(
	_request: NextRequest,
	{ params }: { params: Promise<{ cardId: string }> }
) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const { cardId } = await params;
		if (!cardId) {
			return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
		}

		const pool = getPool();
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			const checkRes = await client.query(
				`SELECT id, title, source, coins, voucher_id, voucher_title, voucher_code, voucher_brand, is_scratched, theme_color, badge, created_at
				 FROM scratch_cards
				 WHERE id = $1 AND user_id = $2
				 FOR UPDATE`,
				[cardId, user.id]
			);

			if (checkRes.rows.length === 0) {
				await client.query('ROLLBACK');
				return NextResponse.json({ error: 'Scratch card not found' }, { status: 404 });
			}

			const row = checkRes.rows[0];
			const coinsWon = Number(row.coins) || 0;
			const isAlreadyScratched = Boolean(row.is_scratched);

			if (!isAlreadyScratched) {
				await client.query(
					`UPDATE scratch_cards
					 SET is_scratched = true, scratched_at = NOW()
					 WHERE id = $1`,
					[cardId]
				);

				if (coinsWon > 0) {
					await client.query(
						`INSERT INTO coin_ledger (user_id, coins, reason, created_at)
						 VALUES ($1, $2, 'scratch_card_win', NOW())`,
						[user.id, coinsWon]
					);
				}
			}

			await client.query('COMMIT');

			const newBalance = await getUserCoinBalance(user.id);

			return NextResponse.json({
				success: true,
				coins_won: coinsWon,
				balance: newBalance,
				card: {
					id: String(row.id),
					title: row.title,
					source: row.source,
					date: formatCardDate(row.created_at),
					coins: coinsWon,
					isScratched: true,
					themeColor: row.theme_color || '#FF2D78',
					badge: row.badge || undefined,
					voucherId: row.voucher_id || undefined,
					voucherTitle: row.voucher_title || undefined,
					voucherCode: row.voucher_code || undefined,
					voucherBrand: row.voucher_brand || undefined,
				},
			});
		} catch (e) {
			await client.query('ROLLBACK');
			throw e;
		} finally {
			client.release();
		}
	} catch (err) {
		console.error('Scratch card action error:', err);
		return NextResponse.json({ error: 'Failed to scratch card' }, { status: 500 });
	}
}
