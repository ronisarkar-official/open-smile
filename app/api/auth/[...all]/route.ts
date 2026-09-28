import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
	const { pathname, searchParams } = req.nextUrl;
	if (pathname.endsWith("/error")) {
		const destination = new URL("/banned", req.url);
		searchParams.forEach((value, key) => {
			destination.searchParams.set(key, value);
		});
		return NextResponse.redirect(destination);
	}
	return handlers.GET(req);
}

export const { POST, PATCH, PUT, DELETE } = handlers;