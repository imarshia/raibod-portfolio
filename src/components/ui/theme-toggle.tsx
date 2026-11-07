// components/ui/theme-toggle.tsx: Raibod theme toggle (Design System v3.2 section 6).
// Lucide Sun in Dark / Moon in Light, size 20, in the topbar.
// useTheme comes from next-themes (not from HeroUI). Rendering is deferred
// until after mount, because the active theme is not known in SSR.

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button isIconOnly variant="ghost" aria-label="تغییر تم" isDisabled>
        <Sun size={20} />
      </Button>
    );
  }

  const dark = resolvedTheme === "dark";
  return (
    <Button
      isIconOnly
      variant="ghost"
      aria-label={dark ? "تم روشن" : "تم تیره"}
      onPress={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}
