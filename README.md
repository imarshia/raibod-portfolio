# رایبد: نمونه عملی پشته و بنیان ریپوی اصلی

این ریپو بنیان محلی پروژه رایبد است. نمونه عملی لوکال است، نه اسکلت کامل و نه محصول نهایی. فقط سه جدول نمایشی دارد و هیچ فیچر کسب و کاری ندارد.

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
| Prisma | 6.19.3 |
| @prisma/client | 6.19.3 |
| PostgreSQL | 16.15 |
| argon2 | 0.45.2 |
| jalaali-js | 2.0.1 |
| @fontsource/vazirmatn | 5.3.0 |
| @playwright/test | 1.55.0 |

## نصب و اجرا

PostgreSQL با apt نصب شده است و روی localhost:5432 اجرا می شود. اگر ماشین مجازی عوض شد، PostgreSQL را دوباره با apt نصب کنید، چون نصب سیستمی با عوض شدن ماشین از بین می رود. دیتابیس و فایل های ریپو در فضای کاری می مانند.

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

## تست ها

```bash
npm run test:exclusion
npm run build
npm run test:e2e
```

تست e2e را روی سرور نهایی (`npm run start`) اجرا کنید، نه روی سرور توسعه. روی سرور توسعه، کامپایل هم زمان تست ها را کند و ناپایدار می کند.

## ورود با حساب تست

| نقش | موبایل | رمز |
|---|---|---|
| مدیر | 09120000000 | Admin1234! |
| فروشنده | 09120000001 | Seller1234! |

این رمزها فقط برای تست لوکال است و باید پیش از هر استفاده واقعی عوض شوند.

## چه چیزی هست

- صفحه اصلی با توضیح ۸ مورد اثبات، به فارسی و راست به چپ، با تاریخ جلالی.
- ورود با موبایل و رمز، سشن در دیتابیس، کوکی httpOnly.
- پنل با کنترل دسترسی سمت سرور: بخش مدیر فقط برای ADMIN.
- فرم و جدول نمایشی با HeroUI و اعتبارسنجی فارسی.
- صفحه چاپ A5.
- Middleware زیردامنه برای panel.localhost و panel.raibod.com.

## چه چیزی نیست

- هیچ فیچر کسب و کاری: رزرو واقعی، نسخه، سفارش، انبار، مالی و پیامک نیست.
- Migration نهایی ۳۹ جدول نیست. فقط سه جدول نمایشی هست.
- دیپلوی نیست. نه VPS، نه Vercel، نه دامنه واقعی.
- جدول رزرو نمایشی است و جایگزین ERD نسخه ۳ نیست.

## ساختار

- `src/lib/db`: کلاینت Prisma
- `src/lib/auth`: رمز Argon2id، سشن، بررسی نقش
- `src/lib/jalali`: تبدیل میلادی به جلالی با منطقه زمانی Asia/Tehran
- `src/lib/validation`: قانون های اعتبارسنجی فرم نمایشی
- `src/components`: کامپوننت های کلاینت HeroUI
- `src/app/(public)`: صفحه اصلی، ورود، فرم نمایشی، چاپ
- `src/app/(panel)/panel`: پنل با کنترل دسترسی سمت سرور
- `src/middleware.ts`: مسیریابی بر اساس هاست
- `prisma/`: اسکیما، Migration با SQL خام، سید تست
- `scripts/`: تست Exclusion، اسکرین شات، دانلود موتور Prisma
- `tests/`: تست e2e با Playwright
- `verification/`: شواهد اجرا، لاگ ها و اسکرین شات ها
