import { randomBytes } from "crypto";
import {
  BookingStatus,
  Prisma,
  ReminderStatus,
  SlotStatus,
  Space,
  WaitlistStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  Booking,
  BookingResponse,
} from "@/lib/types/booking";
import type { BookingNotificationSummary } from "@/lib/notifications/types";
import { bookingTypeToSpace, isBookingTypeId } from "@/lib/booking-utils";
import { sendBookingNotifications } from "@/lib/notifications/service";
import { BookingServiceError } from "./errors";
import { buildAvailabilityResponse, serializeSlot } from "./availability";
import { evaluatePolicy } from "./policy";
import { addHoursToTime, buildLocalDateTime, getLocalDateKey } from "./time";

const defaultSettings = {
  cancelFullRefundHours: 72,
  cancelPartialRefundHours: 24,
  partialRefundPercentage: 50,
  defaultBufferBefore: 30,
  defaultBufferAfter: 30,
  peakPricingMultiplier: 1.25,
  whatsappNumber: null,
  reminderEmailEnabled: false,
  reminderSmsEnabled: false,
};

function mapBookingStatus(status: BookingStatus): Booking["status"] {
  switch (status) {
    case BookingStatus.pending:
      return "pending";
    case BookingStatus.pending_payment:
      return "pending-payment";
    case BookingStatus.confirmed:
      return "confirmed";
    case BookingStatus.cancelled:
      return "cancelled";
    case BookingStatus.rescheduled:
      return "rescheduled";
    case BookingStatus.completed:
      return "completed";
    case BookingStatus.refund_initiated:
      return "refund-initiated";
    case BookingStatus.refund_processed:
      return "refund-processed";
    case BookingStatus.no_show:
      return "no-show";
    default:
      return "pending";
  }
}

function mapReminderStatus(status: ReminderStatus): Booking["reminderStatus"] {
  switch (status) {
    case ReminderStatus.not_scheduled:
      return "not_scheduled";
    case ReminderStatus.pending:
      return "pending";
    case ReminderStatus.sent_72h:
      return "sent_72h";
    case ReminderStatus.sent_24h:
      return "sent_24h";
    case ReminderStatus.failed:
      return "failed";
    default:
      return "not_scheduled";
  }
}

function mapWaitlistStatus(status: WaitlistStatus) {
  switch (status) {
    case WaitlistStatus.active:
      return "active";
    case WaitlistStatus.notified:
      return "notified";
    case WaitlistStatus.converted:
      return "converted";
    case WaitlistStatus.closed:
      return "closed";
    default:
      return "active";
  }
}

function createReference(space: Space) {
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `BP-${space.toUpperCase()}-${suffix}`;
}

function buildConfirmationUrl(params: {
  reference: string;
  space: string;
  date: string;
  time: string;
  status: string;
  notifications?: BookingNotificationSummary;
}) {
  const searchParams = new URLSearchParams({
    ref: params.reference,
    space: params.space,
    date: params.date,
    time: params.time,
    status: params.status,
  });

  if (params.notifications) {
    searchParams.set("customerEmailDelivery", params.notifications.customerEmail);
    searchParams.set("customerWhatsappDelivery", params.notifications.customerWhatsapp);
  }

  return `/booking/confirmation?${searchParams.toString()}`;
}

async function getSettings(tx = prisma) {
  const settings = await tx.appSettings.findUnique({ where: { id: 1 } });
  if (settings) {
    return settings;
  }

  return tx.appSettings.create({
    data: { id: 1, ...defaultSettings },
  });
}

async function ensureBookingVisibilitySettings(tx = prisma) {
  return getSettings(tx);
}

function toPublicBooking(booking: {
  id: string;
  reference: string;
  userId?: string | null;
  slotId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  space: Space;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  acceptedPolicies: boolean;
  reminderStatus: ReminderStatus;
  createdAt: Date;
  adminNotes: string | null;
  specificStudio: string | null;
  selectedPackage: string | null;
  packageLabel: string | null;
  priceModifier: number | null;
  rescheduledFromId: string | null;
  cancelledAt: Date | null;
  tags?: { label: string }[];
}): Booking {
  return {
    id: booking.id,
    reference: booking.reference,
    userId: booking.userId ?? undefined,
    slotId: booking.slotId ?? undefined,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    space: booking.space.toLowerCase() as Booking["space"],
    date: booking.dateKey,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: mapBookingStatus(booking.status),
    acceptedPolicies: booking.acceptedPolicies,
    createdAt: booking.createdAt.toISOString(),
    tags: booking.tags?.map((tag) => tag.label) ?? [],
    adminNotes: booking.adminNotes ?? undefined,
    reminderStatus: mapReminderStatus(booking.reminderStatus),
    rescheduledFromId: booking.rescheduledFromId ?? undefined,
    priceModifier: booking.priceModifier ?? undefined,
    packageLabel: booking.packageLabel ?? undefined,
    specificStudio: booking.specificStudio ?? undefined,
  };
}

