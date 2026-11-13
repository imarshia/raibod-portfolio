// src/components/NotFoundContent.tsx: the 404 content from Arshia's
// Figma (raibod-404.svg, received 2026-11-13, frame 1448x966).
// The SVG is the Figma export itself, so it is pixel-perfect by
// definition. The "Oops!" text is outlined to paths in the SVG, so a
// visually hidden h1 is provided for screen readers and the image
// carries the same text as its alt. Used by both the panel
// not-found (inside the shell: sidebar + header stay) and the
// landing not-found (with the landing header and footer).

import Image from "next/image";

export default function NotFoundContent() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-4 py-12">
      <h1 className="sr-only">صفحه پیدا نشد</h1>
      <Image
        src="/images/raibod-404.svg"
        alt="Oops! We're Working On it!"
        width={1448}
        height={966}
        className="h-auto w-full max-w-[880px]"
        priority
      />
    </div>
  );
}
