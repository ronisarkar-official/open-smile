import { getPool } from './client';

export interface ExploreFeedRow {
	id: string;
	user_id: string;
	capture_id: string | null;
	image_url: string;
	smile_score: number;
	caption: string | null;
	likes_count: number;
	created_at: Date;
	user_name: string | null;
	user_avatar: string | null;
	is_liked_by_me: boolean;
}

export interface ExploreFeedResult {
	rows: ExploreFeedRow[];
	nextCursor: string | null;
	hasMore: boolean;
}

export function encodeCursor(createdAt: Date, id: string): string {
	return Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');
}

export function decodeCursor(cursor: string): { createdAt: Date; id: string } | null {
	try {
		let raw = cursor;
		if (!raw.includes('|')) {
			try {
				const decoded = Buffer.from(raw, 'base64url').toString('utf8');
				if (decoded.includes('|') || decoded.includes('_')) {
					raw = decoded;
				}
			} catch {
				// keep raw
			}
		}
		const delimiter = raw.includes('|') ? '|' : '_';
		const parts = raw.split(delimiter);
		if (parts.length >= 2) {
			const id = parts[parts.length - 1];
			const dateStr = parts.slice(0, parts.length - 1).join(delimiter);
			const dt = new Date(dateStr);
			if (!isNaN(dt.getTime()) && id) {
				return { createdAt: dt, id };
			}
		}
	} catch {
		return null;
	}
	return null;
}

export async function getExploreFeedPosts(options: {
	currentUserId?: string | null;
	limit?: number;
	cursor?: string | null;
	page?: number;
	filter?: string | null;
}): Promise<ExploreFeedResult> {
	const pool = getPool();
	const currentUserId = options.currentUserId || null;
	const limit = Math.min(100, Math.max(1, options.limit || 20));
	const fetchLimit = limit + 1;
	const decoded = options.cursor ? decodeCursor(options.cursor) : null;

	let orderClause = 'ep.created_at DESC, ep.id DESC';
	if (options.filter === 'top_scored') {
		orderClause = 'ep.smile_score DESC, ep.created_at DESC, ep.id DESC';
	} else if (options.filter === 'most_liked') {
		orderClause = 'ep.likes_count DESC, ep.created_at DESC, ep.id DESC';
	} else if (options.filter === 'random') {
		orderClause = 'RANDOM()';
	}

	let query = '';
	let params: any[] = [];

	const isDefaultOrder = !options.filter || options.filter === 'latest';
	if (decoded && isDefaultOrder) {
		query = `
			SELECT 
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
			LEFT JOIN "user" u ON ep.user_id = u.id
			LEFT JOIN explore_likes el ON ep.id = el.post_id AND el.user_id = $1
			WHERE ep.image_url IS NOT NULL AND ep.image_url != ''
			  AND (ep.created_at, ep.id) < ($2, $3::uuid)
			ORDER BY ${orderClause}
			LIMIT $4
		`;
		params = [currentUserId, decoded.createdAt, decoded.id, fetchLimit];
	} else {
		const page = Math.max(1, options.page || 1);
		const offset = (page - 1) * limit;
		query = `
			SELECT 
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
			LEFT JOIN "user" u ON ep.user_id = u.id
			LEFT JOIN explore_likes el ON ep.id = el.post_id AND el.user_id = $1
			WHERE ep.image_url IS NOT NULL AND ep.image_url != ''
			ORDER BY ${orderClause}
			LIMIT $2 OFFSET $3
		`;
		params = [currentUserId, fetchLimit, offset];
	}

	const { rows } = await pool.query(query, params);
	const hasMore = rows.length > limit;
	const slicedRows = hasMore ? rows.slice(0, limit) : rows;
	const lastItem = slicedRows[slicedRows.length - 1];
	const nextCursor = hasMore && lastItem ? encodeCursor(new Date(lastItem.created_at), String(lastItem.id)) : null;

	return {
		rows: slicedRows,
		nextCursor,
		hasMore,
	};
}

export async function getExploreFeedTotalCount(): Promise<number> {
	const pool = getPool();
	const res = await pool.query(
		"SELECT COUNT(*) FROM explore_posts WHERE image_url IS NOT NULL AND image_url != ''"
	);
	return parseInt(res.rows[0]?.count || '0', 10);
}
