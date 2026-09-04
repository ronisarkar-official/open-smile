import { NextRequest, NextResponse } from "next/server";
import { sendLoginNotificationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "Unknown IP";
    const userAgent = req.headers.get("user-agent") || "Browser / Web Client";
    const time = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "UTC",
    });

    await sendLoginNotificationEmail(email, {
      time,
      ip,
      userAgent,
    });

    return NextResponse.json(
      { success: true, message: "Login notification sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in notify-login route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
