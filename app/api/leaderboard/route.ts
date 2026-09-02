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
		let title = 'Weekly Top Smile Points';

		if (period === 'daily') {
			startDate = new Date(
				Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
			);
			endDate = now;
			const nextMidnight = new Date(
				Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
			);
			resetAt = nextMidnight.toISOString();
			title = 'Daily Top Smile Points';

			settleDailyLeaderboard().catch((err) => {
				console.error('Lazy daily settlement error:', err);
			});
		} else if (period === 'weekly') {
			startDate = new Date(
				Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6, 0, 0, 0, 0)
			);
			endDate = now;
			title = 'Weekly Top Smile Points';
		} else {
			startDate = new Date(
				Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 29, 0, 0, 0, 0)
			);
			endDate = now;
			title = 'Monthly Smile Champions';
		}

		const currentUser = await getServerUser();
		const rows = await getLeaderboardSmileRankings(startDate, 50, endDate);

		const rankings = rows.map((r, index) => {
			const isCurr = currentUser ? r.user_id === currentUser.id : false;
			const val = Number(r.primary_value) || 0;

			let byline = 'Warm Smile';
			if (period === 'daily') {
				if (val >= 95) byline = `Duchenne Smile (${val} pts)`;
				else if (val >= 88) byline = `Radiant Smile (${val} pts)`;
				else if (val >= 80) byline = `Great Smile (${val} pts)`;
				else byline = `Warm Smile (${val} pts)`;
			} else if (period === 'weekly') {
				if (val >= 500) byline = `Smile Champion (${val} pts)`;
				else if (val >= 350) byline = `Super Consistent (${val} pts)`;
				else if (val >= 200) byline = `Radiant Smiler (${val} pts)`;
				else if (val >= 80) byline = `Active Smiler (${val} pts)`;
				else byline = `Rising Smiler (${val} pts)`;
			} else {
				if (val >= 2000) byline = `Smile Legend (${val} pts)`;
				else if (val >= 1200) byline = `Grand Master (${val} pts)`;
				else if (val >= 600) byline = `Consistent Smiler (${val} pts)`;
				else if (val >= 200) byline = `Dedicated Smiler (${val} pts)`;
				else byline = `Active Smiler (${val} pts)`;
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

