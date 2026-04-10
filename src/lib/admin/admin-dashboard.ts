import "server-only";

import { format, parseISO, eachDayOfInterval, endOfMonth, startOfMonth, subMonths, addMonths } from "date-fns";
import {
  BookingStatus as BookingStatusEnum,
  Prisma,
  ReminderStatus as ReminderStatusEnum,
  SlotStatus as SlotStatusEnum,
  Space,
  WaitlistStatus as WaitlistStatusEnum,
} from "@prisma/client";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUserSummary, type CurrentUserSummary } from "@/lib/auth/session";
import { SPACE_LABELS } from "@/lib/booking-utils";
import { getDayAvailabilitySummary, serializeSlot } from "@/lib/booking/availability";
import { compareDateTimeKeys, getLocalDateKey, getMonthKeyFromDateKey } from "@/lib/booking/time";
import { evaluatePolicy, DEFAULT_POLICY_SETTINGS } from "@/lib/booking/policy";
import { getAvailableRescheduleSlotsForSpace } from "@/lib/booking/service";

export const ADMIN_ROUTE_LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/waitlist", label: "Waitlist" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export const ADMIN_SPACES = [
  { key: "vsl" as const, label: "Verve Studio Left", name: SPACE_LABELS.vsl },
  { key: "vsr" as const, label: "Verve Studio Right", name: SPACE_LABELS.vsr },
  { key: "arcade" as const, label: "The Arcade", name: SPACE_LABELS.arcade },
] as const;

export type AdminSpaceKey = (typeof ADMIN_SPACES)[number]["key"];

export type AdminBookingRecord = {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  userName: string | null;
  userEmail: string | null;
  space: Space;
  spaceLabel: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: BookingStatusEnum;
  statusLabel: string;
  acceptedPolicies: boolean;
  createdAt: string;
  cancelledAt: string | null;
  reminderStatus: ReminderStatusEnum;
  reminderLabel: string;
  adminNotes: string | null;
  packageLabel: string | null;
  specificStudio: string | null;
  priceModifier: number | null;
  slotStatus: SlotStatusEnum | null;
  adminEmailSent: boolean;
  customerEmailSent: boolean;
  customerWhatsappSent: boolean;
  adminWhatsappSent: boolean;
  notificationLastAttemptAt: string | null;
  notificationFailedReason: string | null;
  tags: string[];
  canCancel: boolean;
  canReschedule: boolean;
  actionMessage: string;
  refundPercentage: number;
  rescheduleOptions: {
    id: string;
    dateKey: string;
    startTime: string;
    endTime: string;
    peakTime: boolean;
    label: string | null;
    priceModifier: number;
  }[];
};

export type AdminSlotRecord = {
  id: string;
  space: Space;
  spaceLabel: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: SlotStatusEnum;
  statusLabel: string;
  peakTime: boolean;
  priceModifier: number;
  label: string | null;
  bufferBefore: number;
  bufferAfter: number;
  note: string | null;
  tag: string | null;
  bookingCount: number;
};

export type AdminWaitlistRecord = {
  id: string;
  space: Space;
  spaceLabel: string;
  dateKey: string;
  name: string;
  email: string;
  phone: string;
  note: string | null;
  status: WaitlistStatusEnum;
  statusLabel: string;
  createdAt: string;
  bookingReference: string | null;
  userEmail: string | null;
};

export type AdminSettingsSnapshot = {
  cancelFullRefundHours: number;
  cancelPartialRefundHours: number;
  partialRefundPercentage: number;
  defaultBufferBefore: number;
  defaultBufferAfter: number;
  peakPricingMultiplier: number;
  whatsappNumber: string | null;
  reminderEmailEnabled: boolean;
  reminderSmsEnabled: boolean;
};

export type AdminOverviewStats = {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  rescheduledBookings: number;
  noShowBookings: number;
  activeWaitlist: number;
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  peakSlots: number;
  todaysBookings: number;
};

