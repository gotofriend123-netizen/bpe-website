import "server-only";

import { redirect } from "next/navigation";
import * as authSession from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { evaluatePolicy, DEFAULT_POLICY_SETTINGS } from "@/lib/booking/policy";
import { buildLocalDateTime, compareDateTimeKeys, getHoursUntil } from "@/lib/booking/time";
import { getAvailableRescheduleSlotsForSpace } from "@/lib/booking/service";
import type { CurrentUserSummary } from "@/lib/auth/session";

export type { CurrentUserSummary } from "@/lib/auth/session";

type AuthSessionModule = typeof authSession & {
  requireAuthenticatedUser?: () => Promise<CurrentUserSummary | null>;
};

const sessionModule = authSession as AuthSessionModule;

export type DashboardBookingStatus =
  | "confirmed"
  | "pending"
  | "pending-payment"
  | "cancelled"
  | "rescheduled"
  | "completed"
  | "refund-initiated"
  | "refund-processed"
  | "no-show";

export type DashboardSlotStatus =
  | "available"
  | "pending"
  | "booked"
  | "blocked"
  | "cancelled"
  | "rescheduled"
  | "buffer-blocked"
  | "waitlist-only";

export type DashboardSpace = "vsl" | "vsr" | "arcade";

export type DashboardWaitlistStatus =
  | "active"
  | "notified"
  | "converted"
  | "closed";

export type DashboardPolicyAction = "cancel" | "reschedule";

export type DashboardEventBookingStatus =
  | "confirmed"
  | "cancelled"
  | "refunded";

export type DashboardActionSlot = {
  id: string;
  space: DashboardSpace;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: DashboardSlotStatus;
  peakTime: boolean;
  label: string | null;
  note: string | null;
  tag: string | null;
  bufferBefore: number;
  bufferAfter: number;
  priceModifier: number;
};

export type DashboardSlotDetails = {
  id: string;
  status: DashboardSlotStatus;
  peakTime: boolean;
  label: string | null;
  note: string | null;
  tag: string | null;
  bufferBefore: number;
  bufferAfter: number;
};

export type DashboardBooking = {
  id: string;
  reference: string;
  space: DashboardSpace;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: DashboardBookingStatus;
  acceptedPolicies: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
  packageLabel: string | null;
  specificStudio: string | null;
  selectedPackage: string | null;
  priceModifier: number | null;
  reminderStatus: string;
  adminNotes: string | null;
  tags: string[];
  slot: DashboardSlotDetails | null;
  dateLabel: string;
  isUpcoming: boolean;
  hoursUntil: number;
  policy: ReturnType<typeof evaluatePolicy>;
  canCancel: boolean;
  canReschedule: boolean;
  actionMessage: string;
  nextAvailableSlot: DashboardActionSlot | null;
  rescheduleOptions: DashboardActionSlot[];
};

export type DashboardEventBooking = {
  id: string;
  reference: string;
  eventSlug: string;
  eventTitle: string;
  eventCategory: string;
  eventVenue: string;
  organizer: string;
  posterImage: string | null;
  eventStartsAt: string;
  eventEndsAt: string | null;
  ticketTierId: string;
  ticketTierLabel: string;
  ticketUnitPrice: number;
  quantity: number;
  totalAmount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  status: DashboardEventBookingStatus;
  confirmationEmailSent: boolean;
  adminEmailSent: boolean;
  notificationFailedReason: string | null;
  notificationLastAttemptAt: string | null;
  createdAt: string;
  updatedAt: string;
  startsAtLabel: string;
  timeLabel: string;
  isUpcoming: boolean;
};

export type DashboardWaitlistEntry = {
  id: string;
  space: DashboardSpace;
  dateKey: string;
  dateLabel: string;
  name: string;
  email: string;
  phone: string;
  note: string | null;
  status: DashboardWaitlistStatus;
  createdAt: string;
  bookingReference: string | null;
};

