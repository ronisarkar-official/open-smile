import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSystemSettingsMap, getExploreFeedPosts, getExploreFeedTotalCount } from '@/lib/db';
import { getServerUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatTimeAgo(dt: Date | string | null): string {
	if (!dt) return 'recently';
	const now = Date.now();
	const time = new Date(dt).getTime();
	const diff = Math.max(0, Math.floor((now - time) / 1000));
	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	return `${Math.floor(diff / 86400)}d ago`;
}

function getAvatarLetters(name: string | null): string {
	if (!name) return 'OS';
	const parts = name.trim().split(/\s+/);
	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.slice(0, 2).toUpperCase();
}

export async function GET(request: NextRequest) {
	try {
		const settings = await getSystemSettingsMap();
		if (settings.explore_feed_enabled === false) {
			return NextResponse.json({ posts: [], total: 0, disabled: true, message: 'Explore feed is disabled.' });
		}
		const { searchParams } = new URL(request.url);
		const filter = searchParams.get('filter');
		const cursor = searchParams.get('cursor');
		const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
		const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

		const currentUser = await getServerUser();
		const currentUserId = currentUser?.id || null;

		const result = await getExploreFeedPosts({
			currentUserId,
			limit,
			cursor,
			page,
			filter,
		});

		const total = await getExploreFeedTotalCount();

		const bgClasses = ['bg-primary', 'bg-accent', 'bg-secondary', 'bg-success'];
		const posts = result.rows.map((r, idx) => {
			const createdAt = new Date(r.created_at);
			const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
			const msRemaining = expiresAt.getTime() - Date.now();
			const hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60));
			const expiresIn = msRemaining > 0 ? `${Math.max(1, hoursRemaining)}h left` : undefined;

			return {
				id: String(r.id),
				userId: String(r.user_id),
				user: r.user_name || 'Smiler',
				avatar: getAvatarLetters(r.user_name),
				userAvatar: r.user_avatar || '/icons/default-icon.webp',
				score: Number(r.smile_score) || 0,
				caption: r.caption || undefined,
				imageUrl: r.image_url || undefined,
				likes: Number(r.likes_count) || 0,
				timeAgo: formatTimeAgo(r.created_at),
				expiresIn,
				isLikedByMe: Boolean(r.is_liked_by_me),
				isMine: Boolean(currentUserId && String(r.user_id) === String(currentUserId)),
				bg: bgClasses[idx % bgClasses.length],
			};
		});

		return NextResponse.json({
			posts,
			nextCursor: result.nextCursor,
			hasMore: result.hasMore,
			page,
			total,
		});
	} catch (err) {
		console.error('Explore feed error:', err);
		return NextResponse.json({ error: 'Failed to fetch feed', posts: [] }, { status: 500 });
	}
}
