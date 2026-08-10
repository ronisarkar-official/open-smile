import { NextRequest, NextResponse } from "next/server";
import { usersCollection } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (Boolean(process.env.MONGODB_DIRECT_URI)) {
      await usersCollection().updateOne(
        { email: normalizedEmail },
        { $set: { emailVerified: true } }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in mark-verified route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
