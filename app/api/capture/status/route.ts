import { NextResponse } from 'next/server';
import { requireServerUser } from '@/backend/auth';
import { getPool } from '@/backend/db/client';
import { getLastCaptureTime, getSystemSettingsMap } from '@/backend/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const settings = await getSystemSettingsMap();
		const isMaintenance = settings.maintenance_mode === true;
		const maxDaily = Math.max(1, Number(settings.max_daily_captures_per_user) || 10);
		const cooldownMin = Math.max(0, Number(settings.min_capture_cooldown_minutes) ?? 60);

		const pool = getPool();
		const dailyRes = await pool.query(
			`SELECT COUNT(*) FROM smile_captures 
			 WHERE user_id = $1 AND created_at >= (NOW() AT TIME ZONE 'UTC')::date`,
			[user.id]
		);
		const dailyCount = parseInt(dailyRes.rows[0]?.count || '0', 10);

		const lastCapture = await getLastCaptureTime(user.id);
		let cooldownRemainingMs = 0;
		if (lastCapture && cooldownMin > 0) {
			const elapsed = Date.now() - new Date(lastCapture).getTime();
			const cooldownMs = cooldownMin * 60 * 1000;
			if (elapsed < cooldownMs) {
				cooldownRemainingMs = cooldownMs - elapsed;
			}
		}

		const now = new Date();
		const nextMidnight = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
		);

		const limitReached = dailyCount >= maxDaily;

		return NextResponse.json({
			daily_captures_used: dailyCount,
			max_daily_captures: maxDaily,
			captures_remaining: Math.max(0, maxDaily - dailyCount),
			limit_reached: limitReached,
			resets_at: nextMidnight.toISOString(),
			cooldown_remaining_ms: cooldownRemainingMs,
			cooldown_minutes: cooldownMin,
			maintenance_mode: isMaintenance,
		});
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || 'Failed to fetch status' }, { status: 500 });
	}
}
