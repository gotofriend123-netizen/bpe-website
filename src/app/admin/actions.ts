"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BookingStatus as BookingStatusEnum,
  EventAvailability as EventAvailabilityEnum,
  OfferStatus as OfferStatusEnum,
  SlotStatus as SlotStatusEnum,
  WaitlistStatus as WaitlistStatusEnum,
} from "@prisma/client";
import { z } from "zod";

import { createEventListing, createOffer } from "@/lib/admin/control-center";
import { saveEventImageUpload } from "@/lib/admin/event-media";
import {
  addBookingTag,
  requireAdminSession,
  removeBookingTag,
  setBookingNote,
  setBookingStatus,
  setDaySlotStatus,
  setSlotStatus,
  setWaitlistStatus,
  updateAdminSettings,
  updateSlotDetails,
} from "@/lib/admin/admin-dashboard";
import { cancelBooking, rescheduleBooking } from "@/lib/booking/service";
import type { EventCategoryId } from "@/lib/events/catalog";
import { prisma } from "@/lib/prisma";

const ADMIN_PATHS = [
  "/admin",
  "/admin/bookings",
  "/admin/calendar",
  "/admin/events",
  "/admin/offers",
  "/admin/waitlist",
  "/admin/settings",
] as const;

const EVENT_CATEGORY_VALUES = [
  "parties",
  "standup",
  "workshop",
  "meetup",
  "concert",
  "exhibition",
  "live-vibes",
  "festival",
] as const satisfies readonly EventCategoryId[];

const bookingStatusSchema = z.object({
  bookingId: z.string().min(1),
  status: z.nativeEnum(BookingStatusEnum),
});

const bookingNoteSchema = z.object({
  bookingId: z.string().min(1),
  note: z.string().max(2000).optional(),
});

const bookingTagSchema = z.object({
  bookingId: z.string().min(1),
  label: z.string().min(1).max(60),
});

const slotStatusSchema = z.object({
  slotId: z.string().min(1),
  status: z.nativeEnum(SlotStatusEnum),
});

const slotDetailsSchema = z.object({
  slotId: z.string().min(1),
  note: z.string().max(2000).optional(),
  tag: z.string().max(120).optional(),
  label: z.string().max(120).optional(),
  peakTime: z.boolean(),
  priceModifier: z.number().min(0.1).max(10),
  bufferBefore: z.number().int().min(0).max(360),
  bufferAfter: z.number().int().min(0).max(360),
});

const daySlotSchema = z.object({
  space: z.enum(["vsl", "vsr", "arcade"]),
  dateKey: z.string().min(10),
  mode: z.enum(["open", "blocked"]),
});

const waitlistStatusSchema = z.object({
  waitlistId: z.string().min(1),
  status: z.nativeEnum(WaitlistStatusEnum),
});

const settingsSchema = z.object({
  cancelFullRefundHours: z.number().int().min(0).max(240),
  cancelPartialRefundHours: z.number().int().min(0).max(240),
  partialRefundPercentage: z.number().int().min(0).max(100),
  defaultBufferBefore: z.number().int().min(0).max(360),
  defaultBufferAfter: z.number().int().min(0).max(360),
  peakPricingMultiplier: z.number().min(1).max(5),
  whatsappNumber: z.string().nullable(),
  reminderEmailEnabled: z.boolean(),
  reminderSmsEnabled: z.boolean(),
});

const adminBookingIdSchema = z.object({
  bookingId: z.string().min(1),
});

const adminRescheduleSchema = z.object({
  bookingId: z.string().min(1),
  slotId: z.string().min(1),
});

const eventListingSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().max(140).optional(),
  category: z.enum(EVENT_CATEGORY_VALUES),
  summary: z.string().min(24).max(220),
  teaser: z.string().min(24).max(220),
  venue: z.string().min(2).max(120),
  organizer: z.string().min(2).max(120),
  city: z.string().min(2).max(80),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  priceFrom: z.number().int().min(0).max(200000),
  posterImage: z.string().max(400).optional(),
  coverImage: z.string().max(400).optional(),
  availability: z.nativeEnum(EventAvailabilityEnum),
  metadataLine: z.string().max(180).optional(),
  hot: z.boolean(),
  featured: z.boolean(),
  trending: z.boolean(),
  homepage: z.boolean(),
  published: z.boolean(),
  highlights: z.array(z.string()).min(2).max(6),
  description: z.array(z.string()).min(2).max(6),
  policies: z.array(z.string()).min(2).max(6),
  ticketLabel: z.string().min(2).max(80),
  ticketDescription: z.string().min(8).max(180),
  ticketPerks: z.array(z.string()).min(1).max(6),
});

const offerSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().max(140).optional(),
  summary: z.string().min(12).max(180),
  description: z.string().max(500).optional(),
  image: z.string().min(1).max(400),
  venue: z.string().max(120).optional(),
  code: z.string().max(80).optional(),
  discountLabel: z.string().max(80).optional(),
  ctaLabel: z.string().max(60).optional(),
  status: z.nativeEnum(OfferStatusEnum),
  featured: z.boolean(),
  validUntil: z.string().optional(),
});

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

function readNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(readString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function readList(formData: FormData, key: string) {
  return readString(formData, key)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function readFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function revalidateAdminPages() {
  for (const path of ADMIN_PATHS) {
    revalidatePath(path);
  }
}

function revalidateAdminAndEventPages(slug?: string) {
  revalidateAdminPages();
  revalidatePath("/");
  revalidatePath("/events");

  if (slug) {
    revalidatePath(`/events/${slug}`);
  }
}

export async function updateBookingStatusAction(formData: FormData) {
  await requireAdminSession();
  const parsed = bookingStatusSchema.safeParse({
    bookingId: readString(formData, "bookingId"),
    status: readString(formData, "status"),
  });

  if (!parsed.success) {
    throw new Error("Please select a valid booking status.");
  }

  await setBookingStatus(parsed.data);
  revalidateAdminPages();
}

export async function updateBookingNoteAction(formData: FormData) {
  await requireAdminSession();
  const parsed = bookingNoteSchema.safeParse({
    bookingId: readString(formData, "bookingId"),
    note: readString(formData, "note"),
  });

  if (!parsed.success) {
    throw new Error("Please add a valid internal note.");
  }

  await setBookingNote({
    bookingId: parsed.data.bookingId,
    note: parsed.data.note ?? "",
  });
  revalidateAdminPages();
}

export async function addBookingTagAction(formData: FormData) {
  await requireAdminSession();
  const parsed = bookingTagSchema.safeParse({
    bookingId: readString(formData, "bookingId"),
    label: readString(formData, "label"),
  });

  if (!parsed.success) {
    throw new Error("Please enter a valid tag.");
  }

  await addBookingTag(parsed.data);
  revalidateAdminPages();
}

export async function removeBookingTagAction(formData: FormData) {
  await requireAdminSession();
  const parsed = bookingTagSchema.safeParse({
    bookingId: readString(formData, "bookingId"),
    label: readString(formData, "label"),
  });

  if (!parsed.success) {
    throw new Error("Unable to remove the tag.");
  }

  await removeBookingTag(parsed.data);
  revalidateAdminPages();
}

export async function updateSlotStatusAction(formData: FormData) {
  await requireAdminSession();
  const parsed = slotStatusSchema.safeParse({
    slotId: readString(formData, "slotId"),
    status: readString(formData, "status"),
  });

  if (!parsed.success) {
    throw new Error("Please choose a valid slot status.");
  }

  await setSlotStatus(parsed.data);
  revalidateAdminPages();
}

export async function updateSlotDetailsAction(formData: FormData) {
  await requireAdminSession();
  const parsed = slotDetailsSchema.safeParse({
    slotId: readString(formData, "slotId"),
    note: readString(formData, "note"),
    tag: readString(formData, "tag"),
    label: readString(formData, "label"),
    peakTime: readBoolean(formData, "peakTime"),
    priceModifier: readNumber(formData, "priceModifier", 1),
    bufferBefore: readNumber(formData, "bufferBefore", 30),
    bufferAfter: readNumber(formData, "bufferAfter", 30),
  });

  if (!parsed.success) {
    throw new Error("Please review the slot details before saving.");
  }

  await updateSlotDetails({
    ...parsed.data,
    note: parsed.data.note ?? "",
    tag: parsed.data.tag ?? "",
    label: parsed.data.label ?? "",
  });
  revalidateAdminPages();
}

export async function setDaySlotStatusAction(formData: FormData) {
  await requireAdminSession();
  const parsed = daySlotSchema.safeParse({
    space: readString(formData, "space"),
    dateKey: readString(formData, "dateKey"),
    mode: readString(formData, "mode"),
  });

  if (!parsed.success) {
    throw new Error("Please choose a valid day action.");
  }

  await setDaySlotStatus(parsed.data);
  revalidateAdminPages();
}

export async function updateWaitlistStatusAction(formData: FormData) {
  await requireAdminSession();
  const parsed = waitlistStatusSchema.safeParse({
    waitlistId: readString(formData, "waitlistId"),
    status: readString(formData, "status"),
  });

  if (!parsed.success) {
    throw new Error("Please choose a valid waitlist status.");
  }

  await setWaitlistStatus(parsed.data);
  revalidateAdminPages();
}

export async function updateSettingsAction(formData: FormData) {
  await requireAdminSession();
  const parsed = settingsSchema.safeParse({
    cancelFullRefundHours: readNumber(formData, "cancelFullRefundHours", 72),
    cancelPartialRefundHours: readNumber(formData, "cancelPartialRefundHours", 24),
    partialRefundPercentage: readNumber(formData, "partialRefundPercentage", 50),
    defaultBufferBefore: readNumber(formData, "defaultBufferBefore", 30),
    defaultBufferAfter: readNumber(formData, "defaultBufferAfter", 30),
    peakPricingMultiplier: Number(readString(formData, "peakPricingMultiplier") || 1.25),
    whatsappNumber: readString(formData, "whatsappNumber") || null,
    reminderEmailEnabled: readBoolean(formData, "reminderEmailEnabled"),
    reminderSmsEnabled: readBoolean(formData, "reminderSmsEnabled"),
  });

  if (!parsed.success) {
    throw new Error("Please review the settings before saving.");
  }

  await updateAdminSettings(parsed.data);
  revalidateAdminPages();
}

export async function cancelAdminBookingAction(formData: FormData) {
  await requireAdminSession();
  const parsed = adminBookingIdSchema.safeParse({
    bookingId: readString(formData, "bookingId"),
  });

  if (!parsed.success) {
    redirect("/admin/bookings?error=Please%20choose%20a%20booking%20to%20cancel.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId },
    select: { reference: true },
  });

  if (!booking) {
    redirect("/admin/bookings?error=Booking%20not%20found.");
  }

  try {
    await cancelBooking(booking.reference);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to cancel this booking right now.";
    redirect(`/admin/bookings?error=${encodeURIComponent(message)}`);
  }

  revalidateAdminPages();
  redirect(`/admin/bookings?updated=${booking.reference}&action=cancelled`);
}

export async function rescheduleAdminBookingAction(formData: FormData) {
  await requireAdminSession();
  const parsed = adminRescheduleSchema.safeParse({
    bookingId: readString(formData, "bookingId"),
    slotId: readString(formData, "slotId"),
  });

  if (!parsed.success) {
    redirect("/admin/bookings?error=Please%20choose%20a%20booking%20and%20valid%20slot%20to%20reschedule.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId },
    select: {
      reference: true,
    },
  });

  if (!booking) {
    redirect("/admin/bookings?error=Booking%20not%20found.");
  }

  try {
    const result = await rescheduleBooking(booking.reference, parsed.data.slotId);
    revalidateAdminPages();
    redirect(`/admin/bookings?updated=${result.booking.reference}&action=rescheduled`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reschedule this booking right now.";
    redirect(`/admin/bookings?error=${encodeURIComponent(message)}`);
  }
}

export async function createEventListingAction(formData: FormData) {
  const currentUser = await requireAdminSession();
  const posterFile = readFile(formData, "posterFile");
  const coverFile = readFile(formData, "coverFile");

  const parsed = eventListingSchema.safeParse({
    title: readString(formData, "title"),
    slug: readString(formData, "slug") || undefined,
    category: readString(formData, "category"),
    summary: readString(formData, "summary"),
    teaser: readString(formData, "teaser"),
    venue: readString(formData, "venue"),
    organizer: readString(formData, "organizer"),
    city: readString(formData, "city"),
    startsAt: readString(formData, "startsAt"),
    endsAt: readString(formData, "endsAt"),
    priceFrom: readNumber(formData, "priceFrom"),
    posterImage: readString(formData, "posterImage"),
    coverImage: readString(formData, "coverImage") || undefined,
    availability: readString(formData, "availability"),
    metadataLine: readString(formData, "metadataLine") || undefined,
    hot: readBoolean(formData, "hot"),
    featured: readBoolean(formData, "featured"),
    trending: readBoolean(formData, "trending"),
    homepage: readBoolean(formData, "homepage"),
    published: readBoolean(formData, "published"),
    highlights: readList(formData, "highlights"),
    description: readList(formData, "description"),
    policies: readList(formData, "policies"),
    ticketLabel: readString(formData, "ticketLabel"),
    ticketDescription: readString(formData, "ticketDescription"),
    ticketPerks: readList(formData, "ticketPerks"),
  });

  if (!parsed.success) {
    redirect("/admin/events?error=Please%20review%20the%20event%20details%20before%20publishing.");
  }

  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(parsed.data.endsAt);

  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
    redirect("/admin/events?error=Please%20enter%20a%20valid%20event%20date%20range.");
  }

  let posterImage = parsed.data.posterImage?.trim() || "";
  let coverImage = parsed.data.coverImage?.trim() || undefined;

  try {
    if (posterFile) {
      posterImage = await saveEventImageUpload(
        posterFile,
        "poster",
        parsed.data.slug || parsed.data.title,
      );
    }

    if (coverFile) {
      coverImage = await saveEventImageUpload(
        coverFile,
        "cover",
        parsed.data.slug || parsed.data.title,
      );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to upload the event image right now.";
    redirect(`/admin/events?error=${encodeURIComponent(message)}`);
  }

  if (!posterImage) {
    redirect("/admin/events?error=Please%20upload%20a%20poster%20or%20enter%20a%20poster%20image%20path.");
  }

  try {
    const created = await createEventListing(
      {
        ...parsed.data,
        posterImage,
        coverImage: coverImage || posterImage,
        startsAt,
        endsAt,
      },
      currentUser.id,
    );

    revalidateAdminAndEventPages(created.slug);
    redirect(`/admin/events?success=${encodeURIComponent(created.title)}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create the event listing right now.";
    redirect(`/admin/events?error=${encodeURIComponent(message)}`);
  }
}

export async function createOfferAction(formData: FormData) {
  const currentUser = await requireAdminSession();

  const parsed = offerSchema.safeParse({
    title: readString(formData, "title"),
    slug: readString(formData, "slug") || undefined,
    summary: readString(formData, "summary"),
    description: readString(formData, "description") || undefined,
    image: readString(formData, "image"),
    venue: readString(formData, "venue") || undefined,
    code: readString(formData, "code") || undefined,
    discountLabel: readString(formData, "discountLabel") || undefined,
    ctaLabel: readString(formData, "ctaLabel") || undefined,
    status: readString(formData, "status"),
    featured: readBoolean(formData, "featured"),
    validUntil: readString(formData, "validUntil") || undefined,
  });

  if (!parsed.success) {
    redirect("/admin/offers?error=Please%20review%20the%20offer%20details%20before%20saving.");
  }

  const validUntil =
    parsed.data.validUntil && parsed.data.validUntil.trim()
      ? new Date(parsed.data.validUntil)
      : null;

  if (validUntil && Number.isNaN(validUntil.getTime())) {
    redirect("/admin/offers?error=Please%20enter%20a%20valid%20expiry%20date.");
  }

  try {
    const created = await createOffer(
      {
        ...parsed.data,
        validUntil,
      },
      currentUser.id,
    );

    revalidateAdminAndEventPages();
    redirect(`/admin/offers?success=${encodeURIComponent(created.title)}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create the offer right now.";
    redirect(`/admin/offers?error=${encodeURIComponent(message)}`);
  }
}
