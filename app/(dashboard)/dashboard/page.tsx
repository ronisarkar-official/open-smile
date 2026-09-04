import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getUserCoinBalance,
  getUserStreak,
  getUserDailyRank,
  getUserRecentSmiles,
} from "@/lib/db";
import { DashboardView, type DashboardStats } from "@/components/dashboard/dashboard-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const userId = user?.id;

  let stats: DashboardStats = {
    balance: 0,
    streak: 0,
    streakMultiplier: "1.0x",
    dailyRank: null,
    totalUsers: 1,
    recentSmiles: [],
  };

  if (userId) {
    try {
      const [balance, streak, rankData, recentSmiles] = await Promise.all([
        getUserCoinBalance(userId),
        getUserStreak(userId),
        getUserDailyRank(userId),
        getUserRecentSmiles(userId, 5),
      ]);

      const multiplier = (1.0 + Math.min(streak * 0.1, 1.0)).toFixed(1);

      stats = {
        balance,
        streak,
        streakMultiplier: `${multiplier}x`,
        dailyRank: rankData.rank,
        totalUsers: rankData.totalUsers,
        recentSmiles,
      };
    } catch (e) {
      console.error("Dashboard server data fetch error:", e);
    }
  }

  return <DashboardView firstName={firstName} initialStats={stats} />;
}
