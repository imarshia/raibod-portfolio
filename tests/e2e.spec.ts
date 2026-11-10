// tests/e2e.spec.ts: Phase 1 skeleton checks against the running server.
// Run the PRODUCTION server first (npm run start, port 3000), then:
// npm run test:e2e
// Run this BEFORE the lockout test: the lockout test locks the seller
// account, and re-seeding unlocks it afterwards.

import { test, expect } from "@playwright/test";
import "dotenv/config";

// Test-account passwords come from the environment (gitignored .env).
// They are never hardcoded: a missing variable fails the run loudly.
function testPassword(name: "TEST_ADMIN_PASSWORD" | "TEST_SELLER_PASSWORD"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Set it in the local .env (see README, test accounts section).`
    );
  }
  return value;
}

const ADMIN_PASSWORD = testPassword("TEST_ADMIN_PASSWORD");
const SELLER_PASSWORD = testPassword("TEST_SELLER_PASSWORD");

test("landing renders without hero, with services and footer", async ({ page }) => {
  await page.goto("/");
  // The hero was removed by the owner (2026-11-09, to be redesigned
  // from scratch); no h1 is on the page. This is the LES-001 case:
  // the test must match the current UI, not the old hero.
  await expect(page.locator("h1")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "خدمات", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "معاینه چشم" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "درباره ما", exact: true })).toBeVisible();
  // Scoped to <main>: the footer also has a "تماس" heading (h3), so an
  // unscoped lookup would match two headings and fail strict mode.
  await expect(
    page.locator("main").getByRole("heading", { name: "تماس", exact: true }),
  ).toBeVisible();
  // The footer is final and renders at the bottom of the page.
  await expect(page.locator("footer.site-footer")).toBeVisible();
});

test("booking shell states online booking opens later and shows the phone", async ({
  page,
}) => {
  await page.goto("/booking");
  await expect(
    page.getByText("رزرو آنلاین نوبت در مرحله بعد فعال می شود."),
  ).toBeVisible();
  await expect(page.getByText("09120987790")).toBeVisible();
});

test("landing is light-only with no theme toggle", async ({ page }) => {
  await page.goto("/");
  // The theme toggle was removed by the owner (2026-11-09); the site is
  // light-only. No toggle button exists, and <html> never gets the
  // "dark" class. This is the LES-001 case: the test must match the
  // current UI, not the old toggle.
  await expect(page.getByRole("button", { name: "تم تیره" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "تم روشن" })).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  // Even with a stored dark preference, the site stays light (the
  // provider forces light; a stored value must not re-apply dark).
  await page.evaluate(() => localStorage.setItem("raibod-theme", "dark"));
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: "تم تیره" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "تم روشن" })).toHaveCount(0);
});

test("login field radius is 12px per the Design System", async ({ page }) => {
  // The DS field radius changed 2026-11-10 from 16px to 12px (owner
  // decision: Figma shows 12px and the design takes priority). The
  // login fields get the radius from the global .input override, not
  // from a login-only radius class.
  await page.goto("/login");
  const radius = await page
    .getByLabel("شماره موبایل")
    .evaluate((el) => getComputedStyle(el).borderRadius);
  expect(radius).toBe("12px");
});

test("login page does not scroll on desktop or mobile, even with an error", async ({
  page,
}) => {
  // The owner requires the login page to be exactly one viewport tall
  // with no vertical scroll, on desktop and on mobile. The card is
  // centered, so it grows symmetrically when an error appears.
  for (const size of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    const noScroll = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollHeight === window.innerHeight;
    });
    expect(noScroll).toBe(true);
    // Show a per-field error: the card grows, but the page must
    // still not scroll.
    await page.getByLabel("شماره موبایل").fill("123");
    await page.getByLabel("رمز عبور").fill("something");
    await page.getByRole("button", { name: "وارد شوید" }).click();
    await expect(page.getByText("شماره موبایل نادرست است")).toBeVisible();
    const noScrollWithError = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollHeight === window.innerHeight;
    });
    expect(noScrollWithError).toBe(true);
  }
});
test("login button radius is 16px per Figma, not the DS 12px", async ({
  page,
}) => {
  // The Figma login button is 16px radius. This overrides STD-006
  // (button radius 12px) for this button only; the DS 12px rule still
  // applies to other buttons. Recorded as an open item (see the task
  // report). The button is a native button, not the HeroUI Button:
  // the global .button override forces 12px on HeroUI buttons, so the
  // 16px Figma radius needs a native button.
  await page.goto("/login");
  const cta = page.getByRole("button", { name: "وارد شوید" });
  const radius = await cta.evaluate(
    (el) => getComputedStyle(el).borderRadius,
  );
  expect(radius).toBe("16px");
});

test("demo route returns 404", async ({ page }) => {
  const res = await page.goto("/demo");
  expect(res?.status()).toBe(404);
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "ورود به پنل" })).toBeVisible();
  await expect(page.getByLabel("شماره موبایل")).toBeVisible();
  await expect(page.getByLabel("رمز عبور")).toBeVisible();
  await expect(page.getByRole("button", { name: "وارد شوید" })).toBeVisible();
  // The owner signature links Arshiasdrl to his site.
  await expect(page.getByRole("link", { name: "Arshiasdrl" })).toHaveAttribute(
    "href",
    "https://arshiasdrl.ir",
  );
});

test("invalid mobile shows a per-field error without calling the API", async ({
  page,
}) => {
  // Client-side validation: the mobile must be 11 digits starting with
  // 09. An invalid mobile shows "شماره موبایل نادرست است" under the
  // mobile field and the form is not submitted. This runs without a
  // database: no fetch happens, so no 503 appears.
  await page.goto("/login");
  await page.getByLabel("شماره موبایل").fill("123");
  await page.getByLabel("رمز عبور").fill("something");
  await page.getByRole("button", { name: "وارد شوید" }).click();
  await expect(page.getByText("شماره موبایل نادرست است")).toBeVisible();
  await expect(
    page.getByText("مشکلی موقت پیش آمده است. لطفا دوباره تلاش کنید."),
  ).toHaveCount(0);
});

test("empty password shows a per-field error without calling the API", async ({
  page,
}) => {
  // Client-side validation: the password must not be empty. An empty
  // password shows "پر کردن این فیلد الزامی هست" under the password
  // field and the form is not submitted. This runs without a database.
  await page.goto("/login");
  await page.getByLabel("شماره موبایل").fill("09120000000");
  await page.getByRole("button", { name: "وارد شوید" }).click();
  await expect(page.getByText("پر کردن این فیلد الزامی هست")).toBeVisible();
  await expect(
    page.getByText("مشکلی موقت پیش آمده است. لطفا دوباره تلاش کنید."),
  ).toHaveCount(0);
});

test("empty mobile shows the required-field error without calling the API", async ({
  page,
}) => {
  // Client-side validation: an empty mobile shows
  // "پر کردن این فیلد الزامی هست" under the mobile field, not the
  // format error. This runs without a database.
  await page.goto("/login");
  await page.getByLabel("رمز عبور").fill("something");
  await page.getByRole("button", { name: "وارد شوید" }).click();
  await expect(page.getByText("پر کردن این فیلد الزامی هست")).toBeVisible();
  await expect(page.getByText("شماره موبایل نادرست است")).toHaveCount(0);
  await expect(
    page.getByText("مشکلی موقت پیش آمده است. لطفا دوباره تلاش کنید."),
  ).toHaveCount(0);
});

test("unauthenticated panel redirects to login", async ({ page }) => {
  await page.goto("/panel");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "ورود به پنل" })).toBeVisible();
});

test("wrong password shows a Persian error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("شماره موبایل").fill("09120000000");
  await page.getByLabel("رمز عبور").fill("wrong-password");
  await page.getByRole("button", { name: "وارد شوید" }).click();
  await expect(page.getByText("موبایل یا رمز درست نیست.")).toBeVisible();
});

test("database outage shows the temporary-error message (Q-02)", async ({
  page,
}) => {
  // Q-02: a database outage must return 503 and show a distinct
  // message, not "wrong password". The login API wraps its Prisma
  // calls in try/catch and returns 503 with error "server_error";
  // the page shows the approved temporary-error message for 503.
  // This test runs against the no-database test server, so the API
  // returns 503. It fails on the old code (which showed the
  // wrong-password message for any non-OK response except 429)
  // and passes after the fix. With a live database, the 503 path
  // is verified by stopping the database (Alex's Q-02
  // verification: stop the DB, attempt a login, assert 503 and
  // the distinct message).
  await page.goto("/login");
  await page.getByLabel("شماره موبایل").fill("09120000000");
  await page.getByLabel("رمز عبور").fill("wrong-password");
  await page.getByRole("button", { name: "وارد شوید" }).click();
  await expect(
    page.getByText("مشکلی موقت پیش آمده است. لطفا دوباره تلاش کنید."),
  ).toBeVisible();
  await expect(page.getByText("موبایل یا رمز درست نیست.")).toHaveCount(0);
});

test("admin login sees the admin section", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("شماره موبایل").fill("09120000000");
  await page.getByLabel("رمز عبور").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "وارد شوید" }).click();
  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByTestId("admin-section")).toBeVisible();
});

test("seller login does not see the admin section", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("شماره موبایل").fill("09120000001");
  await page.getByLabel("رمز عبور").fill(SELLER_PASSWORD);
  await page.getByRole("button", { name: "وارد شوید" }).click();
  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByTestId("admin-section")).toHaveCount(0);
  await expect(page.getByTestId("non-admin-note")).toBeVisible();
});

test("mobile menu close keeps the scrolled header state (LES-002)", async ({
  page,
}) => {
  // LES-002: closing the mobile menu while scrolled must not wipe the
  // scroll-managed classes. The menu open class was once applied through
  // the className prop, so a React re-render rewrote the class attribute
  // and removed header-scrolled; the header then showed clean until the
  // next scroll. The fix toggles open/show directly on the DOM nodes and
  // keeps the className prop constant, so React never rewrites it.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  // Wait for hydration before scrolling: the scroll listener in
  // SiteHeader mounts on hydration and reads the current scrollY as
  // its starting point. Scrolling before it mounts makes the listener
  // treat the scrolled position as its start, so it never adds
  // header-hidden and the scroll direction is misread.
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  const mobileHeader = page.locator("#mobileHeader");
  const menuToggle = page.getByRole("button", { name: "منو" });
  // Scroll down, then up, so the header is shown and scrolled. Each
  // scroll is confirmed before the next, so the scroll listener sees
  // the direction change in separate animation frames.
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(mobileHeader).toHaveClass(/\bheader-hidden\b/);
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(mobileHeader).toHaveClass(/\bheader-scrolled\b/);
  await expect(mobileHeader).not.toHaveClass(/\bheader-hidden\b/);
  // Baseline: the scrolled shadow is present before the menu opens.
  await expect(mobileHeader).not.toHaveCSS("box-shadow", "none");
  // Open the menu. The scrolled class must survive the re-render.
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(mobileHeader).toHaveClass(/\bopen\b/);
  await expect(mobileHeader).toHaveClass(/\bheader-scrolled\b/);
  // Close the menu. Without scrolling again, the scrolled state must
  // still be there: the class is present and the scrolled shadow is back.
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await expect(mobileHeader).not.toHaveClass(/\bopen\b/);
  await expect(mobileHeader).toHaveClass(/\bheader-scrolled\b/);
  // Let the 0.3s shadow transition finish, then check the visible outcome.
  await page.waitForTimeout(500);
  await expect(mobileHeader).not.toHaveCSS("box-shadow", "none");
});

test("closed mobile menu links are not focusable (R-04)", async ({ page }) => {
  // R-04: closed mobile menu links must not be in the Tab order.
  // The menu was hidden with grid 0fr + opacity 0 only, so the links
  // stayed focusable. The fix adds visibility hidden to the closed
  // state (REM-03). This test fails on the old CSS and passes after.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  const menuToggle = page.getByRole("button", { name: "منو" });
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  // Focus the toggle, then Tab. Focus must skip the closed menu links
  // and land outside the menu.
  await menuToggle.focus();
  await page.keyboard.press("Tab");
  const where = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return "none";
    const inMenu = el.closest(".mobile-menu") !== null;
    return (inMenu ? "in-menu:" : "outside:") + (el.textContent || "").trim();
  });
  expect(where.startsWith("in-menu:")).toBe(false);
});

test("Escape closes the mobile menu and returns focus to the toggle (R-05)", async ({
  page,
}) => {
  // R-05: Escape must close the mobile menu and return focus to the
  // toggle. There was no Escape handler, so Escape did nothing and the
  // menu stayed open. This test fails on the old code and passes after.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  const mobileHeader = page.locator("#mobileHeader");
  const menuToggle = page.getByRole("button", { name: "منو" });
  // Open the menu.
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(mobileHeader).toHaveClass(/\bopen\b/);
  // Press Escape. The menu must close and focus must return to the toggle.
  await page.keyboard.press("Escape");
  await expect(mobileHeader).not.toHaveClass(/\bopen\b/);
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  const focused = await page.evaluate(
    () => document.activeElement?.getAttribute("aria-label") ?? "",
  );
  expect(focused).toBe("منو");
});

test("booking and login use their own skeleton, not the hero skeleton (R-06)", async ({
  page,
}) => {
  // R-06: navigating to /booking or /login must not show the hero
  // skeleton. The group loading.tsx renders HeroSkeleton for the whole
  // (public) group; the segment loading.tsx files override it per
  // route (Next.js uses the nearest loading.tsx).
  //
  // A live throttled client-side navigation cannot reliably show the
  // skeleton here: Next.js prefetches Link routes, so a click reuses
  // the cached payload and no loading UI paints; and when the RSC
  // fetch is delayed, React keeps the current page visible during the
  // navigation transition instead of painting the loading boundary
  // (verified by probes: a 5s delayed RSC fetch shows no skeleton at
  // all). So this test proves the fix by file precedence and by the
  // served response instead of by a live paint.
  //
  // Old-vs-new proof: before the fix there were no segment loading
  // files, so the served HTML for /booking and /login carried only
  // the hero skeleton as the loading fallback. After the fix the
  // served HTML carries the segment skeleton for each route. This
  // test fails on the old code (no segment skeleton in the response)
  // and passes after the fix.
  const fs = await import("node:fs");
  const path = await import("node:path");
  const bookingLoading = path.join(
    process.cwd(),
    "src/app/(public)/booking/loading.tsx",
  );
  const loginLoading = path.join(
    process.cwd(),
    "src/app/(public)/login/loading.tsx",
  );
  expect(fs.existsSync(bookingLoading)).toBe(true);
  expect(fs.existsSync(loginLoading)).toBe(true);
  expect(fs.readFileSync(bookingLoading, "utf8")).toContain("booking-skeleton");
  expect(fs.readFileSync(loginLoading, "utf8")).toContain("login-skeleton");

  // The served HTML for each route must carry its own segment
  // skeleton as the loading fallback.
  const bookingRes = await page.request.get("/booking");
  expect(bookingRes.ok()).toBe(true);
  const bookingHtml = await bookingRes.text();
  expect(bookingHtml).toContain("booking-skeleton");
  const loginRes = await page.request.get("/login");
  expect(loginRes.ok()).toBe(true);
  const loginHtml = await loginRes.text();
  expect(loginHtml).toContain("login-skeleton");

  // Navigating to both routes renders the page content, and no
  // skeleton remains once loaded.
  await page.goto("/booking");
  await expect(
    page.getByText("رزرو آنلاین نوبت در مرحله بعد فعال می شود."),
  ).toBeVisible();
  await expect(page.locator(".hero-skeleton")).toHaveCount(0);
  await expect(page.locator(".booking-skeleton")).toHaveCount(0);
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "ورود به پنل" })).toBeVisible();
  await expect(page.locator(".hero-skeleton")).toHaveCount(0);
  await expect(page.locator(".login-skeleton")).toHaveCount(0);
});

test("footer renders with copyright, contact, and Instagram link", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.locator("footer.site-footer");
  await expect(footer).toBeVisible();
  await expect(
    footer.getByText("© ۱۴۰۴ عینک رایبد. تمامی حقوق محفوظ است."),
  ).toBeVisible();
  await expect(
    footer.getByText("آدرس: خیابان طالقانی، چهارراه امیریه، بجنورد."),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "058-3223-8568" }),
  ).toHaveAttribute("href", "tel:+985832238568");
  await expect(
    footer.getByRole("link", { name: "0912-098-7790" }),
  ).toHaveAttribute("href", "tel:+989120987790");
  const instagram = footer.getByRole("link", {
    name: "اینستاگرام عینک رایبد",
  });
  await expect(instagram).toBeVisible();
  await expect(instagram).toHaveAttribute(
    "href",
    "https://www.instagram.com/raibodoptic.ir",
  );
  await expect(footer.getByRole("link", { name: "رزرو نوبت" })).toHaveAttribute(
    "href",
    "/booking",
  );
});

test("footer is visible on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const footer = page.locator("footer.site-footer");
  await expect(footer).toBeVisible();
  await expect(
    footer.getByText("© ۱۴۰۴ عینک رایبد. تمامی حقوق محفوظ است."),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "اینستاگرام عینک رایبد" }),
  ).toBeVisible();
});