export type AdminOverviewData = {
  currentDateKey: string;
  currentMonthKey: string;
  bookings: AdminBookingRecord[];
  waitlist: AdminWaitlistRecord[];
  slots: AdminSlotRecord[];
  settings: AdminSettingsSnapshot;
  stats: AdminOverviewStats;
};

export type AdminBookingsData = {
  bookings: AdminBookingRecord[];
  stats: Pick<
    AdminOverviewStats,
    | "totalBookings"
    | "confirmedBookings"
    | "pendingBookings"
    | "cancelledBookings"
    | "rescheduledBookings"
    | "noShowBookings"
  >;
};

export type AdminWaitlistData = {
  waitlist: AdminWaitlistRecord[];
  activeCount: number;
  notifiedCount: number;
  convertedCount: number;
  closedCount: number;
};

export type AdminCalendarDay = {
  dateKey: string;
  label: string;
  dayOfWeek: string;
  status: "available" | "limited" | "fully-booked" | "unavailable";
  totalSlots: number;
  availableSlots: number;
  pendingSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  waitlistOnlySlots: number;
  peakSlots: number;
  bookingCount: number;
  slots: AdminSlotRecord[];
};

export type AdminCalendarSpace = {
  key: AdminSpaceKey;
  label: string;
  name: string;
  days: AdminCalendarDay[];
};

export type AdminCalendarData = {
  monthKey: string;
  monthLabel: string;
  previousMonthKey: string;
  nextMonthKey: string;
  spaces: AdminCalendarSpace[];
  settings: AdminSettingsSnapshot;
};

export const BOOKING_STATUS_META: Record<
  BookingStatusEnum,
  { label: string; className: string }
> = {
  [BookingStatusEnum.pending]: {
    label: "Pending",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  },
  [BookingStatusEnum.pending_payment]: {
    label: "Pending Payment",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-200",
  },
  [BookingStatusEnum.confirmed]: {
    label: "Confirmed",
    className: "border-[#d8f24d]/20 bg-[#d8f24d]/10 text-[#d8f24d]",
  },
  [BookingStatusEnum.cancelled]: {
    label: "Cancelled",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-200",
  },
  [BookingStatusEnum.rescheduled]: {
    label: "Rescheduled",
    className: "border-cyan-500/20 bg-cyan-500/10 text-cyan-200",
  },
  [BookingStatusEnum.completed]: {
    label: "Completed",
    className: "border-[#d8f24d]/20 bg-[#d8f24d]/10 text-[#d8f24d]",
  },
  [BookingStatusEnum.refund_initiated]: {
    label: "Refund Initiated",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-200",
  },
  [BookingStatusEnum.refund_processed]: {
    label: "Refund Processed",
    className: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-200",
  },
  [BookingStatusEnum.no_show]: {
    label: "No Show",
    className: "border-zinc-500/20 bg-zinc-500/10 text-zinc-200",
  },
};

export const SLOT_STATUS_META: Record<
  SlotStatusEnum,
  { label: string; className: string }
> = {
  [SlotStatusEnum.available]: {
    label: "Available",
    className: "border-[#d8f24d]/20 bg-[#d8f24d]/10 text-[#d8f24d]",
  },
  [SlotStatusEnum.pending]: {
    label: "Pending",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  },
  [SlotStatusEnum.booked]: {
    label: "Booked",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  },
  [SlotStatusEnum.blocked]: {
    label: "Blocked",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-200",
  },
  [SlotStatusEnum.cancelled]: {
    label: "Cancelled",
    className: "border-zinc-500/20 bg-zinc-500/10 text-zinc-200",
  },
  [SlotStatusEnum.rescheduled]: {
    label: "Rescheduled",
    className: "border-cyan-500/20 bg-cyan-500/10 text-cyan-200",
  },
  [SlotStatusEnum.buffer_blocked]: {
    label: "Buffer Blocked",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-200",
  },
  [SlotStatusEnum.waitlist_only]: {
    label: "Waitlist Only",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  },
};

export const WAITLIST_STATUS_META: Record<
  WaitlistStatusEnum,
  { label: string; className: string }
