// scripts/seed-admin.ts creates (upserts) the real manager account for
// the Raibod shop. It reads the mobile, password, and name ONLY from the
// environment (RAIBOD_ADMIN_MOBILE, RAIBOD_ADMIN_PASSWORD,
// RAIBOD_ADMIN_NAME, default "مدیر رایبد"). No credential is hardcoded
// in this file, and the plaintext password is never logged or printed.
// Safety: the same guard as prisma/seed.ts (STD-015): refuses in
// NODE_ENV=production, requires ALLOW_ADMIN_SEED=true on every run, and
// only runs against the allowlisted local destinations (localhost /
// 127.0.0.1 / ::1, database raibod_poc). The password is hashed with
// argon2 (the same as src/lib/auth). The script is safe to run more
// than once: it upserts by mobile. The manager must change the password
// after the first login.
// Run (with a local database available):
//   RAIBOD_ADMIN_MOBILE=09xxxxxxxxx RAIBOD_ADMIN_PASSWORD=... ALLOW_ADMIN_SEED=true npx tsx scripts/seed-admin.ts
// Or via npm: npm run seed:admin (with the same env vars set).

import "dotenv/config";

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

function validateEnvironment(): {
  mobile: string;
  password: string;
  name: string;
} {
  if (process.env.NODE_ENV === "production") {
    refuse(
      "NODE_ENV=production. Admin seed must never run in production, even with ALLOW_ADMIN_SEED=true."
    );
  }
  if (process.env.ALLOW_ADMIN_SEED !== "true") {
    refuse(
      "ALLOW_ADMIN_SEED=true is required. Run with ALLOW_ADMIN_SEED=true."
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
  const mobile = process.env.RAIBOD_ADMIN_MOBILE;
  if (!mobile) {
    refuse("RAIBOD_ADMIN_MOBILE is not set.");
  }
  if (!/^09\d{9}$/.test(mobile)) {
    refuse("RAIBOD_ADMIN_MOBILE must be 11 digits starting with 09.");
  }
  const password = process.env.RAIBOD_ADMIN_PASSWORD;
  if (!password) {
    refuse("RAIBOD_ADMIN_PASSWORD is not set.");
  }
  if (password.length < 8) {
    refuse("RAIBOD_ADMIN_PASSWORD must be at least 8 characters.");
  }
  const name = process.env.RAIBOD_ADMIN_NAME ?? "مدیر رایبد";
  return { mobile, password, name };
}

async function main() {
  const { mobile, password, name } = validateEnvironment();
  const { prisma } = await import("../src/lib/db");
  const { hashPassword } = await import("../src/lib/auth");

  try {
    const passwordHash = await hashPassword(password);
    await prisma.user.upsert({
      where: { mobile },
      update: {
        passwordHash,
        role: "ADMIN",
        active: true,
        fullName: name,
      },
      create: {
        fullName: name,
        mobile,
        passwordHash,
        role: "ADMIN",
        active: true,
      },
    });
    console.log(
      "Admin seed done: manager account created (role ADMIN, active). The manager must change the password after the first login."
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
