// src/components/ui/login-form owns the login form.
// Extracted 2026-11-12 from src/app/(public)/login/page.tsx with no
// visual or behavior change. It is shared by two routes:
// - /login (thin wrapper page) and
// - /dashboard, which renders it inline when there is no session.
// Design is the owner's Figma (Admin - login SVGs, desktop, desktop
// error, mobile), restyled 2026-11-10: teal page, centered white card,
// per-field errors below the field, success toast on login.
// It posts mobile and password to /api/auth/login and shows Persian
// errors. The auth logic (401/429/503 mapping) is unchanged.
// The test-account note was removed: the real manager account is
// created by scripts/seed-admin.ts, not by a note on the page.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleAlert, Eye, EyeOff } from "lucide-react";
import { toast } from "@heroui/react";
import { FormError } from "@/components/ui/alert";

const MOBILE_RE = /^09\d{9}$/;

export function LoginForm({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
    if (!mobile.trim()) {
      setMobileError("پر کردن این فیلد الزامی هست");
      valid = false;
    } else if (!MOBILE_RE.test(mobile.trim())) {
      setMobileError("شماره موبایل نادرست است");
      valid = false;
    } else {
      setMobileError("");
    }
    if (!password) {
      setPasswordError("پر کردن این فیلد الزامی هست");
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
    // Show the standard HeroUI success toast, then go to the panel.
    // The toast auto-dismisses after 4000ms (DS); the redirect happens
    // after 1.5s so the user is not left waiting on the login page.
    // The Provider placement is responsive (bottom-right desktop,
    // top-center mobile), set in src/app/providers.tsx.
    toast.success("ورود با موفقیت انجام شد.");
    setTimeout(() => {
      router.push(redirectTo);
      router.refresh();
    }, 1500);
  }

  return (
    <main className="login-page relative flex h-screen h-dvh flex-col items-center justify-center overflow-hidden bg-accent px-4 py-4 max-md:px-[25px]">
      {/* Card shadow is the Figma login value (dy 8, blur 8, black 10%),
          not the DS modal shadow (0 8px 24px / 0.12) that was here
          before (Q-07). */}
      <div className="w-[400px] max-w-full rounded-[24px] border border-border bg-background px-[17px] pb-[17px] pt-9 shadow-[0_8px_8px_rgba(0,0,0,0.1)]">
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                autoComplete="current-password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="input h-10 w-full border border-border bg-surface-2 px-3 pr-10 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
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
    </main>
  );
}