> = {
  [WaitlistStatusEnum.active]: {
    label: "Active",
    className: "border-[#d8f24d]/20 bg-[#d8f24d]/10 text-[#d8f24d]",
  },
  [WaitlistStatusEnum.notified]: {
    label: "Notified",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  },
  [WaitlistStatusEnum.converted]: {
    label: "Converted",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  },
  [WaitlistStatusEnum.closed]: {
    label: "Closed",
    className: "border-zinc-500/20 bg-zinc-500/10 text-zinc-200",
  },
};

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { tags: true; slot: true; user: true };
}>;

type WaitlistWithRelations = Prisma.WaitlistEntryGetPayload<{
  include: { booking: true; user: true };
}>;

type SlotWithRelations = Prisma.AvailabilitySlotGetPayload<{
  include: { bookings: { select: { id: true } } };
}>;

function getStatusLabel<T extends Record<string, { label: string }>>(
  map: T,
  status: keyof T,
) {
  return map[status].label;
}

function bookingToRecord(booking: BookingWithRelations): AdminBookingRecord {
  return {
    id: booking.id,
    reference: booking.reference,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    userName: booking.user?.name ?? null,
    userEmail: booking.user?.email ?? null,
    space: booking.space,
    spaceLabel: SPACE_LABELS[booking.space],
    dateKey: booking.dateKey,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    statusLabel: getStatusLabel(BOOKING_STATUS_META, booking.status),
    acceptedPolicies: booking.acceptedPolicies,
    createdAt: booking.createdAt.toISOString(),
    cancelledAt: booking.cancelledAt ? booking.cancelledAt.toISOString() : null,
    reminderStatus: booking.reminderStatus,
    reminderLabel: booking.reminderStatus.replace(/_/g, " "),
    adminNotes: booking.adminNotes,
    packageLabel: booking.packageLabel,
    specificStudio: booking.specificStudio,
    priceModifier: booking.priceModifier,
    slotStatus: booking.slot?.status ?? null,
    adminEmailSent: booking.adminEmailSent,
    customerEmailSent: booking.customerEmailSent,
    customerWhatsappSent: booking.customerWhatsappSent,
    adminWhatsappSent: booking.adminWhatsappSent,
    notificationLastAttemptAt: booking.notificationLastAttemptAt
      ? booking.notificationLastAttemptAt.toISOString()
      : null,
    notificationFailedReason: booking.notificationFailedReason,
    tags: booking.tags.map((tag) => tag.label),
    canCancel: false,
    canReschedule: false,
    actionMessage:
      "This booking is no longer eligible for cancellation or rescheduling as per policy.",
    refundPercentage: 0,
    rescheduleOptions: [],
  };
}

function waitlistToRecord(entry: WaitlistWithRelations): AdminWaitlistRecord {
  return {
    id: entry.id,
    space: entry.space,
    spaceLabel: SPACE_LABELS[entry.space],
    dateKey: entry.dateKey,
    name: entry.name,
    email: entry.email,
    phone: entry.phone,
    note: entry.note,
    status: entry.status,
    statusLabel: getStatusLabel(WAITLIST_STATUS_META, entry.status),
    createdAt: entry.createdAt.toISOString(),
    bookingReference: entry.booking?.reference ?? null,
    userEmail: entry.user?.email ?? null,
  };
}

function slotToRecord(slot: SlotWithRelations): AdminSlotRecord {
  return {
    id: slot.id,
    space: slot.space,
    spaceLabel: SPACE_LABELS[slot.space],
    dateKey: slot.dateKey,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: slot.status,
    statusLabel: getStatusLabel(SLOT_STATUS_META, slot.status),
    peakTime: slot.peakTime,
    priceModifier: slot.priceModifier,
    label: slot.label,
    bufferBefore: slot.bufferBefore,
    bufferAfter: slot.bufferAfter,
    note: slot.note,
    tag: slot.tag,
    bookingCount: slot.bookings.length,
  };
}

