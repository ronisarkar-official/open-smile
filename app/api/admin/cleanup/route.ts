import { NextResponse } from "next/server";
import { requireServerAdmin } from "@/lib/auth/session";
import { cleanupExpiredOtpCodes, cleanupExpiredRateLimits, cleanupExpiredExplorePosts, logAdminAction } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const [deletedOtps, deletedRateLimits, exploreResult] = await Promise.all([
			cleanupExpiredOtpCodes(),
			cleanupExpiredRateLimits(),
			cleanupExpiredExplorePosts(),
		]);

		await logAdminAction(user.id, user.email, "manual_cleanup", "system", "all", {
			deletedOtps,
			deletedRateLimits,
			deletedExplorePosts: exploreResult.deletedCount,
		});

		return NextResponse.json({
			success: true,
			deletedOtps,
			deletedRateLimits,
			deletedExplorePosts: exploreResult.deletedCount,
			message: "Database cleanup completed",
		});
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Cleanup failed" }, { status: 500 });
	}
}
