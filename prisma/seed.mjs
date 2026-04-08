import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLOT_TEMPLATES = {
  vsl: [
    { startTime: "09:00", endTime: "11:00" },
    { startTime: "11:30", endTime: "13:30" },
    { startTime: "14:00", endTime: "16:00", peakTime: true, label: "Peak Time", priceModifier: 1.25 },
    { startTime: "16:30", endTime: "18:30", peakTime: true, label: "Peak Time", priceModifier: 1.25 },
    { startTime: "19:00", endTime: "21:00", peakTime: true, label: "Evening Premium", priceModifier: 1.35 },
  ],
  vsr: [
    { startTime: "09:00", endTime: "11:00" },
    { startTime: "11:30", endTime: "13:30" },
    { startTime: "14:00", endTime: "16:00" },
    { startTime: "16:30", endTime: "18:30", peakTime: true, label: "Prime Slot", priceModifier: 1.2 },
    { startTime: "19:00", endTime: "21:00", peakTime: true, label: "Prime Slot", priceModifier: 1.3 },
  ],
  arcade: [
    { startTime: "10:00", endTime: "13:00" },
    { startTime: "13:30", endTime: "16:30" },
    { startTime: "17:00", endTime: "20:00", peakTime: true, label: "Event Peak", priceModifier: 1.4 },
  ],
};

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

async function normalizeLegacyEnumRows() {
  await prisma.$executeRawUnsafe(`
    UPDATE "Booking"
    SET space = CASE
      WHEN space::text = 'VSL' THEN 'vsl'::"Space"
      WHEN space::text = 'VSR' THEN 'vsr'::"Space"
      WHEN space::text = 'ARCADE' THEN 'arcade'::"Space"
      ELSE space
    END
    WHERE space::text IN ('VSL', 'VSR', 'ARCADE')
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "WaitlistEntry"
    SET space = CASE
      WHEN space::text = 'VSL' THEN 'vsl'::"Space"
      WHEN space::text = 'VSR' THEN 'vsr'::"Space"
      WHEN space::text = 'ARCADE' THEN 'arcade'::"Space"
      ELSE space
    END
    WHERE space::text IN ('VSL', 'VSR', 'ARCADE')
  `);

  await prisma.$executeRawUnsafe(`
    DELETE FROM "AvailabilitySlot"
    WHERE space::text IN ('VSL', 'VSR', 'ARCADE')
  `);
}

async function seedSlots() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const [space, templates] of Object.entries(SLOT_TEMPLATES)) {
    const rows = [];

    for (let dayOffset = 0; dayOffset < 90; dayOffset += 1) {
      const dateKey = formatDateKey(addDays(today, dayOffset));

      for (const template of templates) {
        rows.push({
          space,
          dateKey,
          startTime: template.startTime,
          endTime: template.endTime,
          status: "available",
          peakTime: Boolean(template.peakTime),
          label: template.label ?? null,
          priceModifier: template.priceModifier ?? 1,
          bufferBefore: 30,
          bufferAfter: 30,
        });
      }
    }

    await prisma.availabilitySlot.createMany({
      data: rows,
      skipDuplicates: true,
    });
  }
}

async function seedSettings() {
  await prisma.appSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      cancelFullRefundHours: 72,
      cancelPartialRefundHours: 24,
      partialRefundPercentage: 50,
      defaultBufferBefore: 30,
      defaultBufferAfter: 30,
      peakPricingMultiplier: 1.25,
      whatsappNumber: null,
      reminderEmailEnabled: false,
      reminderSmsEnabled: false,
    },
  });
}

async function main() {
  await normalizeLegacyEnumRows();
  await seedSettings();
  await seedSlots();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Prisma seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
