// app/providers.tsx is the single combined client provider file.
// Design System v3.4 sections 0.3 and 6: theme is managed only with
// next-themes (attribute="class"). Light + Dark, both required
// (portfolio decision, Arshia 2026-11-18; this supersedes the
// light-only decision 2026-11-09, which stays in force for the
// original Raibod repo): defaultTheme="system", enableSystem, and
// no forcedTheme, so the site follows the system theme by default
// and the toggle in the panel header can switch it. Order,
// confirmed in code: NextThemesProvider outermost (it owns the
// class on <html>), then I18nProvider (locale context for React
// Aria components), then Toast.Provider. Both orders render, but
// this order keeps theme control outermost.

"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toast } from "@heroui/react";
import type { ReactNode } from "react";
import { I18nProvider } from "./provider";

export function Providers({ children }: { children: ReactNode }) {
  // Toast placement is responsive: bottom-right on desktop, top-center
  // on mobile (below the Tailwind md breakpoint, 768px). The placement
  // is a prop, so it can change with the viewport; a single static
  // value cannot cover both. This keeps the standard HeroUI Toast
  // (no custom toast component) while honouring the owner's direction.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="raibod-theme"
    >
      <I18nProvider>
        <Toast.Provider placement={isMobile ? "top" : "bottom start"} />
        {children}
      </I18nProvider>
    </NextThemesProvider>
  );
}
