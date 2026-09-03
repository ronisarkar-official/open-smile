import { NextResponse } from 'next/server';
import { requireServerUser } from '@/backend/auth';
import { getUserStreakFullDetails } from '@/backend/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const details = await getUserStreakFullDetails(user.id);
		return NextResponse.json(
			details,
			{
				headers: {
					'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
					Pragma: 'no-cache',
					Expires: '0',
				},
			}
		);
	} catch (err) {
		console.error('Failed to get user streak:', err);
		return NextResponse.json(
			{ error: 'Failed to retrieve streak' },
			{ status: 500 }
		);
	}
}
