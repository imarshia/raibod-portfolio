// src/lib/auth owns passwords, sessions and role checks.
// Passwords are hashed with Argon2id and never stored in plain text.
// Sessions are server-managed rows in the sessions table, not signed tokens.
// The cookie only carries a random token; its SHA-256 hash is stored in the database.

import { randomBytes, createHash } from "node:crypto";
import argon2 from "argon2";
import { cookies, headers } from "next/headers";
import { prisma } from "./db";

export const SESSION_COOKIE = "raibod_session";
// Session lifetime is 30 days (owner decision 2026-11-12; was 8 hours,
// PoC behavior, ADR-020 provisional). The same TTL drives both the
// database session expiresAt and the cookie maxAge.
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type Role = "ADMIN" | "DOCTOR" | "SELLER" | "RECEPTION";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "مدیر",
  DOCTOR: "دکتر",
  SELLER: "فروشنده",
  RECEPTION: "پذیرش",
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// The Secure cookie flag must only be set when the connection is
// actually HTTPS. `next start` sets NODE_ENV=production even for
// local LAN testing over plain HTTP, so NODE_ENV alone is wrong:
// a Secure cookie is rejected by the browser over http://<LAN-IP>
// (not a secure context), the session cookie is never stored, and
// login silently stays on the login page. Localhost works because
// browsers treat it as a secure context. So: Secure only when the
// request host is not local (not localhost and not a private IP).
async function isSecureRequest(): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return false;
  const host = (await headers()).get("host") ?? "";
  // R-14: a bracketed IPv6 host ("[::1]" or "[::1]:3000") splits on ":"
  // to "[", so a hostname check for "[::1]" can never match it. Check
  // the raw host for the loopback before the split.
  const lowerHost = host.toLowerCase();
  if (lowerHost === "[::1]" || lowerHost.startsWith("[::1]:")) {
    return false;
  }
  const hostname = host.split(":")[0].toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("10.") ||
    hostname.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  ) {
    return false;
  }
  return true;
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      ip: (await headers()).get("x-forwarded-for") ?? undefined,
      userAgent: (await headers()).get("user-agent") ?? undefined,
    },
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: await isSecureRequest(),
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return token;
}

export async function getSessionUser(): Promise<{
  id: string;
  fullName: string;
  mobile: string;
  role: Role;
} | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;
  if (!session.user.active) return null;
  return {
    id: session.user.id,
    fullName: session.user.fullName,
    mobile: session.user.mobile,
    role: session.user.role as Role,
  };
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { tokenHash: hashToken(token) },
      data: { revokedAt: new Date() },
    });
  }
  jar.delete(SESSION_COOKIE);
}

export function requireRole(user: { role: Role } | null, allowed: Role[]): boolean {
  return user !== null && allowed.includes(user.role);
}

// --- Login lockout (added 2026-11-07, post-PoC gap) ---
// An account locks for 15 minutes after 5 consecutive failed logins.
// Counters live on the User model (failedLoginAttempts, lockedUntil).
// Unknown mobiles get a plain 401 with no counter, so the lockout never
// reveals whether a mobile exists. Per-IP limiting is still open (HANDOVER §3).

export const MAX_FAILED_LOGINS = 5;
export const LOCKOUT_MS = 15 * 60 * 1000;

export function isLockedOut(lockedUntil: Date | null): boolean {
  return lockedUntil !== null && lockedUntil.getTime() > Date.now();
}

export async function getLoginLockState(userId: string): Promise<{
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { failedLoginAttempts: true, lockedUntil: true },
  });
  return {
    failedLoginAttempts: user?.failedLoginAttempts ?? 0,
    lockedUntil: user?.lockedUntil ?? null,
  };
}

export async function recordFailedLogin(
  userId: string,
  currentAttempts: number,
): Promise<Date | null> {
  const attempts = currentAttempts + 1;
  const lockedUntil =
    attempts >= MAX_FAILED_LOGINS ? new Date(Date.now() + LOCKOUT_MS) : null;
  await prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: attempts, lockedUntil },
  });
  return lockedUntil;
}

export async function resetLoginAttempts(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });
}
