import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/lib/auth/session";
import { adminDeleteExplorePost } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { id } = await params;
		const result = await adminDeleteExplorePost(user.id, user.email, id);
		return NextResponse.json({ ...result, postId: id });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to delete explore post" }, { status: 500 });
	}
}
