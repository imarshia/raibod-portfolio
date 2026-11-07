import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    mobile?: string;
    password?: string;
  } | null;
  if (!body?.mobile || !body?.password) {
    return NextResponse.json({ error: "mobile and password required" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { mobile: body.mobile.trim() } });
  if (!user || !user.active) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }
  const ok = await verifyPassword(user.passwordHash, body.password);
  if (!ok) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await createSession(user.id);
  return NextResponse.json({ ok: true, role: user.role });
}
