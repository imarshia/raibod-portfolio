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
  "flex h-11 w-[267px] items-center gap-2 px-6 py-2 text-base leading-7 text-[#333333] transition-colors";
const ITEM_SELECTED =
  "rounded-[8px_0_0_8px] bg-[#E6E8E8] text-accent shadow-[inset_-2px_0_0_var(--accent)]";

function PanelMenu() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-4">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const divider = item.type === "link" && item.dividerBefore && (
          <div key={`divider-${item.href}`} className="h-px w-[267px] bg-border" role="separator" />
        );
        if (item.type === "logout") {
          return (
            <form key="logout" action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className={`${ITEM_BASE} cursor-pointer text-danger hover:text-danger`}
              >
                <Icon size={24} strokeWidth={2} className="h-6 w-6 shrink-0" aria-hidden="true" />
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
              className={`${ITEM_BASE} ${active ? ITEM_SELECTED : "hover:text-accent-hover"}`}
            >
              <Icon size={24} strokeWidth={2} className="h-6 w-6 shrink-0" aria-hidden="true" />
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
export function PanelSidebar({
  className = "",
  asideLabel,
}: {
  className?: string;
  asideLabel?: string;
}) {
  return (
    <aside aria-label={asideLabel} className={className}>
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
      <PanelMenu />
      <p className="pt-3 text-center text-[10px] leading-4 text-muted">
        A Product By Arshiasdrl
      </p>
    </aside>
  );
}
