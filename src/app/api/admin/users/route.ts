// src/app/api/admin/users: the admin user list (GET).
// Returns the users for the activity-log user filter and the future
// user management page. Management only: the caller must be ADMIN.
// The list is dynamic (read from the database on every call), never
// hardcoded. No password hash or other secret is ever returned.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    const users = await prisma.user.findMany({
      where: { active: true },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, mobile: true, role: true },
    });
    return NextResponse.json({ users });
  } catch {
    // A database failure must not leak connection details (STD-016).
    return NextResponse.json({ error: "server_error" }, { status: 503 });
  }
}
