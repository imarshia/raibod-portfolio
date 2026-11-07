// scripts/test-login-lockout.mjs: HTTP-level check of the login lockout.
// Run against a running production server, e.g.:
//   npm run start -- -p 3100   (in one shell)
//   BASE_URL=http://localhost:3100 npm run test:lockout
// Uses the SELLER test user (09120000001) so the admin account stays usable
// for the e2e suite. Leaves the seller account LOCKED on purpose; unlock it
// with:  psql -d raibod_poc -c "UPDATE users SET failed_login_attempts=0,
//   locked_until=NULL WHERE mobile='09120000001';"
// or simply re-run the seed:  ALLOW_TEST_SEED=true npx tsx prisma/seed.ts
// Exits non-zero on any failed check.

import "dotenv/config";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const MOBILE = "09120000001";
const WRONG = "WrongPass123!";
// The seller password comes from the environment (gitignored .env).
// It is never hardcoded: a missing variable stops the run loudly.
const RIGHT = process.env.TEST_SELLER_PASSWORD;
if (!RIGHT) {
  console.error(
    "TEST_SELLER_PASSWORD is not set. Set it in the local .env (see README, test accounts section)."
  );
  process.exit(1);
}

let failures = 0;
function check(name, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: got ${actual}, expected ${expected}`);
}

async function login(mobile, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password }),
  });
  return res.status;
}

const s1 = await login(MOBILE, WRONG);
check("wrong password #1", s1, 401);
const s2 = await login(MOBILE, WRONG);
check("wrong password #2", s2, 401);
const s3 = await login(MOBILE, WRONG);
check("wrong password #3", s3, 401);
const s4 = await login(MOBILE, WRONG);
check("wrong password #4", s4, 401);
const s5 = await login(MOBILE, WRONG);
check("wrong password #5 (lock triggers)", s5, 401);
const s6 = await login(MOBILE, RIGHT);
check("correct password while locked", s6, 429);
const s7 = await login(MOBILE, WRONG);
check("wrong password while locked", s7, 429);
const s8 = await login("09120000999", WRONG);
check("unknown mobile still 401, not 429", s8, 401);

if (failures > 0) {
  console.log(`LOCKOUT TEST FAILED (${failures} checks)`);
  process.exit(1);
}
console.log("LOCKOUT TEST PASSED (8/8). Seller test account is now locked; unlock via seed or psql (see header).");
