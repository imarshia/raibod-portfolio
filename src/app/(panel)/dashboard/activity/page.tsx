// src/app/(panel)/dashboard/activity: the activity log (AuditLog).
// Management only: the manager sees what employees do, including
// every edit. Server-side session and role checks. Non-admin users
// see an access-denied message (no redirect). The log is
// append-only: there is no delete button and no hard delete.
// Entries are newest first, 50 per page. Dates are Jalali with
// time, Latin digits, dir="ltr" (Design System v3.2 section 2).
// The page renders inside the panel shell (sidebar + header) from
// the (panel) layout; it has no header of its own.

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { actionLabel } from "@/lib/audit";
import { formatJalaliDateTimeLatin } from "@/lib/jalali";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ActivityPage() {
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
            <p className="text-body-sm text-muted">
              این صفحه فقط برای مدیر است.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { fullName: true } } },
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card variant="default">
        <CardHeader>
          <CardTitle>لاگ فعالیت</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-body-sm text-muted">
              هنوز فعالیتی ثبت نشده است.
            </p>
          ) : (
            <ul>
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {entry.user.fullName} - {actionLabel(entry.action)}
                    </p>
                    {entry.details && (
                      <p className="mt-1 text-body-sm text-muted">
                        {entry.details}
                      </p>
                    )}
                  </div>
                  <span
                    dir="ltr"
                    className="shrink-0 text-body-sm text-muted tnum"
                  >
                    {formatJalaliDateTimeLatin(entry.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
