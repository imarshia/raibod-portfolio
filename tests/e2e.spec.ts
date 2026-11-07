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

test("landing renders with hero, services, and booking CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("عینک رایبد");
  const cta = page.getByRole("link", { name: "رزرو نوبت معاینه" });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/booking");
  await expect(page.getByRole("heading", { name: "خدمات", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "معاینه چشم" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "درباره ما", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "تماس", exact: true })).toBeVisible();
  // Jalali date in Latin digits, format YYYY/MM/DD (Design System v3.2 section 2).
  await expect(page.getByText(/امروز به جلالی: 14\d\d\/\d\d\/\d\d/)).toBeVisible();
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

test("theme toggle switches light/dark and persists", async ({ page }) => {
  await page.goto("/");
  // System theme in the test browser is light, so the toggle offers dark.
  const toggle = page.getByRole("button", { name: "تم تیره" });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(
    page.getByRole("button", { name: "تم روشن" }),
  ).toBeVisible();
  // Switch back so later tests start from light.
  await page.getByRole("button", { name: "تم روشن" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("primary button radius is 12px, not the HeroUI v3 default 24px", async ({
  page,
}) => {
  await page.goto("/");
  const cta = page.getByRole("button", { name: "رزرو نوبت معاینه" });
  const radius = await cta.evaluate(
    (el) => getComputedStyle(el).borderRadius,
  );
  expect(radius).toBe("12px");
});

test("demo route returns 404", async ({ page }) => {
  const res = await page.goto("/demo");
  expect(res?.status()).toBe(404);
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "ورود به پنل" })).toBeVisible();
  await expect(page.getByLabel("موبایل")).toBeVisible();
  await expect(page.getByLabel("رمز عبور")).toBeVisible();
  await expect(page.getByRole("button", { name: "ورود" })).toBeVisible();
});

test("unauthenticated panel redirects to login", async ({ page }) => {
  await page.goto("/panel");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "ورود به پنل" })).toBeVisible();
});

test("wrong password shows a Persian error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("موبایل").fill("09120000000");
  await page.getByLabel("رمز عبور").fill("wrong-password");
  await page.getByRole("button", { name: "ورود" }).click();
  await expect(page.getByText("موبایل یا رمز درست نیست.")).toBeVisible();
});

test("admin login sees the admin section", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("موبایل").fill("09120000000");
  await page.getByLabel("رمز عبور").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "ورود" }).click();
  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByTestId("admin-section")).toBeVisible();
});

test("seller login does not see the admin section", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("موبایل").fill("09120000001");
  await page.getByLabel("رمز عبور").fill(SELLER_PASSWORD);
  await page.getByRole("button", { name: "ورود" }).click();
  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByTestId("admin-section")).toHaveCount(0);
  await expect(page.getByTestId("non-admin-note")).toBeVisible();
});
