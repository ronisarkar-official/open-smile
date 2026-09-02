import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLeaderboardSmileRankings, settleDailyLeaderboard } from '@/backend/db';
import { getServerUser } from '@/backend/auth/session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const period = searchParams.get('period') || 'weekly';

		const now = new Date();
		let startDate: Date;
		let endDate: Date | undefined;
		let resetAt: string | undefined;
		let title = 'Weekly Top Smile Scores';

		if (period === 'daily') {
			startDate = new Date(
				Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
			);
			endDate = now;
			const nextMidnight = new Date(
				Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
			);
			resetAt = nextMidnight.toISOString();
			title = 'Daily Top Smile Scores';

			settleDailyLeaderboard().catch((err) => {
				console.error('Lazy daily settlement error:', err);
			});
		} else if (period === 'weekly') {
			startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
			title = 'Weekly Top Smile Scores';
		} else {
			startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
			title = 'Monthly Smile Champions';
		}

		const currentUser = await getServerUser();
		const rows = await getLeaderboardSmileRankings(startDate, 50, endDate);

		const rankings = rows.map((r, index) => {
			const isCurr = currentUser ? r.user_id === currentUser.id : false;
			const val = Number(r.primary_value) || 0;

			let byline = 'Warm Smile';
			if (val >= 95) byline = `Duchenne Smile (${val}%)`;
			else if (val >= 88) byline = `Radiant Smile (${val}%)`;
			else if (val >= 80) byline = `Great Smile (${val}%)`;
			else byline = `Warm Smile (${val}%)`;

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
			metric: 'score',
			title,
			fromDate: startDate.toISOString().split('T')[0],
			toDate: now.toISOString().split('T')[0],
			resetAt,
			podium,
			rankings,
		});
	} catch (err) {
		console.error('Leaderboard error:', err);
		return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
	}
}