async function getAvailabilitySlots(
  space: Space,
  dateKeyOrMonthKey: string,
  scope: "date" | "month" = "date",
) {
  const slots = await prisma.availabilitySlot.findMany({
    where:
      scope === "date"
        ? { space, dateKey: dateKeyOrMonthKey }
        : { space, dateKey: { startsWith: dateKeyOrMonthKey } },
    orderBy: [{ dateKey: "asc" }, { startTime: "asc" }],
  });

  return slots.map(serializeSlot);
}

export async function getAvailability(space: Space, monthOrDate: string, scope: "date" | "month") {
  const slots = await getAvailabilitySlots(space, monthOrDate, scope);
  if (scope === "date") {
    return buildAvailabilityResponse({
      space,
      date: monthOrDate,
      slots,
    });
  }

  return buildAvailabilityResponse({
    space,
    month: monthOrDate,
    slots,
  });
}

export async function getAvailabilityForMonth(space: Space, month: string) {
  return getAvailability(space, month, "month");
}

export async function getAvailabilityForDate(space: Space, date: string) {
  return getAvailability(space, date, "date");
}

export async function getNextAvailableSlotForSpace(
  space: Space,
  afterDateKey: string,
  afterTime?: string,
) {
  const slots = await prisma.availabilitySlot.findMany({
    where: { space, status: SlotStatus.available },
    orderBy: [{ dateKey: "asc" }, { startTime: "asc" }],
  });

  const publicSlots = slots.map(serializeSlot);
  return (
    publicSlots.find((slot) => {
      if (slot.dateKey > afterDateKey) {
        return true;
      }

      if (slot.dateKey === afterDateKey) {
        if (!afterTime) {
          return true;
        }

        return slot.startTime > afterTime;
      }

      return false;
    }) ?? null
  );
}

export async function getAvailableRescheduleSlotsForSpace(
  space: Space,
  afterDateKey: string,
  afterTime?: string,
  limit = 8,
) {
  const slots = await prisma.availabilitySlot.findMany({
    where: {
      space,
      status: SlotStatus.available,
      OR: [
        { dateKey: { gt: afterDateKey } },
        afterTime
          ? {
              dateKey: afterDateKey,
              startTime: { gt: afterTime },
            }
          : {
              dateKey: afterDateKey,
            },
      ],
    },
    orderBy: [{ dateKey: "asc" }, { startTime: "asc" }],
    take: limit,
  });

  return slots.map(serializeSlot);
}

async function reserveMatchingSlot(params: {
  tx: Prisma.TransactionClient;
  space: Space;
  dateKey: string;
  startTime: string;
  endTime: string;
}) {
  const { tx, space, dateKey, startTime, endTime } = params;

  const slot = await tx.availabilitySlot.findUnique({
    where: {
      space_dateKey_startTime_endTime: {
        space,
        dateKey,
        startTime,
        endTime,
      },
    },
  });

  if (!slot) {
    return null;
  }

  if (slot.status !== SlotStatus.available) {
    throw new BookingServiceError(
      "Selected slot is no longer available.",
      409,
      "SLOT_UNAVAILABLE",
      { nextAvailableSlot: await getNextAvailableSlotForSpace(space, dateKey, startTime) },
    );
  }

  const updated = await tx.availabilitySlot.update({
    where: { id: slot.id },
    data: { status: SlotStatus.booked },
  });

  return updated;
}

