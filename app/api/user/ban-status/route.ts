import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth/session";
import { getUserBanInfo } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
	const user = await getServerUser();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const banInfo = await getUserBanInfo(user.id);
	return NextResponse.json({
		banned: banInfo?.banned || false,
		banReason: banInfo?.banReason || null,
		banExpires: banInfo?.banExpires || null,
	});
}
