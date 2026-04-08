import "server-only";

import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import {
  EventAvailability,
  OfferStatus,
  type Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getAllEventItems } from "@/lib/events/repository";
import { type EventCategoryId, EVENT_CATEGORIES } from "@/lib/events/catalog";

const CATEGORY_LABELS = new Map(EVENT_CATEGORIES.map((item) => [item.id, item.label]));

const CATEGORY_ACCENTS: Record<EventCategoryId, string> = {
  parties: "from-[#365ee8]/95 via-[#2847b8]/85 to-[#1e2a6d]/85",
  standup: "from-[#b73e84]/95 via-[#8f2965]/88 to-[#5e1841]/82",
  workshop: "from-[#b69466]/95 via-[#8f744d]/86 to-[#604d31]/84",
  meetup: "from-[#b53f44]/95 via-[#8e2e33]/88 to-[#5f171a]/82",
  concert: "from-[#5b995d]/95 via-[#447a47]/88 to-[#244629]/82",
  exhibition: "from-[#bce8e2]/95 via-[#8fc9c2]/86 to-[#5a928c]/82",
  "live-vibes": "from-[#cb9164]/95 via-[#af7143]/87 to-[#744625]/82",
  festival: "from-[#7d4fe3]/95 via-[#5d32b6]/87 to-[#371b6f]/82",
};

type EventListingWithCreator = Prisma.EventListingGetPayload<{
  include: {
    createdBy: {
      select: { name: true; email: true };
    };
  };
}>;

type OfferWithCreator = Prisma.OfferGetPayload<{
  include: {
    createdBy: {
      select: { name: true; email: true };
    };
  };
}>;

export type AdminActivityPoint = {
  label: string;
  studioBookings: number;
  eventTickets: number;
};

export type AdminEventListingRecord = {
  id: string;
  slug: string;
  title: string;
  categoryLabel: string;
  venue: string;
  startsAt: string;
  priceFrom: number;
  availability: string;
  published: boolean;
  featured: boolean;
  hot: boolean;
  bookingsCount: number;
  createdByName: string | null;
};

export type AdminOfferRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  venue: string | null;
  code: string | null;
  discountLabel: string | null;
  status: OfferStatus;
  featured: boolean;
  validUntil: string | null;
  createdByName: string | null;
};

export type AdminControlCenterData = {
  stats: {
    studioBookings: number;
    eventTickets: number;
    publishedEvents: number;
    activeOffers: number;
    openSlots: number;
    activeWaitlist: number;
    totalEventIncome: number;
    pastEventsCount: number;
  };
  activity: AdminActivityPoint[];
  eventMix: Array<{ label: string; value: number; color: string }>;
  recentStudioBookings: Array<{
    id: string;
    reference: string;
    customerName: string;
    space: string;
    dateKey: string;
    status: string;
  }>;
  recentEventBookings: Array<{
    id: string;
    reference: string;
    eventTitle: string;
    customerName: string;
    quantity: number;
    totalAmount: number;
    status: string;
  }>;
  eventListings: AdminEventListingRecord[];
  offers: AdminOfferRecord[];
};

export type CreateEventListingInput = {
  title: string;
  slug?: string;
  category: EventCategoryId;
  summary: string;
  teaser: string;
  venue: string;
  organizer: string;
  city: string;
  startsAt: Date;
  endsAt: Date;
  priceFrom: number;
  posterImage: string;
  coverImage?: string | null;
  availability: EventAvailability;
  metadataLine?: string | null;
  hot: boolean;
  featured: boolean;
  trending: boolean;
  homepage: boolean;
  published: boolean;
  highlights: string[];
  description: string[];
  policies: string[];
  ticketLabel: string;
  ticketDescription: string;
  ticketPerks: string[];
};

export type CreateOfferInput = {
  title: string;
  slug?: string;
  summary: string;
  description?: string | null;
  image: string;
  venue?: string | null;
  code?: string | null;
  discountLabel?: string | null;
  ctaLabel?: string | null;
  status: OfferStatus;
  featured: boolean;
  validUntil?: Date | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategoryLabel(category: EventCategoryId) {
  return CATEGORY_LABELS.get(category) ?? "Event";
}

function mapEventListingRecord(
  item: EventListingWithCreator,
  bookingsCount: number,
): AdminEventListingRecord {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    categoryLabel: item.categoryLabel,
    venue: item.venue,
    startsAt: item.startsAt.toISOString(),
    priceFrom: item.priceFrom,
    availability: item.availability,
    published: item.published,
    featured: item.featured,
    hot: item.hot,
    bookingsCount,
    createdByName: item.createdBy?.name ?? null,
  };
}

function mapOfferRecord(item: OfferWithCreator): AdminOfferRecord {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    venue: item.venue,
    code: item.code,
    discountLabel: item.discountLabel,
    status: item.status,
    featured: item.featured,
    validUntil: item.validUntil ? item.validUntil.toISOString() : null,
    createdByName: item.createdBy?.name ?? null,
  };
}

