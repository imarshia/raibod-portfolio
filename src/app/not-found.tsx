// src/app/not-found.tsx: the 404 for unknown public URLs. It
// renders the landing header and footer around the same 404 content
// from Arshia's Figma, so an unknown landing link keeps the site
// chrome. Panel URLs use src/app/(panel)/not-found.tsx instead.

import SiteFooter from "@/components/landing/SiteFooter";
import SiteHeader from "@/components/landing/SiteHeader";
import NotFoundContent from "@/components/NotFoundContent";

export default function GlobalNotFound() {
  return (
    <>
      <SiteHeader />
      <NotFoundContent />
      <SiteFooter />
    </>
  );
}
