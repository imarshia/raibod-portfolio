// app/providers.tsx is the single combined client provider file.
// Design System v3.2 sections 0.3 and 6: theme is managed only with
// next-themes (attribute="class", defaultTheme="system", enableSystem).
// Order, confirmed in code: NextThemesProvider outermost (it owns the class
// on <html>), then I18nProvider (locale context for React Aria components),
// then Toast.Provider. Both orders render, but this order keeps theme
// control outermost and was verified with the theme-toggle test.

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toast } from "@heroui/react";
import type { ReactNode } from "react";
import { I18nProvider } from "./provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        <Toast.Provider />
        {children}
      </I18nProvider>
    </NextThemesProvider>
  );
}