export function formatDateLabel(dateKey: string) {
  return format(parseISO(dateKey), "EEE, d MMM yyyy");
}

export function formatMonthLabel(monthKey: string) {
  return format(parseISO(`${monthKey}-01`), "MMMM yyyy");
}

export function getMonthNavigation(monthKey: string) {
  const monthDate = parseISO(`${monthKey}-01`);
  return {
    previousMonthKey: format(subMonths(monthDate, 1), "yyyy-MM"),
    nextMonthKey: format(addMonths(monthDate, 1), "yyyy-MM"),
  };
}

export async function requireAdminSession(): Promise<CurrentUserSummary> {
  const currentUser = await getCurrentUserSummary();

  if (!currentUser) {
    redirect("/login?next=/admin");
  }

  if (currentUser.role !== "admin") {
    redirect("/dashboard");
  }

  return currentUser;
}

export function getDefaultMonthKey(now = new Date()) {
  return format(now, "yyyy-MM");
}

function getSettingsSnapshot(settings: {
  cancelFullRefundHours: number;
  cancelPartialRefundHours: number;
  partialRefundPercentage: number;
  defaultBufferBefore: number;
  defaultBufferAfter: number;
  peakPricingMultiplier: number;
  whatsappNumber: string | null;
  reminderEmailEnabled: boolean;
  reminderSmsEnabled: boolean;
}): AdminSettingsSnapshot {
  return {
    cancelFullRefundHours: settings.cancelFullRefundHours,
    cancelPartialRefundHours: settings.cancelPartialRefundHours,
    partialRefundPercentage: settings.partialRefundPercentage,
    defaultBufferBefore: settings.defaultBufferBefore,
    defaultBufferAfter: settings.defaultBufferAfter,
    peakPricingMultiplier: settings.peakPricingMultiplier,
    whatsappNumber: settings.whatsappNumber,
    reminderEmailEnabled: settings.reminderEmailEnabled,
    reminderSmsEnabled: settings.reminderSmsEnabled,
  };
}

