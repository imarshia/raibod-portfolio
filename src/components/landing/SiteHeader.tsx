// src/components/landing/SiteHeader.tsx — Raibod final landing header,
// built from Arshia's Figma SVGs (email 2026-11-09 04:08: desktop, mobile
// close, mobile expanded) via the approved standalone
// ~/workspace/your_files/raibod-header-final.html. Approved by Arshia
// 2026-11-09 («تاییده»); this replaces the earlier pill header.
// Desktop (1024px and up): full-width bar, 80px content + 4px padding top
// and bottom (88 total), sticky, content 1312px, logo right 76x56, nav
// center (14px, gap 40), CTA 92x40 rx16 left, theme toggle 40x40 rx16.
// Mobile (below 1024px): fixed bar, 56px + 8px padding (72 total), logo
// right 54x40, hamburger + theme toggle left; the menu is a modal panel
// (page background, no colour change on open, bottom rx16) over a dark
// backdrop, with body scroll locked while open.
// Both headers hide on scroll down and show on scroll up (0.35s slide),
// and get a 1px bottom border + faint shadow whenever scrolled
// (scrollY > 0); clean at the very top (like negah.agency).
// Theme: next-themes owns the theme (see providers.tsx); the toggle adds
// the circular reveal from the toggle button via the View Transitions API,
// with an instant fallback. The dark accent is exactly the light accent
// code (#C2410C, Arshia's decision); see globals.css. Design System
// v3.4 (portfolio): Light + Dark, toggle restored 2026-11-18 after the
// light-only removal (aad8cd0, owner decision 2026-11-09).
// The خدمات chevron is a static icon: no dropdown content was designed
// in Figma, so it opens nothing. The CTA goes to /booking (locked
// decision); there is no login button (the panel lives on
// panel.raibod.com).

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import "./site-header.css";

const NAV = [
  { label: "خانه", href: "#top", active: true },
  { label: "خدمات", href: "#services", active: false, chevron: true },
  { label: "درباره ما", href: "#about", active: false },
  { label: "تماس با ما", href: "#contact", active: false },
];

/* Icons drawn from the Figma SVG path data (the sample's exact paths):
   moon is Figma's crescent, sun is Lucide-style, chevron is the 8x4
   Figma chevron, burger/X are the Figma menu icons. All 12x12,
   stroke 1.33333, round caps and joins. */
function MoonIcon() {
  return (
    <svg
      className="icon-moon"
      viewBox="-1 -1 14 14"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11.991 6.3239C11.929 7.4814 11.532 8.5959 10.85 9.5329C10.168 10.4698 9.228 11.1891 8.146 11.6036C7.064 12.0182 5.884 12.1104 4.75 11.869C3.617 11.6276 2.577 11.063 1.758 10.2434C0.938 9.4238 0.373 8.3844 0.132 7.2507C-0.11 6.117 -0.018 4.9376 0.397 3.8552C0.811 2.7727 1.53 1.8334 2.467 1.1509C3.404 0.4684 4.519 0.0719 5.676 0.0093C5.946 -0.0054 6.087 0.3159 5.944 0.5446C5.465 1.3116 5.259 2.2185 5.362 3.1172C5.464 4.016 5.868 4.8535 6.507 5.4931C7.147 6.1327 7.985 6.5366 8.883 6.6389C9.782 6.7413 10.689 6.536 11.456 6.0566C11.685 5.9133 12.006 6.0539 11.991 6.3239Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      className="icon-sun"
      viewBox="-1 -1 14 14"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2.8" />
      <path d="M6 0.6V1.8M6 10.2V11.4M0.6 6H1.8M10.2 6H11.4M2.18 2.18L3.03 3.03M8.97 8.97L9.82 9.82M9.82 2.18L8.97 3.03M3.03 8.97L2.18 9.82" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="-1 -1 10 6"
      width="8"
      height="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M0 0L4 4L8 0" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg
      className="icon-burger"
      viewBox="-1 -1 14 14"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M0 1.33H12M0 6H12M0 10.67H12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="icon-close"
      viewBox="-1 -1 10 10"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 0L0 8M0 0L8 8" />
    </svg>
  );
}

