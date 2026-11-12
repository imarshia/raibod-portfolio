// src/app/(panel)/layout.tsx: the panel shell.
// Server component: reads the session. With a session, the Figma
// dashboard shell (sidebar + header) wraps the page. Without a
// session, children render bare, so the login form stays full-page
// with no shell around it.

import { getSessionUser, ROLE_LABELS } from "@/lib/auth";
import { PanelLayout } from "@/components/panel/PanelLayout";

export default async function PanelRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    return <>{children}</>;
  }
  // Figma shows "مدیر رایبد" for the admin role label in the header,
  // not the generic ROLE_LABELS "مدیر". Other roles use ROLE_LABELS.
  const roleLabel =
    user.role === "ADMIN" ? "مدیر رایبد" : ROLE_LABELS[user.role];
  return (
    <PanelLayout user={{ fullName: user.fullName, roleLabel }}>
      {children}
    </PanelLayout>
  );
}
