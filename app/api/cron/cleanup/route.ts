import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredOtpCodes, cleanupExpiredRateLimits, cleanupExpiredExplorePosts } from "@/lib/db";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest) {
  if (CRON_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const [, , exploreClean] = await Promise.all([
      cleanupExpiredOtpCodes(),
      cleanupExpiredRateLimits(),
      cleanupExpiredExplorePosts(),
    ]);

    return NextResponse.json(
      { success: true, message: "Cleanup completed", deletedExplorePosts: exploreClean.deletedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("[cron/cleanup] Error:", error);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}

export const GET = POST;
