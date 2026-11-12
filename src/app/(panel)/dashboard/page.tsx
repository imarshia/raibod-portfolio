// src/app/(panel)/dashboard: the panel entry point.
// No session: the login form renders inline here (no redirect to
// /login). With a session: the body is blank; the shell (sidebar +
// header) comes from the (panel) layout. No dashboard content is
// designed yet, so the page renders nothing of its own.

import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/ui/login-form";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    return <LoginForm redirectTo="/dashboard" />;
  }
  return null;
}
