import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/lib/auth/session";
import { getSystemSettings, updateSystemSetting } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const settings = await getSystemSettings();
		return NextResponse.json({ success: true, settings });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to fetch settings" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await request.json();
		const key = String(body?.key || "").trim();
		const value = body?.value;
		const description = body?.description ? String(body.description) : undefined;

		if (!key || value === undefined) {
			return NextResponse.json({ error: "key and value are required" }, { status: 400 });
		}

		const result = await updateSystemSetting(user.id, user.email, key, value, description);
		return NextResponse.json(result);
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to update setting" }, { status: 500 });
	}
}
