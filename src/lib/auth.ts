// src/lib/auth owns passwords, sessions and role checks.
// Passwords are hashed with Argon2id and never stored in plain text.
// Sessions are server-managed rows in the sessions table, not signed tokens.
// The cookie only carries a random token; its SHA-256 hash is stored in the database.

import { randomBytes, createHash } from "node:crypto";
import argon2 from "argon2";
import { cookies, headers } from "next/headers";
import { prisma } from "./db";

export const SESSION_COOKIE = "raibod_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

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
    secure: process.env.NODE_ENV === "production",
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
