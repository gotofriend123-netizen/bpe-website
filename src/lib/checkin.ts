import { prisma } from "@/lib/prisma";
import { Space } from "@prisma/client";
import { getLocalDateKey } from "@/lib/booking/time";

export async function validateCheckinForUser(userId: string, space: Space = "arcade") {
  const today = getLocalDateKey(new Date());
  
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
    return { valid: false, error: "ERROR", message: "System under maintenance." };
  }
}