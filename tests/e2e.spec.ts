// tests/e2e.spec.ts: login and panel access checks against the running dev server.
// Run the dev server first, then: npm run test:e2e

import { test, expect } from "@playwright/test";

test("home page shows Jalali date and proof list", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("رایبد: نمونه عملی پشته");
  await expect(page.getByText("امروز به جلالی: ۱۴۰۵")).toBeVisible();
});

test("unauthenticated panel redirects to login", async ({ page }) => {
  await page.goto("/panel");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator("h1")).toContainText("ورود به پنل");
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
  await page.getByLabel("رمز عبور").fill("Admin1234!");
  await page.getByRole("button", { name: "ورود" }).click();
  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByTestId("admin-section")).toBeVisible();
});

test("seller login does not see the admin section", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("موبایل").fill("09120000001");
  await page.getByLabel("رمز عبور").fill("Seller1234!");
  await page.getByRole("button", { name: "ورود" }).click();
  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByTestId("admin-section")).toHaveCount(0);
  await expect(page.getByTestId("non-admin-note")).toBeVisible();
});

test("demo form shows Persian validation errors", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "بررسی فرم" }).click();
  await expect(page.getByText("نام کامل باید حداقل ۳ حرف باشد.")).toBeVisible();
  await expect(page.getByText("شماره موبایل باید ۱۱ رقم و با 09 شروع شود.")).toBeVisible();
});
