import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "رایبد | نمونه عملی پشته",
  description: "نمونه عملی لوکال پشته رایبد: Next.js و Prisma و PostgreSQL و HeroUI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