export async function createBookingFromRequest(input: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  acceptedPolicies: boolean;
  bookingType: string;
  date: string;
  time: string;
  specificStudio?: string;
  selectedPackage?: string;
  slotId?: string;
  userId?: string | null;
}) {
  if (!isBookingTypeId(input.bookingType)) {
    throw new BookingServiceError("Please choose a valid booking type.", 400, "INVALID_BOOKING_TYPE");
  }

  const space = bookingTypeToSpace(input.bookingType as Parameters<typeof bookingTypeToSpace>[0]);
  const settings = await ensureBookingVisibilitySettings();
  const endTime = addHoursToTime(input.time, 2);
  const priceModifier = 1;

  const booking = await prisma.$transaction(async (tx) => {
    const explicitSlot = input.slotId
      ? await tx.availabilitySlot.findUnique({ where: { id: input.slotId } })
      : null;
    const matchingSlot =
      explicitSlot ??
      (await tx.availabilitySlot.findUnique({
        where: {
          space_dateKey_startTime_endTime: {
            space,
            dateKey: input.date,
            startTime: input.time,
            endTime,
          },
        },
      }));

    let status: BookingStatus = BookingStatus.confirmed;
    let slotId: string | null = null;
    let actualEndTime = endTime;
    const reservationSlot = matchingSlot;

    if (reservationSlot && reservationSlot.status === SlotStatus.available) {
      const reservedSlot = await reserveMatchingSlot({
        tx,
        space,
        dateKey: reservationSlot.dateKey,
        startTime: reservationSlot.startTime,
        endTime: reservationSlot.endTime,
      });
      slotId = reservedSlot?.id ?? null;
      actualEndTime = reservedSlot?.endTime ?? actualEndTime;
      status = BookingStatus.confirmed;
    } else if (input.slotId || matchingSlot) {
      throw new BookingServiceError(
        "Selected slot is no longer available.",
        409,
        "SLOT_UNAVAILABLE",
        {
          nextAvailableSlot: await getNextAvailableSlotForSpace(space, input.date, input.time),
        },
      );
    }

    const created = await tx.booking.create({
      data: {
        reference: createReference(space),
        userId: input.userId ?? null,
        slotId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        space,
        dateKey: input.date,
        startTime: input.time,
        endTime: actualEndTime,
        status,
        acceptedPolicies: input.acceptedPolicies,
        specificStudio: input.specificStudio ?? null,
        selectedPackage: input.selectedPackage ?? null,
        packageLabel: input.selectedPackage ?? null,
        priceModifier,
        reminderStatus: ReminderStatus.not_scheduled,
        adminNotes: input.selectedPackage ?? null,
        tags: {
          create: [
            input.selectedPackage ? { label: `package:${input.selectedPackage}` } : undefined,
            reservationSlot?.peakTime ? { label: "peak-time" } : undefined,
          ].filter(Boolean) as Prisma.BookingTagCreateWithoutBookingInput[],
        },
      },
      include: {
        tags: true,
      },
    });

    return created;
  });

  const publicBooking = toPublicBooking({
    ...booking,
    dateKey: booking.dateKey,
    reminderStatus: booking.reminderStatus,
    tags: booking.tags,
  });

  const policy = evaluatePolicy(
    "cancel",
    booking.dateKey,
    booking.startTime,
    {
      fullRefundHours: settings.cancelFullRefundHours,
      partialRefundHours: settings.cancelPartialRefundHours,
      partialRefundPercentage: settings.partialRefundPercentage,
    },
    new Date(),
  );

  const manageUrl = `/booking/manage?ref=${publicBooking.reference}`;
  let notifications: BookingNotificationSummary | undefined;

  try {
    notifications = await sendBookingNotifications({
      bookingId: booking.id,
      manageUrl,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown notification failure.";
    console.error(
      `[booking-notifications] Booking ${publicBooking.reference} saved but notification orchestration failed: ${reason}`,
    );
  }

  return {
    booking: publicBooking,
    policy,
    nextAvailableSlot: await getNextAvailableSlotForSpace(space, input.date, input.time),
    manageUrl,
    confirmationUrl: buildConfirmationUrl({
      reference: publicBooking.reference,
      space: publicBooking.space,
      date: publicBooking.date,
      time: publicBooking.startTime,
      status: publicBooking.status,
      notifications,
    }),
    notifications,
  } satisfies BookingResponse;
}

export async function createWaitlistEntry(input: {
  space: Space;
  date: string;
  name: string;
  email: string;
  phone: string;
  note?: string;
  userId?: string | null;
}) {
  const entry = await prisma.waitlistEntry.create({
    data: {
      space: input.space,
      dateKey: input.date,
      name: input.name,
      email: input.email,
      phone: input.phone,
      note: input.note ?? null,
      userId: input.userId ?? null,
      status: WaitlistStatus.active,
    },
  });

  return {
    id: entry.id,
    space: entry.space.toLowerCase() as BookingResponse["booking"]["space"],
    date: entry.dateKey,
    name: entry.name,
    email: entry.email,
    phone: entry.phone,
    note: entry.note ?? undefined,
    createdAt: entry.createdAt.toISOString(),
    status: mapWaitlistStatus(entry.status),
  };
}

export async function getBookingByReference(reference: string) {
  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { tags: true, slot: true, user: true },
  });

  if (!booking) {
    return null;
  }

  return toPublicBooking({
    id: booking.id,
    reference: booking.reference,
    userId: booking.userId,
    slotId: booking.slotId,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    space: booking.space,
    dateKey: booking.dateKey,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    acceptedPolicies: booking.acceptedPolicies,
    reminderStatus: booking.reminderStatus,
    createdAt: booking.createdAt,
    adminNotes: booking.adminNotes,
    specificStudio: booking.specificStudio,
    selectedPackage: booking.selectedPackage,
    packageLabel: booking.packageLabel,
    priceModifier: booking.priceModifier,
    rescheduledFromId: booking.rescheduledFromId,
    cancelledAt: booking.cancelledAt,
    tags: booking.tags,
  });
}

