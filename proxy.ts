import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16: "middleware" is renamed to "proxy"
// Proxy defaults to Node.js runtime
const protectedRoutes = [
  "/dashboard",
  "/leaderboard",
  "/explore",
  "/rewards",
  "/refer",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/join/")) {
    const parts = pathname.split("/");
    const code = parts[2];
    if (code) {
      const response = NextResponse.next();
      response.cookies.set("ref_code", code.toUpperCase(), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });
      return response;
    }
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected) {
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token");

    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