export async function getAdminControlCenterData(): Promise<AdminControlCenterData> {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => startOfMonth(subMonths(now, 5 - index)));

  const [
    studioBookingsCount,
    eventTicketsCount,
    publishedEventsCount,
    activeOffersCount,
    openSlotsCount,
    activeWaitlistCount,
    totalIncomeAggregate,
    pastEventsCount,
    recentStudioBookings,
    recentEventBookings,
    eventListings,
    offers,
    allEventItems,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.eventBooking.count(),
    prisma.eventListing.count({ where: { published: true } }),
    prisma.offer.count({ where: { status: OfferStatus.active } }),
    prisma.availabilitySlot.count({ where: { status: "available" } }),
    prisma.waitlistEntry.count({ where: { status: "active" } }),
    prisma.eventBooking.aggregate({ where: { status: "confirmed" }, _sum: { totalAmount: true } }),
    prisma.eventListing.count({ where: { endsAt: { lt: now } } }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        reference: true,
        customerName: true,
        space: true,
        dateKey: true,
        status: true,
      },
    }),
    prisma.eventBooking.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        reference: true,
        eventTitle: true,
        customerName: true,
        quantity: true,
        totalAmount: true,
        status: true,
      },
    }),
    prisma.eventListing.findMany({
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: [{ startsAt: "asc" }, { createdAt: "desc" }],
      take: 12,
    }),
    prisma.offer.findMany({
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 12,
    }),
    getAllEventItems(),
  ]);

  const bookingsBySlug = await prisma.eventBooking.groupBy({
    by: ["eventSlug"],
    _count: { _all: true },
  });
  const bookingsCountMap = new Map(
    bookingsBySlug.map((item) => [item.eventSlug, item._count._all]),
  );

  const activity = await Promise.all(
    months.map(async (monthStart) => {
      const monthEnd = endOfMonth(monthStart);
      const [studioBookings, eventTickets] = await Promise.all([
        prisma.booking.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
        prisma.eventBooking.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
      ]);

      return {
        label: format(monthStart, "MMM"),
        studioBookings,
        eventTickets,
      };
    }),
  );

  const eventMixMap = new Map<string, number>();
  for (const event of allEventItems) {
    eventMixMap.set(event.categoryLabel, (eventMixMap.get(event.categoryLabel) ?? 0) + 1);
  }

  const eventMixPalette = ["#c7f13b", "#6f6bff", "#ff735a", "#43d1a7", "#f8c15b", "#dc5cff"];
  const eventMix = Array.from(eventMixMap.entries())
    .map(([label, value], index) => ({
      label,
      value,
      color: eventMixPalette[index % eventMixPalette.length],
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6);

  return {
    stats: {
      studioBookings: studioBookingsCount,
      eventTickets: eventTicketsCount,
      publishedEvents: publishedEventsCount,
      activeOffers: activeOffersCount,
      openSlots: openSlotsCount,
      activeWaitlist: activeWaitlistCount,
      totalEventIncome: totalIncomeAggregate._sum.totalAmount || 0,
      pastEventsCount: pastEventsCount,
    },
    activity,
    eventMix,
    recentStudioBookings: recentStudioBookings.map((item) => ({
      ...item,
      status: item.status,
    })),
    recentEventBookings: recentEventBookings.map((item) => ({
      ...item,
      status: item.status,
    })),
    eventListings: eventListings.map((item) =>
      mapEventListingRecord(item, bookingsCountMap.get(item.slug) ?? 0),
    ),
    offers: offers.map(mapOfferRecord),
  };
}

export async function getAdminEventListings() {
  const rows = await prisma.eventListing.findMany({
    include: {
      createdBy: {
        select: { name: true, email: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const grouped = await prisma.eventBooking.groupBy({
    by: ["eventSlug"],
    _count: { _all: true },
  });
  const countMap = new Map(grouped.map((item) => [item.eventSlug, item._count._all]));

  return rows.map((item) => mapEventListingRecord(item, countMap.get(item.slug) ?? 0));
}

export async function getAdminOffers() {
  const rows = await prisma.offer.findMany({
    include: {
      createdBy: {
        select: { name: true, email: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return rows.map(mapOfferRecord);
}

export async function createEventListing(
  input: CreateEventListingInput,
  createdById?: string,
) {
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);

  return prisma.eventListing.create({
    data: {
      slug,
      title: input.title,
      shortTitle: input.title,
      category: input.category,
      categoryLabel: getCategoryLabel(input.category),
      summary: input.summary,
      teaser: input.teaser,
      venue: input.venue,
      organizer: input.organizer,
      city: input.city,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      availability: input.availability,
      priceFrom: input.priceFrom,
      posterImage: input.posterImage,
      coverImage: input.coverImage || input.posterImage,
      accent: CATEGORY_ACCENTS[input.category],
      metadataLine:
        input.metadataLine?.trim() ||
        `${getCategoryLabel(input.category)} • ${input.organizer} • ${input.city}`,
      hot: input.hot,
      featured: input.featured,
      trending: input.trending,
      homepage: input.homepage,
      published: input.published,
      highlights: input.highlights,
      description: input.description,
      policies: input.policies,
      faq: [
        {
          question: "Will I receive a confirmation after booking?",
          answer:
            "Yes. Once your booking is completed, a confirmation email with your booking reference is sent automatically.",
        },
        {
          question: "Can I contact support before the event?",
          answer:
            "Yes. Use Black Pepper support if you need help with tickets, timings, access, or event-day questions.",
        },
      ],
      ticketTiers: [
        {
          id: slugify(input.ticketLabel) || "general",
          label: input.ticketLabel,
          description: input.ticketDescription,
          price: input.priceFrom,
          perks: input.ticketPerks,
        },
      ],
      createdById: createdById ?? null,
    },
  });
}

export async function createOffer(input: CreateOfferInput, createdById?: string) {
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);

  return prisma.offer.create({
    data: {
      slug,
      title: input.title,
      summary: input.summary,
      description: input.description || null,
      image: input.image,
      accent: "from-[#7d4fe3]/95 via-[#d45eff]/70 to-[#f6cb52]/72",
      venue: input.venue || null,
      code: input.code || null,
      discountLabel: input.discountLabel || null,
      ctaLabel: input.ctaLabel || "Claim Offer",
      status: input.status,
      featured: input.featured,
      validUntil: input.validUntil || null,
      createdById: createdById ?? null,
    },
  });
}
