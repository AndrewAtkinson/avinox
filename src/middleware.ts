import { NextResponse, type NextRequest } from "next/server";

// Show the landing page at / to anyone without a session cookie. The (app) layout
// still checks the cookie properly and sends stale sessions to /login.
export function middleware(request: NextRequest) {
  if (request.cookies.has("__session")) return NextResponse.next();
  return NextResponse.rewrite(new URL("/welcome", request.url));
}

export const config = { matcher: "/" };
