// scripts/test-exclusion.ts proves the raw-SQL Exclusion Constraint rejects
// an overlapping booking for the same doctor, and allows a non-overlapping
// booking and an overlapping booking for a different doctor.
// Run: npm run test:exclusion
// Exit code 0 means all three checks passed.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DOCTOR_A = "11111111-1111-1111-1111-111111111111";
const DOCTOR_B = "22222222-2222-2222-2222-222222222222";

async function insert(doctorId: string, from: string, to: string, status: string) {
  return prisma.$executeRawUnsafe(
    `INSERT INTO demo_bookings (id, doctor_id, slot, status) VALUES (gen_random_uuid(), $1::uuid, tstzrange($2::timestamptz, $3::timestamptz, '[)'), $4::"DemoBookingStatus")`,
    doctorId,
    from,
    to,
    status,
  );
}

async function main() {
  await prisma.$executeRawUnsafe(`DELETE FROM demo_bookings`);
  let passed = 0;
  let failed = 0;

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

  const count = await prisma.$queryRawUnsafe<{ n: bigint }[]>(
    `SELECT COUNT(*)::bigint AS n FROM demo_bookings`,
  );
  console.log(`Bookings in table after test: ${count[0].n}`);
  console.log(`Result: ${passed} passed, ${failed} failed.`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
