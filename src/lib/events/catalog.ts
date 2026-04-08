import {
  CalendarDays,
  Laugh,
  Music2,
  PartyPopper,
  Sparkles,
  Users,
  type LucideIcon,
  BrushCleaning,
  Mic2,
} from "lucide-react";

import { arcadeImages, pickVenueImage, verveImages } from "@/lib/content/site-images";

export type EventCategoryId =
  | "parties"
  | "standup"
  | "workshop"
  | "meetup"
  | "concert"
  | "exhibition"
  | "live-vibes"
  | "festival";

export type EventAvailability = "available" | "limited" | "sold_out";

export type EventTicketTier = {
  id: string;
  label: string;
  description: string;
  price: number;
  perks: string[];
};

export type EventFaq = {
  question: string;
  answer: string;
};

export type EventItem = {
  slug: string;
  title: string;
  shortTitle: string;
  category: EventCategoryId;
  categoryLabel: string;
  summary: string;
  teaser: string;
  venue: string;
  organizer: string;
  city: string;
  startsAt: string;
  endsAt: string;
  availability: EventAvailability;
  priceFrom: number;
  posterImage: string;
  coverImage: string;
  accent: string;
  metadataLine: string;
  hot: boolean;
  featured: boolean;
  trending: boolean;
  homepage: boolean;
  highlights: string[];
  description: string[];
  faq: EventFaq[];
  policies: string[];
  ticketTiers: EventTicketTier[];
};

export type EventCategory = {
  id: EventCategoryId;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  href: string;
  image: string;
  accentClass: string;
};

export const EVENT_CATEGORIES: readonly EventCategory[] = [
  {
    id: "parties",
    label: "Parties",
    subtitle: "DJ nights and celebration formats",
    icon: PartyPopper,
    href: "/events?category=parties",
    image: arcadeImages[3],
    accentClass: "from-[#365ee8]/95 via-[#2847b8]/85 to-[#1e2a6d]/85",
  },
  {
    id: "standup",
    label: "Standup",
    subtitle: "Sharp sets and intimate audience energy",
    icon: Laugh,
    href: "/events?category=standup",
    image: arcadeImages[0],
    accentClass: "from-[#b73e84]/95 via-[#8f2965]/88 to-[#5e1841]/82",
  },
  {
    id: "workshop",
    label: "Workshop",
    subtitle: "Hands-on sessions with premium production",
    icon: BrushCleaning,
    href: "/events?category=workshop",
    image: verveImages[2],
    accentClass: "from-[#b69466]/95 via-[#8f744d]/86 to-[#604d31]/84",
  },
  {
    id: "meetup",
    label: "Meetup",
    subtitle: "Founder, community, and culture circles",
    icon: Users,
    href: "/events?category=meetup",
    image: arcadeImages[5],
    accentClass: "from-[#b53f44]/95 via-[#8e2e33]/88 to-[#5f171a]/82",
  },
  {
    id: "concert",
    label: "Concert",
    subtitle: "Live performances with strong atmosphere",
    icon: Music2,
    href: "/events?category=concert",
    image: verveImages[5],
    accentClass: "from-[#5b995d]/95 via-[#447a47]/88 to-[#244629]/82",
  },
  {
    id: "exhibition",
    label: "Exhibition",
    subtitle: "Visual storytelling and curated showcases",
    icon: Sparkles,
    href: "/events?category=exhibition",
    image: arcadeImages[4],
    accentClass: "from-[#bce8e2]/95 via-[#8fc9c2]/86 to-[#5a928c]/82",
  },
  {
    id: "live-vibes",
    label: "Live Vibes",
    subtitle: "Atmospheric nights built around experience",
    icon: Mic2,
    href: "/events?category=live-vibes",
    image: verveImages[0],
    accentClass: "from-[#cb9164]/95 via-[#af7143]/87 to-[#744625]/82",
  },
  {
    id: "festival",
    label: "Festival",
    subtitle: "Large-format cultural and community energy",
    icon: CalendarDays,
    href: "/events?category=festival",
    image: pickVenueImage(9),
    accentClass: "from-[#7d4fe3]/95 via-[#5d32b6]/87 to-[#371b6f]/82",
  },
] as const;

