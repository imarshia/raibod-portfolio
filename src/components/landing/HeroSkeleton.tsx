// src/components/landing/HeroSkeleton.tsx: Raibod landing skeleton loader.
// Server component (no client JS). Placeholder blocks in the shape of the
// landing hero, with a shimmer sweep (see hero-skeleton.css). This is the
// site loader Arshia approved on 2026-11-09 (sample
// raibod-loader-skeleton.html); it replaces all earlier loader versions
// (glasses draw-on, Luma Spin, Spinner Loader), none of which were ever
// integrated. Rendered by src/app/(public)/loading.tsx as the route
// loading state, so the landing shows its own shape while it loads
// instead of a blank page or a spinner (locked DS rule).

import "./hero-skeleton.css";

export default function HeroSkeleton() {
  return (
    <div className="hero-skeleton" role="status" aria-label="در حال بارگذاری">
      <div className="hero-skeleton-block hero-skeleton-header" />
      <div className="hero-skeleton-block hero-skeleton-title" />
      <div className="hero-skeleton-block hero-skeleton-subtitle" />
      <div className="hero-skeleton-block hero-skeleton-subtitle-2" />
      <div className="hero-skeleton-ctas">
        <div className="hero-skeleton-block hero-skeleton-cta" />
        <div className="hero-skeleton-block hero-skeleton-cta" />
      </div>
      <div className="hero-skeleton-block hero-skeleton-band" />
    </div>
  );
}
