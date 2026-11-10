// app/providers.tsx is the single combined client provider file.
// Design System v3.2 sections 0.3 and 6: theme is managed only with
// next-themes (attribute="class"). Light mode only, by owner decision
// 2026-11-09 (the dark/light toggle was removed from the landing page):
// defaultTheme="light", enableSystem={false}, and forcedTheme="light"
// so the site always renders light, even if a "dark" value was stored
// earlier under storageKey "raibod-theme" (a stored value would win
// over defaultTheme on its own). Order, confirmed in code:
// NextThemesProvider outermost (it owns the class on <html>), then
// I18nProvider (locale context for React Aria components), then
// Toast.Provider. Both orders render, but this order keeps theme
// control outermost.

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
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
      disableTransitionOnChange
      storageKey="raibod-theme"
    >
      <I18nProvider>
        <Toast.Provider placement={isMobile ? "top" : "bottom end"} />
        {children}
      </I18nProvider>
    </NextThemesProvider>
  );
}
