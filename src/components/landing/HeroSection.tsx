// src/components/landing/HeroSection.tsx — Raibod landing hero, built exactly
// from Arshia's Figma hero frame (raibod-hero-section.svg, 1440x884, received
// 2026-11-09). Spec, all values measured from the SVG/render:
// - Canvas 1440x884; final header sits above this section (SiteHeader).
// - Title (one line, centered): 40px Vazirmatn ExtraBold (DS display 40);
//   «رایبد؛» in accent #13847F, the rest in foreground #1E1E1C. Glyph box
//   y 190-230 (41 tall), 554 wide. (First build used 48px; the ink
//   measured 668 wide against Figma's 554, so the size was corrected to
//   40px. Frame is 1440 wide, content 1312 — Arshia, 2026-11-09.)
// - Subtitle (one line, centered): 16px regular, #333333. Glyph box
//   y 253-270. Text: «در عینک رایبد، معاینه چشم، انتخاب فریم و ساخت عدسی
//   در یک جا انجام می‌شود. نوبت خود را آنلاین رزرو کنید.»
// - CTAs (y 308-348, 40 tall, gap 8, centered): teal 164x40 rx 16
//   #13847F, white 14px semibold «رزرو نوبت» + Lucide Calendar 20px;
//   grey 164x40 rx 16 #EBEBEC, #0D5C59 14px semibold «تماس با ما».
//   RTL order: teal first (right), grey second (left).
// - Photo band (y 394-884, 490 tall, full width): the building photo
//   (hero-building.jpg, 929x1080), cover, center — this reproduces
//   Figma's pattern crop exactly (uniform 1.55x scale, vertical center).
//   LENS EFFECT (Arshia, 2026-11-09): the building is blurred around the
//   glasses and sharp only through the lens openings (mask cut from the
//   frame PNG's own alpha; see hero-section.css). White fades 110px at
//   the top (white to transparent) and bottom (transparent to white)
//   are kept (Figma). The glasses (eyewear-frame.png, the same file as
//   the scroll experience) 830x273 at (305, 503), centered.
// - PARALLAX (Arshia, 2026-11-09): the building moves behind the FIXED
//   glasses as the page scrolls (his choice over the glasses moving).
//   One passive scroll listener + requestAnimationFrame writes a single
//   CSS var --hero-progress 0..1 (from this section's scroll position)
//   on the <section>; the band layers shift the building down by up to
//   200px desktop / 60px mobile (see hero-section.css). No React state
//   per scroll. Skipped under prefers-reduced-motion.
// - Mobile is an adaptation (Figma supplied desktop only): title 32px,
//   band 300px, glasses 92vw, fades 60px, CTAs stay side by side.

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import "./hero-section.css";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;
    function update() {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress =
        rect.height > 0
          ? Math.min(1, Math.max(0, -rect.top / rect.height))
          : 0;
      el.style.setProperty("--hero-progress", progress.toFixed(4));
    }
    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="معرفی عینک رایبد">
      <h1 className="mt-[78px] text-center text-[28px] font-extrabold leading-[1.2] text-foreground md:mt-[82px] md:text-[40px]">
        <span className="text-accent">رایبد؛</span> عینکی که برای چشم شماست
      </h1>

      <p className="mt-3 text-center text-[15px] leading-[1.8] text-[#333333] md:text-base">
        در عینک رایبد، معاینه چشم، انتخاب فریم و ساخت عدسی در یک جا انجام
        می‌شود. نوبت خود را آنلاین رزرو کنید.
      </p>

      <div className="mt-[33px] flex justify-center gap-2">
        <Link
          href="/booking"
          className="flex h-10 w-[164px] items-center justify-center gap-2 rounded-2xl bg-accent text-sm font-semibold text-white"
        >
          <Calendar size={20} strokeWidth={2} />
          رزرو نوبت
        </Link>
        <Link
          href="#contact"
          className="flex h-10 w-[164px] items-center justify-center rounded-2xl bg-[#EBEBEC] text-sm font-semibold text-accent-text"
        >
          تماس با ما
        </Link>
      </div>

      <div className="relative mt-[46px] h-[300px] w-full overflow-hidden md:h-[490px]">
        <div className="hero-band-blur" aria-hidden="true" />
        <div className="hero-band-sharp" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-white to-transparent md:h-[110px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-white to-transparent md:h-[110px]"
        />
        <div className="absolute left-1/2 top-[60px] aspect-[1864/613] w-[min(830px,92vw)] -translate-x-1/2 md:top-[109px]">
          <Image
            src="/images/eyewear-frame.png"
            alt="عینک رایبد"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
