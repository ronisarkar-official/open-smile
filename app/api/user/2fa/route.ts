import { NextRequest, NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth";
import { getUserTwoFactorStatus, updateUserTwoFactorStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, error } = await requireServerUser();
    if (!user) return error;

    const enabled = await getUserTwoFactorStatus(user.id);
    return NextResponse.json({
      success: true,
      enabled,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch 2FA status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireServerUser();
    if (!user) return error;

    const body = await req.json().catch(() => ({}));
    const enabled = Boolean(body.enabled);
    const updated = await updateUserTwoFactorStatus(user.id, enabled);

    return NextResponse.json({
      success: true,
      enabled: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update 2FA status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
