import { NextResponse } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { getAdminDashboardStats } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const stats = await getAdminDashboardStats();
		return NextResponse.json({ success: true, stats });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to fetch admin stats" }, { status: 500 });
	}
}
