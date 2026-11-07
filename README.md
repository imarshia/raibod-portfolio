# رایبد: اسکلت فاز ۱

این ریپو بنیان محلی پروژه رایبد است. فاز ۱ (اسکلت) کامل شده است: زیرساخت Design System نسخه ۳٫۲، پوسته صفحه اصلی و پنل، ورود با کنترل دسترسی. هنوز محصول نهایی نیست و هیچ فیچر کسب و کاری ندارد.

## وضعیت فاز ۱ (۲۰۲۶-۱۱-۰۷)

- صفحه نمایشی و چاپ A5 حذف شدند؛ فقط دو جدول `users` و `sessions` هست.
- Design System نسخه ۳٫۲ در `DESIGN_SYSTEM.md` و توکن های آن در `src/app/globals.css` پیاده شده است.
- صفحه اصلی پوسته لندینگ است (متن موقت، تا طراحی فیگما)؛ صفحه `/booking` فقط اعلام می کند رزرو آنلاین در مرحله بعد فعال می شود.
- ورود و پنل با توکن های Design System بازطراحی شدند؛ منطق ورود و بررسی نقش سمت سرور بدون تغییر مانده است.
- گزارش کامل فاز ۱ در `PHASE1-REPORT.md` است.

## نسخه های دقیق

| ابزار | نسخه |
|---|---|
| Node.js | 24.22.1 |
| npm | 10.9.4 |
| Next.js | 15.5.29 |
| React | 19.3.1 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.5 |
| HeroUI | 3.2.7 |
| @heroui/styles | 3.2.7 |
| next-themes | 0.4.6 |
| lucide-react | 1.70.0 |
| @internationalized/date | 3.12.4 |
| Prisma | 6.19.3 |
| @prisma/client | 6.19.3 |
| PostgreSQL | 16.15 |
| argon2 | 0.45.2 |
| jalaali-js | 2.0.1 |
| @fontsource/vazirmatn | 5.3.0 |
| @playwright/test | 1.55.0 |

## نصب و اجرا

PostgreSQL با apt نصب شده است و روی localhost:5432 اجرا می شود. اگر ماشین مجازی عوض شد، PostgreSQL را دوباره با apt نصب کنید، چون نصب سیستمی با عوض شدن ماشین از بین می رود. دیتابیس و فایل های ریپو در فضای کاری می مانند. در 2026-11-07 همین اتفاق افتاد و PostgreSQL 16.15 دوباره نصب و دیتابیس `raibod_poc` از روی Migrationها ساخته و سید شد؛ `npx prisma migrate status` تایید می‌کند دیتابیس به‌روز است.

```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres psql -c "CREATE USER raibod WITH PASSWORD 'raibod_poc_local' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE raibod_poc OWNER raibod;"
sudo -u postgres psql -d raibod_poc -c "CREATE EXTENSION IF NOT EXISTS btree_gist;"
```

بعد در ریپو:

```bash
cp .env.example .env
npm install --ignore-scripts
bash scripts/setup-engines.sh
export PRISMA_QUERY_ENGINE_LIBRARY="$HOME/.cache/prisma/master/c2990dca591cba766e3b7ef5d9e8a84796e47ab7/debian-openssl-3.0.x/libquery_engine.so.node"
export PRISMA_SCHEMA_ENGINE_BINARY="$HOME/.cache/prisma/master/c2990dca591cba766e3b7ef5d9e8a84796e47ab7/debian-openssl-3.0.x/schema-engine"
npx prisma migrate dev
npm run db:seed
npm run dev
```

نکته مهم: دانلود موتور Prisma با ابزار داخلی آن در این محیط با خطای اتصال قطع می شود، ولی دانلود مستقیم با curl کار می کند. به همین دلیل نصب با `--ignore-scripts` انجام می شود و موتورها با اسکریپت بالا گرفته می شوند. این یک مشکل محیطی است، نه مشکل کد. در محیط دیگر ممکن است نصب معمولی کار کند.

نکته مهم دوم: متغیرهای موتور Prisma فقط برای دستورهای `prisma` نیستند. سرور Next.js هم در زمان اجرا به `PRISMA_QUERY_ENGINE_LIBRARY` نیاز دارد؛ بدون آن، کلاینت Prisma موتور را پیدا نمی کند و `/api/auth/login` خطای ۵۰۰ می دهد (در ۲۰۲۶-۱۱-۰۷ تایید شد). پس پیش از `npm run dev` یا `npm run start` هم همان دو متغیر را export کنید.

