// src/app/(public)/page.tsx: Raybod public landing (Phase 1).
// Header + hero are FINAL, built exactly from Arshia's Figma hero frame
// (raibod-hero-section.svg, 1440x884, received 2026-11-09):
// SiteHeader (the final header: full-width bar + theme toggle + mobile menu) and HeroSection (title, subtitle,
// CTAs, photo band with glasses). The scroll experience follows the hero.
// Services, about and contact below are still PROVISIONAL copy until
// Arshia designs them in Figma.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EyewearScrollExperience from "@/components/landing/EyewearScrollExperience";
import HeroSection from "@/components/landing/HeroSection";
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

      <HeroSection />

      <EyewearScrollExperience />

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

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-caption text-muted">
          <span>عینک رایبد</span>
          <span dir="ltr">09120987790</span>
        </div>
      </footer>
    </div>
  );
}
