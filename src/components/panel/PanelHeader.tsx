// src/components/panel/PanelHeader.tsx: the panel header.
// Desktop (97px): role label above "{fullName}؛ خوش آمدید" on the
// right, Jalali weekday + date and the bell on the left.
// Mobile (77px): hamburger + bell on the left, role label above the
// welcome text (16px bold) on the right, no date. The bell is
// decorative for now: there is no notification backend (the Figma
// comment defines its future trigger as a new online booking, in
// real time). Buttons are native elements, not HeroUI Button: the
// Figma geometry is exact 40x40 with a 16px bell radius, and the
// global .button override forces 12px on HeroUI buttons.

"use client";

import type { RefObject } from "react";
import { Bell, Menu } from "lucide-react";
import { todayJalaliHeaderLatin } from "@/lib/jalali";

type PanelHeaderProps = {
  user: { fullName: string; roleLabel: string };
  variant: "desktop" | "mobile";
  onMenuClick?: () => void;
  drawerOpen?: boolean;
  menuButtonRef?: RefObject<HTMLButtonElement | null>;
};

function BellButton() {
  return (
    <button
      type="button"
      aria-label="اعلان‌ها"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-[#EBEBEC] text-foreground"
    >
      <Bell size={24} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

export function PanelHeader({
  user,
  variant,
  onMenuClick,
  drawerOpen = false,
  menuButtonRef,
}: PanelHeaderProps) {
  const { weekday, date } = todayJalaliHeaderLatin();
  const roleLabel = user.roleLabel;

  if (variant === "mobile") {
    return (
      <header className="flex h-[77px] shrink-0 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            ref={menuButtonRef}
            aria-label="باز کردن منو"
            aria-expanded={drawerOpen}
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBEBEC] text-foreground"
          >
            <Menu size={24} strokeWidth={2} aria-hidden="true" />
          </button>
          <BellButton />
        </div>
        <div className="text-right">
          <p className="text-sm leading-6 text-[#333333]">{roleLabel}</p>
          <p className="text-base font-bold leading-6 text-foreground">
            {user.fullName}؛ خوش آمدید
          </p>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-[97px] shrink-0 items-center justify-between border-b border-border bg-background px-8">
      <div className="text-right">
        <p className="text-sm leading-6 text-[#333333]">{roleLabel}</p>
        <p className="text-xl font-bold leading-7 text-foreground">
          {user.fullName}؛ خوش آمدید
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-left text-sm leading-6 text-[#333333]">
          <p>{weekday}</p>
          <p>{date}</p>
        </div>
        <BellButton />
      </div>
    </header>
  );
}
