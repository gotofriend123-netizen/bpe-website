import { prisma } from "@/lib/prisma";
import { Space } from "@prisma/client";
import { buildLocalDateTime, getLocalDateKey } from "@/lib/booking/time";

export async function getQRCodeForVenue(venue: Space) {
  try {
    const qrCode = await prisma.venueQRCode.findUnique({
      where: { venue, isActive: true },
    });
    return qrCode;
  } catch {
    return null;
  }
}

export async function validateCheckinEligibility(userId: string, space: Space, dateKey?: string) {
  const today = dateKey || getLocalDateKey(buildLocalDateTime());
  
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        userId,
        space,
        dateKey: today,
        status: "confirmed",
      },
      orderBy: { startTime: "asc" },
    });

    if (!booking) {
      return { valid: false, error: "NO_BOOKING", message: "No valid booking found for today." };
    }

    return { valid: true, booking };
  } catch {
    return { valid: false, error: "ERROR", message: "Failed to validate booking" };
  }
}