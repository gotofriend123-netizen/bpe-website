import "server-only";

import { EventAvailability as EventAvailabilityEnum, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  EVENTS,
  type EventCategoryId,
  type EventFaq,
  type EventItem,
  type EventTicketTier,
} from "@/lib/events/catalog";

const DEFAULT_EVENT_ACCENTS: Record<EventCategoryId, string> = {
  parties: "from-fuchsia-500/40 via-rose-500/20 to-black/40",
  standup: "from-amber-400/40 via-orange-500/18 to-black/40",
  workshop: "from-cyan-400/40 via-sky-500/18 to-black/40",
  meetup: "from-emerald-400/35 via-teal-500/16 to-black/40",
  concert: "from-violet-500/40 via-indigo-500/16 to-black/40",
  exhibition: "from-stone-200/20 via-zinc-400/10 to-black/40",
  "live-vibes": "from-pink-500/40 via-purple-500/16 to-black/40",
  festival: "from-yellow-300/30 via-orange-500/16 to-black/40",
};

type EventListingRecord = Prisma.EventListingGetPayload<Record<string, never>>;

function isEventCategoryId(value: string): value is EventCategoryId {
  return (
    value === "parties" ||
    value === "standup" ||
    value === "workshop" ||
    value === "meetup" ||
    value === "concert" ||
    value === "exhibition" ||
    value === "live-vibes" ||
    value === "festival"
  );
}

function ensureStringArray(value: Prisma.JsonValue | null | undefined, fallback: string[]) {
  if (Array.isArray(value)) {
    const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    if (items.length > 0) {
      return items;
    }
  }

  return fallback;
}

function ensureFaqArray(
  value: Prisma.JsonValue | null | undefined,
  fallback: EventFaq[],
): EventFaq[] {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => {
        if (
          item &&
          typeof item === "object" &&
          "question" in item &&
          "answer" in item &&
          typeof item.question === "string" &&
          typeof item.answer === "string"
        ) {
          return {
            question: item.question,
            answer: item.answer,
          } satisfies EventFaq;
        }

        return null;
      })
      .filter(Boolean) as EventFaq[];

    if (items.length > 0) {
      return items;
    }
  }

  return fallback;
}

function ensureTicketTierArray(
  value: Prisma.JsonValue | null | undefined,
  fallbackPrice: number,
): EventTicketTier[] {
  if (Array.isArray(value)) {
    const items = value
      .map((item, index) => {
        if (
          item &&
          typeof item === "object" &&
          "label" in item &&
          "price" in item &&
          typeof item.label === "string" &&
          typeof item.price === "number"
        ) {
          return {
            id: typeof item.id === "string" ? item.id : `tier-${index + 1}`,
            label: item.label,
            description:
              typeof item.description === "string"
                ? item.description
                : "General event access",
            price: item.price,
            perks: Array.isArray(item.perks)
              ? item.perks.filter((perk): perk is string => typeof perk === "string")
              : [],
          } satisfies EventTicketTier;
        }

        return null;
      })
      .filter(Boolean) as EventTicketTier[];

    if (items.length > 0) {
      return items;
    }
  }

  return [
    {
      id: "general",
      label: "General Access",
      description: "Event access",
      price: fallbackPrice,
      perks: ["Event access"],
    },
  ];
}

function mapAvailability(value: EventAvailabilityEnum): EventItem["availability"] {
  if (value === EventAvailabilityEnum.available) return "available";
  if (value === EventAvailabilityEnum.limited) return "limited";
  return "sold_out";
}

