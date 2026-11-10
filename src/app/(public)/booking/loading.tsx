// src/app/(public)/booking/loading.tsx: route loading state for the
// booking segment. Next.js renders this while /booking loads (it
// overrides the group loading.tsx, which renders the hero skeleton).
// It shows a small booking-form skeleton (card with title, text lines
// and a button block) instead of the hero skeleton (R-06), per the
// locked DS skeleton rule: skeletons, never a blank page or a bare
// spinner. Server component (no client JS).

import "@/components/landing/segment-skeleton.css";

export default function BookingLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div
        className="booking-skeleton"
        role="status"
        aria-label="در حال بارگذاری"
      >
        <div className="segment-skeleton-card">
          <div className="segment-skeleton-block segment-skeleton-title" />
          <div className="segment-skeleton-block segment-skeleton-line" />
          <div className="segment-skeleton-block segment-skeleton-line segment-skeleton-line--short" />
          <div className="segment-skeleton-block segment-skeleton-button" />
        </div>
      </div>
    </main>
  );
}
