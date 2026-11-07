// scripts/test-seed-guard.ts checks the seed safety guard (prisma/seed.ts).
// It spawns the seed with different environments and asserts refusal or
// success. The success case really seeds the local database, exactly like
// a normal seed run. Run: npm run test:seed-guard
// Requires the Prisma engine env vars (see README, setup section).

import "dotenv/config";
import { spawnSync } from "node:child_process";

type SeedCase = {
  name: string;
  env: Record<string, string | undefined>;
  expectRefuse: boolean;
  expectText: string;
};

const BASE_ENV: Record<string, string | undefined> = { ...process.env };
const REAL_URL = BASE_ENV.DATABASE_URL ?? "";

function runSeed(overrides: Record<string, string | undefined>) {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const [key, value] of Object.entries({ ...BASE_ENV, ...overrides })) {
    if (value !== undefined) {
      env[key] = value;
    } else {
      delete env[key];
    }
  }
  const result = spawnSync("npx", ["tsx", "prisma/seed.ts"], {
    cwd: process.cwd(),
    env,
    encoding: "utf-8",
    timeout: 60000,
  });
  return {
    status: result.status,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`,
  };
}

const cases: SeedCase[] = [
  {
    name: "production refuses even with the flag set",
    env: { NODE_ENV: "production", ALLOW_TEST_SEED: "true" },
    expectRefuse: true,
    expectText: "production",
  },
  {
    name: "missing flag refuses",
    env: { NODE_ENV: "development", ALLOW_TEST_SEED: undefined },
    expectRefuse: true,
    expectText: "ALLOW_TEST_SEED",
  },
  {
    name: "remote host refuses",
    env: {
      NODE_ENV: "development",
      ALLOW_TEST_SEED: "true",
      DATABASE_URL: "postgresql://raibod:x@db.example.com:5432/raibod_poc",
    },
    expectRefuse: true,
    expectText: "not in the seed allowlist",
  },
  {
    name: "wrong database refuses",
    env: {
      NODE_ENV: "development",
      ALLOW_TEST_SEED: "true",
      DATABASE_URL: REAL_URL.replace(/\/raibod_poc$/, "/otherdb"),
    },
    expectRefuse: true,
    expectText: "not in the seed allowlist",
  },
  {
    name: "missing passwords refuse",
    // dotenv would reload the passwords from .env, so point it at an
    // empty file and pass DATABASE_URL directly to isolate this check.
    env: {
      NODE_ENV: "development",
      ALLOW_TEST_SEED: "true",
      DOTENV_CONFIG_PATH: "/dev/null",
      DATABASE_URL: REAL_URL,
      TEST_ADMIN_PASSWORD: undefined,
      TEST_SELLER_PASSWORD: undefined,
    },
    expectRefuse: true,
    expectText: "TEST_ADMIN_PASSWORD",
  },
  {
    name: "allowed environment seeds successfully",
    env: { NODE_ENV: "development", ALLOW_TEST_SEED: "true" },
    expectRefuse: false,
    expectText: "Seed done",
  },
];

let failures = 0;
for (const c of cases) {
  const { status, output } = runSeed(c.env);
  const refused = status !== 0;
  const ok = refused === c.expectRefuse && output.includes(c.expectText);
  console.log(
    `${ok ? "PASS" : "FAIL"} - ${c.name} (exit ${status ?? "null"}, expected ${c.expectRefuse ? "refusal" : "success"})`
  );
  if (!ok) {
    failures += 1;
    console.log(`  output was: ${output.slice(0, 300)}`);
  }
}

if (failures > 0) {
  console.log(`SEED GUARD TEST FAILED (${failures}/${cases.length})`);
  process.exit(1);
}
console.log(`SEED GUARD TEST PASSED (${cases.length}/${cases.length})`);
