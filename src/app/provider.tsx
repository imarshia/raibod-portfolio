// app/provider.tsx owns the I18nProvider with a fixed Persian locale.
// Design System v3.2 section 0.2: no HeroUIProvider in HeroUI v3.
// The locale is fixed "fa" (not from Accept-Language). Verified in code:
// Intl.DateTimeFormat("fa").resolvedOptions().calendar is "persian", so the
// Jalali calendar system comes from this locale via @internationalized/date.

"use client";

import { I18nProvider as HeroUII18nProvider } from "@heroui/react";
import type { ReactNode } from "react";

export function I18nProvider({ children }: { children: ReactNode }) {
  return <HeroUII18nProvider locale="fa">{children}</HeroUII18nProvider>;
}
