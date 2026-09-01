import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/backend/db/client';
import { getServerUser } from '@/backend/auth/session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const period = searchParams.get('period') || 'weekly';
		const metric = searchParams.get('metric') || 'coins';

		const now = new Date();
		let startDate: Date;
		let title = 'Weekly Smile Challenge';

		if (period === 'daily') {
			startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
			title = metric === 'score' ? 'Daily Top Smile Scores' : 'Daily Smile Sprint';
		} else if (period === 'weekly') {
			startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
			title = metric === 'score' ? 'Weekly Top Smile Scores' : 'Weekly Smile Challenge';
		} else {
			startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
			title = metric === 'score' ? 'Monthly Smile Champions' : 'Monthly Hall of Fame';
		}

		const pool = getPool();
		const currentUser = await getServerUser();

		let rows: any[] = [];

		if (metric === 'score') {
			const res = await pool.query(
				`SELECT 
					u.id AS user_id,
					COALESCE(u.name, 'Smiler') AS user_name,
					u.image AS avatar_url,
					COALESCE(u.streak_count, 0) AS streak_count,
					MAX(sc.smile_score)::int AS primary_value
				 FROM "user" u
				 JOIN smile_captures sc ON sc.user_id = u.id
				 WHERE sc.created_at >= $1
				 GROUP BY u.id, u.name, u.image, u.streak_count
				 ORDER BY primary_value DESC
				 LIMIT 50`,
				[startDate]
			);
			rows = res.rows;

			if (!rows || rows.length === 0) {
				const fallback = await pool.query(
					`SELECT 
						u.id AS user_id,
						COALESCE(u.name, 'Smiler') AS user_name,
						u.image AS avatar_url,
						COALESCE(u.streak_count, 0) AS streak_count,
						COALESCE(MAX(sc.smile_score), 0)::int AS primary_value
					 FROM "user" u
					 LEFT JOIN smile_captures sc ON sc.user_id = u.id
					 GROUP BY u.id, u.name, u.image, u.streak_count
					 ORDER BY primary_value DESC, u.id ASC
					 LIMIT 50`
				);
				rows = fallback.rows;
			}
		} else {
			const res = await pool.query(
				`SELECT 
					u.id AS user_id,
					COALESCE(u.name, 'Smiler') AS user_name,
					u.image AS avatar_url,
					COALESCE(u.streak_count, 0) AS streak_count,
					COALESCE(SUM(l.coins), 0)::int AS primary_value
				 FROM "user" u
				 JOIN coin_ledger l ON l.user_id = u.id
				 WHERE l.created_at >= $1 AND l.coins > 0
				 GROUP BY u.id, u.name, u.image, u.streak_count
				 ORDER BY primary_value DESC
				 LIMIT 50`,
				[startDate]
			);
			rows = res.rows;

			if (!rows || rows.length === 0) {
				const fallback = await pool.query(
					`SELECT 
						u.id AS user_id,
						COALESCE(u.name, 'Smiler') AS user_name,
						u.image AS avatar_url,
						COALESCE(u.streak_count, 0) AS streak_count,
						COALESCE(SUM(l.coins), 0)::int AS primary_value
					 FROM "user" u
					 LEFT JOIN coin_ledger l ON l.user_id = u.id
					 GROUP BY u.id, u.name, u.image, u.streak_count
					 ORDER BY primary_value DESC, u.id ASC
					 LIMIT 50`
				);
				rows = fallback.rows;
			}
		}

		const rankings = rows.map((r, index) => {
			const isCurr = currentUser ? r.user_id === currentUser.id : false;
			const val = Number(r.primary_value) || 0;
			const streak = Number(r.streak_count) || 0;

			let byline = 'Active Smiler';
			if (metric === 'score') {
				if (val >= 95) byline = `Duchenne Smile (${val}%)`;
				else if (val >= 88) byline = `Radiant Smile (${val}%)`;
				else if (val >= 80) byline = `Great Smile (${val}%)`;
				else byline = `Warm Smile (${val}%)`;
			} else {
				byline = streak > 0 ? `Level ${Math.max(1, streak * 3)} Smiler` : 'Active Smiler';
			}

			return {
				rank: index + 1,
				userId: r.user_id,
				userName: isCurr ? 'You' : r.user_name,
				byline,
				value: val,
				change: 0,
				avatarUrl: r.avatar_url,
				isCurrentUser: isCurr,
				displayed: true,
			};
		});

		const podium = rankings.slice(0, 3).map((r) => ({
			rank: r.rank,
			userId: r.userId,
			userName: r.userName,
			value: r.value,
			avatarUrl: r.avatarUrl,
		}));

		return NextResponse.json({
			period,
			metric,
			title,
			fromDate: startDate.toISOString().split('T')[0],
			toDate: now.toISOString().split('T')[0],
			podium,
			rankings,
		});
	} catch (err) {
		console.error('Leaderboard error:', err);
		return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
	}
}
