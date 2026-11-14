// src/components/panel/PanelHeader.tsx: the panel header, one element.
// Desktop (>= 1024px, 97px): role label above "{fullName}؛ خوش آمدید" on the
// right, Jalali weekday + date and the bell on the left.
// Mobile (< 1024px, 77px): hamburger + bell on the left, role label above the
// welcome text on the right, no date.
// One header with responsive classes (R-10): the welcome text, the bell and
// the hamburger exist once in the DOM, so no test or screen reader ever
// sees them twice. The date shows on desktop only; the hamburger shows
// on mobile only. The visual result at each breakpoint is unchanged.
// Welcome block (Figma Frame 37, owner 2026-11-14, both viewports):
// flex column, gap 4px, items flex-end, justify center; role 12px
// weight 500 line-height 16px muted; name 16px weight 600
// line-height 24px foreground. (Replaces the earlier 14px/#333 role
// and the 20px desktop name.)
// RTL note: the Figma frame is LTR, where flex-end right-aligns.
// This page is RTL, so for a column container flex-end means the
// LEFT edge and flex-start means the RIGHT edge; items-start is
// what right-aligns the role line here (owner correction 2026-11-14,
// the role had drifted to the left).
// The bell is decorative for now: there is no notification backend (the Figma
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
      <Bell size={16} strokeWidth={1.33} aria-hidden="true" />
    </button>
  );
}

export function PanelHeader({
  user,
  onMenuClick,
  drawerOpen = false,
  menuButtonRef,
}: PanelHeaderProps) {
  const { weekday, date } = todayJalaliHeaderLatin();
  const roleLabel = user.roleLabel;

  return (
    <header className="flex h-[77px] shrink-0 items-center justify-between border-b border-border bg-background px-4 lg:h-[97px] lg:px-8">
      <div className="flex flex-col items-start justify-center gap-1 text-right">
        <p className="text-xs font-medium leading-4 text-muted">{roleLabel}</p>
        <p className="text-base font-semibold leading-6 text-foreground">
          {user.fullName}؛ خوش آمدید
        </p>
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden text-left text-sm leading-6 text-[#333333] lg:block">
          <p>{weekday}</p>
          <p>{date}</p>
        </div>
        <button
          type="button"
          ref={menuButtonRef}
          aria-label={drawerOpen ? "بستن منو" : "باز کردن منو"}
          aria-expanded={drawerOpen}
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-[#EBEBEC] text-foreground lg:hidden"
        >
          <Menu size={16} strokeWidth={1.33} aria-hidden="true" />
        </button>
        <BellButton />
      </div>
    </header>
  );
}