function getPolicySettings(settings: {
  cancelFullRefundHours: number;
  cancelPartialRefundHours: number;
  partialRefundPercentage: number;
} | null) {
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

async function enrichBookingActions(
  booking: AdminBookingRecord,
  policySettings: {
    fullRefundHours: number;
    partialRefundHours: number;
    partialRefundPercentage: number;
  },
) {
  const policy = evaluatePolicy(
    "reschedule",
    booking.dateKey,
    booking.startTime,
    policySettings,
  );
  const isActionLocked =
    booking.status === BookingStatusEnum.cancelled ||
    booking.status === BookingStatusEnum.rescheduled ||
    booking.status === BookingStatusEnum.no_show;
  const canAct =
    !isActionLocked && policy.isAllowed && booking.status === BookingStatusEnum.confirmed;
  const rescheduleOptions = canAct
    ? await getAvailableRescheduleSlotsForSpace(
        booking.space,
        booking.dateKey,
        booking.startTime,
      )
    : [];

  return {
    ...booking,
    canCancel: canAct,
    canReschedule: canAct && rescheduleOptions.length > 0,
    actionMessage: isActionLocked
      ? "This booking is no longer eligible for cancellation or rescheduling as per policy."
      : policy.message,
    refundPercentage: policy.refundPercentage,
    rescheduleOptions: rescheduleOptions.map((slot) => ({
      id: slot.id,
      dateKey: slot.dateKey,
      startTime: slot.startTime,
      endTime: slot.endTime,
      peakTime: slot.peakTime,
      label: slot.label ?? null,
      priceModifier: slot.priceModifier,
    })),
  } satisfies AdminBookingRecord;
}

function getOverviewStats(params: {
  bookings: AdminBookingRecord[];
  waitlist: AdminWaitlistRecord[];
  slots: AdminSlotRecord[];
  currentDateKey: string;
}): AdminOverviewStats {
  const { bookings, waitlist, slots, currentDateKey } = params;

  return {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((item) => item.status === BookingStatusEnum.confirmed).length,
    pendingBookings: bookings.filter((item) => item.status === BookingStatusEnum.pending).length,
    cancelledBookings: bookings.filter((item) => item.status === BookingStatusEnum.cancelled).length,
    rescheduledBookings: bookings.filter((item) => item.status === BookingStatusEnum.rescheduled).length,
    noShowBookings: bookings.filter((item) => item.status === BookingStatusEnum.no_show).length,
    activeWaitlist: waitlist.filter((item) => item.status === WaitlistStatusEnum.active).length,
    totalSlots: slots.length,
    availableSlots: slots.filter((item) => item.status === SlotStatusEnum.available).length,
    bookedSlots: slots.filter((item) => item.status === SlotStatusEnum.booked).length,
    blockedSlots: slots.filter((item) => item.status === SlotStatusEnum.blocked).length,
    peakSlots: slots.filter((item) => item.peakTime).length,
    todaysBookings: bookings.filter((item) => item.dateKey === currentDateKey).length,
  };
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  const currentDateKey = getLocalDateKey();
  const currentMonthKey = getMonthKeyFromDateKey(currentDateKey);

  const [settings, bookings, waitlist, slots] = await Promise.all([
    prisma.appSettings.findUnique({ where: { id: 1 } }),
    prisma.booking.findMany({
      include: { tags: true, slot: true, user: true },
      orderBy: [{ createdAt: "desc" }],
      take: 24,
    }),
    prisma.waitlistEntry.findMany({
      include: { booking: true, user: true },
      orderBy: [{ createdAt: "desc" }],
      take: 12,
    }),
    prisma.availabilitySlot.findMany({
      include: { bookings: { select: { id: true } } },
      orderBy: [{ dateKey: "asc" }, { startTime: "asc" }],
      take: 48,
    }),
  ]);

  const bookingRecords = bookings.map(bookingToRecord);
  const waitlistRecords = waitlist.map(waitlistToRecord);
  const slotRecords = slots.map(slotToRecord);

  return {
    currentDateKey,
    currentMonthKey,
    bookings: bookingRecords,
    waitlist: waitlistRecords,
    slots: slotRecords,
    settings: getSettingsSnapshot(
      settings ?? {
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
    ),
    stats: getOverviewStats({
      bookings: bookingRecords,
      waitlist: waitlistRecords,
      slots: slotRecords,
      currentDateKey,
    }),
  };
}

export async function getAdminBookingsData(): Promise<AdminBookingsData> {
  const [settings, bookings] = await Promise.all([
    prisma.appSettings.findUnique({ where: { id: 1 } }),
    prisma.booking.findMany({
      include: { tags: true, slot: true, user: true },
      orderBy: [{ createdAt: "desc" }],
    }),
  ]);

  const baseRecords = bookings.map(bookingToRecord);
  const policySettings = getPolicySettings(settings);
  const records = await Promise.all(
    baseRecords.map((record) => enrichBookingActions(record, policySettings)),
  );

  return {
    bookings: records,
    stats: {
      totalBookings: records.length,
      confirmedBookings: records.filter((item) => item.status === BookingStatusEnum.confirmed).length,
      pendingBookings: records.filter((item) => item.status === BookingStatusEnum.pending).length,
      cancelledBookings: records.filter((item) => item.status === BookingStatusEnum.cancelled).length,
      rescheduledBookings: records.filter((item) => item.status === BookingStatusEnum.rescheduled).length,
      noShowBookings: records.filter((item) => item.status === BookingStatusEnum.no_show).length,
    },
  };
}

export async function getAdminWaitlistData(): Promise<AdminWaitlistData> {
  const waitlist = await prisma.waitlistEntry.findMany({
    include: { booking: true, user: true },
    orderBy: [{ createdAt: "desc" }],
  });

  const records = waitlist.map(waitlistToRecord);

  return {
    waitlist: records,
    activeCount: records.filter((item) => item.status === WaitlistStatusEnum.active).length,
    notifiedCount: records.filter((item) => item.status === WaitlistStatusEnum.notified).length,
    convertedCount: records.filter((item) => item.status === WaitlistStatusEnum.converted).length,
    closedCount: records.filter((item) => item.status === WaitlistStatusEnum.closed).length,
  };
}

export async function getAdminCalendarData(monthKey = getDefaultMonthKey()): Promise<AdminCalendarData> {
  const normalizedMonth = monthKey || getDefaultMonthKey();
  const { previousMonthKey, nextMonthKey } = getMonthNavigation(normalizedMonth);
  const monthStart = startOfMonth(parseISO(`${normalizedMonth}-01`));
  const monthEnd = endOfMonth(monthStart);

  const [settings, slots, bookings] = await Promise.all([
    prisma.appSettings.findUnique({ where: { id: 1 } }),
    prisma.availabilitySlot.findMany({
      include: { bookings: { select: { id: true } } },
      where: { dateKey: { startsWith: normalizedMonth } },
      orderBy: [{ dateKey: "asc" }, { startTime: "asc" }],
    }),
    prisma.booking.findMany({
      select: { dateKey: true, space: true, status: true },
      where: { dateKey: { startsWith: normalizedMonth } },
    }),
  ]);

  const slotRecords = slots.map(slotToRecord);
  const bookingsByDateSpace = new Map<string, number>();

  for (const booking of bookings) {
    const key = `${booking.space}:${booking.dateKey}`;
    bookingsByDateSpace.set(key, (bookingsByDateSpace.get(key) ?? 0) + 1);
  }

  const dates = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const spaces = ADMIN_SPACES.map<AdminCalendarSpace>((space) => ({
    key: space.key,
    label: space.label,
    name: space.name,
    days: dates.map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const daySlots = slotRecords
        .filter((slot) => slot.space === space.key && slot.dateKey === dateKey)
        .sort(compareDateTimeKeys);
      const summary = getDayAvailabilitySummary(daySlots.map(serializeSlot), dateKey);

      return {
        dateKey,
        label: format(date, "EEE, d MMM"),
        dayOfWeek: format(date, "EEE"),
        status: summary.status,
        totalSlots: summary.totalSlots,
        availableSlots: summary.availableSlots,
        pendingSlots: summary.pendingSlots,
        bookedSlots: summary.bookedSlots,
        blockedSlots: summary.blockedSlots,
        waitlistOnlySlots: summary.waitlistOnlySlots,
        peakSlots: summary.peakSlots,
        bookingCount: bookingsByDateSpace.get(`${space.key}:${dateKey}`) ?? 0,
        slots: daySlots,
      };
    }),
  }));

  return {
    monthKey: normalizedMonth,
    monthLabel: formatMonthLabel(normalizedMonth),
    previousMonthKey,
    nextMonthKey,
    spaces,
    settings: getSettingsSnapshot(
      settings ?? {
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
    ),
  };
}

export async function setBookingStatus(input: { bookingId: string; status: BookingStatusEnum }) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: { slot: true },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: input.bookingId },
      data: {
        status: input.status,
        cancelledAt:
          input.status === BookingStatusEnum.cancelled
            ? new Date()
            : booking.cancelledAt,
      },
    });

    if (booking.slotId) {
      if (
        input.status === BookingStatusEnum.cancelled ||
        input.status === BookingStatusEnum.rescheduled
      ) {
        await tx.availabilitySlot.updateMany({
          where: {
            id: booking.slotId,
            status: { in: [SlotStatusEnum.booked, SlotStatusEnum.pending] },
          },
          data: { status: SlotStatusEnum.available },
        });
      }

      if (input.status === BookingStatusEnum.confirmed) {
        await tx.availabilitySlot.updateMany({
          where: { id: booking.slotId },
          data: { status: SlotStatusEnum.booked },
        });
      }
    }

    return updated;
  });
}

