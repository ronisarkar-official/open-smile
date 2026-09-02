import { NextResponse } from 'next/server';
import { requireServerUser } from '@/backend/auth';
import { getPool } from '@/backend/db/client';
import { getSystemSettingsMap } from '@/backend/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const settings = await getSystemSettingsMap();
		const isMaintenance = settings.maintenance_mode === true;
		const maxDaily = Math.max(1, Number(settings.max_daily_captures_per_user) || 10);

		const pool = getPool();
		const dailyRes = await pool.query(
			`SELECT COUNT(*) FROM smile_captures 
			 WHERE user_id = $1 AND created_at AT TIME ZONE 'Asia/Kolkata' >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date`,
			[user.id]
		);
		const dailyCount = parseInt(dailyRes.rows[0]?.count || '0', 10);

		const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
		const istNow = new Date(Date.now() + istOffsetMs);
		const nextIstMidnightUtc = Date.UTC(
			istNow.getUTCFullYear(),
			istNow.getUTCMonth(),
			istNow.getUTCDate() + 1,
			0,
			0,
			0,
			0
		);
		const nextMidnight = new Date(nextIstMidnightUtc - istOffsetMs);

		const limitReached = dailyCount >= maxDaily;

		return NextResponse.json({
			daily_captures_used: dailyCount,
			max_daily_captures: maxDaily,
			captures_remaining: Math.max(0, maxDaily - dailyCount),
			limit_reached: limitReached,
			resets_at: nextMidnight.toISOString(),
			maintenance_mode: isMaintenance,
		});
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || 'Failed to fetch status' }, { status: 500 });
	}
}
