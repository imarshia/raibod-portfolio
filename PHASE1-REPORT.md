# گزارش فاز ۱: اسکلت رایبد

تاریخ: ۲۰۲۶-۱۱-۰۷. وضعیت: کامل شد، ولی کامیت نشده است. این گزارش برای بازبینی عرشیا است؛ فقط او کامیت را تایید می کند. هیچ کامیت، پوش یا ریموتی ساخته نشده است.

## خلاصه مدیریتی

فاز ۱ کامل شد: صفحه ها و فرم نمایشی حذف شدند، Design System نسخه ۳٫۲ پیاده شد، پوسته لندینگ و صفحه رزرو و پنل با توکن های سیستم طراحی ساخته شدند، و همه تست ها سبز هستند. دو یافته فنی مهم در این فاز ثبت شد: نماد نقطه ای کامپوننت های ترکیبی HeroUI از کامپوننت سرور کار نمی کند (با قطعه های تخت حل شد)، و دکمه HeroUI به طور پیش فرض ۲۴ پیکسل گردی دارد که با یک override به ۱۲ پیکسل Design System برگشت. مورد باز ارقام DateField با تصمیم عرشیا در ۱۶ آبان ۱۴۰۵ حل شد: locale به `fa-u-nu-latn` تغییر کرد و بررسی مرورگر تایید کرد تقویم جلالی با ارقام لاتین درست کار می کند.

## چه چیزی تغییر کرد

### واحد ۱: حذف صفحه نمایشی

حذف شده:
- `src/app/(public)/demo/page.tsx` (فرم و جدول نمایشی)
- `src/app/(public)/print/page.tsx` (صفحه چاپ A5؛ الگوی CSS مربوط به `@page` در `globals.css` مانده است)
- `src/components/demo-form.tsx`
- `src/components/print-button.tsx`
- `src/components/home-actions.tsx` (دکمه های صفحه اصلی قدیمی)
- `src/lib/validation.ts` (فقط فرم نمایشی از آن استفاده می کرد)

تغییر کرده:
- `prisma/schema.prisma`: مدل `DemoBooking` و enum آن حذف شد؛ سربرگ فایل به «دو جدول: users و sessions (فقط ورود)» تغییر کرد.
- `prisma/migrations/20261107052905_drop_demo_bookings/` (جدید): تنها Migration مجاز این فاز؛ جدول `demo_bookings` را حذف می کند. با `prisma migrate deploy` اعمال شد و `prisma migrate status` تایید می کند «Database schema is up to date!».
- `scripts/test-exclusion.ts`: دیگر به `demo_bookings` وابسته نیست؛ جدول موقت `exclusion_probe_slots` را در خود تست می سازد، همان ۳ بررسی را اجرا می کند و جدول را حذف می کند.
- `prisma/seed.ts`: سید رزرو نمایشی حذف شد؛ کاربران تست مدیر و فروشنده مانده اند.

تایید شده با grep: هیچ ارجاعی به `demo_bookings` ،`demo-form` یا مسیر `/demo` و `/print` در `src/` و `prisma/` نیست (به جز یک کامنت توضیحی در سربرگ اسکیما). سوابق تاریخی PoC (`HANDOVER.md` ،`POC-REPORT.md` ،`verification/`) دست نخورده اند.

### واحد ۲: زیرساخت Design System نسخه ۳٫۲

اضافه شده:
- `DESIGN_SYSTEM.md` در ریشه ریپو: کپی دقیق فایل سیستم طراحی، بدون هیچ تغییری (md5 هر دو فایل `5945f87a6850cf8e8e671691123cf682`).
- `src/app/provider.tsx` (جدید): فقط I18nProvider با locale ثابت `fa-u-nu-latn` (تصمیم عرشیا، ۱۶ آبان ۱۴۰۵).
- `src/app/providers.tsx` (جدید): فایل ترکیب شده کلاینت: NextThemesProvider بیرونی (`attribute="class"` ،`defaultTheme="system"` ،`enableSystem` ،`disableTransitionOnChange`)، بعد I18nProvider، بعد `Toast.Provider`.
- `src/components/ui/button.tsx` ،`text-field.tsx` ،`card.tsx` ،`alert.tsx` ،`theme-toggle.tsx` (جدید): فقط پوشه هایی که لندینگ، ورود و پنل واقعا استفاده می کنند. فقط توکن های معنایی، بدون hex خام در JSX، بدون الگوی HeroUI نسخه ۲.

