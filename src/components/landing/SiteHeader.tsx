// src/components/landing/SiteHeader.tsx — Raibod final landing header,
// built from Arshia's Figma SVGs (email 2026-11-09 04:08: desktop, mobile
// close, mobile expanded) via the approved standalone
// ~/workspace/your_files/raibod-header-final.html. Approved by Arshia
// 2026-11-09 («تاییده»); this replaces the earlier pill header.
// Desktop (1024px and up): full-width bar, 80px content + 4px padding top
// and bottom (88 total), sticky, content 1312px, logo right 76x56, nav
// center (14px, gap 40), CTA 92x40 rx16 left.
// Mobile (below 1024px): fixed bar, 56px + 8px padding (72 total), logo
// right 54x40, hamburger left; the menu is a modal panel
// (page background, no colour change on open, bottom rx16) over a dark
// backdrop, with body scroll locked while open.
// Both headers hide on scroll down and show on scroll up (0.35s slide),
// and get a 1px bottom border + faint shadow whenever scrolled
// (scrollY > 0); clean at the very top (like negah.agency).
// Theme: light mode only. The theme toggle was removed by owner decision
// 2026-11-09 (mode change is not logical for the landing page); the
// Figma header never had a toggle either. The provider forces light
// (see providers.tsx). The dark accent is exactly the light accent
// code (#13847F, Arshia's decision); see globals.css.
// The خدمات chevron is a static icon: no dropdown content was designed
// in Figma, so it opens nothing. The CTA goes to /booking (locked
// decision); there is no login button (the panel lives on
// panel.raibod.com).

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./site-header.css";

const NAV = [
  { label: "خانه", href: "#top", active: true },
  { label: "خدمات", href: "#services", active: false, chevron: true },
  { label: "درباره ما", href: "#about", active: false },
  { label: "تماس با ما", href: "#contact", active: false },
];

/* Icons drawn from the Figma SVG path data (the sample's exact paths):
   chevron is the 8x4 Figma chevron, burger/X are the Figma menu icons.
   All 12x12, stroke 1.33333, round caps and joins. */
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
  const [menuOpen, setMenuOpen] = useState(false);
  const desktopRef = useRef<HTMLElement | null>(null);
  const mobileRef = useRef<HTMLElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const menuOpenRef = useRef(false);

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
              priority
            />
          </Link>
          <div className="mobile-actions">
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
