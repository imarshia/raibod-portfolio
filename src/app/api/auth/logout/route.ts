import { NextRequest, NextResponse } from "next/server";
import { destroySession, getSessionUser } from "@/lib/auth";
import { logActivity } from "@/lib/audit";

export async function POST(request: NextRequest) {
  // The user is read before the session is destroyed: after
  // destroySession there is no session left to identify the user.
  // The logging is guarded so a session-read failure never blocks
  // the logout itself.
  try {
    const user = await getSessionUser();
    if (user) {
      await logActivity({
        userId: user.id,
        action: "logout",
        details: "خروج از پنل",
        ip: request.headers.get("x-forwarded-for") ?? undefined,
      });
    }
  } catch {
    // Logging must never block logout.
  }
  await destroySession();
  // J-3: 307 keeps the method, so the browser would POST to /login
  // and get 405 (the login page only has GET). 303 is the
  // POST-Redirect-GET pattern: the browser continues with GET.
  return NextResponse.redirect(new URL("/login", request.url), 303);
}
