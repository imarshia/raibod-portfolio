// src/components/panel/PanelLayout.tsx: the panel shell.
// Desktop (>= 1024px): sidebar on the right + main column with the
// header; the page renders in the blank body below the header.
// Mobile (< 1024px): header + body; the hamburger opens the drawer
// (same sidebar, slides in from the right over a 20% black backdrop).
// Owns the drawer state: scroll lock while open, Escape closes it
// and returns focus to the hamburger, resizing to desktop closes it.
// The shell is light-only and uses Design System tokens throughout.

"use client";

import { useEffect, useRef, useState } from "react";
import { PanelHeader } from "./PanelHeader";
import { PanelSidebar } from "./PanelSidebar";

const SIDEBAR_CONTAINER =
  "sticky top-0 flex h-dvh w-[300px] shrink-0 flex-col border-e border-border bg-background px-4 pb-3 pt-6";

const DRAWER_CONTAINER =
  "fixed inset-y-0 start-0 z-50 flex w-[300px] max-w-[85vw] flex-col bg-background px-4 pb-3 pt-6 transition-transform duration-300 ease-out lg:hidden";

export function PanelLayout({
  user,
  children,
}: {
  user: { fullName: string; roleLabel: string };
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Body scroll locks while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Resizing to desktop closes the drawer (landing Q-04/R-08 pattern).
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setDrawerOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Escape closes the drawer and returns focus to the hamburger.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop: sidebar + main column with header. */}
      <div className="hidden min-h-screen lg:flex">
        <PanelSidebar className={SIDEBAR_CONTAINER} />
        <div className="flex min-w-0 flex-1 flex-col">
          <PanelHeader user={user} variant="desktop" />
          <main className="flex-1 bg-background">{children}</main>
        </div>
      </div>

      {/* Mobile: header + body. */}
      <div className="flex min-h-screen flex-col lg:hidden">
        <PanelHeader
          user={user}
          variant="mobile"
          onMenuClick={() => setDrawerOpen(true)}
          drawerOpen={drawerOpen}
          menuButtonRef={menuButtonRef}
        />
        <main className="flex-1 bg-background">{children}</main>
      </div>

      {/* Mobile drawer: backdrop, drawer, close button. */}
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <PanelSidebar
        asideLabel="منو"
        compact
        onClose={closeDrawer}
        className={`${DRAWER_CONTAINER} ${drawerOpen ? "translate-x-0" : "translate-x-[105%]"}`}
      />
    </div>
  );
}