export async function setBookingNote(input: { bookingId: string; note: string }) {
  return prisma.booking.update({
    where: { id: input.bookingId },
    data: { adminNotes: input.note.trim() || null },
  });
}

export async function addBookingTag(input: { bookingId: string; label: string }) {
  const label = input.label.trim();
  if (!label) {
    return null;
  }

  return prisma.bookingTag.upsert({
    where: {
      bookingId_label: {
        bookingId: input.bookingId,
        label,
      },
    },
    update: {},
    create: {
      bookingId: input.bookingId,
      label,
    },
  });
}

export async function removeBookingTag(input: { bookingId: string; label: string }) {
  return prisma.bookingTag.deleteMany({
    where: { bookingId: input.bookingId, label: input.label.trim() },
  });
}

export async function setSlotStatus(input: { slotId: string; status: SlotStatusEnum }) {
  return prisma.availabilitySlot.update({
    where: { id: input.slotId },
    data: { status: input.status },
  });
}

export async function updateSlotDetails(input: {
  slotId: string;
  note: string;
  tag: string;
  label: string;
  peakTime: boolean;
  priceModifier: number;
  bufferBefore: number;
  bufferAfter: number;
}) {
  return prisma.availabilitySlot.update({
    where: { id: input.slotId },
    data: {
      note: input.note.trim() || null,
      tag: input.tag.trim() || null,
      label: input.label.trim() || null,
      peakTime: input.peakTime,
      priceModifier: input.priceModifier,
      bufferBefore: input.bufferBefore,
      bufferAfter: input.bufferAfter,
    },
  });
}