export type DashboardOverview = {
  user: CurrentUserSummary;
  createdAt: string;
  bookings: DashboardBooking[];
  eventBookings: DashboardEventBooking[];
  upcomingBookings: DashboardBooking[];
  pastBookings: DashboardBooking[];
  upcomingEventBookings: DashboardEventBooking[];
  pastEventBookings: DashboardEventBooking[];
  waitlistEntries: DashboardWaitlistEntry[];
  stats: {
    totalBookings: number;
    eventBookings: number;
    upcomingBookings: number;
    upcomingEventBookings: number;
    pastBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    waitlistEntries: number;
  };
  latestBooking: DashboardBooking | null;
  latestEventBooking: DashboardEventBooking | null;
};

export type DashboardLatestBookingSummary = {
  reference: string;
  space: DashboardSpace;
  dateLabel: string;
  startTime: string;
};

export type DashboardLatestEventBookingSummary = {
  reference: string;
  eventTitle: string;
  startsAtLabel: string;
};

export type DashboardFrameOverview = {
  stats: DashboardOverview["stats"];
  latestBooking: DashboardLatestBookingSummary | null;
  latestEventBooking: DashboardLatestEventBookingSummary | null;
};

type DashboardBookingsData = {
  bookings: DashboardBooking[];
  upcomingBookings: DashboardBooking[];
  pastBookings: DashboardBooking[];
  stats: Pick<
    DashboardOverview["stats"],
    "totalBookings" | "upcomingBookings" | "pastBookings" | "confirmedBookings" | "pendingBookings"
  >;
  latestBooking: DashboardBooking | null;
};

type DashboardEventBookingsData = {
  eventBookings: DashboardEventBooking[];
  upcomingEventBookings: DashboardEventBooking[];
  pastEventBookings: DashboardEventBooking[];
  stats: Pick<DashboardOverview["stats"], "eventBookings" | "upcomingEventBookings">;
  latestEventBooking: DashboardEventBooking | null;
};