تغییر کرده:
- `src/app/globals.css`: توکن های بخش ۹ Design System (import اول `tailwindcss`، بعد `@heroui/styles`؛ وزن های ۶۰۰ و ۸۰۰ Vazirmatn اضافه شد)؛ CSS چاپ A5 و `.no-print` مانده است؛ یک override برای گردی دکمه (به بخش «یافته ها» نگاه کنید).
- `src/app/layout.tsx`: ‏`lang="fa"` و `dir="rtl"`، ‏`suppressHydrationWarning` روی html، ‏`bg-background text-foreground` روی body، و `Providers` ترکیب شده.
- `src/components/providers.tsx`: حذف شد و با `src/app/provider.tsx` و `src/app/providers.tsx` جایگزین شد.

نصب شده (پین دقیق، بدون ارتقای HeroUI):
- `next-themes@0.4.6` ،`lucide-react@1.70.0` ،`@internationalized/date@3.12.4` ،`@heroui/styles@3.2.7` (وابستگی مستقیم شد).
- آخرین پچ HeroUI از npm تایید شد: `3.2.7` جدیدترین پچ است، پس همان نسخه نصب شده، جدیدترین است و ارتقایی انجام نشد.
- تایید شد `@heroui/styles` نسخه ۳٫۲٫۷ ایمپورت `@import "@heroui/styles"` را به `./dist/index.css` می رساند؛ پس ایمپورت درست همان است که Design System بخش ۰٫۱ می گوید، نه `@heroui/react/styles` که قبلا در ریپو بود.
- تایید شد `@internationalized/date@3.12.4` همان peer dependency اعلام شده `@heroui/react@3.2.7` است.
- `tailwind-variants@3.3.1` از قبل به صورت transitive بود و نصب مستقیم لازم نداشت.

### واحد ۳: صفحه ها و ورود

تغییر کرده:
- `src/app/(public)/page.tsx`: صفحه اصلی حالا پوسته لندینگ است: هدر با نام فروشگاه و دکمه تغییر تم و ورود، هیرو با دکمه اصلی «رزرو نوبت معاینه» به `/booking`، بخش خدمات (۳ کارت)، درباره ما، تماس (تلفن فروشگاه)، فوتر. متن موقت است و تا طراحی فیگما جایگزین می شود.
- `src/app/(public)/booking/page.tsx` (جدید): پوسته رزرو؛ فقط می گوید رزرو آنلاین در مرحله بعد فعال می شود و شماره فروشگاه (09120987790) را نشان می دهد. هیچ فرم و منطق رزروی ندارد.
- `src/app/(public)/login/page.tsx`: منطق ورود بدون تغییر؛ فقط با توکن های Design System و `components/ui` بازطراحی شد؛ خطا با `FormError` (Alert با status خطر) نشان داده می شود؛ دکمه ورود از `isPending` استفاده می کند.
- `src/app/(panel)/panel/page.tsx`: بررسی سشن و نقش سمت سرور بدون تغییر؛ پوسته پنل با توکن های Design System بازطراحی شد؛ هدر با دکمه تغییر تم و خروج؛ محتوای داشبورد فقط یک پوسته است و هیچ KPI واقعی ندارد.
- `src/lib/jalali.ts`: تابع `formatJalaliLatin` و `todayJalaliLatin` اضافه شد (ارقام لاتین، قالب YYYY/MM/DD)؛ تابع قدیمی با ارقام فارسی فقط برای مرجع مانده و در رابط کاربری استفاده نمی شود.

