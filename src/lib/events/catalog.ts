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

const eventImages = {
  founders: "/EVENTS IMAGES/Founders meet  POSTER DESIGN.jpg.jpeg",
  playHard: "/EVENTS IMAGES/Play Hard  POSTER DESIGN.jpg.jpeg",
  saturday: "/EVENTS IMAGES/The Saturday Screening  DESIGN POSTER.jpg.jpeg",
  kids: "/EVENTS IMAGES/kids poster.jpg.jpeg",
};

export const EVENTS: readonly EventItem[] = [
  {
    slug: "founders-meet",
    title: "Founders Meet",
    shortTitle: "Founders Meet",
    category: "meetup",
    categoryLabel: "Meetup",
    summary: "A networking event for startup founders and entrepreneurs to connect, share insights, and grow together.",
    teaser: "Connect with like-minded founders, share your journey, and build meaningful connections.",
    venue: "The Arcade",
    organizer: "Black Pepper Experiences",
    city: "Raipur",
    startsAt: "2026-04-20T18:00:00+05:30",
    endsAt: "2026-04-20T21:00:00+05:30",
    availability: "available",
    priceFrom: 299,
    posterImage: eventImages.founders,
    coverImage: eventImages.founders,
    accent: "from-blue-500/40 via-indigo-400/15 to-black/40",
    metadataLine: "Founders only • Limited spots • Networking",
    hot: true,
    featured: true,
    trending: true,
    homepage: true,
    highlights: ["Meet fellow founders", "Share startup experiences", "Build lasting connections"],
    description: ["An exclusive networking event designed for startup founders and aspiring entrepreneurs.", "Connect with like-minded individuals, share your startup journey, and build valuable connections."],
    faq: [
      { question: "Who can attend?", answer: "Founders, co-founders, and aspiring entrepreneurs are welcome." },
      { question: "What should I bring?", answer: "Your business cards and an open mind to network." },
    ],
    policies: ["Tickets are non-refundable within 24 hours of the event.", "Entry begins 30 minutes before the event."],
    ticketTiers: [
      { id: "general", label: "General Access", description: "Full event access and networking", price: 299, perks: ["Event access", "Networking session"] },
      { id: "vip", label: "VIP Pass", description: "Priority networking with featured founders", price: 599, perks: ["Priority entry", "1-on-1 networking"] },
    ],
  },
  {
    slug: "play-hard",
    title: "Play Hard",
    shortTitle: "Play Hard",
    category: "parties",
    categoryLabel: "Party",
    summary: "An electrifying night of music, dancing, and non-stop vibes. Let loose and have the time of your life.",
    teaser: "Dance the night away with top beats and an amazing crowd.",
    venue: "The Arcade",
    organizer: "Black Pepper Experiences",
    city: "Raipur",
    startsAt: "2026-04-25T21:00:00+05:30",
    endsAt: "2026-04-26T02:00:00+05:30",
    availability: "available",
    priceFrom: 499,
    posterImage: eventImages.playHard,
    coverImage: eventImages.playHard,
    accent: "from-purple-500/40 via-pink-400/15 to-black/40",
    metadataLine: "DJ nights • Dancing • VIP sections",
    hot: true,
    featured: true,
    trending: true,
    homepage: true,
    highlights: ["Top DJ performances", "Dance floor vibes", "VIP table service"],
    description: ["Get ready for an unforgettable night of music, dancing, and electrifying energy.", "Top DJs, amazing crowd, and the best vibes in town."],
    faq: [
      { question: "What is the dress code?", answer: "Smart casual - dress to impress!" },
      { question: "Is there a age restriction?", answer: "21+ only. Valid ID required." },
    ],
    policies: ["21+ only. ID verification required.", "No outside food or beverages.", "Dress code enforced."],
    ticketTiers: [
      { id: "general", label: "General Entry", description: "Full night access to dance floor", price: 499, perks: ["Dance floor access", "One drink included"] },
      { id: "vip", label: "VIP Table", description: "Exclusive table with bottle service", price: 2999, perks: ["Private table", "Bottle service", "Fast-track entry"] },
    ],
  },
  {
    slug: "saturday-screening",
    title: "The Saturday Screening",
    shortTitle: "Saturday Screening",
    category: "exhibition",
    categoryLabel: "Film",
    summary: "An exclusive film screening followed by discussion and networking with filmmakers.",
    teaser: "Watch indie films, meet filmmakers, and be part of the conversation.",
    venue: "The Arcade",
    organizer: "Black Pepper Experiences",
    city: "Raipur",
    startsAt: "2026-05-02T18:00:00+05:30",
    endsAt: "2026-05-02T21:30:00+05:30",
    availability: "available",
    priceFrom: 199,
    posterImage: eventImages.saturday,
    coverImage: eventImages.saturday,
    accent: "from-yellow-500/40 via-orange-400/15 to-black/40",
    metadataLine: "Film screening • Director Q&A • Networking",
    hot: true,
    featured: true,
    trending: false,
    homepage: true,
    highlights: ["Curated indie film selection", "Director Q&A session", "Post-screening networking"],
    description: ["An evening of handpicked indie films followed by insightful discussions with the filmmakers.", "Be part of the conversation and connect with the creative community."],
    faq: [
      { question: "How long is the screening?", answer: "Approximately 2 hours of film + Q&A." },
      { question: "Can I bring friends?", answer: "Yes, each ticket includes one guest." },
    ],
    policies: ["No recording during screenings.", "Silence phones during the film.", "Respect the filmmaker Q&A session."],
    ticketTiers: [
      { id: "general", label: "General Access", description: "Film screening and discussion", price: 199, perks: ["Screening access", "Q&A session"] },
      { id: "filmmaker", label: "Filmmaker Pass", description: "Meet the filmmakers special access", price: 499, perks: ["Meet & greet", "Signed poster"] },
    ],
  },
  {
    slug: "kids-fun-zone",
    title: "Kids Fun Zone",
    shortTitle: "Kids Fun Zone",
    category: "workshop",
    categoryLabel: "Kids",
    summary: "A day full of fun activities, games, and entertainment for kids of all ages.",
    teaser: "Games, crafts, and endless fun for your little ones.",
    venue: "The Arcade",
    organizer: "Black Pepper Experiences",
    city: "Raipur",
    startsAt: "2026-05-10T10:00:00+05:30",
    endsAt: "2026-05-10T16:00:00+05:30",
    availability: "available",
    priceFrom: 399,
    posterImage: eventImages.kids,
    coverImage: eventImages.kids,
    accent: "from-green-500/40 via-teal-400/15 to-black/40",
    metadataLine: "Games • Crafts • Food included",
    hot: true,
    featured: true,
    trending: true,
    homepage: true,
    highlights: ["Exciting games and activities", "Creative crafts session", "Healthy snacks included"],
    description: ["A day packed with fun activities, games, and entertainment for kids.", "Let your children have a blast while you enjoy some time off."],
    faq: [
      { question: "What age group is this for?", answer: "Ages 5-12 years old." },
      { question: "Are snacks included?", answer: "Yes, healthy snacks and drinks are provided." },
    ],
    policies: ["Parents must fill emergency contact form.", "Drop-off and pick-up required.", "Maximum 20 kids per session."],
    ticketTiers: [
      { id: "general", label: "General Entry", description: "Full day access to all activities", price: 399, perks: ["All activities", "Snacks included"] },
      { id: "premium", label: "Premium Pass", description: "Extra crafts and goody bag", price: 699, perks: ["Goody bag", "Extra crafts", "Photo memories"] },
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
