// src/app/(public)/login owns the login form only.
// It posts mobile and password to /api/auth/login and shows Persian errors.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Input, Label, TextField } from "@heroui/react";

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
      setError("موبایل یا رمز درست نیست.");
      return;
    }
    router.push("/panel");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardContent>
          <h1 className="mb-4 text-xl font-bold">ورود به پنل</h1>
          <form onSubmit={submit} className="grid gap-4" noValidate>
            <TextField value={mobile} onChange={setMobile}>
              <Label>موبایل</Label>
              <Input dir="ltr" placeholder="09120000000" />
            </TextField>
            <TextField value={password} onChange={setPassword}>
              <Label>رمز عبور</Label>
              <Input dir="ltr" type="password" />
            </TextField>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" variant="primary" isDisabled={busy}>
              ورود
            </Button>
          </form>
          <p className="mt-4 text-xs text-default-500">
            حساب تست مدیر: 09120000000 با رمز Admin1234! - فقط برای تست لوکال.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
