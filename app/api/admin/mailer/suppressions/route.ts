import { NextRequest, NextResponse } from 'next/server';
import { requireServerAdmin } from '@/lib/auth/session';
import {
	listEmailSuppressions,
	addEmailSuppression,
	removeEmailSuppression,
	logAdminAction,
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

		const result = await listEmailSuppressions({ page, limit, search });
		return NextResponse.json({ success: true, ...result });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to list email suppressions' },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await req.json().catch(() => ({}));
		const email = body?.email ? String(body.email).trim() : '';
		const reason = body?.reason ? String(body.reason).trim() : 'admin_block';
		const category = body?.category ? String(body.category).trim() : 'all';

		if (!email || !email.includes('@')) {
			return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
		}

		await addEmailSuppression(email, reason, category);
		await logAdminAction(
			user.id,
			user.email,
			'ADD_EMAIL_SUPPRESSION',
			'email_suppressions',
			email,
			{ reason, category },
		);

		return NextResponse.json({ success: true, email, reason, category });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to add email suppression' },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(req.url);
		const email = searchParams.get('email');

		if (!email) {
			return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
		}

		const success = await removeEmailSuppression(email);
		await logAdminAction(
			user.id,
			user.email,
			'REMOVE_EMAIL_SUPPRESSION',
			'email_suppressions',
			email,
		);

		return NextResponse.json({ success, email });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to remove email suppression' },
			{ status: 500 },
		);
	}
}
