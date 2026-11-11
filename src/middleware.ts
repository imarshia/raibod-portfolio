// middleware.ts owns host-based routing only. It does not check auth.
// Auth is checked server-side in the dashboard page and in API routes.
// panel.localhost and panel.raibod.com rewrite the root path to /dashboard.
// localhost and raibod.com serve the public routes unchanged.
// This is localhost-only host logic and must be reviewed before any real deployment.

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();
  const isPanelHost = hostname === "panel.localhost" || hostname === "panel.raibod.com";
  if (isPanelHost && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
