import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireServerUser } from '@/lib/auth/session';
import {
	getUserCoinBalance,
	getUserStreak,
	getUserDailyRank,
	getUserRecentSmiles,
} from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_request: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const [balance, streak, rankData, recentSmiles] = await Promise.all([
			getUserCoinBalance(user.id),
			getUserStreak(user.id),
			getUserDailyRank(user.id),
			getUserRecentSmiles(user.id, 5),
		]);

		const multiplier = (1.0 + Math.min(streak * 0.1, 1.0)).toFixed(1);

		return NextResponse.json({
			balance,
			streak,
			streakMultiplier: `${multiplier}x`,
			dailyRank: rankData.rank,
			totalUsers: rankData.totalUsers,
			recentSmiles,
		});
	} catch (err) {
		console.error('Dashboard stats fetch error:', err);
		return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
	}
}
