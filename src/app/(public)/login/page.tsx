// src/app/(public)/login owns the login form only.
// Restyled 2026-11-10 from the owner's Figma (Admin - login SVGs,
// desktop, desktop error, mobile): teal page, centered white card,
// per-field errors below the field, success toast on login.
// It posts mobile and password to /api/auth/login and shows Persian
// errors. The auth logic (401/429/503 mapping) is unchanged.
// The test-account note was removed: the real manager account is
// created by scripts/seed-admin.ts, not by a note on the page.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { FormError } from "@/components/ui/alert";
import { LoginToast } from "@/components/ui/login-toast";

const MOBILE_RE = /^09\d{9}$/;

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function onMobileChange(value: string) {
    setMobile(value);
    if (mobileError) setMobileError("");
  }

  function onPasswordChange(value: string) {
    setPassword(value);
    if (passwordError) setPasswordError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    let valid = true;
    if (!MOBILE_RE.test(mobile.trim())) {
      setMobileError("شماره موبایل نادرست است");
      valid = false;
    } else {
      setMobileError("");
    }
    if (!password) {
      setPasswordError("رمز عبور نادرست است");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;
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
    // Show the success toast, then go to the panel. The toast is
    // visible for 1.5s; its own 4000ms auto-dismiss covers the case
    // where the redirect does not happen.
    setShowToast(true);
    setTimeout(() => {
      router.push("/panel");
      router.refresh();
    }, 1500);
  }

  return (
    <main className="relative flex h-screen h-dvh flex-col items-center justify-center overflow-hidden bg-accent px-4 py-4 max-md:px-[25px]">
      <div className="w-[400px] max-w-full rounded-[24px] border border-border bg-background px-[17px] pb-[17px] pt-9 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <h1 className="text-center text-2xl font-bold text-foreground">
          ورود به پنل
        </h1>
        <p className="mt-3 text-center text-sm text-[#333333]">
          شماره موبایل و رمز عبور خود را وارد کنید.
        </p>
        <form onSubmit={submit} className="mt-10" noValidate>
          <div>
            <label
              htmlFor="mobile"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              شماره موبایل
            </label>
            <input
              id="mobile"
              type="tel"
              dir="ltr"
              placeholder="09120000000"
              autoComplete="tel"
              value={mobile}
              onChange={(e) => onMobileChange(e.target.value)}
              className="input h-10 w-full border border-border bg-surface-2 px-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {mobileError && (
              <p className="mt-1 flex items-center gap-1 text-xs text-danger">
                <CircleAlert size={14} aria-hidden="true" />
                <span>{mobileError}</span>
              </p>
            )}
          </div>
          <div className="mt-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="input h-10 w-full border border-border bg-surface-2 px-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {passwordError && (
              <p className="mt-1 flex items-center gap-1 text-xs text-danger">
                <CircleAlert size={14} aria-hidden="true" />
                <span>{passwordError}</span>
              </p>
            )}
          </div>
          {error && (
            <div className="mt-4">
              <FormError title={error} />
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="mt-9 flex h-10 w-full items-center justify-center gap-2 rounded-[16px] bg-accent text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            <span>وارد شوید</span>
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
        </form>
      </div>
      <p className="absolute bottom-[11px] left-[calc(50%-156px)] h-3 w-[312px] text-right font-['Inter',sans-serif] text-[10px] font-light leading-3 text-surface-2">
        A Product By{" "}
        <a
          href="https://arshiasdrl.ir"
          target="_blank"
          rel="noopener"
          className="text-surface-2 no-underline"
        >
          Arshiasdrl
        </a>{" "}
        | Thoughtfully designed. Intentionally built.
      </p>
      <LoginToast message="ورود با موفقیت انجام شد." show={showToast} />
    </main>
  );
}
