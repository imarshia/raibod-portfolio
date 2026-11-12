// src/components/panel/PanelSidebar.tsx: the panel sidebar and menu.
// One component renders both the desktop sidebar and the mobile drawer:
// the parent passes the container classes (positioning, visibility),
// the menu markup is identical in both.
//
// The menu is defined ONCE, in the MENU_ITEMS array below: one entry
// per item, each with label, icon, and either an href (a link) or the
// logout action (a form POST to /api/auth/logout). dividerBefore
// renders the 1px divider above that item. To add or remove an item,
// edit this one array; both the sidebar and the drawer render from it.
//
// The active item is dynamic: whichever menu item matches the current
// route gets the selected styling (Figma: #E6E8E8 background, accent
// text/icon, 2px accent bar on the right edge, radius 8px 0 0 8px).
// The right corners are 0 and the left corners are 8; this is
// deliberate, verified against the Figma SVG path, and must not
// become a uniform radius. Icons are lucide-react (24x24, stroke 2,
// currentColor).

"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChartSpline,
  Database,
  LayoutDashboard,
  LogOut,
  User,
  UserRoundPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type MenuLinkItem = {
  type: "link";
  label: string;
  href: string;
  icon: LucideIcon;
  dividerBefore?: boolean;
};

type MenuLogoutItem = {
  type: "logout";
  label: string;
  icon: LucideIcon;
};

type MenuItem = MenuLinkItem | MenuLogoutItem;

const MENU_ITEMS: MenuItem[] = [
  { type: "link", label: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
  { type: "link", label: "نوبت‌ها", href: "/dashboard/appointments", icon: User },
  { type: "link", label: "مراجعه کنندگان", href: "/dashboard/clients", icon: Users },
  { type: "link", label: "حسابداری", href: "/dashboard/accounting", icon: ChartSpline },
  { type: "link", label: "انبارداری", href: "/dashboard/inventory", icon: Database },
  {
    type: "link",
    label: "مدیریت کاربران",
    href: "/dashboard/users",
    icon: UserRoundPlus,
    dividerBefore: true,
  },
  { type: "link", label: "لاگ‌ها", href: "/dashboard/activity", icon: Activity },
  { type: "logout", label: "خروج از حساب", icon: LogOut },
];

// An item is selected when the pathname equals its href, or is a
// child route under it (so /dashboard/activity selects لاگ‌ها).
// /dashboard selects داشبورد only on an exact match, so a child
// route such as /dashboard/activity does not also select it.
function isItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const ITEM_BASE =
  "flex h-11 w-full items-center px-6 py-2 text-[#333333] transition-colors";
const ITEM_SELECTED =
  "rounded-[8px_0_0_8px] bg-[#E6E8E8] text-accent shadow-[inset_-2px_0_0_var(--accent)]";

// The mobile drawer uses a 4px icon-text gap, 14px font and 20px
// icons; the desktop sidebar uses 8px gap, 16px font and 24px icons
// (Figma). The gap/font/icon are props so the menu stays defined once.
function PanelMenu({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const gap = compact ? "gap-1" : "gap-2";
  const text = compact ? "text-sm leading-6" : "text-base leading-7";
  const iconSize = compact ? 20 : 24;
  const iconClass = compact ? "h-5 w-5 shrink-0" : "h-6 w-6 shrink-0";
  return (
    <nav className="flex flex-1 flex-col gap-4">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const divider = item.type === "link" && item.dividerBefore && (
          <div key={`divider-${item.href}`} className="h-px w-full bg-border" role="separator" />
        );
        if (item.type === "logout") {
          return (
            <form key="logout" action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className={`${ITEM_BASE} ${gap} ${text} cursor-pointer text-danger hover:text-danger`}
              >
                <Icon size={iconSize} strokeWidth={2} className={iconClass} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            </form>
          );
        }
        const active = isItemActive(pathname, item.href);
        return (
          <Fragment key={item.href}>
            {divider}
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`${ITEM_BASE} ${gap} ${text} ${active ? ITEM_SELECTED : "hover:text-accent-hover"}`}
            >
              <Icon size={iconSize} strokeWidth={2} className={iconClass} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </Fragment>
        );
      })}
    </nav>
  );
}

// className carries the container positioning: the desktop sidebar
// (300px, full height, border on the edge facing main) or the mobile
// drawer (fixed, slides in from the right). asideLabel is set only
// for the drawer, which the task requires to carry aria-label "منو".
// compact renders the mobile 4px icon-text gap, 14px font and 20px
// icons; desktop uses 8px gap, 16px font and 24px icons.
// onClose renders the close button INSIDE the drawer (Figma: the
// CloseButton is part of the drawer SVG, 24x24, radius 12, left
// 17px, top 24px, X icon 16px, 1.5px stroke). It is only set for
// the drawer; the desktop sidebar has no close button.
export function PanelSidebar({
  className = "",
  asideLabel,
  compact = false,
  onClose,
}: {
  className?: string;
  asideLabel?: string;
  compact?: boolean;
  onClose?: () => void;
}) {
  return (
    <aside aria-label={asideLabel} className={className}>
      {onClose && (
        <button
          type="button"
          aria-label="بستن منو"
          onClick={onClose}
          className="absolute end-[17px] top-[24px] z-10 flex h-6 w-6 items-center justify-center rounded-[12px] bg-[#EBEBEC] text-foreground"
        >
          <X size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}
      <div className="mb-10 flex h-14 justify-center">
        <Image
          src="/images/raibod-logo.png"
          alt="عینک رایبد"
          width={76}
          height={56}
          className="h-14 w-auto"
          priority
        />
      </div>
      <PanelMenu compact={compact} />
      <p className="pt-3 text-center text-[10px] leading-4 text-muted">
        A Product By Arshiasdrl
      </p>
    </aside>
  );
}
