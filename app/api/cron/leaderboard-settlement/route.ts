import { NextRequest, NextResponse } from "next/server";
import { settleDailyLeaderboard } from "@/backend/db";

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
    try {
      const body = await req.json();
      if (body?.date) {
        targetDate = new Date(body.date);
      }
    } catch {
      targetDate = undefined;
    }

    const result = await settleDailyLeaderboard(targetDate);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("[cron/leaderboard-settlement] Error:", error);
    return NextResponse.json(
      { error: "Settlement failed" },
      { status: 500 }
    );
  }
}
