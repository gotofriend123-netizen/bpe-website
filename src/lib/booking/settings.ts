import "server-only";

import { prisma } from "@/lib/prisma";
import {
  FALLBACK_BOOKING_DURATION_HOURS,
  normalizeBookingDurationHours,
} from "@/lib/booking/duration";

export async function getPublicBookingSettings() {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { id: 1 },
      select: {
        defaultBookingDurationHours: true,
      },
    });

    return {
      defaultBookingDurationHours: normalizeBookingDurationHours(
        settings?.defaultBookingDurationHours,
      ),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown settings error";
    console.error(`[booking-settings] Falling back to default booking duration: ${reason}`);

    return {
      defaultBookingDurationHours: FALLBACK_BOOKING_DURATION_HOURS,
    };
  }
}