## ساختار فایل

```
DESIGN_SYSTEM.md
PRODUCT_SPECIFICATION_v2.1.md
PHASE1-REPORT.md
README.md
ARCHITECTURE.md
prisma/
  schema.prisma            # فقط users و sessions
  migrations/
    20261106230011_init_poc/
    20261107043000_login_lockout/
    20261107052905_drop_demo_bookings/   # تنها Migration فاز ۱
  seed.ts
src/
  app/
    layout.tsx             # fa / rtl / suppressHydrationWarning / Providers
    provider.tsx           # I18nProvider با locale ثابت fa-u-nu-latn
    providers.tsx          # NextThemesProvider + I18nProvider + Toast.Provider
    globals.css            # توکن های DS بخش ۹ + override گردی دکمه + چاپ A5
    (public)/
      page.tsx             # لندینگ
      booking/page.tsx     # پوسته رزرو
      login/page.tsx       # ورود
    (panel)/panel/page.tsx # پوسته پنل
    api/auth/login/route.ts
    api/auth/logout/route.ts
  components/ui/
    button.tsx  text-field.tsx  card.tsx  alert.tsx  theme-toggle.tsx
  lib/
    auth.ts  db.ts  jalali.ts
  middleware.ts
scripts/
  test-exclusion.ts  test-login-lockout.mjs  setup-engines.sh  screenshots.ts
tests/e2e.spec.ts    # ۱۰ تست
```

مسیرها پس از بیلد: `/` (لندینگ، ۶۸۱ بایت)، `/booking` (۳۹۲ بایت)، `/login` (۴۴٫۴ کیلوبایت)، `/panel` (۱٫۲۶ کیلوبایت)، `/api/auth/login` ،`/api/auth/logout` ،`/_not-found`. مسیر `/demo` و `/print` دیگر وجود ندارند.

## نتایج تست (همه سبز)

| تست | نتیجه |
|---|---|
| Lint (`npm run lint`) | ۰ خطا، ۱ هشدار شناخته شده و بی ضرر در `postcss.config.mjs` |
| تست Exclusion (`npm run test:exclusion`) | ۳ از ۳ گذشت، با خطای دقیق Postgres |
| بیلد (`npm run build`) | خروج ۰؛ ۹ از ۹ صفحه ساخته شد |
| e2e (`npm run test:e2e` روی سرور نهایی پورت ۳۰۰۰) | ۱۰ از ۱۰ گذشت در ۱۰٫۶ ثانیه |
| تست قفل ورود (`BASE_URL=http://localhost:3000 npm run test:lockout`) | ۸ از ۸ گذشت؛ بعد با سید دوباره باز شد و ورود فروشنده ۲۰۰ شد |

تست های e2e جدید: لندینگ با هیرو و CTA، پوسته رزرو با تلفن، تغییر تم روشن/تیره با ماندگاری، گردی دکمه ۱۲ پیکسل، برگشت ۴۰۴ برای `/demo`، رندر صفحه ورود. تست فرم نمایشی حذف شد؛ تست های ورود مدیر/فروشنده، رمز اشتباه، و ریدایرکت پنل بدون ورود مانده اند.

دیتابیس پس از فاز ۱: فقط `users` ،`sessions` و `_prisma_migrations` (تایید با psql). جدول `demo_bookings` و enum آن حذف شده اند و جدول موقت تست Exclusion هم پس از اجرا حذف شده است (تعداد ۰).

## یافته های فنی مهم

### ۱. نماد نقطه ای کامپوننت ترکیبی از کامپوننت سرور کار نمی کند (حل شد)

