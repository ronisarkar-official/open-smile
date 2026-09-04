import { NextResponse } from "next/server";
import { getSystemSettingsMap } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	try {
		const settings = await getSystemSettingsMap();
		return NextResponse.json(
			{ success: true, settings },
			{
				headers: {
					"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
				},
			}
		);
	} catch (err: any) {
		return NextResponse.json(
			{
				success: false,
				settings: {
					maintenance_mode: false,
					signup_enabled: true,
					marketplace_enabled: true,
					explore_feed_enabled: true,
					explore_posting_enabled: true,
					leaderboard_enabled: true,
					scratch_cards_enabled: true,
				},
			},
			{ status: 200 }
		);
	}
}
