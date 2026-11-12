import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/audit";
import {
  createSession,
  getLoginLockState,
  isLockedOut,
  recordFailedLogin,
  resetLoginAttempts,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    mobile?: string;
    password?: string;
  } | null;
  if (!body?.mobile || !body?.password) {
    return NextResponse.json({ error: "mobile and password required" }, { status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({ where: { mobile: body.mobile.trim() } });
    if (!user || !user.active) {
      // No counter for unknown/inactive mobiles: the lockout must not reveal
      // whether a mobile exists. Per-IP limiting is still open (HANDOVER §3).
      return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    }
    const lock = await getLoginLockState(user.id);
    if (isLockedOut(lock.lockedUntil)) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((lock.lockedUntil!.getTime() - Date.now()) / 1000),
      );
      return NextResponse.json(
        { error: "account locked", retryAfterSeconds },
        { status: 429 },
      );
    }
    const ok = await verifyPassword(user.passwordHash, body.password);
    if (!ok) {
      await recordFailedLogin(user.id, lock.failedLoginAttempts);
      return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    }
    await resetLoginAttempts(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    await createSession(user.id);
    // Activity log: a successful login is recorded. Failed logins
    // are NOT logged here (the mobile would be recorded on a failed
    // attempt); failures are already counted by the lockout.
    await logActivity({
      userId: user.id,
      action: "login",
      details: "ورود به پنل",
      ip: request.headers.get("x-forwarded-for") ?? undefined,
    });
    return NextResponse.json({ ok: true, role: user.role });
  } catch {
    // A database or server failure must not look like a wrong password:
    // the login page shows a distinct temporary-error message for 503.
    // The error is not logged: Prisma errors can carry connection
    // details, and no secret may appear in a log (STD-016).
    return NextResponse.json({ error: "server_error" }, { status: 503 });
  }
}
