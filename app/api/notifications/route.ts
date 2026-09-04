import { NextRequest, NextResponse } from 'next/server';
import { requireServerUser } from '@/lib/auth/session';
import {
	getUserNotifications,
	syncUnscratchedCardNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	deleteNotification,
	clearReadNotifications,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		await syncUnscratchedCardNotifications(user.id).catch(() => 0);

		const { searchParams } = new URL(req.url);
		const category = searchParams.get('category') || undefined;
		const unreadOnly = searchParams.get('unread') === 'true';
		const limit = searchParams.get('limit')
			? parseInt(searchParams.get('limit')!, 10)
			: 40;
		const offset = searchParams.get('offset')
			? parseInt(searchParams.get('offset')!, 10)
			: 0;

		const data = await getUserNotifications(user.id, {
			category,
			unreadOnly,
			limit,
			offset,
		});

		return NextResponse.json({
			success: true,
			...data,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to fetch notifications' },
			{ status: 500 },
		);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const body = await req.json().catch(() => ({}));
		const action = body?.action || 'mark_read';
		const notificationId = body?.id ? String(body.id) : undefined;

		if (action === 'mark_all_read') {
			const updatedCount = await markAllNotificationsAsRead(user.id);
			return NextResponse.json({
				success: true,
				updatedCount,
			});
		}

		if (!notificationId) {
			return NextResponse.json(
				{ error: 'Notification ID is required' },
				{ status: 400 },
			);
		}

		const success = await markNotificationAsRead(user.id, notificationId);
		return NextResponse.json({
			success,
			notificationId,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to update notification' },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');
		const filter = searchParams.get('filter');

		if (filter === 'read') {
			const deletedCount = await clearReadNotifications(user.id);
			return NextResponse.json({
				success: true,
				deletedCount,
			});
		}

		if (!id) {
			return NextResponse.json(
				{ error: 'Notification ID or filter=read required' },
				{ status: 400 },
			);
		}

		const success = await deleteNotification(user.id, id);
		return NextResponse.json({
			success,
			id,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to delete notification' },
			{ status: 500 },
		);
	}
}