export const EVENTS: readonly EventItem[] = [
  {
    slug: "bollywood-dance-workshop",
    title: "Bollywood Dance Workshop",
    shortTitle: "Bollywood Dance",
    category: "workshop",
    categoryLabel: "Workshop",
    summary:
      "A high-energy instructor-led session built for movement, rhythm, and camera-ready confidence.",
    teaser:
      "Step into a polished movement session with pro-led choreography, warm ambient lighting, and a social finish.",
    venue: "The Arcade",
    organizer: "Black Pepper Experiences",
    city: "Raipur",
    startsAt: "2026-04-18T17:30:00+05:30",
    endsAt: "2026-04-18T20:00:00+05:30",
    availability: "available",
    priceFrom: 799,
    posterImage: arcadeImages[0],
    coverImage: arcadeImages[3],
    accent: "from-fuchsia-500/40 via-orange-400/15 to-black/40",
    metadataLine: "Choreography led • Community warmup • Open level",
    hot: true,
    featured: true,
    trending: true,
    homepage: true,
    highlights: [
      "Instructor-led choreography block",
      "Premium hall lighting scenes",
      "Social mixer after the workshop",
    ],
    description: [
      "This workshop is built for guests who want more than a casual dance class. The room, lighting, and pacing are designed to feel energetic, premium, and beginner-friendly at the same time.",
      "Expect a guided warmup, step breakdowns, filmed choreography moments, and a polished community atmosphere that makes the experience feel like an event.",
    ],
    faq: [
      {
        question: "Do I need prior dance experience?",
        answer:
          "No. The session is designed for mixed levels, and the instructor keeps the progression accessible.",
      },
      {
        question: "Is this suitable for groups?",
        answer:
          "Yes. Group bookings are welcome, and the hall format works well for friends or creator communities attending together.",
      },
    ],
    policies: [
      "Tickets are non-refundable within 24 hours of the event start time.",
      "Entry begins 30 minutes before the session.",
      "Photography and short-form recording may take place during selected workshop moments.",
    ],
    ticketTiers: [
      {
        id: "general",
        label: "General Access",
        description: "Full workshop entry and mixer access",
        price: 799,
        perks: ["Workshop access", "Group choreography block"],
      },
      {
        id: "creator-pass",
        label: "Creator Pass",
        description: "Priority floor placement and capture-friendly access",
        price: 1199,
        perks: ["Priority check-in", "Dedicated capture segment"],
      },
    ],
  },
  {
    slug: "live-sufi-night",
    title: "Live Sufi Night",
    shortTitle: "Live Sufi Night",
    category: "concert",
    categoryLabel: "Concert",
    summary:
      "A mood-led live set with immersive sound, low-lit ambience, and an audience experience built around emotion.",
    teaser:
      "An intimate live music evening shaped by warm lighting, rich acoustics, and a seated premium audience flow.",
    venue: "The Arcade",
    organizer: "Black Pepper Live",
    city: "Raipur",
    startsAt: "2026-04-25T19:00:00+05:30",
    endsAt: "2026-04-25T22:00:00+05:30",
    availability: "limited",
    priceFrom: 1499,
    posterImage: arcadeImages[5],
    coverImage: arcadeImages[4],
    accent: "from-amber-300/35 via-orange-500/15 to-black/40",
    metadataLine: "Seated premium format • Limited rows • Live ensemble",
    hot: true,
    featured: true,
    trending: false,
    homepage: true,
    highlights: [
      "Curated low-light hall setup",
      "Integrated sound experience",
      "Limited seating for a focused audience",
    ],
    description: [
      "Live Sufi Night is designed as an elevated music experience, not just a performance slot. The Arcade transforms into a mood-led live venue with audience comfort, sound clarity, and atmosphere given equal attention.",
      "Guests can expect a seated layout, premium audio balance, and a performance run sheet built for uninterrupted immersion.",
    ],
    faq: [
      {
        question: "Will there be open seating?",
        answer:
          "Seating is assigned by booking tier and check-in order inside each zone.",
      },
      {
        question: "Is food included?",
        answer:
          "Food is not included by default, though selected partner service counters may be active on event day.",
      },
    ],
    policies: [
      "Late entry may be held during active performance segments.",
      "Tickets are transferable up to 24 hours before the event.",
      "Recording of the live set may be restricted depending on artist policy.",
    ],
    ticketTiers: [
      {
        id: "premium-seat",
        label: "Premium Seat",
        description: "Reserved front-zone seating",
        price: 1499,
        perks: ["Reserved seating", "Fast-track check-in"],
      },
      {
        id: "lounge-circle",
        label: "Lounge Circle",
        description: "Elevated seating with closer sightlines",
        price: 2499,
        perks: ["Closer seating zone", "Complimentary welcome drink"],
      },
    ],
  },
  {
    slug: "stand-up-comedy-evening",
    title: "Stand-Up Comedy Evening",
    shortTitle: "Comedy Evening",
    category: "standup",
    categoryLabel: "Standup",
    summary:
      "A fast, high-energy comedy format with strong crowd engagement and a polished hall setup.",
    teaser:
      "Sharp sets, warm room energy, and a premium audience layout designed for clean laughs and no clutter.",
    venue: "The Arcade",
    organizer: "Pepper Laugh Circuit",
    city: "Raipur",
    startsAt: "2026-05-02T20:00:00+05:30",
    endsAt: "2026-05-02T22:00:00+05:30",
    availability: "available",
    priceFrom: 999,
    posterImage: arcadeImages[1],
    coverImage: arcadeImages[0],
    accent: "from-red-500/35 via-orange-500/10 to-black/40",
    metadataLine: "Headline comic • Support lineup • Seated format",
    hot: true,
    featured: false,
    trending: true,
    homepage: true,
    highlights: [
      "Headline plus support acts",
      "Seated crowd layout",
      "Quick entry and exit flow",
    ],
    description: [
      "This comedy evening uses The Arcade in a tight, audience-first format so the focus stays on timing, visibility, and sound.",
      "Expect a strong lineup, premium room styling, and a cleaner crowd flow than a typical pop-up comedy show.",
    ],
    faq: [
      {
        question: "Is this an adults-only event?",
        answer:
          "Yes. This format is recommended for 18+ guests due to artist material.",
      },
      {
        question: "Can I book for a group?",
        answer:
          "Yes. Group ticket tiers and priority seating blocks are available in limited quantities.",
      },
    ],
    policies: [
      "Guests should arrive 20 minutes before start time for smooth seating.",
      "Lineup changes may happen without prior notice.",
    ],
    ticketTiers: [
      {
        id: "standard",
        label: "Standard Entry",
        description: "Main show access",
        price: 999,
        perks: ["General entry", "Seated audience area"],
      },
      {
        id: "group-pass",
        label: "Group of 4",
        description: "Shared seating zone for group bookings",
        price: 3499,
        perks: ["Reserved group seating", "Priority admission lane"],
      },
    ],
  },
  {
    slug: "open-mic-meetup",
    title: "Open Mic Meetup",
    shortTitle: "Open Mic Meetup",
    category: "meetup",
    categoryLabel: "Meetup",
    summary:
      "An open-format performance and networking evening for creators, poets, musicians, and first-time performers.",
    teaser:
      "A softer, community-led night designed for spoken word, stripped-back music, and warm introductions.",
    venue: "The Arcade",
    organizer: "Black Pepper Community",
    city: "Raipur",
    startsAt: "2026-05-08T18:30:00+05:30",
    endsAt: "2026-05-08T21:30:00+05:30",
    availability: "limited",
    priceFrom: 499,
    posterImage: arcadeImages[2],
    coverImage: arcadeImages[5],
    accent: "from-sky-400/35 via-blue-500/10 to-black/40",
    metadataLine: "Community spotlight • Open format • Creator mixer",
    hot: false,
    featured: false,
    trending: true,
    homepage: false,
    highlights: [
      "Open mic performance slots",
      "Creator introductions and networking",
      "Premium low-pressure hall format",
    ],
    description: [
      "Open Mic Meetup blends performance and community networking inside a hall setup that feels elevated rather than improvised.",
      "The room is tuned for clean transitions between speakers, performers, and social moments, making it ideal for first-time guests and repeat creator circles alike.",
    ],
    faq: [
      {
        question: "Can I perform without prior registration?",
        answer:
          "A small number of walk-in slots may be available, but performer pre-registration is recommended.",
      },
      {
        question: "Can audience-only guests attend?",
        answer:
          "Yes. You do not need to perform in order to attend.",
      },
    ],
    policies: [
      "Performance slots are time-boxed to keep the program balanced.",
      "Audience and performer tickets are limited separately.",
    ],
    ticketTiers: [
      {
        id: "audience",
        label: "Audience Pass",
        description: "Attend the full showcase and mixer",
        price: 499,
        perks: ["Audience access", "Networking window"],
      },
      {
        id: "performer",
        label: "Performer Pass",
        description: "Includes stage slot request",
        price: 699,
        perks: ["Performer queue access", "Soundcheck window"],
      },
    ],
  },
  {
    slug: "business-networking-mixer",
    title: "Business Networking Mixer",
    shortTitle: "Networking Mixer",
    category: "meetup",
    categoryLabel: "Meetup",
    summary:
      "A founder and operator evening built around polished introductions, lounge-style conversation zones, and high-intent networking.",
    teaser:
      "More than a standard mixer: this evening is shaped for founders, brand builders, and operators who value a premium room and serious conversations.",
    venue: "The Arcade",
    organizer: "Black Pepper Business Circle",
    city: "Raipur",
    startsAt: "2026-05-15T19:00:00+05:30",
    endsAt: "2026-05-15T22:00:00+05:30",
    availability: "available",
    priceFrom: 1299,
    posterImage: arcadeImages[4],
    coverImage: arcadeImages[3],
    accent: "from-emerald-400/30 via-cyan-400/12 to-black/40",
    metadataLine: "Founder-only mixers • Curated seating • Fast introductions",
    hot: false,
    featured: true,
    trending: false,
    homepage: true,
    highlights: [
      "Curated guest introductions",
      "Lounge and standing zones",
      "Premium networking environment",
    ],
    description: [
      "This mixer is structured to make real conversations easier. Rather than a generic room and loose agenda, the evening uses thoughtful zoning, moderated introductions, and hospitality-driven pacing.",
      "It is designed for founders, operators, and community leaders who want a better networking environment than the usual informal meetup.",
    ],
    faq: [
      {
        question: "Is this open to students?",
        answer:
          "This edition prioritizes working founders, operators, and brand decision-makers.",
      },
      {
        question: "Do I need business attire?",
        answer:
          "Smart casual or business casual is recommended to match the tone of the event.",
      },
    ],
    policies: [
      "Guest list curation may apply before final confirmation.",
      "Refunds are not available after the networking list has been finalized.",
    ],
    ticketTiers: [
      {
        id: "networker",
        label: "Networker Pass",
        description: "Core mixer access",
        price: 1299,
        perks: ["General mixer access", "Guest introduction circle"],
      },
      {
        id: "lounge-plus",
        label: "Lounge Plus",
        description: "Priority check-in and premium lounge zone",
        price: 1899,
        perks: ["Priority access", "Premium lounge area"],
      },
    ],
  },
  {
    slug: "music-festival-city-edition",
    title: "Music Festival: City Edition",
    shortTitle: "Music Festival",
    category: "festival",
    categoryLabel: "Festival",
    summary:
      "A multi-format showcase of live acts, DJ energy, and crowd-led momentum built for a memorable night.",
    teaser:
      "A louder, brighter, more energetic format built for guests who want a high-volume community night with premium execution.",
    venue: "The Arcade",
    organizer: "Pepper Live",
    city: "Raipur",
    startsAt: "2026-05-23T18:00:00+05:30",
    endsAt: "2026-05-23T23:00:00+05:30",
    availability: "sold_out",
    priceFrom: 1999,
    posterImage: pickVenueImage(10),
    coverImage: pickVenueImage(11),
    accent: "from-pink-500/45 via-indigo-500/15 to-black/40",
    metadataLine: "Festival format • Multiple acts • Limited drop access",
    hot: true,
    featured: true,
    trending: true,
    homepage: false,
    highlights: [
      "Multi-format live programming",
      "Festival-style room energy",
      "Limited-pass ticket drops",
    ],
    description: [
      "City Edition is the most energetic event format in the current lineup. It is designed as a crowd-led experience with multiple live moments rather than a single-stage program.",
      "Even with that scale, the venue styling and guest flow remain polished so the evening still feels premium.",
    ],
    faq: [
      {
        question: "Are tickets still available?",
        answer:
          "This edition is currently sold out. You can still explore the event page for future drops and updates.",
      },
      {
        question: "Will there be another edition?",
        answer:
          "Yes. Additional editions are planned subject to demand and release windows.",
      },
    ],
    policies: [
      "Sold-out bookings may not be transferred without organizer review.",
      "Festival entry windows may be staggered by ticket tier.",
    ],
    ticketTiers: [
      {
        id: "festival-floor",
        label: "Festival Floor",
        description: "Standing floor access",
        price: 1999,
        perks: ["Festival floor entry", "Main access window"],
      },
      {
        id: "festival-lounge",
        label: "Lounge Deck",
        description: "Elevated lounge access",
        price: 2999,
        perks: ["Elevated viewing", "Priority lane"],
      },
    ],
  },
  {
    slug: "cultural-evening-showcase",
    title: "Cultural Evening Showcase",
    shortTitle: "Cultural Evening",
    category: "exhibition",
    categoryLabel: "Exhibition",
    summary:
      "A curated evening of performance, storytelling, and community-led cultural programming in a polished hall format.",
    teaser:
      "A premium cultural showcase designed with elegance, stage presence, and guest experience in mind.",
    venue: "The Arcade",
    organizer: "Black Pepper Cultural Circle",
    city: "Raipur",
    startsAt: "2026-05-29T18:30:00+05:30",
    endsAt: "2026-05-29T21:30:00+05:30",
    availability: "available",
    priceFrom: 899,
    posterImage: pickVenueImage(6),
    coverImage: arcadeImages[1],
    accent: "from-yellow-200/35 via-amber-400/12 to-black/40",
    metadataLine: "Stage moments • Cultural program • Community-first format",
    hot: false,
    featured: false,
    trending: true,
    homepage: false,
    highlights: [
      "Curated stage program",
      "Polished cultural hosting",
      "Guest-friendly hall layout",
    ],
    description: [
      "Cultural Evening Showcase is designed to highlight stage moments, audience comfort, and visual elegance in equal measure.",
      "The result is a more premium format for community cultural programming than the typical multipurpose hall experience.",
    ],
    faq: [
      {
        question: "Can families attend?",
        answer:
          "Yes. This showcase is designed as a family-friendly event unless noted otherwise on the final schedule.",
      },
      {
        question: "Will there be reserved seating?",
        answer:
          "Reserved seating is available for selected premium tiers.",
      },
    ],
    policies: [
      "Program order may evolve closer to the event date.",
      "Premium seating is limited and assigned by booking tier.",
    ],
    ticketTiers: [
      {
        id: "general-showcase",
        label: "General Showcase",
        description: "Main floor access",
        price: 899,
        perks: ["Showcase access", "General seating zone"],
      },
      {
        id: "premium-row",
        label: "Premium Row",
        description: "Closer stage-view seating",
        price: 1499,
        perks: ["Priority seating", "Fast entry line"],
      },
    ],
  },
  {
    slug: "premium-community-social",
    title: "Premium Community Social",
    shortTitle: "Community Social",
    category: "live-vibes",
    categoryLabel: "Live Vibes",
    summary:
      "A design-led social format built around premium room energy, conversation, ambient music, and curated guest flow.",
    teaser:
      "A community-first evening with more polish, softer lighting, and a stronger sense of hospitality than a typical mixer.",
    venue: "Verve Studio",
    organizer: "Black Pepper Socials",
    city: "Raipur",
    startsAt: "2026-06-05T19:30:00+05:30",
    endsAt: "2026-06-05T22:00:00+05:30",
    availability: "limited",
    priceFrom: 699,
    posterImage: verveImages[0],
    coverImage: verveImages[4],
    accent: "from-cyan-300/30 via-blue-500/10 to-black/40",
    metadataLine: "Social curation • Ambient set design • Limited capacity",
    hot: false,
    featured: true,
    trending: true,
    homepage: true,
    highlights: [
      "Limited-capacity social format",
      "Premium set design and styling",
      "Ambient background programming",
    ],
    description: [
      "Premium Community Social uses Verve Studio in a more experiential mode. The room is arranged for layered conversation, visual atmosphere, and an intimate but elevated social flow.",
      "It is ideal for guests who enjoy more curated rooms than loud, crowded mixers.",
    ],
    faq: [
      {
        question: "Is there a dress code?",
        answer:
          "The suggested look is polished casual to match the tone of the evening and venue styling.",
      },
      {
        question: "Will there be open networking?",
        answer:
          "Yes. The event is structured around conversation rather than a fixed seated program.",
      },
    ],
    policies: [
      "Limited capacity means ticket transfers may be reviewed close to event day.",
      "Selected sessions may include photography for event recap use.",
    ],
    ticketTiers: [
      {
        id: "social-entry",
        label: "Social Entry",
        description: "General event access",
        price: 699,
        perks: ["General access", "Ambient social setup"],
      },
      {
        id: "host-circle",
        label: "Host Circle",
        description: "Priority arrival plus closer hosted zone",
        price: 1199,
        perks: ["Priority arrival", "Hosted social corner"],
      },
    ],
  },
] as const;