export async function getBookingDetailsByReference(reference: string) {
  const settings = await getSettings();
  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { tags: true, slot: true, user: true },
  });

  if (!booking) {
    return null;
  }

  const publicBooking = toPublicBooking({
    id: booking.id,
    reference: booking.reference,
    userId: booking.userId,
    slotId: booking.slotId,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    space: booking.space,
    dateKey: booking.dateKey,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    acceptedPolicies: booking.acceptedPolicies,
    reminderStatus: booking.reminderStatus,
    createdAt: booking.createdAt,
    adminNotes: booking.adminNotes,
    specificStudio: booking.specificStudio,
    selectedPackage: booking.selectedPackage,
    packageLabel: booking.packageLabel,
    priceModifier: booking.priceModifier,
    rescheduledFromId: booking.rescheduledFromId,
    cancelledAt: booking.cancelledAt,
    tags: booking.tags,
  });

  const policy = evaluatePolicy(
    "cancel",
    booking.dateKey,
    booking.startTime,
    {
      fullRefundHours: settings.cancelFullRefundHours,
      partialRefundHours: settings.cancelPartialRefundHours,
      partialRefundPercentage: settings.partialRefundPercentage,
    },
  );

  return {
    booking: publicBooking,
    policy,
    nextAvailableSlot: await getNextAvailableSlotForSpace(booking.space, booking.dateKey, booking.startTime),
    manageUrl: `/booking/manage?ref=${publicBooking.reference}`,
    confirmationUrl: buildConfirmationUrl({
      reference: publicBooking.reference,
      space: publicBooking.space,
      date: publicBooking.date,
      time: publicBooking.startTime,
      status: publicBooking.status,
    }),
  } satisfies BookingResponse;
}

export async function cancelBooking(reference: string) {
  const settings = await getSettings();
  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { slot: true, tags: true },
  });

  if (!booking) {
    throw new BookingServiceError("Booking not found.", 404, "BOOKING_NOT_FOUND");
  }

  const policy = evaluatePolicy(
    "cancel",
    booking.dateKey,
    booking.startTime,
    {
      fullRefundHours: settings.cancelFullRefundHours,
      partialRefundHours: settings.cancelPartialRefundHours,
      partialRefundPercentage: settings.partialRefundPercentage,
    },
  );



  const updated = await prisma.$transaction(async (tx) => {
    const cancelled = await tx.booking.update({
      where: { reference },
      data: {
        status: BookingStatus.cancelled,
        cancelledAt: new Date(),
      },
      include: { tags: true },
    });

    if (booking.slotId) {
      await tx.availabilitySlot.updateMany({
        where: {
          id: booking.slotId,
          status: SlotStatus.booked,
        },
        data: { status: SlotStatus.available },
      });
    }

    return cancelled;
  });

  return {
    booking: toPublicBooking({
      ...updated,
      dateKey: updated.dateKey,
      reminderStatus: updated.reminderStatus,
      tags: updated.tags,
    }),
    policy,
    nextAvailableSlot: await getNextAvailableSlotForSpace(booking.space, booking.dateKey, booking.startTime),
    manageUrl: `/booking/manage?ref=${updated.reference}`,
    confirmationUrl: buildConfirmationUrl({
      reference: updated.reference,
      space: updated.space,
      date: updated.dateKey,
      time: updated.startTime,
      status: updated.status,
    }),
  } satisfies BookingResponse;
}

