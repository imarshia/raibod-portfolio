// src/app/(public)/login/loading.tsx: route loading state for the
// login segment. Next.js renders this while /login loads (it overrides
// the group loading.tsx, which renders the hero skeleton). It shows a
// small login-card skeleton (card with title, two field blocks, a
// button block and a note line) instead of the hero skeleton (R-06),
// per the locked DS skeleton rule: skeletons, never a blank page or a
// bare spinner. Server component (no client JS).

import "@/components/landing/segment-skeleton.css";

export default function LoginLoading() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div
        className="login-skeleton"
        role="status"
        aria-label="در حال بارگذاری"
      >
        <div className="segment-skeleton-card">
          <div className="segment-skeleton-block segment-skeleton-title" />
          <div className="segment-skeleton-block segment-skeleton-field" />
          <div className="segment-skeleton-block segment-skeleton-field" />
          <div className="segment-skeleton-block segment-skeleton-button segment-skeleton-button--full" />
          <div className="segment-skeleton-block segment-skeleton-line segment-skeleton-line--short" />
        </div>
      </div>
    </main>
  );
}
