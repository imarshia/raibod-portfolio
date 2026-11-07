// scripts/screenshots.ts takes desktop and mobile screenshots of the main pages
// with shell Playwright. The dev server must be running on localhost:3000.
// Run: npx tsx scripts/screenshots.ts

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import "dotenv/config";

// The admin test password comes from the environment (gitignored .env).
// It is never hardcoded: a missing variable stops the run loudly.
function requiredEnv(name: "TEST_ADMIN_PASSWORD"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Set it in the local .env (see README, test accounts section).`
    );
  }
  return value;
}

const ADMIN_PASSWORD = requiredEnv("TEST_ADMIN_PASSWORD");

const OUT = "verification";

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const pages = [
    { name: "home", url: "/" },
    { name: "login", url: "/login" },
    { name: "demo", url: "/demo" },
    { name: "print", url: "/print" },
  ];
  for (const size of [
    { label: "desktop", width: 1280, height: 800 },
    { label: "mobile", width: 390, height: 844 },
  ]) {
    for (const p of pages) {
      const ctx = await browser.newContext({
        viewport: { width: size.width, height: size.height },
      });
      const page = await ctx.newPage();
      await page.goto(`http://localhost:3000${p.url}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/${size.label}-${p.name}.png`, fullPage: true });
      console.log(`saved ${OUT}/${size.label}-${p.name}.png`);
      await ctx.close();
    }
  }
  // Panel as logged-in admin, desktop and mobile.
  for (const size of [
    { label: "desktop", width: 1280, height: 800 },
    { label: "mobile", width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: size.width, height: size.height },
    });
    const page = await ctx.newPage();
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
    await page.getByLabel("موبایل").fill("09120000000");
    await page.getByLabel("رمز عبور").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "ورود" }).click();
    await page.waitForURL(/\/panel$/);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/${size.label}-panel.png`, fullPage: true });
    console.log(`saved ${OUT}/${size.label}-panel.png`);
    await ctx.close();
  }
  await browser.close();
  console.log("Screenshots done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
