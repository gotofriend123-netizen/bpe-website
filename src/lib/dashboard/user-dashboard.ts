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
  upcomingBookings: DashboardBooking[];
  pastBookings: DashboardBooking[];
  waitlistEntries: DashboardWaitlistEntry[];
  stats: {
    totalBookings: number;
    upcomingBookings: number;
    pastBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    waitlistEntries: number;
  };
  latestBooking: DashboardBooking | null;
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
  const isUpcoming = buildLocalDateTime(booking.dateKey, booking.startTime).getTime() >= Date.now();
  const hoursUntil = getHoursUntil(booking.dateKey, booking.startTime);
  const policy = evaluatePolicy(
    "reschedule",
    booking.dateKey,
    booking.startTime,
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
    space: booking.space as DashboardSpace,
    dateKey: booking.dateKey,
    startTime: booking.startTime,
    endTime: booking.endTime,
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
    dateLabel: formatDateLabel(booking.dateKey),
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

async function enrichWithNextAvailableSlot(bookings: DashboardBooking[]) {
  return Promise.all(
    bookings.map(async (booking) => ({
      ...booking,
      nextAvailableSlot: booking.status === "confirmed" && !booking.canReschedule
        ? await getNextAvailableSlot(booking.space, booking.dateKey, booking.startTime)
        : null,
    })),
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

export async function getUserDashboardOverview(userId: string): Promise<DashboardOverview> {
  const [user, policySettings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        bookings: {
          orderBy: [{ createdAt: "desc" }],
          include: {
            tags: true,
            slot: true,
          },
        },
        waitlistEntries: {
          orderBy: [{ createdAt: "desc" }],
          include: {
            booking: {
              select: {
                reference: true,
              },
            },
          },
        },
      },
    }),
    getPolicySettings(),
  ]);

  if (!user) {
    redirect("/login");
  }

  const bookingsByCreatedAt = user.bookings.map((booking) =>
    toDashboardBooking(booking, policySettings),
  );
  const bookings = await enrichWithNextAvailableSlot(bookingsByCreatedAt);
  const sortedUpcoming = bookings
    .filter((booking) => booking.isUpcoming && booking.status !== "cancelled")
    .sort(sortBookingsAsc);
  const sortedPast = bookings
    .filter((booking) => !booking.isUpcoming || booking.status === "cancelled")
    .sort((left, right) => sortBookingsAsc(right, left));
  const orderedBookings = [...sortedUpcoming, ...sortedPast];
  const waitlistEntries = user.waitlistEntries.map((entry) => ({
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
    bookings: orderedBookings,
    upcomingBookings: sortedUpcoming,
    pastBookings: sortedPast,
    waitlistEntries,
    stats: {
      totalBookings: bookings.length,
      upcomingBookings: sortedUpcoming.length,
      pastBookings: sortedPast.length,
      confirmedBookings: bookings.filter((booking) => booking.status === "confirmed").length,
      pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
      waitlistEntries: waitlistEntries.length,
    },
    latestBooking: bookingsByCreatedAt[0] ?? null,
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
