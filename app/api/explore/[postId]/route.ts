import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireServerUser } from '@/lib/auth/session';
import { deleteUserExplorePost } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ postId: string }> }
) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const { postId } = await params;
		if (!postId) {
			return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
		}

		const result = await deleteUserExplorePost(user.id, postId);
		if (!result.success) {
			return NextResponse.json(
				{ error: result.error || 'Post not found or unauthorized' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Explore post deleted successfully',
			postId,
		});
	} catch (err: any) {
		console.error('Delete explore post error:', err);
		return NextResponse.json(
			{ error: err?.message || 'Failed to delete explore post' },
			{ status: 500 }
		);
	}
}
