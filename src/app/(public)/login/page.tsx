// src/app/(public)/login owns the login form only.
// It posts mobile and password to /api/auth/login and shows Persian errors.
// Restyled in Phase 1 with Design System v3.2 tokens and components/ui.
// The auth logic is unchanged.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormError } from "@/components/ui/alert";
import { Input, Label, TextField } from "@/components/ui/text-field";

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password }),
    });
    setBusy(false);
    if (!res.ok) {
      if (res.status === 429) {
        const data = (await res.json().catch(() => null)) as {
          retryAfterSeconds?: number;
        } | null;
        const minutes = Math.max(
          1,
          Math.ceil((data?.retryAfterSeconds ?? 900) / 60),
        );
        setError(
          `حساب شما به علت تلاش‌های ناموفق قفل شده است. لطفا ${minutes} دقیقه دیگر تلاش کنید.`,
        );
        return;
      }
      if (res.status === 503) {
        // Q-02: a database or server failure is not a wrong password.
        // The message is the owner-approved text, exactly as given.
        setError("مشکلی موقت پیش آمده است. لطفا دوباره تلاش کنید.");
        return;
      }
      setError("موبایل یا رمز درست نیست.");
      return;
    }
    router.push("/panel");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Card variant="default">
        <CardHeader>
          <CardTitle>ورود به پنل</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4" noValidate>
            <TextField value={mobile} onChange={setMobile}>
              <Label>موبایل</Label>
              <Input dir="ltr" placeholder="09120000000" />
            </TextField>
            <TextField value={password} onChange={setPassword}>
              <Label>رمز عبور</Label>
              <Input dir="ltr" type="password" />
            </TextField>
            {error && <FormError title={error} />}
            <Button type="submit" variant="primary" isPending={busy}>
              ورود
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted">
            حساب تست مدیر: 09120000000 - فقط برای تست لوکال.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
