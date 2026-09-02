import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { getAdminUserDetail, adminDeleteUser } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { id } = await params;
		const detail = await getAdminUserDetail(id);
		if (!detail) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, ...detail });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to fetch user detail" }, { status: 500 });
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { id } = await params;
		if (user.id === id) {
			return NextResponse.json({ error: "Cannot delete your own admin account" }, { status: 400 });
		}

		const result = await adminDeleteUser(user.id, user.email, id);
		return NextResponse.json({ ...result, userId: id });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to delete user" }, { status: 500 });
	}
}