export default function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const desktopRef = useRef<HTMLElement | null>(null);
  const mobileRef = useRef<HTMLElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const menuOpenRef = useRef(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  /* Body scroll locks while the mobile menu is open. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* One passive scroll listener + rAF: hide/show on scroll direction and
     the scrolled border+shadow. No React state per scroll; the classes are
     toggled on the DOM nodes directly. Runs once on mount too, so a page
     that loads already scrolled gets the right state. */
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      const scrolled = y > 0;
      desktopRef.current?.classList.toggle("header-scrolled", scrolled);
      mobileRef.current?.classList.toggle("header-scrolled", scrolled);
      if (y > lastScrollY && y > 10) {
        desktopRef.current?.classList.add("header-hidden");
        if (!menuOpenRef.current) {
          mobileRef.current?.classList.add("header-hidden");
        }
      } else if (y < lastScrollY || y <= 10) {
        desktopRef.current?.classList.remove("header-hidden");
        mobileRef.current?.classList.remove("header-hidden");
      }
      lastScrollY = y;
      ticking = false;
    }
    function onScrollRequest() {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScrollRequest, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScrollRequest);
  }, []);

  /* The mobile menu closes when the viewport grows to desktop width.
     Close through setMenu, the single writer for the menu classes
     (STD-017): the old setMenuOpen(false) left the `open` class on the
     header after a resize round-trip (Q-04 / R-08). */
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMenu(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* The menu's `open` / `show` classes are toggled on the DOM nodes
     directly (never through the className prop): the scroll listener
     also writes classes on the same nodes (`header-scrolled`,
     `header-hidden`), and a React className rewrite would wipe those.
     Keeping the className prop constant means React never rewrites it. */
  function setMenu(open: boolean) {
    setMenuOpen(open);
    mobileRef.current?.classList.toggle("open", open);
    backdropRef.current?.classList.toggle("show", open);
    /* The menu can only be opened from the visible hamburger, but make
       sure the bar is shown whenever the menu opens. */
    if (open) mobileRef.current?.classList.remove("header-hidden");
  }

  /* Escape closes the mobile menu and returns focus to the toggle
     (R-05). Gated on menuOpen so the listener only exists while the
     menu is open. Closes through setMenu, the single writer for the
     menu classes (STD-017); no focus trap. */
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenu(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  /* Theme toggle with the circular reveal from the toggle button.
     next-themes owns the theme state; the class is also toggled on
     <html> synchronously inside the transition callback so the View
     Transition snapshot is correct (next-themes applies the same class
     in its own effect, so the two never disagree). */
  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const dark = !(mounted && resolvedTheme === "dark");
    const apply = () => {
      document.documentElement.classList.toggle("dark", dark);
      setTheme(dark ? "dark" : "light");
    };
    if (!document.startViewTransition || reduceMotionRef.current) {
      apply();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  const dark = mounted && resolvedTheme === "dark";
  const themeLabel = dark ? "تم روشن" : "تم تیره";

  return (
    <>
      <header ref={desktopRef} className="site-header">
        <div className="header-inner">
          <Link href="#top" aria-label="عینک رایبد" className="logo">
            <Image
              src="/images/raibod-logo.png"
              alt="عینک رایبد"
              width={76}
              height={56}
              priority
            />
          </Link>

          <nav className="header-nav" aria-label="منوی اصلی">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={item.active ? "active" : undefined}
              >
                {item.label}
                {item.chevron ? <ChevronIcon /> : null}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              aria-label={themeLabel}
              onClick={toggleTheme}
            >
              <MoonIcon />
              <SunIcon />
            </button>
            <Link href="/booking" className="cta">
              رزرو نوبت
            </Link>
          </div>
        </div>
      </header>

      <header ref={mobileRef} className="mobile-header" id="mobileHeader">
        <div className="mobile-bar">
          <Link href="#top" aria-label="عینک رایبد" className="logo">
            <Image
              src="/images/raibod-logo.png"
              alt="عینک رایبد"
              width={76}
              height={56}
            />
          </Link>
          <div className="mobile-actions">
            <button
              type="button"
              className="theme-toggle"
              aria-label={themeLabel}
              onClick={toggleTheme}
            >
              <MoonIcon />
              <SunIcon />
            </button>
            <button
              type="button"
              ref={toggleRef}
              className="menu-toggle"
              aria-label="منو"
              aria-expanded={menuOpen}
              aria-controls="mobileMenu"
              onClick={() => setMenu(!menuOpen)}
            >
              <BurgerIcon />
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="mobile-menu" id="mobileMenu">
          <div className="mobile-menu-inner">
            <nav aria-label="منوی موبایل">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={item.active ? "active" : undefined}
                  onClick={() => setMenu(false)}
                >
                  {item.label}
                  {item.chevron ? <ChevronIcon /> : null}
                </Link>
              ))}
            </nav>
            <Link
              href="/booking"
              className="cta"
              onClick={() => setMenu(false)}
            >
              رزرو نوبت
            </Link>
          </div>
        </div>
      </header>
      <div
        ref={backdropRef}
        className="menu-backdrop"
        aria-hidden="true"
        onClick={() => setMenu(false)}
      />
      {/* Reserves the fixed mobile bar's 72px in the landing flow (mobile
          only); the sample used body padding-top, which would leak to
          every route because <body> is shared. */}
      <div className="mobile-header-spacer" aria-hidden="true" />
    </>
  );
}
