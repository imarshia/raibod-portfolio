// prisma/seed.ts creates test-only users for the LOCAL database only.
// Safety: the seed refuses to run unless ALL of these hold:
//   1. NODE_ENV is not "production". Production refuses unconditionally,
//      even when the explicit flag is set.
//   2. ALLOW_TEST_SEED is exactly "true" (explicit opt-in on every run).
//   3. DATABASE_URL points at an allowlisted local destination:
//      host localhost / 127.0.0.1 / ::1 AND database raibod_poc.
//      Any other host or database is refused without touching it.
//   4. TEST_ADMIN_PASSWORD and TEST_SELLER_PASSWORD are set in the
//      environment (loaded from the gitignored .env by dotenv).
//      No password is hardcoded anywhere in this file.
// The checks run BEFORE the Prisma client is imported, so a refused run
// never constructs a client and never touches any database.

import "dotenv/config";

// Allowed destinations for test seeding. Local apt PostgreSQL and the
// Docker setup both reach PostgreSQL on localhost:5432 (the compose file
// maps 5432:5432), so localhost covers both. A future containerized app
// setup would extend this list deliberately, never by guessing.
const ALLOWED_DB_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const ALLOWED_DB_NAME = "raibod_poc";

function refuse(message: string): never {
  console.error(`Seed refused: ${message}`);
  process.exit(1);
}

function readDestination(): { host: string; database: string } {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    refuse("DATABASE_URL is not set.");
  }
  let url: URL;
  try {
    url = new URL(databaseUrl);
  } catch {
    refuse("DATABASE_URL is not a valid URL.");
  }
  // URL keeps the IPv6 brackets in hostname ("[::1]"); strip them.
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const database = url.pathname.replace(/^\//, "");
  return { host, database };
}

function validateSeedEnvironment(): {
  adminPassword: string;
  sellerPassword: string;
} {
  if (process.env.NODE_ENV === "production") {
    refuse(
      "NODE_ENV=production. Test seed must never run in production, even with ALLOW_TEST_SEED=true."
    );
  }
  if (process.env.ALLOW_TEST_SEED !== "true") {
    refuse(
      "ALLOW_TEST_SEED=true is required. Run with ALLOW_TEST_SEED=true (see README, test accounts section)."
    );
  }
  const { host, database } = readDestination();
  if (!ALLOWED_DB_HOSTS.has(host)) {
    refuse(
      `Database host '${host}' is not in the seed allowlist (${[...ALLOWED_DB_HOSTS].join(", ")}).`
    );
  }
  if (database !== ALLOWED_DB_NAME) {
    refuse(
      `Database '${database}' is not in the seed allowlist (expected '${ALLOWED_DB_NAME}').`
    );
  }
  const adminPassword = process.env.TEST_ADMIN_PASSWORD;
  if (!adminPassword) {
    refuse("TEST_ADMIN_PASSWORD is not set.");
  }
  const sellerPassword = process.env.TEST_SELLER_PASSWORD;
  if (!sellerPassword) {
    refuse("TEST_SELLER_PASSWORD is not set.");
  }
  return { adminPassword, sellerPassword };
}

async function main() {
  const { adminPassword, sellerPassword } = validateSeedEnvironment();
  const { prisma } = await import("../src/lib/db");
  const { hashPassword } = await import("../src/lib/auth");

  try {
    const adminHash = await hashPassword(adminPassword);
    await prisma.user.upsert({
      where: { mobile: "09120000000" },
      update: { passwordHash: adminHash, role: "ADMIN", active: true, fullName: "مدیر تست" },
      create: {
        fullName: "مدیر تست",
        mobile: "09120000000",
        passwordHash: adminHash,
        role: "ADMIN",
        active: true,
      },
    });
    const sellerHash = await hashPassword(sellerPassword);
    await prisma.user.upsert({
      where: { mobile: "09120000001" },
      update: { passwordHash: sellerHash, role: "SELLER", active: true, fullName: "فروشنده تست" },
      create: {
        fullName: "فروشنده تست",
        mobile: "09120000001",
        passwordHash: sellerHash,
        role: "SELLER",
        active: true,
      },
    });
    // Re-seeding also clears any lockout counters, so repeated e2e runs that
    // submit a wrong password never lock the test accounts (see HANDOVER §3).
    await prisma.user.updateMany({
      where: { mobile: { in: ["09120000000", "09120000001"] } },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
    console.log("Seed done: admin 09120000000, seller 09120000001 (test accounts, local only).");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