علت ریشه ای، تایید شده با بیلد نهایی: در یک کامپوننت سرور، کامپوننت کلاینتی که import می شود فقط یک ارجاع کلاینت است و دسترسی به ویژگی آن (`Card.Header`) مقدار `undefined` می دهد. بیلد نهایی با خطای `Element type is invalid ... got: undefined` روی هر صفحه سروری که از `Card.Header` ،`Card.Title` ،`Card.Content` یا `Card.Footer` استفاده می کرد، رد می شد؛ در حالی که `<Card>` با فرزند متنی از همان صفحه سرور درست رندر می شد و نماد نقطه ای از کامپوننت کلاینت (صفحه ورود) درست کار می کرد. راه حل: قطعه های تخت مستقیم import می شوند (`Card` ،`CardHeader` ،`CardTitle` ،`CardDescription` ،`CardContent` ،`CardFooter`) و در همه صفحه ها، سرور و کلاینت، یک الگوی واحد استفاده می شود. همین قانون برای هر کامپوننت ترکیبی HeroUI که از کامپوننت سرور استفاده شود، برقرار است. این موضوع در `ARCHITECTURE.md` و کامنت `src/components/ui/card.tsx` ثبت شده است. همچنین پوشه های `components/ui` به جای re-export مستقیم (`export { Card } from "@heroui/react"`) با تابع های محلی نوشته شدند، چون re-export مستقیم ترکیب `Object.assign` هم در همان بیلد به ارجاع undefined می رسید؛ الگوی تابع محلی همان الگوی Button است که از اول کار می کرد.

### ۲. گردی دکمه ۲۴ پیکسل بود، نه ۱۲ پیکسل (حل شد)

دکمه HeroUI نسخه ۳ از `rounded-3xl` استفاده می کند که در Tailwind نسخه ۴ به ۲۴ پیکسل می رسد. توکن `--radius: 0.75rem` در بخش ۹ Design System روی آن اثر نمی گذارد. در `src/app/globals.css` یک override اضافه شد (`.button { border-radius: var(--radius); }`) که فقط دکمه را به ۱۲ پیکسل Design System برمی گرداند. تست e2e مقدار محاسبه شده `getComputedStyle` دکمه اصلی را اندازه می گیرد و ۱۲ پیکسل را تایید می کند. بقیه کامپوننت ها مقیاس گردی HeroUI را نگه داشته اند، چون Design System برای آن ها گردی تعریف نکرده است.

### ۳. سرور بدون متغیرهای موتور Prisma خطای ۵۰۰ می دهد (یادداشت محیطی)

`prisma generate` در بیلد به متغیرهای موتور نیاز دارد (در README آمده است)، ولی سرور Next.js هم در زمان اجرا به `PRISMA_QUERY_ENGINE_LIBRARY` نیاز دارد. سروری که بدون آن شروع شود، در `/api/auth/login` خطای ۵۰۰ می دهد (`PrismaClientInitializationError: could not locate the Query Engine`)؛ با همان متغیر، ورود مدیر ۲۰۰، ورود فروشنده ۲۰۰ و رمز اشتباه ۴۰۱ برمی گردد. README با این نکته به روز شد: پیش از `npm run dev` یا `npm run start` هم هر دو متغیر export شوند.

## تاییدیه های بخش ۱۳ Design System

هر مورد با نسخه پین شده ۳٫۲٫۷ در کد تایید شد، نه با حدس:

