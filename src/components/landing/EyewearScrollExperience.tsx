// src/components/landing/EyewearScrollExperience.tsx
// Raibod landing scroll experience: a stationary landscape visible only
// through the two lens openings of an eyeglasses frame that travels
// vertically with the page scroll.
//
// How it works:
// - The section is 250svh tall (200svh on mobile) with a sticky
//   viewport-sized stage. Scrolling the section drives --progress 0..1.
// - The landscape layer is a stationary cover background on an inset-0
//   element. Its CSS mask (cut from the frame PNG's own alpha channel)
//   is positioned at --gy, the same offset the frame uses, so the mask
//   and the frame stay synchronized by construction.
// - The frame is the supplied transparent PNG (public/images/
//   eyewear-frame.png), moved with transform only.
// - One passive scroll listener writes a single CSS custom property via
//   requestAnimationFrame. No React state per scroll, no re-renders, no
//   animation library added. See the CSS file for the full rationale.
// - prefers-reduced-motion: the listener is skipped and the CSS pins a
//   static composition (frame centered, landscape in the lenses).
//
// Copy in ExperienceContent is PROVISIONAL until Arshia finalizes the
// landing copy in Figma.

"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import "./eyewear-scroll-experience.css";

/** Blurred surroundings: the same landscape, blurred, filling the stage.
 *  Same cover geometry as the sharp layer, so the view continues
 *  seamlessly from blurred outside to sharp inside the lenses. */
function EyewearSurroundings() {
  return <div className="eyewear-surroundings" aria-hidden="true" />;
}

/** Layer A + B: stationary landscape, restricted to the lens openings. */
function EyewearLandscape() {
  return <div className="eyewear-landscape" aria-hidden="true" />;
}

import Image from "next/image";

/** Layer C: the eyeglasses frame. */
function EyewearFrame() {
  return (
    <div className="eyewear-frame">
      <Image
        src="/images/eyewear-frame.png"
        alt="عینک رایبد"
        fill
        sizes="(max-width: 767px) 94vw, 920px"
        style={{ objectFit: "contain" }}
        draggable={false}
      />
    </div>
  );
}

/** Editorial caption and scroll hint. Fades out early via CSS. */
function ExperienceContent() {
  return (
    <>
      <div className="eyewear-content">
        <p className="eyewear-eyebrow">تجربه رایبد</p>
        <h2 className="eyewear-title">طبیعت، از پشت عدسی</h2>
        <p className="eyewear-subtitle">
          با اسکرول، منظره از دل عدسی‌ها عوض می‌شود.
        </p>
      </div>
      <div className="eyewear-hint">
        <span>اسکرول کنید</span>
        <ChevronDown size={20} aria-hidden="true" />
      </div>
    </>
  );
}

export default function EyewearScrollExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      stage.style.setProperty("--progress", progress.toFixed(4));
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="eyewear-section"
      aria-label="تجربه بصری عینک رایبد"
    >
      <div ref={stageRef} className="eyewear-stage">
        <EyewearSurroundings />
        <EyewearLandscape />
        <ExperienceContent />
        <EyewearFrame />
      </div>
    </section>
  );
}
