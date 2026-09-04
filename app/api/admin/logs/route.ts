import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/lib/auth/session";
import { getAdminAuditLogs } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "30", 10);
		const offset = parseInt(searchParams.get("offset") || "0", 10);

		const data = await getAdminAuditLogs({ limit, offset });
		return NextResponse.json({ success: true, ...data });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to fetch audit logs" }, { status: 500 });
	}
}
