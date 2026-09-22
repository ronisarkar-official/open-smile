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
  const refQuery = request.nextUrl.searchParams.get("ref");

  let refCodeToSet: string | null = null;
  if (pathname.startsWith("/join/")) {
    const parts = pathname.split("/");
    if (parts[2]) {
      refCodeToSet = decodeURIComponent(parts[2]).trim().toUpperCase();
    }
  } else if (refQuery) {
    refCodeToSet = decodeURIComponent(refQuery).trim().toUpperCase();
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
      const redirectResponse = NextResponse.redirect(loginUrl);
      if (refCodeToSet) {
        redirectResponse.cookies.set("ref_code", refCodeToSet, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "lax",
        });
      }
      return redirectResponse;
    }
  }

  const response = NextResponse.next();
  if (refCodeToSet) {
    response.cookies.set("ref_code", refCodeToSet, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
