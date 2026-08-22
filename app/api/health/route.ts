import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

/**
 * GET /api/health
 *
 * Liveness probe for judges, uptime monitors and deploys. Pings PostgreSQL
 * (the only external service this app requires).
 */
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, database: "not_configured" },
      { status: 503 }
    );
  }

  try {
    await getPool().query("SELECT 1");
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