import { NextRequest, NextResponse } from 'next/server';
import { requireServerAdmin } from '@/lib/auth/session';
import {
	getAdminNotifications,
	createBroadcastNotification,
	deleteNotificationAdmin,
	getPool,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get('page') || '1', 10);
		const limit = parseInt(searchParams.get('limit') || '25', 10);
		const search = searchParams.get('search') || undefined;
		const category = searchParams.get('category') || undefined;

		const result = await getAdminNotifications({ page, limit, search, category });

		const pool = getPool();
		const statsRes = await pool.query(`
			SELECT 
				COUNT(*)::int AS total_notifications,
				COUNT(CASE WHEN read = false THEN 1 END)::int AS unread_notifications,
				COUNT(DISTINCT user_id)::int AS users_with_notifications
			FROM notifications
		`);

		const stats = statsRes.rows[0] ?? {
			total_notifications: 0,
			unread_notifications: 0,
			users_with_notifications: 0,
		};

		return NextResponse.json({
			success: true,
			...result,
			stats: {
				total: Number(stats.total_notifications),
				unread: Number(stats.unread_notifications),
				activeUsers: Number(stats.users_with_notifications),
				readRate:
					Number(stats.total_notifications) > 0
						? Math.round(
								((Number(stats.total_notifications) -
									Number(stats.unread_notifications)) /
									Number(stats.total_notifications)) *
									100,
						  )
						: 100,
			},
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to fetch admin notifications' },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await req.json().catch(() => ({}));
		const target = body?.target || 'all';
		const targetUserId = body?.target_user_id ? String(body.target_user_id) : undefined;
		const title = body?.title ? String(body.title).trim() : '';
		const description = body?.description ? String(body.description).trim() : '';
		const category = body?.category || 'system';
		const iconType = body?.icon_type || 'bell';
		const actionLabel = body?.action_label ? String(body.action_label).trim() : undefined;
		const actionUrl = body?.action_url ? String(body.action_url).trim() : undefined;

		if (!title || !description) {
			return NextResponse.json(
				{ error: 'Title and description are required for notifications' },
				{ status: 400 },
			);
		}

		if (target === 'specific' && !targetUserId) {
			return NextResponse.json(
				{ error: 'Target user ID or email is required for targeted notifications' },
				{ status: 400 },
			);
		}

		const broadcastResult = await createBroadcastNotification({
			target,
			targetUserId,
			title,
			description,
			category,
			iconType,
			actionLabel,
			actionUrl,
			adminId: user.id,
			adminEmail: user.email,
		});

		return NextResponse.json({
			success: true,
			count: broadcastResult.count,
			target,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to broadcast notification' },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
		}

		const success = await deleteNotificationAdmin(id);
		return NextResponse.json({ success, id });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to delete notification' },
			{ status: 500 },
		);
	}
}
