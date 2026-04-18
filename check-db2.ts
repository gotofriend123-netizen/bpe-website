import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 2,
    select: {
      reference: true,
      createdAt: true,
      customerPhone: true,
      adminEmailSent: true,
      customerEmailSent: true,
      customerWhatsappSent: true,
      adminWhatsappSent: true,
      notificationFailedReason: true
    }
  });
  console.log(JSON.stringify(bookings, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
