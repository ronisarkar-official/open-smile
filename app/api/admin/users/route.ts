import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { getAdminUsers } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search") || undefined;
		const role = searchParams.get("role") || undefined;
		const banned = searchParams.get("banned") || undefined;
		const limit = parseInt(searchParams.get("limit") || "20", 10);
		const offset = parseInt(searchParams.get("offset") || "0", 10);

		const result = await getAdminUsers({ search, role, banned, limit, offset });
		return NextResponse.json({ success: true, ...result });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to fetch users" }, { status: 500 });
	}
}
