import { NextResponse } from "next/server";
import { requireServerUser } from "@/backend/auth/session";
import { bootstrapAdminUser } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function POST() {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const result = await bootstrapAdminUser(user.id, user.email);
		if (!result.success) {
			return NextResponse.json({ error: result.error || "Forbidden" }, { status: 403 });
		}

		return NextResponse.json({ success: true, message: "Promoted to admin", user: { ...user, role: "admin" } });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to bootstrap admin" }, { status: 500 });
	}
}