| مورد بخش ۱۳ | نتیجه |
|---|---|
| رشته locale جلالی با `@internationalized/date` | تایید شد: `fa` و `fa-IR` هر دو به تقویم `persian` می رسند. با تصمیم عرشیا (۱۶ آبان ۱۴۰۵) locale به `fa-u-nu-latn` تغییر کرد: `Intl.DateTimeFormat("fa-u-nu-latn").resolvedOptions()` تقویم `persian` و `numberingSystem` برابر `latn` می دهد و DateFormatter با این locale تاریخ ۲۰۲۶-۱۱-۰۷ را `1405/08/16` می سازد. `createCalendar('persian')` با تاریخ ۱۴۰۵/۰۸/۱۶ درست به ۲۰۲۶-۱۱-۰۷ میلادی می رسد. |
| ارقام لاتین در DateField با locale `fa-u-nu-latn` | حل شد با تصمیم عرشیا (۱۶ آبان ۱۴۰۵): locale به `fa-u-nu-latn` تغییر کرد و بررسی مرورگر تایید کرد DateField تاریخ 1405/8/16 را با ارقام لاتین نشان می دهد و تقویم جلالی (آبان ۱۴۰۵) است. تست ماندگار `npm run test:locale` (اسکریپت `scripts/test-locale.ts`) و اسکرین شات `~/workspace/raibod/phase1-screenshots/dev-datefield.png`. |
| جای `isOpen` در Modal | تایید شد و مثال Design System اصلاح لازم دارد: در ۳٫۲٫۷ ریشه Modal به جای `isOpen`/`onOpenChange`، ‏`state` از نوع `UseOverlayStateReturn` می گیرد؛ `isOpen` فقط ویژگی `Modal.Backdrop` است. `Modal.Container` فقط `placement`/`scroll`/`size` می گیرد. همین الگو برای AlertDialog هم برقرار است. فایل Design System تغییر نکرد؛ این یافته برای تایید عرشیا ثبت شده است. |
| ترکیب Switch در نسخه ۳٫۲٫۰ | تایید شد: Switch در ۳٫۲٫۷ زیرکامپوننت های Root و Content و Control و Thumb و Icon را دارد و Label ندارد؛ برچسب متن ساده داخل Content است و Description و FieldError (عمومی، از ریشه پکیج) خواهر Content هستند. پس ترکیب یادداشت انتشار نسخه ۳٫۲٫۰ درست است و صفحه مستندات قدیمی است. |
| ترتیب Providerها | تایید شد در کد و تست تم: NextThemesProvider بیرونی (مالک class روی html) و I18nProvider درونی؛ تست تغییر تم و ماندگاری آن گذشت. |
| جداکننده Breadcrumbs در RTL | تایید شد که در RTL نمی چرخد: جداکننده پیش فرض `IconChevronRight` است، یک SVG ساده که همیشه به راست اشاره می کند و هیچ منطق چرخش RTL ندارد. در فاز ۱ از Breadcrumbs استفاده نمی شود؛ راه حل (دادن جداکننده سفارشی) نیاز به تصمیم دارد. |
| رفتار spinner دکمه | تایید شد که spinner خودکار نیست: `isPending` فقط `data-pending="true"` و `aria-disabled="true"` می گذارد و برچسب را نگه می دارد؛ هیچ عنصر spinner در DOM نیست (بررسی HTML رندر شده). برای spinner باید Spinner جداگانه کنار دکمه گذاشت، همان طور که بخش ۵ Design System می گوید. |
| وجود Autocomplete در ۳٫۲٫۷ | تایید شد: هم `Autocomplete` و هم `ComboBox` از ورودی اصلی export می شوند. |
| وجود Link ،Separator ،Avatar ،Meter ،Disclosure ،Kbd | تایید شد: هر شش مورد در ورودی اصلی ۳٫۲٫۷ وجود دارند. ویژگی های آن ها از تایپ های نصب شده خوانده شد؛ در فاز ۱ استفاده نمی شوند. |
| دستور نصب next-themes | تایید شد: `npm i next-themes` استاندارد است؛ نسخه نصب شده ۰٫۴٫۶ با پین دقیق است. |
| آخرین پچ HeroUI | تایید شد از npm: ‏`3.2.7` جدیدترین پچ است. |
| جای Toast.Provider | تایید شد: `Toast.Provider` در ۳٫۲٫۷ وجود دارد و در ریشه برنامه رندر می شود. |
| Locale در برابر `fa-IR` | تایید شد (به ردیف اول نگاه کنید): ‏`fa` استفاده شد و `fa-IR` در `src/components/providers.tsx` حذف شده قدیمی، دیگر نیست. |

