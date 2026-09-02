import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { getAdminCaptures } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search") || undefined;
		const minScore = searchParams.get("minScore") ? parseInt(searchParams.get("minScore")!, 10) : undefined;
		const maxScore = searchParams.get("maxScore") ? parseInt(searchParams.get("maxScore")!, 10) : undefined;
		const flaggedOnly = searchParams.get("flagged") === "true";
		const limit = parseInt(searchParams.get("limit") || "25", 10);
		const offset = parseInt(searchParams.get("offset") || "0", 10);

		const result = await getAdminCaptures({ search, minScore, maxScore, flaggedOnly, limit, offset });
		return NextResponse.json({ success: true, ...result });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to fetch captures" }, { status: 500 });
	}
}
