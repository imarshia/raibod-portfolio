// src/app/(panel)/panel: Raybod panel shell (Phase 1).
// Server-side session and role checks are unchanged. The dashboard content
// is a shell only: no real KPIs, because those need business data from
// later phases. Restyled with Design System v3.2 tokens and components/ui.

import { redirect } from "next/navigation";
import { getSessionUser, ROLE_LABELS } from "@/lib/auth";
import { todayJalaliLatin } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function PanelPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  const isAdmin = user.role === "ADMIN";
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="font-bold">پنل رایبد</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="danger">
                خروج
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card variant="default">
          <CardHeader>
            <CardTitle>پنل رایبد</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              خوش آمدید {user.fullName} - نقش: {ROLE_LABELS[user.role]}
            </p>
            <p className="mt-2 text-body-sm text-muted">
              امروز به جلالی: <span dir="ltr">{todayJalaliLatin()}</span>
            </p>
            <p className="mt-4 text-body-sm text-muted">
              داشبورد در فازهای بعد ساخته می شود. این صفحه فقط پوسته پنل است.
            </p>
          </CardContent>
        </Card>

        {isAdmin ? (
          <Card variant="default" data-testid="admin-section" className="mt-4">
            <CardHeader>
              <CardTitle>بخش مدیر</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm">این بخش فقط برای نقش ADMIN دیده می شود.</p>
            </CardContent>
          </Card>
        ) : (
          <Card variant="default" data-testid="non-admin-note" className="mt-4">
            <CardHeader>
              <CardTitle>دسترسی محدود</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm">
                شما مدیر نیستید، پس بخش مدیر برای شما نشان داده نمی شود.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
