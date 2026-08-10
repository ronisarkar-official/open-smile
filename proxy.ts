import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16: "middleware" is renamed to "proxy"
// Proxy defaults to Node.js runtime
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
