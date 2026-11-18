// src/app/(panel)/dashboard/activity: the activity log (AuditLog).
// Management only: the manager sees what employees do, including
// every edit. Server-side session and role checks. Non-admin users
// see an access-denied message (no redirect). The log is
// append-only: there is no delete button and no hard delete.
// Entries are newest first. The state lives in the URL (size, user,
// from, to), so a filtered view is shareable and survives a refresh.
// Page size is the count per page (10 default, up to 100, or all),
// not page navigation: the page always shows the newest N entries
// (owner confirmation 2026-11-14; the approved preview has no page
// number). Dates are Jalali with time, Latin digits, dir="ltr"
// (Design System v3.4 section 2). The page renders inside the panel
// shell (sidebar + header) from the (panel) layout; it has no header
// of its own.

import { redirect } from "next/navigation";
import { isValidJalaaliDate } from "jalaali-js";
import { getSessionUser } from "@/lib/auth";
import { actionLabel } from "@/lib/audit";
import { formatJalaliDateTimeLatin, jalaliDayRangeUTC } from "@/lib/jalali";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLogClient, type LogEntry } from "@/components/panel/ActivityLogClient";
import type { JalaliDate } from "@/components/panel/DateFilterModal";

const PAGE_SIZES = ["10", "20", "30", "40", "50", "100", "all"];

function parseJalaliParam(value: string | undefined): JalaliDate | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const jy = Number(m[1]);
  const jm = Number(m[2]);
  const jd = Number(m[3]);
  if (!isValidJalaaliDate(jy, jm, jd)) return null;
  return { jy, jm, jd };
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{
    size?: string | string[];
    user?: string | string[];
    from?: string | string[];
    to?: string | string[];
  }>;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card variant="default">
          <CardHeader>
            <CardTitle>دسترسی ندارید</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-muted">این صفحه فقط برای مدیر است.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const params = await searchParams;
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  // Page size: 10 default; an unknown value falls back to 10.
  const sizeParam = first(params.size);
  const pageSize = sizeParam && PAGE_SIZES.includes(sizeParam) ? sizeParam : "10";

  // User filter: only a user who actually exists. An unknown id is
  // ignored (no filter), so a stale bookmark never shows an empty
  // chip with no name.
  const users = await prisma.user.findMany({
    where: { active: true },
    orderBy: { fullName: "asc" },
    select: { id: true, fullName: true },
  });
  const userParam = first(params.user);
  const selectedUser = userParam ? users.find((u) => u.id === userParam) : undefined;
  const selectedUserId = selectedUser ? selectedUser.id : null;
  const selectedUserName = selectedUser ? selectedUser.fullName : null;

  // Date filter: Jalali "YYYY-MM-DD". A single day is from == to.
  // If only one end is given, the other defaults to it.
  const fromParam = parseJalaliParam(first(params.from));
  const toParam = parseJalaliParam(first(params.to));
  const dateFrom = fromParam ?? toParam;
  const dateTo = toParam ?? fromParam;

  const where: {
    userId?: string;
    createdAt?: { gte: Date; lt: Date };
  } = {};
  if (selectedUserId) where.userId = selectedUserId;
  if (dateFrom && dateTo) {
    const start = jalaliDayRangeUTC(dateFrom.jy, dateFrom.jm, dateFrom.jd).start;
    const end = jalaliDayRangeUTC(dateTo.jy, dateTo.jm, dateTo.jd).end;
    where.createdAt = { gte: start, lt: end };
  }

  const total = await prisma.auditLog.count({ where });
  const rows = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...(pageSize === "all" ? {} : { take: Number(pageSize) }),
    include: { user: { select: { fullName: true } } },
  });

  const entries: LogEntry[] = rows.map((entry) => ({
    id: entry.id,
    title: `${entry.user.fullName} - ${actionLabel(entry.action)}`,
    details: entry.details,
    dateTime: formatJalaliDateTimeLatin(entry.createdAt),
  }));

  return (
    <ActivityLogClient
      entries={entries}
      total={total}
      pageSize={pageSize}
      users={users}
      selectedUserId={selectedUserId}
      selectedUserName={selectedUserName}
      dateFrom={dateFrom}
      dateTo={dateTo}
    />
  );
}
