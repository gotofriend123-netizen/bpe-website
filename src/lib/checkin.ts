import { prisma } from "@/lib/prisma";
import { Space } from "@prisma/client";
import { getLocalDateKey, buildLocalDateTime } from "@/lib/booking/time";

/** Map venue slugs to internal Space enum values */
const VENUE_SLUG_TO_SPACE: Record<string, Space> = {
  "arcade-main-gate": "arcade",
};

const VENUE_SLUG_TO_LABEL: Record<string, string> = {
  "arcade-main-gate": "Arcade Community Hall",
};

export function resolveVenueSlug(slug: string): { space: Space; label: string } | null {
  const space = VENUE_SLUG_TO_SPACE[slug];
  const label = VENUE_SLUG_TO_LABEL[slug];
  if (!space || !label) return null;
  return { space, label };
}

/**
 * Validate whether the user has a booking that is eligible for check-in right now.
 *
 * Rules:
 * - Must have a confirmed booking for today at this venue
 * - Booking time window: user can check in up to 30 min before start until end time
 * - Must not already have an active check-in
 */
export async function validateCheckinForUser(
  userId: string,
  space: Space = "arcade"
) {
  const now = new Date();
  const today = getLocalDateKey(now);

  try {
    // 1. Check for existing active check-in session for this user at this venue
    const activeCheckin = await prisma.bookingCheckin.findFirst({
      where: {
        userId,
        space,
        status: "checked_in",
      },
    });

    if (activeCheckin) {
      return {
        valid: true,
        booking: await prisma.booking.findUnique({
          where: { id: activeCheckin.bookingId },
          select: {
            id: true,
            reference: true,
            space: true,
            dateKey: true,
            startTime: true,
            endTime: true,
            packageLabel: true,
            status: true,
          },
        }),
        activeCheckin: {
          id: activeCheckin.id,
          checkedInAt: activeCheckin.checkedInAt?.toISOString() ?? null,
          checkedOutAt: activeCheckin.checkedOutAt?.toISOString() ?? null,
          status: activeCheckin.status,
          actualDurationMinutes: activeCheckin.actualDurationMinutes,
        },
      };
    }

    // 2. Find confirmed booking for today at this venue
    const booking = await prisma.booking.findFirst({
      where: {
        userId,
        space,
        dateKey: today,
        status: "confirmed",
      },
      orderBy: { startTime: "asc" },
      select: {
        id: true,
        reference: true,
        space: true,
        dateKey: true,
        startTime: true,
        endTime: true,
        packageLabel: true,
        status: true,
      },
    });

    if (!booking) {
      return {
        valid: false,
        error: "NO_BOOKING",
        message:
          "No valid booking found for today. Please book a slot first from our website.",
      };
    }

    // 3. Time window check: allow check-in starting 30 min before booking start until booking end
    const bookingStart = buildLocalDateTime(booking.dateKey, booking.startTime);
    const bookingEnd = buildLocalDateTime(booking.dateKey, booking.endTime);
    const earlyWindow = new Date(bookingStart.getTime() - 30 * 60 * 1000);

    if (now < earlyWindow) {
      return {
        valid: false,
        error: "TOO_EARLY",
        message: `Your booking starts at ${booking.startTime}. You can check in starting 30 minutes before.`,
      };
    }

    if (now > bookingEnd) {
      return {
        valid: false,
        error: "TOO_LATE",
        message: "Your booking time slot has already ended.",
      };
    }

    // 4. Check if this booking already has a completed check-in today
    const existingCheckin = await prisma.bookingCheckin.findFirst({
      where: {
        bookingId: booking.id,
        userId,
        status: { in: ["checked_out", "auto_checked_out"] },
      },
    });

    if (existingCheckin) {
      return {
        valid: false,
        error: "ALREADY_USED",
        message:
          "You have already checked in and out for this booking.",
      };
    }

    return { valid: true, booking };
  } catch (err) {
    console.error("Check-in validation error:", err);
    return {
      valid: false,
      error: "ERROR",
      message: "System under maintenance. Please try again.",
    };
  }
}