function toEventItem(record: EventListingRecord): EventItem {
  const category = isEventCategoryId(record.category) ? record.category : "meetup";
  const summary = record.summary.trim();
  const teaser = record.teaser.trim();

  return {
    slug: record.slug,
    title: record.title,
    shortTitle: record.shortTitle?.trim() || record.title,
    category,
    categoryLabel: record.categoryLabel,
    summary,
    teaser,
    venue: record.venue,
    organizer: record.organizer,
    city: record.city,
    startsAt: record.startsAt.toISOString(),
    endsAt: record.endsAt.toISOString(),
    availability: mapAvailability(record.availability),
    priceFrom: record.priceFrom,
    posterImage: record.posterImage,
    coverImage: record.coverImage || record.posterImage,
    accent: record.accent || DEFAULT_EVENT_ACCENTS[category],
    metadataLine:
      record.metadataLine ||
      `${record.categoryLabel} • ${record.organizer} • ${record.city}`,
    hot: record.hot,
    featured: record.featured,
    trending: record.trending,
    homepage: record.homepage,
    highlights: ensureStringArray(record.highlights, [
      `${record.categoryLabel} format`,
      "Premium venue experience",
      "Admin-published event listing",
    ]),
    description: ensureStringArray(record.description, [summary, teaser]),
    faq: ensureFaqArray(record.faq, [
      {
        question: "Will I receive a confirmation after booking?",
        answer:
          "Yes. Once the booking is confirmed, guests receive a reference and confirmation email.",
      },
      {
        question: "Can I contact support before the event?",
        answer:
          "Yes. Support remains available before the event if you need help with access, timings, or ticketing.",
      },
    ]),
    policies: ensureStringArray(record.policies, [
      "Please review the event timings and access instructions before arrival.",
      "Refunds and transfers depend on the event-specific policy shown on the event page.",
    ]),
    ticketTiers: ensureTicketTierArray(record.ticketTiers, record.priceFrom),
  };
}

async function getDynamicEventItems() {
  const rows = await prisma.eventListing.findMany({
    where: { published: true, endsAt: { gt: new Date() } },
    orderBy: [{ startsAt: "asc" }, { createdAt: "desc" }],
  });

  return rows.map(toEventItem);
}

function mergeEvents(dynamicEvents: EventItem[]) {
  const map = new Map<string, EventItem>();
  const now = new Date();

  for (const event of EVENTS) {
    if (new Date(event.endsAt) > now) {
      map.set(event.slug, event);
    }
  }

  for (const event of dynamicEvents) {
    if (new Date(event.endsAt) > now) {
      map.set(event.slug, event);
    }
  }

  return Array.from(map.values()).sort(
    (left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
  );
}

export async function getAllEventItems() {
  return mergeEvents(await getDynamicEventItems());
}

export async function getEventItemBySlug(slug: string) {
  const events = await getAllEventItems();
  return events.find((event) => event.slug === slug);
}

export async function getHotSellingEventItems(limit = 6) {
  return (await getAllEventItems()).filter((event) => event.hot).slice(0, limit);
}

export async function getFeaturedEventItems(limit = 4) {
  return (await getAllEventItems()).filter((event) => event.featured).slice(0, limit);
}

export async function getTrendingEventItems(limit = 4) {
  return (await getAllEventItems()).filter((event) => event.trending).slice(0, limit);
}

export async function getHomepageEventItems(limit = 4) {
  return (await getAllEventItems()).filter((event) => event.homepage).slice(0, limit);
}

export async function getUpcomingEventItems(limit = 6) {
  return (await getAllEventItems()).slice(0, limit);
}

export async function getEventsForCategoryItems(category: EventCategoryId, limit = 4) {
  return (await getAllEventItems())
    .filter((event) => event.category === category)
    .slice(0, limit);
}

export async function getRelatedEventItems(slug: string, limit = 3) {
  const events = await getAllEventItems();
  const current = events.find((event) => event.slug === slug);

  if (!current) {
    return [];
  }

  return events
    .filter((event) => event.slug !== slug)
    .sort((left, right) => {
      if (left.category === current.category && right.category !== current.category) return -1;
      if (right.category === current.category && left.category !== current.category) return 1;

      return new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime();
    })
    .slice(0, limit);
}
