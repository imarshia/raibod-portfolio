// src/app/(public)/login owns the login route only.
// The form itself lives in src/components/ui/login-form.tsx and is
// shared with /dashboard, which renders it inline when there is no
// session. Design is the owner's Figma (Admin - login SVGs, desktop,
// desktop error, mobile), restyled 2026-11-10: teal page, centered
// white card, per-field errors below the field, success toast on login.

import { LoginForm } from "@/components/ui/login-form";

export default function LoginPage() {
  return <LoginForm redirectTo="/dashboard" />;
}
