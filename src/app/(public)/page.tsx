// src/app/(public)/page.tsx: Raybod public landing shell (Phase 1).
// PROVISIONAL COPY: the text and layout on this page are placeholders until
// Arshia designs the landing in Figma. The shell only proves the Design
// System v3.2 tokens, the public page structure, and the booking CTA.
// Sections: hero, services, about, contact. No business logic, no data.

import Link from "next/link";
import { todayJalaliLatin } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold">عینک رایبد</span>
          <nav className="flex items-center gap-2">
            <Link href="#services">
              <Button variant="tertiary">خدمات</Button>
            </Link>
            <Link href="#about">
              <Button variant="tertiary">درباره ما</Button>
            </Link>
            <Link href="#contact">
              <Button variant="tertiary">تماس</Button>
            </Link>
            <ThemeToggle />
            <Link href="/login">
              <Button variant="secondary">ورود به پنل</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        <section className="py-16 text-center">
          <h1 className="text-h1 font-bold">عینک رایبد</h1>
          <p className="mx-auto mt-4 max-w-xl text-body text-muted">
            معاینه چشم، فریم و عدسی، همه در یک فروشگاه. نوبت معاینه خود را آنلاین
            رزرو کنید.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/booking">
              <Button variant="primary" size="lg">
                رزرو نوبت معاینه
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-caption text-muted">
            امروز به جلالی: <span dir="ltr">{todayJalaliLatin()}</span>
          </p>
        </section>

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