export async function rescheduleBooking(reference: string, slotId: string) {
  const settings = await getSettings();
  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { slot: true, tags: true },
  });

  if (!booking) {
    throw new BookingServiceError("Booking not found.", 404, "BOOKING_NOT_FOUND");
  }

  const policy = evaluatePolicy(
    "reschedule",
    booking.dateKey,
    booking.startTime,
    {
      fullRefundHours: settings.cancelFullRefundHours,
      partialRefundHours: settings.cancelPartialRefundHours,
      partialRefundPercentage: settings.partialRefundPercentage,
    },
  );



  const newSlot = await prisma.availabilitySlot.findUnique({
    where: { id: slotId },
  });

  if (!newSlot) {
    throw new BookingServiceError("Requested slot not found.", 404, "SLOT_NOT_FOUND");
  }

  if (newSlot.status !== SlotStatus.available) {
    throw new BookingServiceError("Requested slot is no longer available.", 409, "SLOT_UNAVAILABLE");
  }

  const created = await prisma.$transaction(async (tx) => {
    await tx.availabilitySlot.update({
      where: { id: newSlot.id },
      data: { status: SlotStatus.booked },
    });

    if (booking.slotId) {
      await tx.availabilitySlot.updateMany({
        where: { id: booking.slotId, status: SlotStatus.booked },
        data: { status: SlotStatus.available },
      });
    }

    const rescheduled = await tx.booking.create({
      data: {
        reference: createReference(booking.space),
        userId: booking.userId,
        slotId: newSlot.id,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        space: booking.space,
        dateKey: newSlot.dateKey,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        status: BookingStatus.confirmed,
        acceptedPolicies: booking.acceptedPolicies,
        specificStudio: booking.specificStudio,
        selectedPackage: booking.selectedPackage,
        packageLabel: booking.packageLabel,
        priceModifier: newSlot.priceModifier,
        reminderStatus: ReminderStatus.not_scheduled,
        rescheduledFromId: booking.id,
        adminNotes: booking.adminNotes,
        tags: {
          create: [
            ...(booking.tags ?? []).map((tag) => ({ label: tag.label })),
            { label: "rescheduled" },
          ],
        },
      },
      include: { tags: true },
    });

    await tx.booking.update({
      where: { reference },
      data: {
        status: BookingStatus.rescheduled,
        cancelledAt: new Date(),
      },
    });

    return rescheduled;
  });

  return {
    booking: toPublicBooking({
      ...created,
      dateKey: created.dateKey,
      reminderStatus: created.reminderStatus,
      tags: created.tags,
    }),
    policy,
    nextAvailableSlot: await getNextAvailableSlotForSpace(created.space, created.dateKey, created.startTime),
    manageUrl: `/booking/manage?ref=${created.reference}`,
    confirmationUrl: buildConfirmationUrl({
      reference: created.reference,
      space: created.space,
      date: created.dateKey,
      time: created.startTime,
      status: created.status,
    }),
  } satisfies BookingResponse;
}

export async function getMonthAvailability(space: Space, month: string) {
  const slots = await prisma.availabilitySlot.findMany({
    where: { space, dateKey: { startsWith: month } },
    orderBy: [{ dateKey: "asc" }, { startTime: "asc" }],
  });

  return buildAvailabilityResponse({
    space,
    month,
    slots: slots.map(serializeSlot),
  });
}

export async function getDateAvailability(space: Space, date: string) {
  const slots = await prisma.availabilitySlot.findMany({
    where: { space, dateKey: date },
    orderBy: [{ startTime: "asc" }],
  });

  return buildAvailabilityResponse({
    space,
    date,
    slots: slots.map(serializeSlot),
  });
}

export function inferSpaceFromBookingType(bookingType: string) {
  return bookingTypeToSpace(bookingType as Parameters<typeof bookingTypeToSpace>[0]);
}

export function getLocalBookingDateTime(dateKey: string, time: string) {
  return buildLocalDateTime(dateKey, time);
}

export function getLocalDate() {
  return getLocalDateKey();
}
