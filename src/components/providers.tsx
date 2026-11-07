// src/components/providers owns the client providers for the app.
// HeroUI v3 has no HeroUIProvider. We use I18nProvider with fa-IR so
// React Aria components render Persian labels and dates correctly.

"use client";

import { I18nProvider } from "@heroui/react";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <I18nProvider locale="fa-IR">{children}</I18nProvider>;
}
