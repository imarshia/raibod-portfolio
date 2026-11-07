// scripts/test-exclusion.ts proves the raw-SQL Exclusion Constraint pattern
// rejects an overlapping booking for the same doctor, and allows a
// non-overlapping booking and an overlapping booking for a different doctor.
// The demo_bookings table was removed in Phase 1, so this test creates its
// own scratch table with the same tstzrange + Exclusion Constraint, runs
// the three checks, then drops the scratch table. Nothing is left behind.
// Run: npm run test:exclusion
// Exit code 0 means all three checks passed.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TABLE = "exclusion_probe_slots";

const DOCTOR_A = "11111111-1111-1111-1111-111111111111";
const DOCTOR_B = "22222222-2222-2222-2222-222222222222";

async function setup() {
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${TABLE}`);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE ${TABLE} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      doctor_id UUID NOT NULL,
      slot tstzrange NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING'
    )`);
  await prisma.$executeRawUnsafe(`
    ALTER TABLE ${TABLE}
    ADD CONSTRAINT ${TABLE}_no_overlap
    EXCLUDE USING gist ("doctor_id" WITH =, "slot" WITH &&)
    WHERE ("status" IN ('PENDING', 'CONFIRMED'))`);
}

async function insert(doctorId: string, from: string, to: string, status: string) {
  return prisma.$executeRawUnsafe(
    `INSERT INTO ${TABLE} (doctor_id, slot, status) VALUES ($1::uuid, tstzrange($2::timestamptz, $3::timestamptz, '[)'), $4)`,
    doctorId,
    from,
    to,
    status,
  );
}

async function main() {
  await setup();
  let passed = 0;
  let failed = 0;

  try {
    await insert(DOCTOR_A, "2026-11-10T06:30:00Z", "2026-11-10T06:45:00Z", "CONFIRMED");
    console.log("1. First booking for doctor A inserted.");

    try {
      await insert(DOCTOR_A, "2026-11-10T06:40:00Z", "2026-11-10T06:55:00Z", "CONFIRMED");
      console.log("2. FAIL: overlapping booking for doctor A was accepted.");
      failed++;
    } catch (e) {
      const meta = (e as { meta?: { message?: string } }).meta;
      const msg = meta?.message ?? (e instanceof Error ? e.message : String(e));
      console.log("2. PASS: overlapping booking for doctor A rejected.");
      console.log("   Exact error:", msg.replace(/\n/g, " | "));
      passed++;
    }

    try {
      await insert(DOCTOR_A, "2026-11-10T07:00:00Z", "2026-11-10T07:15:00Z", "CONFIRMED");
      console.log("3. PASS: non-overlapping booking for doctor A accepted.");
      passed++;
    } catch (e) {
      console.log("3. FAIL: non-overlapping booking rejected:", e instanceof Error ? e.message : e);
      failed++;
    }

    try {
      await insert(DOCTOR_B, "2026-11-10T06:40:00Z", "2026-11-10T06:55:00Z", "CONFIRMED");
      console.log("4. PASS: overlapping booking for a different doctor accepted.");
      passed++;
    } catch (e) {
      console.log("4. FAIL: different doctor booking rejected:", e instanceof Error ? e.message : e);
      failed++;
    }

    console.log(`Result: ${passed} passed, ${failed} failed.`);
    const code = failed === 0 ? 0 : 1;
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${TABLE}`);
    await prisma.$disconnect();
    process.exit(code);
  } catch (e) {
    console.error(e);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${TABLE}`).catch(() => undefined);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${TABLE}`).catch(() => undefined);
  await prisma.$disconnect();
  process.exit(1);
});
