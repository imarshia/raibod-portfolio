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
  return NextResponse.redirect(new URL("/login", request.url));
}
