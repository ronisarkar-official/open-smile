import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { adminSetUserRole } from "@/backend/db";

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
		const role = String(body?.role || "user").toLowerCase();

		if (role !== "admin" && role !== "user") {
			return NextResponse.json({ error: "Invalid role. Allowed roles: admin, user" }, { status: 400 });
		}

		const result = await adminSetUserRole(user.id, user.email, id, role);
		return NextResponse.json({ ...result, userId: id });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to update role" }, { status: 500 });
	}
}
