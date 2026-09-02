import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { adminSetUserBan } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { id } = await params;
		const body = await request.json();
		const banned = Boolean(body?.banned);
		const banReason = body?.banReason ? String(body.banReason) : undefined;
		const banExpires = body?.banExpires ? new Date(body.banExpires) : undefined;

		const result = await adminSetUserBan(user.id, user.email, id, banned, banReason, banExpires);
		return NextResponse.json({ ...result, userId: id });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to update ban status" }, { status: 500 });
	}
}
