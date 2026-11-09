// src/app/(public)/loading.tsx: route loading state for the public landing.
// Next.js renders this while the landing segment loads. It shows the
// skeleton of the hero (HeroSkeleton, approved by Arshia on 2026-11-09)
// instead of a blank page or a spinner, per the locked DS skeleton rule.
// Note: this file applies to the whole (public) group, so a client-side
// navigation to /booking or /login also briefly shows the hero skeleton
// while that segment loads.

import HeroSkeleton from "@/components/landing/HeroSkeleton";

export default function PublicLoading() {
  return <HeroSkeleton />;
}