## موارد باز و نیازمند تصمیم عرشیا

1. **ارقام لاتین در DateField در برابر locale ثابت `fa` (حل شد، ۱۶ آبان ۱۴۰۵)**: locale به `fa-u-nu-latn` تغییر کرد. با `fa`، تاریخ جلالی درست بود ولی ارقام فارسی بودند؛ با `fa-u-nu-latn`، همان تاریخ با ارقام لاتین است. بررسی مرورگر (۵ چک) و تست `npm run test:locale` گذشت. بقیه موارد این فهرست هنوز باز هستند.
2. **مثال Modal در Design System بخش ۵**: مثال `<Modal isOpen={...} onOpenChange={...}>` با ۳٫۲٫۷ سازگار نیست؛ الگوی درست `<Modal state={s}>` با `useOverlayState` است. Design System تغییر نکرد؛ تایید عرشیا لازم است که آیا مثال اصلاح شود یا نه.
3. **جداکننده Breadcrumbs در RTL**: جداکننده پیش فرض در RTL به راست اشاره می کند و نمی چرخد. در فاز ۱ استفاده نمی شود؛ وقتی لازم شد، جداکننده سفارشی (مثل ChevronLeft) تصمیم می خواهد.
4. **گردی بقیه کامپوننت ها**: فقط دکمه به ۱۲ پیکسل برگشت. بقیه کامپوننت ها (Modal ،Calendar و...) مقیاس گردی HeroUI را دارند، چون Design System برای آن ها گردی تعریف نکرده است.
5. **متن لندینگ موقت است**: تا طراحی فیگما از عرشیا.
6. **فونت متغیر Vazirmatn**: وزن های استاتیک ۴۰۰/۵۰۰/۶۰۰/۷۰۰/۸۰۰ از `@fontsource/vazirmatn` استفاده شد. فونت متغیر واقعی (`@fontsource-variable/vazirmatn`) استفاده نشد، چون نام خانواده آن (`Vazirmatn Variable`) با توکن `--font-sans: "Vazirmatn"` در بخش ۹ فرق می کند. این به عنوان مورد باز ثبت شد.
7. **جلسه ۸ ساعته بدون Refresh Token**: رفتار PoC است و تصمیم محصولی برای آن قفل نشده است.

## چه چیزی عوض نشد

- هیچ تصمیم محصولی جدید گرفته نشد؛ هیچ مورد OPEN یا PROPOSED از مشخصات محصول (نسخه ۲٫۱) به تصمیم نهایی تبدیل نشد.
- فایل Design System و فایل مشخصات محصول تغییر نکردند (مشخصات هنوز پیش نویس تایید نشده است).
- هیچ Migration جدول کسب و کاری ساخته نشد؛ تنها Migration، حذف جدول نمایشی است.
- هیچ فیچر کسب و کاری (رزرو واقعی، نسخه، سفارش، انبار، مالی، پیامک) ساخته نشد؛ Lens Expert خارج از محدوده ماند.
- منطق ورود، سشن، Middleware و API ورود/خروج بدون تغییر ماند (فقط ظاهر آن ها عوض شد).
- `HANDOVER.md` ،`POC-REPORT.md` و `verification/` دست نخورده اند.

## شواهد اجرا

