import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/backend/db/client';
import { requireServerUser } from '@/backend/auth/session';
import { insertCoinLedgerEntry } from '@/backend/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const body = await request.json();
		const { image_url, smile_score, caption } = body;

		if (!image_url || typeof image_url !== 'string') {
			return NextResponse.json({ error: 'Image is required to share' }, { status: 400 });
		}

		const pool = getPool();
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			const insertRes = await client.query(
				`INSERT INTO explore_posts (user_id, image_url, smile_score, caption, likes_count, created_at)
				 VALUES ($1, $2, $3, $4, 0, NOW())
				 RETURNING id`,
				[user.id, image_url, Number(smile_score) || 0, caption || 'Live smile capture! 😊']
			);

			const postId = insertRes.rows[0]?.id;

			await client.query(
				`INSERT INTO posts (id, user_id, image_url, smile_score, like_count, created_at)
				 VALUES ($1, $2, $3, $4, 0, NOW())
				 ON CONFLICT (id) DO NOTHING`,
				[postId, user.id, image_url, Number(smile_score) || 0]
			);

			const bonusCheck = await client.query(
				`SELECT COUNT(*) FROM coin_ledger
				 WHERE user_id = $1 AND reason = 'explore_post_bonus' AND created_at >= (NOW() AT TIME ZONE 'UTC')::date`,
				[user.id]
			);

			let bonusAwarded = 0;
			if (parseInt(bonusCheck.rows[0]?.count || '0', 10) === 0) {
				bonusAwarded = 5;
				await client.query(
					`INSERT INTO coin_ledger (user_id, coins, reason, created_at)
					 VALUES ($1, 5, 'explore_post_bonus', NOW())`,
					[user.id]
				);
			}

			await client.query('COMMIT');

			return NextResponse.json({
				id: postId,
				image_url,
				smile_score: Number(smile_score) || 0,
				caption,
				bonus_coins_awarded: bonusAwarded,
				message:
					'Smile shared to community feed! 24h timer started.' +
					(bonusAwarded > 0 ? ' +5 bonus coins awarded!' : ''),
			});
		} catch (e) {
			await client.query('ROLLBACK');
			throw e;
		} finally {
			client.release();
		}
	} catch (err) {
		console.error('Explore post error:', err);
		return NextResponse.json({ error: 'Failed to post to explore' }, { status: 500 });
	}
}
