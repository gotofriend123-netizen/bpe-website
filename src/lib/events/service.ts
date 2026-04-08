import "server-only";

import { randomBytes } from "crypto";

import { EventBookingStatus } from "@prisma/client";
import { z } from "zod";

import { getCurrentSession } from "@/lib/auth/session";
import { BUSINESS_SUPPORT_EMAIL, toAbsoluteAppUrl } from "@/lib/business/contact";
import {
  EVENTS,
  type EventItem,
  type EventTicketTier,
} from "@/lib/events/catalog";
import { getAllEventItems, getEventItemBySlug } from "@/lib/events/repository";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/notifications/email";
import {
  buildEventAdminAlertEmail,
  buildEventCustomerConfirmationEmail,
} from "@/lib/events/templates";

export const eventBookingSchema = z.object({
  eventSlug: z.string().min(1),
  ticketTierId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(10),
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
});

function createEventReference() {
  return `EVT-${randomBytes(3).toString("hex").toUpperCase()}`;
}

async function resolveEventAndTier(eventSlug: string, ticketTierId: string): Promise<{
  event: EventItem;
  ticketTier: EventTicketTier;
}> {
  const event = await getEventItemBySlug(eventSlug);

  if (!event) {
    throw new Error("Selected event could not be found.");
  }

  if (event.availability === "sold_out") {
    throw new Error("This event is currently sold out.");
  }

  const ticketTier = event.ticketTiers.find((tier) => tier.id === ticketTierId);

  if (!ticketTier) {
    throw new Error("Selected ticket tier could not be found.");
  }

  return { event, ticketTier };
}

async function sendEventBookingNotifications(params: {
  bookingId: string;
  event: EventItem;
  ticketTier: EventTicketTier;
}) {
  const booking = await prisma.eventBooking.findUnique({
    where: { id: params.bookingId },
  });

  if (!booking) {
    return null;
  }

  const confirmationUrl = toAbsoluteAppUrl(`/events/confirmation?ref=${booking.reference}`);
  const input = {
    reference: booking.reference,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    eventTitle: booking.eventTitle,
    eventCategory: booking.eventCategory,
    venue: booking.eventVenue,
    organizer: booking.organizer,
    startsAt: booking.eventStartsAt,
    endsAt: booking.eventEndsAt ?? booking.eventStartsAt,
    ticketTierLabel: booking.ticketTierLabel,
    quantity: booking.quantity,
    totalAmount: booking.totalAmount,
    confirmationUrl,
    supportEmail: BUSINESS_SUPPORT_EMAIL,
  };

  const customerEmail = await sendMail({
    to: booking.customerEmail,
    ...buildEventCustomerConfirmationEmail(input),
  });
  const adminEmail = await sendMail({
    to: BUSINESS_SUPPORT_EMAIL,
    ...buildEventAdminAlertEmail(input),
  });

  const failureReason = [
    !customerEmail.ok && customerEmail.kind === "error"
      ? `Customer email: ${customerEmail.reason}`
      : null,
    !adminEmail.ok && adminEmail.kind === "error"
      ? `Admin email: ${adminEmail.reason}`
      : null,
  ]
    .filter(Boolean)
    .join(" | ");

  await prisma.eventBooking.update({
    where: { id: booking.id },
    data: {
      confirmationEmailSent: customerEmail.ok,
      adminEmailSent: adminEmail.ok,
      notificationLastAttemptAt: new Date(),
      notificationFailedReason: failureReason || null,
    },
  });

  return {
    customerEmail: customerEmail.ok ? "sent" : customerEmail.kind === "not-configured" ? "skipped" : "failed",
    adminEmail: adminEmail.ok ? "sent" : adminEmail.kind === "not-configured" ? "skipped" : "failed",
  };
}

export async function createEventBooking(input: z.infer<typeof eventBookingSchema>) {
  const { event, ticketTier } = await resolveEventAndTier(input.eventSlug, input.ticketTierId);
  const currentSession = await getCurrentSession();

  const booking = await prisma.eventBooking.create({
    data: {
      reference: createEventReference(),
      userId: currentSession?.user.id ?? null,
      eventSlug: event.slug,
      eventTitle: event.title,
      eventCategory: event.categoryLabel,
      eventVenue: event.venue,
      organizer: event.organizer,
      posterImage: event.posterImage,
      eventStartsAt: new Date(event.startsAt),
      eventEndsAt: new Date(event.endsAt),
      ticketTierId: ticketTier.id,
      ticketTierLabel: ticketTier.label,
      ticketUnitPrice: ticketTier.price,
      quantity: input.quantity,
      totalAmount: ticketTier.price * input.quantity,
      customerName: input.fullName,
      customerEmail: input.email.toLowerCase(),
      customerPhone: input.phone,
      status: EventBookingStatus.confirmed,
    },
  });

  const notifications = await sendEventBookingNotifications({
    bookingId: booking.id,
    event,
    ticketTier,
  });

  return {
    booking,
    event,
    ticketTier,
    confirmationUrl: `/events/confirmation?ref=${booking.reference}`,
    notifications,
  };
}

export async function getEventBookingByReference(reference: string) {
  if (!reference) {
    return null;
  }

  return prisma.eventBooking.findUnique({
    where: { reference },
  });
}

export function getCategorySections() {
  return [
    {
      title: "Workshops Near You",
      description: "Hands-on formats that feel polished, social, and professionally staged.",
      category: "workshop",
    },
    {
      title: "Live Music & Concerts",
      description: "Atmospheric live experiences with premium room energy and strong audience flow.",
      category: "concert",
    },
    {
      title: "Premium Private Events",
      description: "Curated social formats and premium community nights built around experience.",
      category: "live-vibes",
    },
    {
      title: "Networking & Meetups",
      description: "High-intent conversations for founders, operators, and communities.",
      category: "meetup",
    },
  ] as const;
}

export function getEventCount() {
  return EVENTS.length;
}

export async function getUpcomingMonthLabel() {
  const first = (await getAllEventItems())[0];
  return first ? new Date(first.startsAt).toLocaleString("en-IN", { month: "long", year: "numeric" }) : "This Month";
}
