import { NextRequest, NextResponse } from 'next/server';
import { requireServerAdmin } from '@/lib/auth/session';
import { getEmailLogById } from '@/lib/db';
import { sendEmailSafe } from '@/lib/mailer';
import type { EmailTemplateType } from '@/lib/mailer/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await req.json().catch(() => ({}));
		const logId = body?.log_id ? String(body.log_id) : '';

		if (!logId) {
			return NextResponse.json({ error: 'Log ID is required' }, { status: 400 });
		}

		const log = await getEmailLogById(logId);
		if (!log) {
			return NextResponse.json({ error: 'Email log not found' }, { status: 404 });
		}

		const sendRes = await sendEmailSafe({
			to: log.recipient_email,
			subject: log.subject,
			text: log.subject,
			template: log.template as EmailTemplateType,
			userId: log.user_id || undefined,
			metadata: { resendFromLogId: log.id, resentBy: user.email },
		});

		return NextResponse.json({
			success: sendRes.success,
			result: sendRes,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to resend email' },
			{ status: 500 },
		);
	}
}
