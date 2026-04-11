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
import {
  recordBookingNotificationFailure,
  sendBookingNotifications,
} from "@/lib/notifications/service";
import { normalizeBookingDurationHours } from "@/lib/booking/duration";
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
  defaultBookingDurationHours: 2,
  whatsappNumber: null,
  reminderEmailEnabled: false,
  reminderSmsEnabled: false,
};

function getUniqueBookingTagLabels(labels: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      labels
        .map((label) => label?.trim())
        .filter((label): label is string => Boolean(label)),
    ),
  );
}

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

function getBookingScheduleSnapshot(booking: {
  slotId: string | null;
  space: Space;
  dateKey: string;
  startTime: string;
  endTime: string;
  priceModifier: number | null;
  slot?: {
    id: string;
    space: Space;
    dateKey: string;
    startTime: string;
    endTime: string;
    priceModifier: number;
  } | null;
}) {
  const source = booking.slot ?? null;

  return {
    slotId: source?.id ?? booking.slotId ?? null,
    space: source?.space ?? booking.space,
    dateKey: source?.dateKey ?? booking.dateKey,
    startTime: source?.startTime ?? booking.startTime,
    endTime: source?.endTime ?? booking.endTime,
    priceModifier: booking.priceModifier ?? source?.priceModifier ?? null,
  };
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

function isBookingActionLocked(status: BookingStatus) {
  return (
    status === BookingStatus.cancelled ||
    status === BookingStatus.rescheduled ||
    status === BookingStatus.no_show
  );
}

function assertBookingCanBeChanged(params: {
  booking: {
    status: BookingStatus;
    dateKey: string;
    startTime: string;
  };
  action: "cancel" | "reschedule";
  settings: Awaited<ReturnType<typeof getSettings>>;
}) {
  const { booking, action, settings } = params;
  const policy = evaluatePolicy(action, booking.dateKey, booking.startTime, {
    fullRefundHours: settings.cancelFullRefundHours,
    partialRefundHours: settings.cancelPartialRefundHours,
    partialRefundPercentage: settings.partialRefundPercentage,
  });

  if (isBookingActionLocked(booking.status)) {
    throw new BookingServiceError(
      "This booking is no longer eligible for cancellation or rescheduling as per policy.",
      409,
      "BOOKING_ACTION_LOCKED",
      { policy },
    );
  }

  if (!policy.isAllowed) {
    throw new BookingServiceError(
      policy.message,
      409,
      "POLICY_WINDOW_CLOSED",
      { policy },
    );
  }

  return policy;
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
  slot?: {
    id: string;
    space: Space;
    dateKey: string;
    startTime: string;
    endTime: string;
    priceModifier: number;
  } | null;
  tags?: { label: string }[];
}): Booking {
  const schedule = getBookingScheduleSnapshot(booking);

  return {
    id: booking.id,
    reference: booking.reference,
    userId: booking.userId ?? undefined,
    slotId: schedule.slotId ?? undefined,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    space: schedule.space.toLowerCase() as Booking["space"],
    date: schedule.dateKey,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    status: mapBookingStatus(booking.status),
    acceptedPolicies: booking.acceptedPolicies,
    createdAt: booking.createdAt.toISOString(),
    tags: booking.tags?.map((tag) => tag.label) ?? [],
    adminNotes: booking.adminNotes ?? undefined,
    reminderStatus: mapReminderStatus(booking.reminderStatus),
    rescheduledFromId: booking.rescheduledFromId ?? undefined,
    priceModifier: schedule.priceModifier ?? undefined,
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

  const now = Date.now();
  const publicSlots = slots
    .map(serializeSlot)
    .filter((slot) => buildLocalDateTime(slot.dateKey, slot.startTime).getTime() > now);
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
  limit = 120,
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
    take: Math.max(limit * 2, 180),
  });

  const now = Date.now();

  return slots
    .map(serializeSlot)
    .filter((slot) => buildLocalDateTime(slot.dateKey, slot.startTime).getTime() > now)
    .slice(0, limit);
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

  const updated = await tx.availabilitySlot.updateMany({
    where: {
      id: slot.id,
      status: SlotStatus.available,
    },
    data: { status: SlotStatus.booked },
  });

  if (updated.count === 0) {
    throw new BookingServiceError(
      "Selected slot is no longer available.",
      409,
      "SLOT_UNAVAILABLE",
      { nextAvailableSlot: await getNextAvailableSlotForSpace(space, dateKey, startTime) },
    );
  }

  return {
    ...slot,
    status: SlotStatus.booked,
  };
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
  const bookingDurationHours = normalizeBookingDurationHours(
    settings.defaultBookingDurationHours,
  );
  const requestedEndTime = addHoursToTime(input.time, bookingDurationHours);

  const booking = await prisma.$transaction(async (tx) => {
    const explicitSlot = input.slotId
      ? await tx.availabilitySlot.findUnique({ where: { id: input.slotId } })
      : null;

    if (explicitSlot && explicitSlot.space !== space) {
      throw new BookingServiceError(
        "Please choose a slot that matches the selected space.",
        400,
        "SPACE_MISMATCH",
      );
    }

    const matchingSlot =
      explicitSlot ??
      (await tx.availabilitySlot.findUnique({
        where: {
          space_dateKey_startTime_endTime: {
            space,
            dateKey: input.date,
            startTime: input.time,
            endTime: requestedEndTime,
          },
        },
      }));

    let status: BookingStatus = BookingStatus.confirmed;
    let slotId: string | null = null;
    let actualSpace = space;
    let actualDateKey = input.date;
    let actualStartTime = input.time;
    let actualEndTime = requestedEndTime;
    let priceModifier = 1;
    const reservationSlot = matchingSlot;

    if (reservationSlot) {
      const requestedStartTime = buildLocalDateTime(
        reservationSlot.dateKey,
        reservationSlot.startTime,
      ).getTime();

      if (requestedStartTime <= Date.now()) {
        throw new BookingServiceError(
          "This slot has already started. Please choose a future time.",
          409,
          "SLOT_ALREADY_STARTED",
          {
            nextAvailableSlot: await getNextAvailableSlotForSpace(
              space,
              reservationSlot.dateKey,
              reservationSlot.startTime,
            ),
          },
        );
      }

      const reservedSlot = await reserveMatchingSlot({
        tx,
        space,
        dateKey: reservationSlot.dateKey,
        startTime: reservationSlot.startTime,
        endTime: reservationSlot.endTime,
      });

      slotId = reservedSlot?.id ?? null;
      actualSpace = reservedSlot?.space ?? actualSpace;
      actualDateKey = reservedSlot?.dateKey ?? actualDateKey;
      actualStartTime = reservedSlot?.startTime ?? actualStartTime;
      actualEndTime = reservedSlot?.endTime ?? actualEndTime;
      priceModifier = reservedSlot?.priceModifier ?? priceModifier;
      status = BookingStatus.confirmed;
    } else {
      const requestedStartTime = buildLocalDateTime(input.date, input.time).getTime();

      if (requestedStartTime <= Date.now()) {
        throw new BookingServiceError(
          "This slot has already started. Please choose a future time.",
          409,
          "SLOT_ALREADY_STARTED",
          {
            nextAvailableSlot: await getNextAvailableSlotForSpace(space, input.date, input.time),
          },
        );
      }
    }

    if (input.slotId && !reservationSlot) {
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
        space: actualSpace,
        dateKey: actualDateKey,
        startTime: actualStartTime,
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
        slot: true,
      },
    });

    return created;
  });

  const publicBooking = toPublicBooking({
    ...booking,
    reminderStatus: booking.reminderStatus,
    slot: booking.slot,
    tags: booking.tags,
  });

  const policy = evaluatePolicy(
    "cancel",
    publicBooking.date,
    publicBooking.startTime,
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
    await recordBookingNotificationFailure({
      bookingId: booking.id,
      reason: `Notification orchestration failed: ${reason}`,
    });
    console.error(
      `[booking-notifications] Booking ${publicBooking.reference} saved but notification orchestration failed: ${reason}`,
    );
  }

  return {
    booking: publicBooking,
    policy,
    nextAvailableSlot: await getNextAvailableSlotForSpace(
      publicBooking.space as Space,
      publicBooking.date,
      publicBooking.startTime,
    ),
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
    slot: booking.slot,
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
    slot: booking.slot,
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

  const policy = assertBookingCanBeChanged({
    booking,
    action: "cancel",
    settings,
  });

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

  const policy = assertBookingCanBeChanged({
    booking,
    action: "reschedule",
    settings,
  });

  const newSlot = await prisma.availabilitySlot.findUnique({
    where: { id: slotId },
  });

  if (!newSlot) {
    throw new BookingServiceError("Requested slot not found.", 404, "SLOT_NOT_FOUND");
  }

  if (newSlot.status !== SlotStatus.available) {
    throw new BookingServiceError("Requested slot is no longer available.", 409, "SLOT_UNAVAILABLE");
  }

  if (newSlot.space !== booking.space) {
    throw new BookingServiceError(
      "Please choose a slot from the same space as your current booking.",
      400,
      "SPACE_MISMATCH",
    );
  }

  const currentSlotDateTime = buildLocalDateTime(booking.dateKey, booking.startTime).getTime();
  const newSlotDateTime = buildLocalDateTime(newSlot.dateKey, newSlot.startTime).getTime();

  if (newSlotDateTime <= currentSlotDateTime) {
    throw new BookingServiceError(
      "Please choose a future slot for this reschedule request.",
      400,
      "INVALID_RESCHEDULE_SLOT",
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const reserved = await tx.availabilitySlot.updateMany({
      where: {
        id: newSlot.id,
        status: SlotStatus.available,
      },
      data: { status: SlotStatus.booked },
    });

    if (reserved.count === 0) {
      throw new BookingServiceError(
        "Requested slot is no longer available.",
        409,
        "SLOT_UNAVAILABLE",
      );
    }

    if (booking.slotId) {
      await tx.availabilitySlot.updateMany({
        where: { id: booking.slotId, status: SlotStatus.booked },
        data: { status: SlotStatus.available },
      });
    }

    const nextTagLabels = getUniqueBookingTagLabels([
      "rescheduled",
      `rescheduled-from:${booking.dateKey} ${booking.startTime}-${booking.endTime}`,
    ]);

    if (nextTagLabels.length > 0) {
      await tx.bookingTag.createMany({
        data: nextTagLabels.map((label) => ({
          bookingId: booking.id,
          label,
        })),
        skipDuplicates: true,
      });
    }

    return tx.booking.update({
      where: { reference },
      data: {
        slotId: newSlot.id,
        space: newSlot.space,
        dateKey: newSlot.dateKey,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        status: BookingStatus.confirmed,
        priceModifier: newSlot.priceModifier,
        reminderStatus: ReminderStatus.not_scheduled,
        cancelledAt: null,
      },
      include: { tags: true, slot: true },
    });
  });

  return {
    booking: toPublicBooking({
      ...updated,
      reminderStatus: updated.reminderStatus,
      slot: updated.slot,
      tags: updated.tags,
    }),
    policy,
    nextAvailableSlot: await getNextAvailableSlotForSpace(
      updated.space,
      updated.dateKey,
      updated.startTime,
    ),
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
