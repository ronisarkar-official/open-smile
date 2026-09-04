import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/lib/db/client';
import { requireServerUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
	_request: NextRequest,
	{ params }: { params: Promise<{ postId: string }> }
) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const { postId } = await params;
		if (!postId) {
			return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
		}

		const pool = getPool();
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			const checkRes = await client.query(
				'SELECT 1 FROM explore_likes WHERE user_id = $1 AND post_id = $2 LIMIT 1',
				[user.id, postId]
			);
			const alreadyLiked = checkRes.rows.length > 0;

			let liked = false;
			let likesCount = 0;

			if (alreadyLiked) {
				await client.query('DELETE FROM explore_likes WHERE user_id = $1 AND post_id = $2', [
					user.id,
					postId,
				]);
				await client.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [
					user.id,
					postId,
				]);
				const updateRes = await client.query(
					'UPDATE explore_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1 RETURNING likes_count',
					[postId]
				);
				likesCount = updateRes.rows[0]?.likes_count ?? 0;
				liked = false;
			} else {
				await client.query(
					'INSERT INTO explore_likes (user_id, post_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
					[user.id, postId]
				);
				await client.query(
					'INSERT INTO likes (user_id, post_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
					[user.id, postId]
				);
				const updateRes = await client.query(
					'UPDATE explore_posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count',
					[postId]
				);
				likesCount = updateRes.rows[0]?.likes_count ?? 1;
				liked = true;
			}

			await client.query('COMMIT');
			return NextResponse.json({ liked, likes_count: likesCount });
		} catch (e) {
			await client.query('ROLLBACK');
			throw e;
		} finally {
			client.release();
		}
	} catch (err) {
		console.error('Like toggle error:', err);
		return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
	}
}
