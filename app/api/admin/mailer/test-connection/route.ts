import { NextResponse } from 'next/server';
import { requireServerAdmin } from '@/lib/auth/session';
import { verifyMailTransport } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST() {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const diagnostics = await verifyMailTransport();
		return NextResponse.json({
			success: true,
			diagnostics,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to verify mail transport' },
			{ status: 500 },
		);
	}
}
