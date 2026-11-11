// src/app/(public)/loading.tsx: route loading state for the public landing.
// Next.js renders this while the landing segment loads. It shows the
// skeleton of the hero (HeroSkeleton, approved by Arshia on 2026-11-09)
// instead of a blank page or a spinner, per the locked DS skeleton rule.
// Note: this file applies to the (public) group except the routes that
// have their own segment loading.tsx: /booking and /login render their
// own skeletons (R-06), so only the landing shows the hero skeleton
// here.

import HeroSkeleton from "@/components/landing/HeroSkeleton";

export default function PublicLoading() {
  return <HeroSkeleton />;
}