- Lint: ‏`npm run lint`: ۰ خطا، ۱ هشدار `postcss.config.mjs`.
- Exclusion: ‏`npm run test:exclusion`: ‏`Result: 3 passed, 0 failed` با خطای دقیق `exclusion_probe_slots_no_overlap`.
- Build: ‏`npm run build`: ‏`✓ Compiled successfully` و `✓ Generating static pages (9/9)`؛ مسیرها در جدول بالا.
- e2e: ‏`npm run test:e2e` روی سرور نهایی پورت ۳۰۰۰: ‏`10 passed (10.6s)`.
- Lockout: ‏`BASE_URL=http://localhost:3000 npm run test:lockout`: ‏`LOCKOUT TEST PASSED (8/8)`؛ سید دوباره اجرا شد و ورود فروشنده ۲۰۰ شد.
- بررسی DateField با locale جدید `fa-u-nu-latn` با یک صفحه موقت انجام شد (۵ چک مرورگر گذشت: فیلد 1405/8/16 با ارقام لاتین، بدون رقم فارسی، ماه آبان، سال 1405 لاتین، بدون نام ماه میلادی) و صفحه پیش از تحویل حذف شد؛ اسکرین شات در `~/workspace/raibod/phase1-screenshots/dev-datefield.png` است. تست ماندگار locale در `scripts/test-locale.ts` است (`npm run test:locale`).
- سرورهای تست پس از پایان خاموش شدند؛ PostgreSQL در حال اجرا مانده است.
- اجرای دوباره کامل تست‌ها پس از تغییر locale (۱۶ آبان ۱۴۰۵، پس از نصب دوباره PostgreSQL به‌علت تعویض ماشین مجازی): lint بدون خطا (۱ هشدار شناخته‌شده)، `test:locale` ۵ از ۵، `test:exclusion` ۳ از ۳، build ‏۹ از ۹، e2e ‏۱۰ از ۱۰ (۱۱٫۲ ثانیه)، lockout ‏۸ از ۸؛ سید دوباره اجرا شد و هر دو حساب تست باز شدند.
- آماده‌سازی امن برای GitHub (۱۶ آبان ۱۴۰۵، بدون کامیت): رمز دیتابیس و SESSION_SECRET چرخانده شدند و مقادیر واقعی از `.env.example` و `docker-compose.yml` و دستور راه‌اندازی README حذف شدند (جای‌نگهدار CHANGE_ME)؛ `.gitignore` کامل شد؛ رمز نمایشی از صفحه Login و خروجی Seed و جدول README حذف شد. Gitleaks 8.30.1 روی تاریخچه و فایل‌های Trackشده ۰ نشت یافت؛ اجرای کامل تست‌ها پس از چرخش سبز است (lint بدون خطا، locale ‏۵ از ۵، exclusion ‏۳ از ۳، build ‏۹ از ۹، e2e ‏۱۰ از ۱۰، lockout ‏۸ از ۸).
- محافظ Seed و رمزهای تست از متغیر محیطی (۱۶ آبان ۱۴۰۵، بدون کامیت): `prisma/seed.ts` حالا در Production به‌صورت قطعی متوقف می‌شود (حتی با پرچم)، به `ALLOW_TEST_SEED=true` نیاز دارد و مقصد دیتابیس را پیش از اجرا اعتبارسنجی می‌کند (Allowlist: هاست localhost ،127.0.0.1 ،::1 و دیتابیس `raibod_poc`؛ Docker هم از همین پورت لوکال می‌رسد). رمز هر دو حساب تست از `TEST_ADMIN_PASSWORD` و `TEST_SELLER_PASSWORD` خوانده می‌شود و هیچ رمز ثابتی در کد نیست؛ هر سه فایل تست هم همان متغیرها را می‌خوانند (خواندن `.env` با پکیج `dotenv`). تست ماندگار محافظ در `scripts/test-seed-guard.ts` است (`npm run test:seed-guard`): ۶ از ۶ گذشت (Production، نبود پرچم، هاست غیرمجاز، دیتابیس اشتباه، نبود رمزها، اجرای موفق). اجرای کامل تست‌ها پس از این تغییر سبز است (lint بدون خطا، locale ‏۵ از ۵، exclusion ‏۳ از ۳، seed-guard ‏۶ از ۶، build ‏۹ از ۹، e2e ‏۱۰ از ۱۰، lockout ‏۸ از ۸)؛ اسکن Secret و Gitleaks روی تاریخچه و فایل‌های Trackشده ۰ نشت یافت و هیچ رمز تست ثابتی در فایل‌های Trackشده نیست.
