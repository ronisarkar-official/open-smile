import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserPublicProfileByUsername } from '@/backend/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ username: string }> }
) {
	try {
		const { username } = await params;
		if (!username) {
			return NextResponse.json({ error: 'Username is required' }, { status: 400 });
		}

		const profile = await getUserPublicProfileByUsername(username);

		if (!profile) {
			return NextResponse.json({ error: 'Smiler profile not found' }, { status: 404 });
		}

		// Backward-compatible flattened fields alongside new rich structures
		return NextResponse.json({
			...profile,
			totalSmiles: profile.stats.totalSmiles,
			bestScore: profile.stats.bestScore,
			streak: profile.stats.streakCount,
			rank: profile.stats.dailyRank || 1,
			publicSmiles: profile.publicPosts,
		});
	} catch (err) {
		console.error('User profile error:', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
