import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email>");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    console.error(`No user found for ${normalizedEmail}`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email: normalizedEmail },
    data: { role: "admin" },
    select: { id: true, name: true, email: true, role: true },
  });

  console.log(`Promoted ${updated.email} (${updated.name}) from ${user.role} to ${updated.role}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

