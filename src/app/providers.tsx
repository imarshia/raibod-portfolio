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

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toast } from "@heroui/react";
import type { ReactNode } from "react";
import { I18nProvider } from "./provider";

export function Providers({ children }: { children: ReactNode }) {
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
        <Toast.Provider />
        {children}
      </I18nProvider>
    </NextThemesProvider>
  );
}
