import { NextRequest, NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  if (CRON_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await pingDatabase();
    return NextResponse.json(
      {
        message: "Database keep-alive ping completed",
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[cron/keep-alive] Error pinging database:", error);
    return NextResponse.json(
      { error: "Database keep-alive ping failed" },
      { status: 500 }
    );
  }
}

export const POST = GET;
