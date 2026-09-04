import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/lib/auth/session";
import { getAdminExplorePosts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "24", 10);
		const offset = parseInt(searchParams.get("offset") || "0", 10);

		const data = await getAdminExplorePosts({ limit, offset });
		return NextResponse.json({ success: true, ...data });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to fetch explore posts" }, { status: 500 });
	}
}