export const EVENT_TRUST_FEATURES = [
  {
    title: "Instant Booking Confirmation",
    description: "Receive your ticket reference and confirmation email immediately after purchase.",
  },
  {
    title: "Easy Ticket Selection",
    description: "Choose the tier, quantity, and checkout details in one polished flow.",
  },
  {
    title: "Verified Events",
    description: "Every listing is part of the Black Pepper lineup or a reviewed hosted format.",
  },
  {
    title: "Fast Support",
    description: "Need help before the event? Our support channels stay easy to reach.",
  },
] as const;

export function getAllEvents() {
  return [...EVENTS].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export function getEventBySlug(slug: string) {
  return EVENTS.find((event) => event.slug === slug);
}

export function getHotSellingEvents(limit = 6) {
  return getAllEvents()
    .filter((event) => event.hot)
    .slice(0, limit);
}

export function getFeaturedEvents(limit = 4) {
  return getAllEvents()
    .filter((event) => event.featured)
    .slice(0, limit);
}

export function getTrendingEvents(limit = 4) {
  return getAllEvents()
    .filter((event) => event.trending)
    .slice(0, limit);
}

export function getHomepageEvents(limit = 4) {
  return getAllEvents()
    .filter((event) => event.homepage)
    .slice(0, limit);
}

export function getUpcomingEvents(limit = 6) {
  return getAllEvents().slice(0, limit);
}

export function getEventsForCategory(category: EventCategoryId, limit = 4) {
  return getAllEvents()
    .filter((event) => event.category === category)
    .slice(0, limit);
}

export function getRelatedEvents(slug: string, limit = 3) {
  const current = getEventBySlug(slug);

  if (!current) {
    return [];
  }

  return getAllEvents()
    .filter((event) => event.slug !== slug)
    .sort((a, b) => {
      if (a.category === current.category && b.category !== current.category) {
        return -1;
      }

      if (b.category === current.category && a.category !== current.category) {
        return 1;
      }

      return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
    })
    .slice(0, limit);
}
