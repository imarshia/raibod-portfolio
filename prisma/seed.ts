// prisma/seed.ts creates test-only users. The passwords below are public test
// credentials for the local PoC only. They must be changed or removed before
// any real use. This file is throwaway seed data, not production data.

import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function main() {
  const adminHash = await hashPassword("Admin1234!");
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
  const sellerHash = await hashPassword("Seller1234!");
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
  console.log("Seed done: admin 09120000000 / Admin1234!, seller 09120000001 / Seller1234!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
