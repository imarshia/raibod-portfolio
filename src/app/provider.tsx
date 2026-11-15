// app/provider.tsx owns the I18nProvider with a fixed Persian locale.
// Design System v3.3 section 0.2: no HeroUIProvider in HeroUI v3.
// The locale is fixed "fa-u-nu-latn" (Arshia's decision, 2026-11-07):
// the Jalali calendar stays, but date digits render Latin. Verified:
// Intl.DateTimeFormat("fa-u-nu-latn").resolvedOptions() gives calendar
// "persian" and numberingSystem "latn", and DateFormatter with this
// locale formats 2026-11-07 as 1405/08/16. The plain "fa" locale gave
// Persian digits in DateField, which the Design System does not want.

"use client";

import { I18nProvider as HeroUII18nProvider } from "@heroui/react";
import type { ReactNode } from "react";

export function I18nProvider({ children }: { children: ReactNode }) {
  return <HeroUII18nProvider locale="fa-u-nu-latn">{children}</HeroUII18nProvider>;
}
