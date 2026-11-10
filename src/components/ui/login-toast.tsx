// components/ui/login-toast.tsx: success toast for the login page only.
// The HeroUI Toast.Provider placement is a single static value, so it
// cannot be bottom-right on desktop and top-center on mobile. This small
// local toast positions itself with responsive Tailwind classes instead.
// Style matches the Design System toast (dark #1E1E1C background, white
// text, radius 12px, 4000ms auto-dismiss) and the owner's direction:
// desktop bottom-right, mobile top-center. No new library is added.

"use client";

import { useEffect, useState } from "react";

export function LoginToast({
  message,
  show,
}: {
  message: string;
  show: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[12px] bg-foreground px-4 py-3 text-sm text-accent-foreground shadow-[0_8px_24px_rgba(0,0,0,0.2)] max-md:bottom-auto max-md:left-1/2 max-md:right-auto max-md:top-4 max-md:max-w-[calc(100vw-2rem)] max-md:-translate-x-1/2 max-md:justify-center"
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full bg-success"
        aria-hidden="true"
      />
      <span>{message}</span>
    </div>
  );
}
