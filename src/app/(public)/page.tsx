import { todayJalali } from "@/lib/jalali";
import { HomeActions } from "@/components/home-actions";

const PROOFS = [
  { n: 1, title: "اجرای Next.js و TypeScript", text: "برنامه با Next.js 15 و TypeScript سخت گیر بالا می آید و ساخت نهایی آن رد می شود اگر خطای نوع وجود داشته باشد." },
  { n: 2, title: "اتصال Prisma به PostgreSQL", text: "سه جدول نمایشی users و sessions و demo_bookings با Migration ساخته می شوند. قید Exclusion روی بازه tstzrange با SQL خام اضافه شده است." },
  { n: 3, title: "ورود و سشن در دیتابیس", text: "ورود با موبایل و رمز انجام می شود. رمز با Argon2id هش می شود و سشن در جدول sessions نگه داشته می شود." },
  { n: 4, title: "Middleware زیردامنه", text: "هاست panel.localhost به پنل می رود و هاست localhost به سایت عمومی می رود. این فقط روی لوکال تست شده است." },
  { n: 5, title: "تاریخ جلالی", text: "تاریخ امروز به جلالی نشان داده می شود و ورودی تاریخ در فرم نمایشی جلالی است و برای ذخیره به میلادی تبدیل می شود." },
  { n: 6, title: "فرم و جدول با HeroUI", text: "فرم نمایشی ۶ فیلد و اعتبارسنجی فارسی دارد و جدول آن قابل جستجو و مرتب سازی است." },
  { n: 7, title: "چاپ A5", text: "صفحه نمونه نسخه و فاکتور با اندازه صفحه A5 و دکمه چاپ ساخته شده است." },
  { n: 8, title: "کنترل دسترسی سمت سرور", text: "درخواست بدون ورود به پنل به صفحه ورود برمی گردد. بخش مدیر فقط برای نقش ADMIN دیده می شود." },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-xl border border-default-200 bg-content1 p-6 shadow-sm">
        <h1 className="text-2xl font-bold">رایبد: نمونه عملی پشته</h1>
        <p className="text-sm text-default-500">امروز به جلالی: {todayJalali()}</p>
        <p className="mt-4">
          این نمونه عملی فقط ثابت می کند فناوری های انتخاب شده کنار هم کار می کنند. این یک اسکلت
          کامل نیست و هیچ فیچر کسب و کاری ندارد. فقط سه جدول نمایشی دارد و رمز تست آن باید پیش
          از هر استفاده واقعی عوض شود.
        </p>
        <div className="mt-4">
          <HomeActions />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {PROOFS.map((p) => (
          <div
            key={p.n}
            className="rounded-xl border border-default-200 bg-content1 p-6 shadow-sm"
          >
            <h2 className="font-bold">
              {p.n}. {p.title}
            </h2>
            <p className="text-sm text-default-600">{p.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
