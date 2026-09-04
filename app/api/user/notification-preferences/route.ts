import { NextRequest, NextResponse } from 'next/server';
import { requireServerUser } from '@/lib/auth/session';
import {
	getUserNotificationPreferences,
	upsertUserNotificationPreferences,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const preferences = await getUserNotificationPreferences(user.id);
		return NextResponse.json({
			success: true,
			preferences,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to fetch notification preferences' },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const body = await req.json().catch(() => ({}));
		const updated = await upsertUserNotificationPreferences(user.id, {
			...(typeof body.security_emails === 'boolean' && { security_emails: body.security_emails }),
			...(typeof body.streak_reminders === 'boolean' && { streak_reminders: body.streak_reminders }),
			...(typeof body.leaderboard_alerts === 'boolean' && { leaderboard_alerts: body.leaderboard_alerts }),
			...(typeof body.reward_alerts === 'boolean' && { reward_alerts: body.reward_alerts }),
			...(typeof body.marketing_emails === 'boolean' && { marketing_emails: body.marketing_emails }),
			...(typeof body.in_app_streaks === 'boolean' && { in_app_streaks: body.in_app_streaks }),
			...(typeof body.in_app_rewards === 'boolean' && { in_app_rewards: body.in_app_rewards }),
			...(typeof body.in_app_leaderboard === 'boolean' && { in_app_leaderboard: body.in_app_leaderboard }),
			...(typeof body.in_app_system === 'boolean' && { in_app_system: body.in_app_system }),
		});

		return NextResponse.json({
			success: true,
			preferences: updated,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to update notification preferences' },
			{ status: 500 },
		);
	}
}