function formatDateLabel(dateKey: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00+05:30`));
}

function formatEventDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function formatEventTimeLabel(start: Date, end?: Date | null) {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
  });
  const startLabel = formatter.format(start);

  if (!end) {
    return startLabel;
  }

  return `${startLabel} - ${formatter.format(end)}`;
}

function mapBookingStatus(status: string): DashboardBookingStatus {
  if (
    status === "confirmed" ||
    status === "pending" ||
    status === "pending_payment" ||
    status === "cancelled" ||
    status === "rescheduled" ||
    status === "completed" ||
    status === "refund_initiated" ||
    status === "refund_processed" ||
    status === "no_show"
  ) {
    return status.replace("_", "-") as DashboardBookingStatus;
  }

  return "pending";
}

function mapSlotStatus(status: string): DashboardSlotStatus {
  if (
    status === "available" ||
    status === "pending" ||
    status === "booked" ||
    status === "blocked" ||
    status === "cancelled" ||
    status === "rescheduled" ||
    status === "buffer_blocked" ||
    status === "waitlist_only"
  ) {
    return status.replace("_", "-") as DashboardSlotStatus;
  }

  return "available";
}

function mapWaitlistStatus(status: string): DashboardWaitlistStatus {
  if (status === "active" || status === "notified" || status === "converted" || status === "closed") {
    return status;
  }

  return "active";
}

function mapEventBookingStatus(status: string): DashboardEventBookingStatus {
  if (status === "confirmed" || status === "cancelled" || status === "refunded") {
    return status;
  }

  return "confirmed";
}

function toDashboardSlot(slot: {
  id: string;
  space: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: string;
  peakTime: boolean;
  label: string | null;
  note: string | null;
  tag: string | null;
  bufferBefore: number;
  bufferAfter: number;
}) {
  return {
    id: slot.id,
    space: slot.space as DashboardSpace,
    dateKey: slot.dateKey,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: mapSlotStatus(slot.status),
    peakTime: slot.peakTime,
    label: slot.label,
    note: slot.note,
    tag: slot.tag,
    bufferBefore: slot.bufferBefore,
    bufferAfter: slot.bufferAfter,
  };
}

function toDashboardActionSlot(slot: {
  id: string;
  space: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: string;
  peakTime: boolean;
  label?: string | null;
  note?: string | null;
  tag?: string | null;
  bufferBefore: number;
  bufferAfter: number;
  priceModifier: number;
}) {
  return {
    id: slot.id,
    space: slot.space as DashboardSpace,
    dateKey: slot.dateKey,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: mapSlotStatus(slot.status),
    peakTime: slot.peakTime,
    label: slot.label ?? null,
    note: slot.note ?? null,
    tag: slot.tag ?? null,
    bufferBefore: slot.bufferBefore,
    bufferAfter: slot.bufferAfter,
    priceModifier: slot.priceModifier,
  } satisfies DashboardActionSlot;
}

function toDashboardEventBooking(booking: {
  id: string;
  reference: string;
  eventSlug: string;
  eventTitle: string;
  eventCategory: string;
  eventVenue: string;
  organizer: string;
  posterImage: string | null;
  eventStartsAt: Date;
  eventEndsAt: Date | null;
  ticketTierId: string;
  ticketTierLabel: string;
  ticketUnitPrice: number;
  quantity: number;
  totalAmount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  status: string;
  confirmationEmailSent: boolean;
  adminEmailSent: boolean;
  notificationFailedReason: string | null;
  notificationLastAttemptAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const effectiveEnd = booking.eventEndsAt ?? booking.eventStartsAt;

  return {
    id: booking.id,
    reference: booking.reference,
    eventSlug: booking.eventSlug,
    eventTitle: booking.eventTitle,
    eventCategory: booking.eventCategory,
    eventVenue: booking.eventVenue,
    organizer: booking.organizer,
    posterImage: booking.posterImage,
    eventStartsAt: booking.eventStartsAt.toISOString(),
    eventEndsAt: booking.eventEndsAt?.toISOString() ?? null,
    ticketTierId: booking.ticketTierId,
    ticketTierLabel: booking.ticketTierLabel,
    ticketUnitPrice: booking.ticketUnitPrice,
    quantity: booking.quantity,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    notes: booking.notes,
    status: mapEventBookingStatus(booking.status),
    confirmationEmailSent: booking.confirmationEmailSent,
    adminEmailSent: booking.adminEmailSent,
    notificationFailedReason: booking.notificationFailedReason,
    notificationLastAttemptAt: booking.notificationLastAttemptAt?.toISOString() ?? null,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    startsAtLabel: formatEventDateLabel(booking.eventStartsAt),
    timeLabel: formatEventTimeLabel(booking.eventStartsAt, booking.eventEndsAt),
    isUpcoming: effectiveEnd.getTime() >= Date.now(),
  } satisfies DashboardEventBooking;
}

function getNextAvailableSlot(
  space: DashboardSpace,
  dateKey: string,
  startTime: string,
) {
  return prisma.availabilitySlot
    .findFirst({
      where: {
        space,
        status: "available",
        OR: [
          { dateKey: { gt: dateKey } },
          { dateKey, startTime: { gt: startTime } },
        ],
      },
      orderBy: [{ dateKey: "asc" }, { startTime: "asc" }],
    })
    .then((slot) => (slot ? toDashboardActionSlot(slot) : null));
}

async function getPolicySettings() {
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });

  return {
    fullRefundHours:
      settings?.cancelFullRefundHours ?? DEFAULT_POLICY_SETTINGS.fullRefundHours,
    partialRefundHours:
      settings?.cancelPartialRefundHours ?? DEFAULT_POLICY_SETTINGS.partialRefundHours,
    partialRefundPercentage:
      settings?.partialRefundPercentage ??
      DEFAULT_POLICY_SETTINGS.partialRefundPercentage,
  };
}

function toDashboardBooking(booking: {
  id: string;
  reference: string;
  space: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: string;
  acceptedPolicies: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: Date;
  updatedAt: Date;
  packageLabel: string | null;
  specificStudio: string | null;
  selectedPackage: string | null;
  priceModifier: number | null;
  reminderStatus: string;
  adminNotes: string | null;
  tags: { label: string }[];
  slot: {
    id: string;
    space: string;
    dateKey: string;
    startTime: string;
    endTime: string;
    status: string;
    peakTime: boolean;
    label: string | null;
    note: string | null;
    tag: string | null;
    bufferBefore: number;
    bufferAfter: number;
  } | null;
}, policySettings: {
  fullRefundHours: number;
  partialRefundHours: number;
  partialRefundPercentage: number;
}) {
  const activeSchedule = booking.slot
    ? {
        space: booking.slot.space as DashboardSpace,
        dateKey: booking.slot.dateKey,
        startTime: booking.slot.startTime,
        endTime: booking.slot.endTime,
      }
    : {
        space: booking.space as DashboardSpace,
        dateKey: booking.dateKey,
        startTime: booking.startTime,
        endTime: booking.endTime,
      };
  const isUpcoming =
    buildLocalDateTime(activeSchedule.dateKey, activeSchedule.startTime).getTime() >=
    Date.now();
  const hoursUntil = getHoursUntil(activeSchedule.dateKey, activeSchedule.startTime);
  const policy = evaluatePolicy(
    "reschedule",
    activeSchedule.dateKey,
    activeSchedule.startTime,
    policySettings,
  );
  const isActionLocked = booking.status === "cancelled" || booking.status === "rescheduled" || booking.status === "no_show";
  const actionMessage = isActionLocked
    ? "This booking is no longer eligible for cancellation or rescheduling as per policy."
    : policy.message;
  const policyAllowsActions = policy.isAllowed;

  return {
    id: booking.id,
    reference: booking.reference,
    space: activeSchedule.space,
    dateKey: activeSchedule.dateKey,
    startTime: activeSchedule.startTime,
    endTime: activeSchedule.endTime,
    status: mapBookingStatus(booking.status),
    acceptedPolicies: booking.acceptedPolicies,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    packageLabel: booking.packageLabel,
    specificStudio: booking.specificStudio,
    selectedPackage: booking.selectedPackage,
    priceModifier: booking.priceModifier,
    reminderStatus: booking.reminderStatus,
    adminNotes: booking.adminNotes,
    tags: booking.tags.map((tag) => tag.label),
    slot: booking.slot ? toDashboardSlot(booking.slot) : null,
    dateLabel: formatDateLabel(activeSchedule.dateKey),
    isUpcoming,
    hoursUntil,
    policy,
    canCancel:
      !isActionLocked &&
      policyAllowsActions &&
      (booking.status === "confirmed" || booking.status === "pending"),
    canReschedule:
      !isActionLocked &&
      policyAllowsActions &&
      (booking.status === "confirmed" || booking.status === "pending"),
    actionMessage,
    nextAvailableSlot: null,
    rescheduleOptions: [],
  };
}

function sortBookingsAsc(left: DashboardBooking, right: DashboardBooking) {
  return compareDateTimeKeys(
    { dateKey: left.dateKey, startTime: left.startTime },
    { dateKey: right.dateKey, startTime: right.startTime },
  );
}

function sortEventBookingsAsc(left: DashboardEventBooking, right: DashboardEventBooking) {
  return (
    new Date(left.eventStartsAt).getTime() -
    new Date(right.eventStartsAt).getTime()
  );
}

export async function getCurrentDashboardUser() {
  if (typeof sessionModule.requireAuthenticatedUser === "function") {
    return sessionModule.requireAuthenticatedUser();
  }

  return authSession.getCurrentUserSummary();
}

export async function requireDashboardUser() {
  const currentUser = await getCurrentDashboardUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role === "admin") {
    redirect("/admin");
  }

  return currentUser;
}

async function loadDashboardBookingsData(userId: string): Promise<DashboardBookingsData> {
  const [bookings, policySettings] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      include: {
        tags: true,
        slot: true,
      },
    }),
    getPolicySettings(),
  ]);

  const bookingsByCreatedAt = bookings.map((booking) =>
    toDashboardBooking(booking, policySettings),
  );
  const sortedUpcoming = bookingsByCreatedAt
    .filter((booking) => booking.isUpcoming && booking.status !== "cancelled")
    .sort(sortBookingsAsc);
  const sortedPast = bookingsByCreatedAt
    .filter((booking) => !booking.isUpcoming || booking.status === "cancelled")
    .sort((left, right) => sortBookingsAsc(right, left));

  return {
    bookings: [...sortedUpcoming, ...sortedPast],
    upcomingBookings: sortedUpcoming,
    pastBookings: sortedPast,
    stats: {
      totalBookings: bookingsByCreatedAt.length,
      upcomingBookings: sortedUpcoming.length,
      pastBookings: sortedPast.length,
      confirmedBookings: bookingsByCreatedAt.filter((booking) => booking.status === "confirmed").length,
      pendingBookings: bookingsByCreatedAt.filter((booking) => booking.status === "pending").length,
    },
    latestBooking: bookingsByCreatedAt[0] ?? null,
  };
}

async function loadDashboardEventBookingsData(
  userId: string,
): Promise<DashboardEventBookingsData> {
  const eventBookings = await prisma.eventBooking.findMany({
    where: { userId },
    orderBy: [{ eventStartsAt: "asc" }, { createdAt: "desc" }],
  });

  const mappedEventBookings = eventBookings.map((booking) =>
    toDashboardEventBooking(booking),
  );
  const upcomingEventBookings = mappedEventBookings
    .filter((booking) => booking.isUpcoming && booking.status === "confirmed")
    .sort(sortEventBookingsAsc);
  const pastEventBookings = mappedEventBookings
    .filter((booking) => !booking.isUpcoming || booking.status !== "confirmed")
    .sort((left, right) => sortEventBookingsAsc(right, left));

  return {
    eventBookings: [...upcomingEventBookings, ...pastEventBookings],
    upcomingEventBookings,
    pastEventBookings,
    stats: {
      eventBookings: mappedEventBookings.length,
      upcomingEventBookings: upcomingEventBookings.length,
    },
    latestEventBooking:
      [...upcomingEventBookings, ...pastEventBookings][0] ?? null,
  };
}

export async function getUserDashboardOverview(userId: string): Promise<DashboardOverview> {
  const [user, bookingsData, eventBookingsData, waitlistEntries] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    loadDashboardBookingsData(userId),
    loadDashboardEventBookingsData(userId),
    prisma.waitlistEntry.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      include: {
        booking: {
          select: {
            reference: true,
          },
        },
      },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  const mappedWaitlistEntries = waitlistEntries.map((entry) => ({
    id: entry.id,
    space: entry.space as DashboardSpace,
    dateKey: entry.dateKey,
    dateLabel: formatDateLabel(entry.dateKey),
    name: entry.name,
    email: entry.email,
    phone: entry.phone,
    note: entry.note,
    status: mapWaitlistStatus(entry.status),
    createdAt: entry.createdAt.toISOString(),
    bookingReference: entry.booking?.reference ?? null,
  }));

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === "admin" ? "admin" : "user",
      createdAt: user.createdAt,
    },
    createdAt: user.createdAt.toISOString(),
    bookings: bookingsData.bookings,
    eventBookings: eventBookingsData.eventBookings,
    upcomingBookings: bookingsData.upcomingBookings,
    pastBookings: bookingsData.pastBookings,
    upcomingEventBookings: eventBookingsData.upcomingEventBookings,
    pastEventBookings: eventBookingsData.pastEventBookings,
    waitlistEntries: mappedWaitlistEntries,
    stats: {
      ...bookingsData.stats,
      ...eventBookingsData.stats,
      waitlistEntries: mappedWaitlistEntries.length,
    },
    latestBooking: bookingsData.latestBooking,
    latestEventBooking: eventBookingsData.latestEventBooking,
  };
}

export async function getUserDashboardFrameData(
  userId: string,
): Promise<DashboardFrameOverview> {
  const [bookings, eventBookings, waitlistEntries] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      select: {
        reference: true,
        space: true,
        dateKey: true,
        startTime: true,
        status: true,
        slot: {
          select: {
            space: true,
            dateKey: true,
            startTime: true,
          },
        },
      },
    }),
    prisma.eventBooking.findMany({
      where: { userId },
      orderBy: [{ eventStartsAt: "asc" }, { createdAt: "desc" }],
      select: {
        reference: true,
        eventTitle: true,
        eventStartsAt: true,
        eventEndsAt: true,
        status: true,
      },
    }),
    prisma.waitlistEntry.count({
      where: { userId },
    }),
  ]);

  const bookingSummaries = bookings.map((booking) => {
    const activeSpace = (booking.slot?.space ?? booking.space) as DashboardSpace;
    const activeDateKey = booking.slot?.dateKey ?? booking.dateKey;
    const activeStartTime = booking.slot?.startTime ?? booking.startTime;
    const mappedStatus = mapBookingStatus(booking.status);
    const isUpcoming =
      buildLocalDateTime(activeDateKey, activeStartTime).getTime() >= Date.now();

    return {
      reference: booking.reference,
      space: activeSpace,
      dateLabel: formatDateLabel(activeDateKey),
      startTime: activeStartTime,
      status: mappedStatus,
      isUpcoming,
    };
  });

  const eventSummaries = eventBookings.map((booking) => {
    const effectiveEnd = booking.eventEndsAt ?? booking.eventStartsAt;
    const mappedStatus = mapEventBookingStatus(booking.status);
    const isUpcoming = effectiveEnd.getTime() >= Date.now();

    return {
      reference: booking.reference,
      eventTitle: booking.eventTitle,
      startsAtLabel: formatEventDateLabel(booking.eventStartsAt),
      status: mappedStatus,
      isUpcoming,
    };
  });

  const orderedEventSummaries = [
    ...eventSummaries.filter((booking) => booking.isUpcoming && booking.status === "confirmed"),
    ...eventSummaries.filter((booking) => !booking.isUpcoming || booking.status !== "confirmed"),
  ];

  return {
    stats: {
      totalBookings: bookingSummaries.length,
      eventBookings: eventSummaries.length,
      upcomingBookings: bookingSummaries.filter((booking) => booking.isUpcoming && booking.status !== "cancelled").length,
      upcomingEventBookings: eventSummaries.filter((booking) => booking.isUpcoming && booking.status === "confirmed").length,
      pastBookings: bookingSummaries.filter((booking) => !booking.isUpcoming || booking.status === "cancelled").length,
      confirmedBookings: bookingSummaries.filter((booking) => booking.status === "confirmed").length,
      pendingBookings: bookingSummaries.filter((booking) => booking.status === "pending").length,
      waitlistEntries,
    },
    latestBooking: bookingSummaries[0]
      ? {
          reference: bookingSummaries[0].reference,
          space: bookingSummaries[0].space,
          dateLabel: bookingSummaries[0].dateLabel,
          startTime: bookingSummaries[0].startTime,
        }
      : null,
    latestEventBooking: orderedEventSummaries[0]
      ? {
          reference: orderedEventSummaries[0].reference,
          eventTitle: orderedEventSummaries[0].eventTitle,
          startsAtLabel: orderedEventSummaries[0].startsAtLabel,
        }
      : null,
  };
}

export function toDashboardFrameOverview(
  overview: Pick<DashboardOverview, "stats" | "latestBooking" | "latestEventBooking">,
): DashboardFrameOverview {
  return {
    stats: overview.stats,
    latestBooking: overview.latestBooking
      ? {
          reference: overview.latestBooking.reference,
          space: overview.latestBooking.space,
          dateLabel: overview.latestBooking.dateLabel,
          startTime: overview.latestBooking.startTime,
        }
      : null,
    latestEventBooking: overview.latestEventBooking
      ? {
          reference: overview.latestEventBooking.reference,
          eventTitle: overview.latestEventBooking.eventTitle,
          startsAtLabel: overview.latestEventBooking.startsAtLabel,
        }
      : null,
  };
}

export async function getUserDashboardHomeData(userId: string) {
  const [frameOverview, bookingsData] = await Promise.all([
    getUserDashboardFrameData(userId),
    loadDashboardBookingsData(userId),
  ]);

  return {
    frameOverview,
    upcomingBookings: bookingsData.upcomingBookings,
  };
}

export async function getUserDashboardBookingsPageData(userId: string) {
  const [frameOverview, bookingsData] = await Promise.all([
    getUserDashboardFrameData(userId),
    loadDashboardBookingsData(userId),
  ]);

  return {
    frameOverview,
    bookings: bookingsData.bookings,
    upcomingBookings: bookingsData.upcomingBookings,
    pastBookings: bookingsData.pastBookings,
  };
}

export async function getUserDashboardEventsPageData(userId: string) {
  const [frameOverview, eventBookingsData] = await Promise.all([
    getUserDashboardFrameData(userId),
    loadDashboardEventBookingsData(userId),
  ]);

  return {
    frameOverview,
    eventBookings: eventBookingsData.eventBookings,
    upcomingEventBookings: eventBookingsData.upcomingEventBookings,
    pastEventBookings: eventBookingsData.pastEventBookings,
  };
}

export async function getDashboardBookingForUser(userId: string, bookingId: string) {
  const [booking, policySettings] = await Promise.all([
    prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
      include: {
        tags: true,
        slot: true,
      },
    }),
    getPolicySettings(),
  ]);

  if (!booking) {
    return null;
  }

  const dashboardBooking = toDashboardBooking(booking, policySettings);

  return {
    ...dashboardBooking,
    nextAvailableSlot:
      dashboardBooking.status === "confirmed"
        ? await getNextAvailableSlot(
            dashboardBooking.space,
            dashboardBooking.dateKey,
            dashboardBooking.startTime,
          )
        : null,
  };
}

export async function getDashboardRescheduleContextForUser(
  userId: string,
  bookingId: string,
) {
  const booking = await getDashboardBookingForUser(userId, bookingId);

  if (!booking) {
    return null;
  }

  const rescheduleOptions = (
    await getAvailableRescheduleSlotsForSpace(
      booking.space,
      booking.dateKey,
      booking.startTime,
      120,
    )
  ).map((slot) => toDashboardActionSlot(slot));

  return {
    ...booking,
    rescheduleOptions,
  };
}

export function getBookingStatusLabel(status: DashboardBookingStatus) {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending";
    case "pending-payment":
      return "Pending Payment";
    case "cancelled":
      return "Cancelled";
    case "rescheduled":
      return "Rescheduled";
    case "completed":
      return "Completed";
    case "refund-initiated":
      return "Refund Initiated";
    case "refund-processed":
      return "Refund Processed";
    case "no-show":
      return "No-show";
    default:
      return "Pending";
  }
}

export function getBookingStatusTone(status: DashboardBookingStatus) {
  switch (status) {
    case "confirmed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "pending":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "pending-payment":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";
    case "cancelled":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "rescheduled":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "completed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "refund-initiated":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    case "refund-processed":
      return "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300";
    case "no-show":
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-300";
    default:
      return "border-white/10 bg-white/5 text-white";
  }
}

export function getEventBookingStatusLabel(status: DashboardEventBookingStatus) {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    default:
      return "Confirmed";
  }
}

export function getEventBookingStatusTone(status: DashboardEventBookingStatus) {
  switch (status) {
    case "confirmed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "cancelled":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "refunded":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    default:
      return "border-white/10 bg-white/5 text-white";
  }
}

export function getWaitlistStatusLabel(status: DashboardWaitlistStatus) {
  switch (status) {
    case "active":
      return "Active";
    case "notified":
      return "Notified";
    case "converted":
      return "Converted";
    case "closed":
      return "Closed";
    default:
      return "Active";
  }
}

export function getWaitlistStatusTone(status: DashboardWaitlistStatus) {
  switch (status) {
    case "active":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "notified":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "converted":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "closed":
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-300";
    default:
      return "border-white/10 bg-white/5 text-white";
  }
}

export function getDashboardSpaceLabel(space: DashboardSpace) {
  switch (space) {
    case "vsl":
      return "Verve Studio Left";
    case "vsr":
      return "Verve Studio Right";
    case "arcade":
      return "The Arcade";
    default:
      return "Space";
  }
}