export async function setDaySlotStatus(input: {
  space: Space;
  dateKey: string;
  mode: "open" | "blocked";
}) {
  const openStatuses = [
    SlotStatusEnum.blocked,
    SlotStatusEnum.pending,
    SlotStatusEnum.cancelled,
    SlotStatusEnum.rescheduled,
    SlotStatusEnum.buffer_blocked,
    SlotStatusEnum.waitlist_only,
  ];

  if (input.mode === "open") {
    return prisma.availabilitySlot.updateMany({
      where: {
        space: input.space,
        dateKey: input.dateKey,
        status: { in: openStatuses },
      },
      data: { status: SlotStatusEnum.available },
    });
  }

  return prisma.availabilitySlot.updateMany({
    where: {
      space: input.space,
      dateKey: input.dateKey,
      status: { not: SlotStatusEnum.booked },
    },
    data: { status: SlotStatusEnum.blocked },
  });
}

export async function setWaitlistStatus(input: {
  waitlistId: string;
  status: WaitlistStatusEnum;
}) {
  return prisma.waitlistEntry.update({
    where: { id: input.waitlistId },
    data: { status: input.status },
  });
}

export async function updateAdminSettings(input: AdminSettingsSnapshot) {
  return prisma.appSettings.upsert({
    where: { id: 1 },
    update: {
      cancelFullRefundHours: input.cancelFullRefundHours,
      cancelPartialRefundHours: input.cancelPartialRefundHours,
      partialRefundPercentage: input.partialRefundPercentage,
      defaultBufferBefore: input.defaultBufferBefore,
      defaultBufferAfter: input.defaultBufferAfter,
      peakPricingMultiplier: input.peakPricingMultiplier,
      whatsappNumber: input.whatsappNumber,
      reminderEmailEnabled: input.reminderEmailEnabled,
      reminderSmsEnabled: input.reminderSmsEnabled,
    },
    create: {
      id: 1,
      cancelFullRefundHours: input.cancelFullRefundHours,
      cancelPartialRefundHours: input.cancelPartialRefundHours,
      partialRefundPercentage: input.partialRefundPercentage,
      defaultBufferBefore: input.defaultBufferBefore,
      defaultBufferAfter: input.defaultBufferAfter,
      peakPricingMultiplier: input.peakPricingMultiplier,
      whatsappNumber: input.whatsappNumber,
      reminderEmailEnabled: input.reminderEmailEnabled,
      reminderSmsEnabled: input.reminderSmsEnabled,
    },
  });
}