## تست ها

```bash
npm run lint
npm run test:exclusion
npm run build
npm run test:e2e
BASE_URL=http://localhost:3000 npm run test:lockout
```

تست قفل ورود را روی یک سرور نهایی در حال اجرا انجام دهید (مثلاً `npm run start -- -p 3000`)؛ حساب فروشنده تست را قفل می‌کند و بعد با `npx tsx prisma/seed.ts` باز می‌شود. دستور `npm run build` پیش از بیلد `prisma generate` را اجرا می‌کند و در این محیط به متغیرهای موتور Prisma در بخش نصب نیاز دارد.

تست e2e را روی سرور نهایی (`npm run start`) اجرا کنید، نه روی سرور توسعه. روی سرور توسعه، کامپایل هم زمان تست ها را کند و ناپایدار می کند. تست e2e را پیش از تست قفل ورود اجرا کنید، چون تست قفل حساب فروشنده را قفل می کند.

## ورود با حساب تست

| نقش | موبایل | رمز |
|---|---|---|
| مدیر | 09120000000 | Admin1234! |
| فروشنده | 09120000001 | Seller1234! |

این رمزها فقط برای تست لوکال است و باید پیش از هر استفاده واقعی عوض شوند.

## چه چیزی هست

- پوسته لندینگ فارسی و راست به چپ با توکن های Design System، تاریخ جلالی با ارقام لاتین، و دکمه اصلی «رزرو نوبت معاینه» به صفحه `/booking`.
- صفحه `/booking` فقط اعلام می کند رزرو آنلاین در مرحله بعد فعال می شود و شماره فروشگاه را نشان می دهد.
- ورود با موبایل و رمز، سشن در دیتابیس، کوکی httpOnly.
- قفل ورود: ۵ تلاش ناموفق حساب را ۱۵ دقیقه قفل می‌کند (خطای ۴۲۹ با پیام فارسی).
- ESLint با پیکربندی `eslint.config.mjs` و دستور `npm run lint`.
- پنل با کنترل دسترسی سمت سرور: بخش مدیر فقط برای ADMIN؛ پوسته پنل با تم روشن و تیره.
- تغییر تم روشن و تیره با next-themes، با دکمه Sun/Moon از Lucide.
- Middleware زیردامنه برای panel.localhost و panel.raibod.com.
- تست قید Exclusion روی بازه tstzrange (جدول موقت در خود تست ساخته و حذف می شود).

## چه چیزی نیست

- هیچ فیچر کسب و کاری: رزرو واقعی، نسخه، سفارش، انبار، مالی و پیامک نیست.
- Migration نهایی ۳۹ جدول نیست. فقط دو جدول `users` و `sessions` هست.
- دیپلوی نیست. نه VPS، نه Vercel، نه دامنه واقعی.
- متن لندینگ نهایی نیست؛ پس از طراحی فیگما جایگزین می شود.

## ساختار

- `DESIGN_SYSTEM.md`: نسخه ۳٫۲ سیستم طراحی (کپی دقیق، بدون تغییر)
- `PRODUCT_SPECIFICATION_v2.1.md`: مشخصات محصول، پیش نویس برای بازبینی مالک (تایید نشده)
- `PHASE1-REPORT.md`: گزارش فاز ۱
- `src/app/provider.tsx` و `src/app/providers.tsx`: ترکیب I18nProvider (locale ثابت `fa`) و NextThemesProvider
- `src/app/globals.css`: توکن های Design System، بخش ۹
- `src/components/ui`: پوشه کامپوننت های پایه (Button ،TextField ،Card ،Alert ،ThemeToggle)
- `src/lib/db`: کلاینت Prisma
- `src/lib/auth`: رمز Argon2id، سشن، بررسی نقش
- `src/lib/jalali`: تبدیل میلادی به جلالی با منطقه زمانی Asia/Tehran (نمایش با ارقام لاتین)
- `src/app/(public)`: صفحه اصلی (لندینگ)، ورود، پوسته رزرو
- `src/app/(panel)/panel`: پنل با کنترل دسترسی سمت سرور
- `src/middleware.ts`: مسیریابی بر اساس هاست
- `prisma/`: اسکیما، Migrationها، سید تست
- `scripts/`: تست Exclusion، تست قفل ورود، دانلود موتور Prisma
- `tests/`: تست e2e با Playwright (۱۰ تست)
- `verification/`: شواهد اجرا، لاگ ها و اسکرین شات ها (سوابق تاریخی PoC، دست نخورده)
