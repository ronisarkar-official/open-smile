import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/backend/db/client';
import { getSystemSettingsMap, cleanupExpiredExplorePosts } from '@/backend/db';
import { getServerUser } from '@/backend/auth/session';

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
		const filter = searchParams.get('filter') || 'latest';
		const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
		const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
		const offset = (page - 1) * limit;

		let orderClause = 'ep.created_at DESC';
		if (filter === 'top_scored') {
			orderClause = 'ep.smile_score DESC, ep.created_at DESC';
		} else if (filter === 'most_liked') {
			orderClause = 'ep.likes_count DESC, ep.created_at DESC';
		}

		await cleanupExpiredExplorePosts().catch(() => {});

		const pool = getPool();
		const currentUser = await getServerUser();
		const currentUserId = currentUser?.id || null;

		const { rows } = await pool.query(
			`SELECT 
				ep.id,
				ep.user_id,
				ep.capture_id,
				ep.image_url,
				ep.smile_score,
				ep.caption,
				ep.likes_count,
				ep.created_at,
				u.name AS user_name,
				u.image AS user_avatar,
				CASE WHEN el.user_id IS NOT NULL THEN true ELSE false END AS is_liked_by_me
			 FROM explore_posts ep
			 JOIN "user" u ON ep.user_id = u.id
			 LEFT JOIN explore_likes el ON ep.id = el.post_id AND el.user_id = $1
			 WHERE ep.created_at >= NOW() - INTERVAL '24 hours'
			 ORDER BY ${orderClause}
			 LIMIT $2 OFFSET $3`,
			[currentUserId, limit, offset]
		);

		const totalCountRes = await pool.query(
			"SELECT COUNT(*) FROM explore_posts WHERE created_at >= NOW() - INTERVAL '24 hours'"
		);
		const total = parseInt(totalCountRes.rows[0]?.count || '0', 10);

		const bgClasses = ['bg-primary', 'bg-accent', 'bg-secondary', 'bg-success'];
		const posts = rows.map((r, idx) => {
			const createdAt = new Date(r.created_at);
			const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
			const msRemaining = Math.max(0, expiresAt.getTime() - Date.now());
			const hoursRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60)));

			return {
				id: String(r.id),
				userId: String(r.user_id),
				user: r.user_name || 'Smiler',
				avatar: getAvatarLetters(r.user_name),
				score: Number(r.smile_score) || 0,
				caption: r.caption || undefined,
				imageUrl: r.image_url || undefined,
				likes: Number(r.likes_count) || 0,
				timeAgo: formatTimeAgo(r.created_at),
				expiresIn: `${hoursRemaining}h left`,
				isLikedByMe: Boolean(r.is_liked_by_me),
				bg: bgClasses[idx % bgClasses.length],
			};
		});

		return NextResponse.json({
			posts,
			page,
			total,
		});
	} catch (err) {
		console.error('Explore feed error:', err);
		return NextResponse.json({ error: 'Failed to fetch feed', posts: [] }, { status: 500 });
	}
}
