import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getServerUser } from "@/lib/auth/session";
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
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  const user = session?.user ?? (await getServerUser(reqHeaders));
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
      const [balanceRes, streakRes, rankRes, smilesRes] = await Promise.allSettled([
        getUserCoinBalance(userId),
        getUserStreak(userId),
        getUserDailyRank(userId),
        getUserRecentSmiles(userId, 5),
      ]);

      const balance = balanceRes.status === "fulfilled" ? balanceRes.value : 0;
      const streak = streakRes.status === "fulfilled" ? streakRes.value : 0;
      const rankData =
        rankRes.status === "fulfilled"
          ? rankRes.value
          : { rank: null, totalUsers: 1 };
      const recentSmiles =
        smilesRes.status === "fulfilled" ? smilesRes.value : [];

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
