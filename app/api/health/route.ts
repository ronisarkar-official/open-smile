import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/health
 *
 * Liveness probe for judges, uptime monitors and deploys. Pings MongoDB
 * (the only external service this app requires).
 */
export async function GET() {
  if (!process.env.MONGODB_DIRECT_URI) {
    return NextResponse.json(
      { ok: false, database: "not_configured" },
      { status: 503 }
    );
  }

  try {
    await getDb().admin().ping();
    return NextResponse.json({ ok: true, database: "connected" });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}