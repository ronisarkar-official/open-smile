import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { getAdminVoucherClaims } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "25", 10);
		const offset = parseInt(searchParams.get("offset") || "0", 10);

		const data = await getAdminVoucherClaims({ limit, offset });
		return NextResponse.json({ success: true, ...data });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to fetch claims" }, { status: 500 });
	}
}
