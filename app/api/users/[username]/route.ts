import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/backend/db/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getAvatarLetters(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.slice(0, 2).toUpperCase() || 'OS';
}

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ username: string }> }
) {
	try {
		const { username } = await params;
		const cleanUsername = username.trim().toLowerCase();

		const pool = getPool();

		let userRow = (
			await pool.query(
				`SELECT id, name, image, streak_count, created_at, "createdAt"
				 FROM "user"
				 WHERE LOWER(name) = $1 OR LOWER(REPLACE(name, ' ', '')) = $1 OR id = $1
				 LIMIT 1`,
				[cleanUsername]
			)
		).rows[0];

		if (!userRow) {
			userRow = (
				await pool.query(
					`SELECT id, name, image, streak_count, created_at, "createdAt"
					 FROM "user"
					 WHERE LOWER(name) LIKE $1
					 LIMIT 1`,
					[`%${cleanUsername}%`]
				)
			).rows[0];
		}

		if (!userRow) {
			return NextResponse.json({ error: 'Smiler profile not found' }, { status: 404 });
		}

		const userId = userRow.id;
		const userName = userRow.name || 'Smiler';

		const [smilesRes, bestScoreRes, coinsRes, streakRes, rankRes, postsRes] = await Promise.all([
			pool.query('SELECT COUNT(*) FROM smile_captures WHERE user_id = $1', [userId]),
			pool.query('SELECT COALESCE(MAX(smile_score), 0) FROM smile_captures WHERE user_id = $1', [userId]),
			pool.query('SELECT COALESCE(SUM(coins), 0) FROM coin_ledger WHERE user_id = $1', [userId]),
			pool.query('SELECT streak_count FROM streaks WHERE user_id = $1', [userId]),
			pool.query(
				`WITH totals AS (
					SELECT user_id, COALESCE(MAX(smile_score), 0) AS s
					FROM smile_captures
					GROUP BY user_id
				)
				SELECT COUNT(*) + 1 AS rank
				FROM totals
				WHERE s > (SELECT COALESCE(MAX(smile_score), 0) FROM smile_captures WHERE user_id = $1)`,
				[userId]
			),
			pool.query(
				`SELECT id, smile_score, likes_count, created_at
				 FROM explore_posts
				 WHERE user_id = $1
				 ORDER BY created_at DESC
				 LIMIT 6`,
				[userId]
			),
		]);

		const totalSmiles = parseInt(smilesRes.rows[0]?.count || '0', 10);
		const bestScore = parseInt(bestScoreRes.rows[0]?.coalesce || '0', 10);
		const coinsBalance = parseInt(coinsRes.rows[0]?.coalesce || '0', 10);
		const streakVal = userRow.streak_count || streakRes.rows[0]?.streak_count || 0;
		const userRank = parseInt(rankRes.rows[0]?.rank || '1', 10);

		const createdDt = userRow.created_at || userRow.createdAt ? new Date(userRow.created_at || userRow.createdAt) : new Date();
		const joinDateStr = createdDt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

		const bgClasses = ['bg-primary', 'bg-accent', 'bg-secondary', 'bg-success'];
		const publicSmiles = postsRes.rows.map((p, idx) => ({
			id: String(p.id),
			score: p.smile_score,
			likes: Number(p.likes_count) || 0,
			timeAgo: 'recently',
			bg: bgClasses[idx % bgClasses.length],
		}));

		return NextResponse.json({
			id: String(userId),
			name: userName,
			username: cleanUsername,
			image: userRow.image || null,
			avatar: getAvatarLetters(userName),
			joinDate: joinDateStr,
			totalSmiles,
			bestScore,
			coins: coinsBalance,
			streak: streakVal,
			rank: userRank,
			publicSmiles,
		});
	} catch (err) {
		console.error('User profile error:', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
