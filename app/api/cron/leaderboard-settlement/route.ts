import { NextRequest, NextResponse } from "next/server";
import {
  settleDailyLeaderboard,
  settleWeeklyLeaderboard,
  settleMonthlyLeaderboard,
} from "@/backend/db";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest) {
  if (CRON_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    let targetDate: Date | undefined;
    let periodRequested: string | undefined;
    try {
      const body = await req.json();
      if (body?.date) {
        targetDate = new Date(body.date);
      }
      if (body?.period) {
        periodRequested = String(body.period);
      }
    } catch {
      targetDate = undefined;
    }

    const now = new Date();
    const daily = await settleDailyLeaderboard(targetDate);

    let weekly = null;
    if (periodRequested === "weekly" || now.getUTCDay() === 1) {
      weekly = await settleWeeklyLeaderboard(targetDate);
    }

    let monthly = null;
    if (periodRequested === "monthly" || now.getUTCDate() === 1) {
      monthly = await settleMonthlyLeaderboard(targetDate);
    }

    return NextResponse.json({
      success: true,
      daily,
      weekly,
      monthly,
    });
  } catch (error) {
    console.error("[cron/leaderboard-settlement] Error:", error);
    return NextResponse.json(
      { error: "Settlement failed" },
      { status: 500 }
    );
  }
}
