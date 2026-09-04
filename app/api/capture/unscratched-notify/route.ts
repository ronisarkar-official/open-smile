import { NextRequest, NextResponse } from 'next/server';
import { requireServerUser } from '@/lib/auth/session';
import { notifyUnscratchedCard, syncUnscratchedCardNotifications } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const body = await req.json().catch(() => ({}));
		const cardId = body?.cardId ? String(body.cardId) : undefined;

		let notified = false;
		if (cardId) {
			notified = await notifyUnscratchedCard(user.id, cardId);
		} else {
			const count = await syncUnscratchedCardNotifications(user.id);
			notified = count > 0;
		}

		return NextResponse.json({
			success: true,
			notified,
		});
	} catch (err: any) {
		console.error('Failed to process unscratched card notification:', err);
		return NextResponse.json(
			{ error: err?.message || 'Failed to process unscratched card notification' },
			{ status: 500 },
		);
	}
}
