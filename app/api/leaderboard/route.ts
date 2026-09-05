import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
	getLeaderboardSmileRankings,
	settleDailyLeaderboard,
	settleWeeklyLeaderboard,
	settleMonthlyLeaderboard,
	getUserLeaderboardRank,
	getLatestLeaderboardSettlement,
} from '@/lib/db';
import { getServerUser } from '@/lib/auth/session';
import {
	getStartOfISTDay,
	getNextISTMidnight,
	getNextWeeklyISTReset,
	getNextMonthlyISTReset,
	formatISTDateString,
	getDaysAgoInIST,
	getISTParts,
} from '@/lib/ist-date';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getSmileByline(period: string, val: number): string {
	if (period === 'daily') {
		if (val >= 95) return `Duchenne Smile (${val} pts)`;
		if (val >= 88) return `Radiant Smile (${val} pts)`;
		if (val >= 80) return `Great Smile (${val} pts)`;
		return `Warm Smile (${val} pts)`;
	} else if (period === 'weekly') {
		if (val >= 500) return `Smile Champion (${val} pts)`;
		if (val >= 350) return `Super Consistent (${val} pts)`;
		if (val >= 200) return `Radiant Smiler (${val} pts)`;
		if (val >= 80) return `Active Smiler (${val} pts)`;
		return `Rising Smiler (${val} pts)`;
	} else {
		if (val >= 2000) return `Smile Legend (${val} pts)`;
		if (val >= 1200) return `Grand Master (${val} pts)`;
		if (val >= 600) return `Consistent Smiler (${val} pts)`;
		if (val >= 200) return `Dedicated Smiler (${val} pts)`;
		return `Active Smiler (${val} pts)`;
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const period = searchParams.get('period') || 'daily';

		const now = new Date();
		const istParts = getISTParts(now);
		let startDate: Date;
		let endDate: Date | undefined;
		let resetAt: string | undefined;
		let fromDateStr: string;
		let toDateStr = formatISTDateString(now);
		let title = 'Daily Top Smile Points';

		if (period === 'daily') {
			startDate = getStartOfISTDay(now);
			endDate = now;
			resetAt = getNextISTMidnight(now).toISOString();
			fromDateStr = formatISTDateString(startDate);
			title = 'Daily Top Smile Points';

			settleDailyLeaderboard().catch((err) => {
				console.error('Lazy daily settlement error:', err);
			});
		} else if (period === 'weekly') {
			startDate = getDaysAgoInIST(6, now);
			endDate = now;
			resetAt = getNextWeeklyISTReset(now).toISOString();
			fromDateStr = formatISTDateString(startDate);
			title = 'Weekly Top Smile Points';

			if (istParts.day === 1) {
				settleWeeklyLeaderboard().catch((err) => {
					console.error('Lazy weekly settlement error:', err);
				});
			}
		} else {
			startDate = getDaysAgoInIST(29, now);
			endDate = now;
			resetAt = getNextMonthlyISTReset(now).toISOString();
			fromDateStr = formatISTDateString(startDate);
			title = 'Monthly Smile Champions';

			if (istParts.date === 1) {
				settleMonthlyLeaderboard().catch((err) => {
					console.error('Lazy monthly settlement error:', err);
				});
			}
		}

		const currentUser = await getServerUser();
		const rows = await getLeaderboardSmileRankings(startDate, 10, endDate);

		const rankings = rows.map((r, index) => {
			const isCurr = currentUser ? r.user_id === currentUser.id : false;
			const val = Number(r.primary_value) || 0;

			return {
				rank: index + 1,
				userId: r.user_id,
				userName: isCurr ? 'You' : r.user_name,
				byline: getSmileByline(period, val),
				value: val,
				change: 0,
				avatarUrl: r.avatar_url || '/icons/default-icon.webp',
				isCurrentUser: isCurr,
				displayed: true,
			};
		});

		let currentUserRanking: any = null;
		if (currentUser) {
			const foundInTop10 = rankings.find((r) => r.userId === currentUser.id);
			if (foundInTop10) {
				currentUserRanking = { ...foundInTop10 };
			} else {
				const userRank = await getUserLeaderboardRank(
					currentUser.id,
					startDate,
					endDate,
				);
				if (userRank) {
					currentUserRanking = {
						rank: userRank.rank,
						userId: currentUser.id,
						userName: 'You',
						byline: getSmileByline(period, userRank.primary_value),
						value: userRank.primary_value,
						change: 0,
						avatarUrl: (currentUser as any).image?.trim() || '/icons/default-icon.webp',
						isCurrentUser: true,
						displayed: true,
					};
				}
			}

			if (currentUserRanking && rankings.length > 0) {
				if (currentUserRanking.rank > 1) {
					const targetIndex =
						currentUserRanking.rank <= 10 ?
							currentUserRanking.rank - 2
						:	Math.min(rankings.length - 1, 9);
					const targetUser = rankings[targetIndex];
					if (targetUser) {
						const diff =
							Number(targetUser.value) - Number(currentUserRanking.value);
						currentUserRanking.pointsToOvertake = Math.max(1, diff + 1);
						currentUserRanking.targetUserName = targetUser.userName;
						currentUserRanking.targetRank = targetUser.rank;
					}
				}
			}
		}

		const podium = rankings.slice(0, 3).map((r) => ({
			rank: r.rank,
			userId: r.userId,
			userName: r.userName,
			value: r.value,
			avatarUrl: r.avatarUrl,
		}));

		const yesterdayPodium = await getLatestLeaderboardSettlement(period).catch(
			() => [],
		);

		return NextResponse.json({
			period,
			metric: 'score',
			title,
			fromDate: fromDateStr,
			toDate: toDateStr,
			resetAt,
			podium,
			yesterdayPodium,
			rankings,
			currentUserRanking,
		});
	} catch (err) {
		console.error('Leaderboard error:', err);
		return NextResponse.json(
			{ error: 'Failed to fetch leaderboard' },
			{ status: 500 },
		);
	}
}
