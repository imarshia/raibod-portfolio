// src/app/(public)/page.tsx: Raybod public landing (Phase 1).
// Header and footer are FINAL, built exactly from Arshia's Figma
// frames: SiteHeader (final header) and SiteFooter (footer SVGs,
// desktop 1440x405, mobile 390x1053, received 2026-11-09).
// The hero and the scroll experience were REMOVED by the owner
// (2026-11-09, "remove the entire frame thing"); the hero will be
// redesigned from scratch. Their files (HeroSection.tsx,
// hero-section.css, EyewearScrollExperience.tsx,
// eyewear-scroll-experience.css, and the hero-building images) were
// deleted from the repo on 2026-11-11 at the owner's direction
// ("if they are not useful, delete them"); they were unused, with no
// imports anywhere. HeroSkeleton.tsx and hero-skeleton.css stay:
// they are still used by the loading skeleton in loading.tsx.
// Services, about and contact below are still PROVISIONAL copy until
// Arshia designs them in Figma.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteFooter from "@/components/landing/SiteFooter";
import SiteHeader from "@/components/landing/SiteHeader";

const SERVICES = [
  {
    title: "معاینه چشم",
    text: "معاینه چشم و ثبت نسخه در مطب فروشگاه، با نوبت آنلاین.",
  },
  {
    title: "فریم و عدسی",
    text: "انتخاب فریم و عدسی متناسب با نسخه، با قیمت شفاف.",
  },
  {
    title: "خدمات پس از فروش",
    text: "تحویل عینک، تنظیم و تعمیر، با پیگیری پیامکی.",
  },
];

export default function HomePage() {
  return (
    <div
      id="top"
      className="min-h-screen overflow-x-clip bg-background text-foreground"
    >
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4">
        <section id="services" className="py-8">
          <h2 className="text-h2 font-bold">خدمات</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {SERVICES.map((s) => (
              <Card key={s.title} variant="default">
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body-sm text-muted">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="about" className="py-8">
          <h2 className="text-h2 font-bold">درباره ما</h2>
          <p className="mt-4 max-w-2xl text-body text-muted">
            عینک رایبد فروشگاه عینک با مطب معاینه چشم است. این صفحه هنوز متن نهایی
            ندارد و پس از طراحی در فیگما جایگزین می شود.
          </p>
        </section>

        <section id="contact" className="py-8">
          <h2 className="text-h2 font-bold">تماس</h2>
          <p className="mt-4 text-body">
            تلفن فروشگاه: <span dir="ltr">09120987790</span>
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
