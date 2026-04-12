import type { Metadata } from "next";
export const dynamic = "force-static";

import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  Camera,
  CheckCircle2,
  GalleryHorizontalEnd,
  Headphones,
  Info,
  LayoutGrid,
  Mic2,
  MoveRight,
  Play,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { HomeCardRail } from "@/components/home/HomeCardRail";
import { EventPosterCard } from "@/components/events/EventPosterCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArcGalleryHeroDemo } from "@/components/ui/arc-gallery-hero-demo";
import { GlowCard } from "@/components/ui/GlowCard";
import { Demo as GlassMarquee } from "@/components/ui/Demo";
import { arcadeImages, pickVenueImage, verveImages } from "@/lib/content/site-images";
import { getHomepageEventItems } from "@/lib/events/repository";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Black Pepper Entertainment | Premium Events, Hall, and Studio Bookings",
  description:
    "Book The Arcade community hall, Verve Studio, and curated events with Black Pepper Entertainment. Explore availability, venue formats, and ticketed experiences in one premium destination.",
  keywords: [
    "Black Pepper Entertainment",
    "The Arcade",
    "Verve Studio",
    "event venue Raipur",
    "podcast studio Raipur",
    "hall booking",
    "event tickets",
    "creator studio",
  ],
  openGraph: {
    title: "Black Pepper Entertainment",
    description:
      "Premium venue bookings and curated event experiences for gatherings, creators, and conversations.",
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Black Pepper Entertainment",
    images: [
      {
        url: "/the-arcade/dsc02553.jpg",
        width: 1200,
        height: 630,
        alt: "Black Pepper Entertainment venue preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Pepper Entertainment",
    description:
      "Premium venue bookings and curated event experiences for gatherings, creators, and conversations.",
    images: ["/the-arcade/dsc02553.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

type SpaceCard = {
  title: string;
  subtitle: string;
  description: string;
  detailHref: string;
  bookingHref: string;
  image: string;
  icon: LucideIcon;
};

type IconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  highlights?: string[];
};

type CompactIconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  tag: string;
};

type PricingCard = {
  title: string;
  price: string;
  note: string;
  description: string;
  ctaHref: string;
};

const spaces: SpaceCard[] = [
  {
    title: "The Arcade",
    subtitle: "Flexible event hall",
    description:
      "A flexible and visually refined hall built for workshops, exhibitions, launches, gatherings, and curated community experiences.",
    detailHref: "/the-arcade",
    bookingHref: "/availability?space=arcade",
    image: arcadeImages[3],
    icon: LayoutGrid,
  },
  {
    title: "Verve Studio",
    subtitle: "Podcast and creator studio",
    description:
      "A professional recording environment crafted for podcasts, interviews, talk shows, creator content, and brand-led conversations.",
    detailHref: "/verve-studio",
    bookingHref: "/availability?space=vsl",
    image: verveImages[2],
    icon: Play,
  },
];

const desktopWhyChooseCards: IconCard[] = [
  {
    title: "Premium Ambience",
    description:
      "Ambient lighting, polished detailing, and a cinematic tone make the first impression feel immediately premium.",
    icon: Sparkles,
    highlights: ["Ambient lighting support", "Refined visual atmosphere"],
  },
  {
    title: "Flexible Bookings",
    description:
      "Availability, policy windows, and next-slot guidance are built into the flow so changes stay manageable.",
    icon: CalendarCheck,
    highlights: ["Live slot visibility", "Managed reschedule flow"],
  },
  {
    title: "Event-Ready Layouts",
    description:
      "The Arcade is shaped like a true community hall, giving launches, workshops, and premium gatherings a layout that feels intentional from arrival to wrap.",
    icon: LayoutGrid,
    highlights: ["Community hall layout", "Built for workshops and launches"],
  },
  {
    title: "Podcast-Ready Setup",
    description:
      "Verve Studio is tuned for creator-led conversations, with a setup that feels composed, camera-friendly, and production-ready.",
    icon: Mic2,
    highlights: ["Interview and talk-show ready", "Professional audio atmosphere"],
  },
  {
    title: "Capacity & Comfort",
    description:
      "The Arcade gives teams room to host confidently while still keeping movement, seating, and guest comfort well balanced.",
    icon: CalendarClock,
    highlights: ["Up to 100 standing capacity", "Up to 60 seated capacity"],
  },
  {
    title: "Smooth Support Experience",
    description:
      "From first inquiry to final handoff, the support flow stays clear, responsive, and built to reduce friction.",
    icon: ShieldCheck,
    highlights: ["Guided booking journey", "Clear support communication"],
  },
];

const mobileWhyChooseCards: CompactIconCard[] = [
  {
    title: "Premium Ambience",
    description: "Cinematic tone and polished first impressions.",
    icon: Sparkles,
    tag: "Ambient lighting",
  },
  {
    title: "Flexible Bookings",
    description: "Live slots and policy-aware changes stay manageable.",
    icon: CalendarCheck,
    tag: "Reschedule flow",
  },
  {
    title: "Community Layout",
    description: "A true hall layout built for launches and workshops.",
    icon: LayoutGrid,
    tag: "Arcade-ready",
  },
  {
    title: "Sound Ready",
    description: "Production support without overcomplicating the setup.",
    icon: Headphones,
    tag: "Sound environment",
  },
  {
    title: "Podcast Setup",
    description: "Interview-led sessions feel composed and creator-friendly.",
    icon: Mic2,
    tag: "Studio-ready",
  },
  {
    title: "Camera Finish",
    description: "Framing and composition feel polished on camera.",
    icon: Camera,
    tag: "Camera-ready",
  },
  {
    title: "Capacity Comfort",
    description: "Space to host confidently without losing comfort.",
    icon: CalendarClock,
    tag: "100 standing",
  },
  {
    title: "Support Flow",
    description: "Guided booking and clear communication throughout.",
    icon: ShieldCheck,
    tag: "Responsive help",
  },
];

const bookingSteps = [
  "Choose Your Space",
  "Check Availability",
  "Select Your Slot",
  "Confirm Your Booking",
  "Manage If Needed",
] as const;

const availabilityHighlights: IconCard[] = [
  {
    title: "Live slot visibility",
    description: "Check open dates across The Arcade, VSL, and VSR in real time.",
    icon: CalendarCheck,
  },
  {
    title: "Limited-slot alerts",
    description: "See when inventory is thinning before the best options disappear.",
    icon: Info,
  },
  {
    title: "Fully booked indicators",
    description: "Unavailable days are clearly marked so planning stays realistic.",
    icon: BadgeCheck,
  },
  {
    title: "Next available suggestions",
    description: "If a date is full, the flow can guide guests to the next open slot.",
    icon: MoveRight,
  },
];

const pricingPreview: PricingCard[] = [
  {
    title: "The Arcade",
    price: "From ₹15,000",
    note: "Half-day event block",
    description:
      "Built for workshops, launches, and curated gatherings with flexible layout support.",
    ctaHref: "/pricing",
  },
  {
    title: "Verve Studio",
    price: "From ₹3,500",
    note: "Creator session",
    description:
      "Ideal for podcasts, interviews, and creator-led shoots in a polished recording environment.",
    ctaHref: "/pricing",
  },
  {
    title: "Custom Booking",
    price: "Tailored quote",
    note: "Brand or hybrid setup",
    description:
      "For private events, brand conversations, or sessions that need custom scheduling and support.",
    ctaHref: "/contact",
  },
];

const galleryPreview = [
  {
    title: "Community Events",
    description: "Workshops, launch moments, and polished gatherings inside The Arcade.",
    image: arcadeImages[0],
  },
  {
    title: "Podcast Sessions",
    description: "Professional conversations, creator-led interviews, and talk-show setups.",
    image: verveImages[1],
  },
  {
    title: "Creator Shoots",
    description: "Camera-ready content sessions that still feel intimate and premium.",
    image: verveImages[4],
  },
  {
    title: "Behind The Scenes",
    description: "A glimpse into the atmosphere, layout, and production energy behind each booking.",
    image: pickVenueImage(7),
  },
] as const;

function SectionHeading(props: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "center" | "left";
  containerClassName?: string;
}) {
  const { eyebrow, title, description, align = "center", containerClassName } = props;

  return (
    <div
      className={cn(
        align === "center" ? "mx-auto text-center" : "min-w-0",
        containerClassName,
      )}
    >
      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-300">
        {eyebrow}
      </span>
      <h2 className="sr-only">{title}</h2>
      <p className="sr-only">{description}</p>
    </div>
  );
}

export default async function HomePage() {
  const upcomingEvents = await getHomepageEventItems(4);
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Black Pepper Entertainment",
        url: "https://blackpepperentertainment.in",
        logo: "/BLACK PEPPER LOGO  WIGHT PNG.png",
      },
      {
        "@type": "WebSite",
        name: "Black Pepper Entertainment",
        url: "https://blackpepperentertainment.in",
        description:
          "Premium bookings for The Arcade, Verve Studio, and curated event experiences.",
      },
      {
        "@type": "LocalBusiness",
        name: "Black Pepper Entertainment",
        image: ["/the-arcade/dsc02553.jpg", "/verve-studio/dsc02518.jpg"],
        telephone: "+91-9203411611",
        areaServed: "Raipur, Chhattisgarh, India",
        description:
          "Premium community hall, podcast studio, and events destination for gatherings, creator sessions, and live experiences.",
      },
    ],
  };

  return (
    <div className="flex w-full flex-col bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
      <section className="relative flex min-h-[460px] w-full items-center overflow-hidden pt-20 sm:min-h-[600px] sm:pt-28 md:min-h-[660px] md:pt-28">
        <div className="absolute inset-0 z-0 h-full w-full">
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90" />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.03),transparent_20%)]" />
          <div className="pointer-events-none absolute left-[8%] top-[14%] z-[2] h-[14rem] w-[14rem] rounded-full bg-[#d8f24d]/[0.045] blur-[110px]" />
          <div className="pointer-events-none absolute right-[10%] top-[18%] z-[2] h-[18rem] w-[18rem] rounded-full bg-white/[0.05] blur-[120px]" />
          <div className="pointer-events-none absolute left-1/2 top-[34%] z-[2] h-[16rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#d6b98c]/[0.045] blur-[130px]" />
          {/* Stars layer 1 – brighter core stars */}
          <div
            className="pointer-events-none absolute inset-0 z-[3] animate-[twinkle_2.6s_ease-in-out_infinite]"
            style={{
              backgroundImage:
                "radial-gradient(2px 2px at 22px 26px, rgba(255,255,255,0.98), transparent 58%), radial-gradient(1.8px 1.8px at 112px 84px, rgba(255,255,255,0.92), transparent 58%), radial-gradient(2.1px 2.1px at 184px 44px, rgba(255,255,255,0.94), transparent 58%), radial-gradient(1.3px 1.3px at 72px 152px, rgba(255,255,255,0.82), transparent 56%), radial-gradient(1.9px 1.9px at 198px 172px, rgba(255,255,255,0.9), transparent 58%), radial-gradient(1.5px 1.5px at 144px 132px, rgba(255,255,255,0.84), transparent 56%), radial-gradient(1.7px 1.7px at 210px 102px, rgba(216,242,77,0.85), transparent 58%)",
              backgroundSize: "210px 210px",
            }}
          />
          {/* Stars layer 2 – wide field */}
          <div
            className="pointer-events-none absolute inset-0 z-[3] animate-[twinkle_3.4s_ease-in-out_0.7s_infinite]"
            style={{
              backgroundImage:
                "radial-gradient(1.35px 1.35px at 50px 60px, rgba(255,255,255,0.78), transparent 58%), radial-gradient(1.5px 1.5px at 160px 120px, rgba(255,255,255,0.72), transparent 58%), radial-gradient(1.1px 1.1px at 90px 30px, rgba(255,255,255,0.66), transparent 56%), radial-gradient(1.4px 1.4px at 130px 180px, rgba(255,255,255,0.6), transparent 58%), radial-gradient(1.15px 1.15px at 220px 46px, rgba(216,242,77,0.52), transparent 58%), radial-gradient(1.05px 1.05px at 238px 198px, rgba(255,255,255,0.58), transparent 56%)",
              backgroundSize: "250px 250px",
            }}
          />
          {/* Stars layer 3 – tiny fast twinkle */}
          <div
            className="pointer-events-none absolute inset-0 z-[3] animate-[twinkle_1.8s_ease-in-out_0.25s_infinite]"
            style={{
              backgroundImage:
                "radial-gradient(0.95px 0.95px at 35px 95px, rgba(255,255,255,0.68), transparent 58%), radial-gradient(1px 1px at 175px 55px, rgba(255,255,255,0.62), transparent 58%), radial-gradient(0.82px 0.82px at 100px 160px, rgba(255,255,255,0.55), transparent 56%), radial-gradient(0.9px 0.9px at 210px 145px, rgba(216,242,77,0.46), transparent 58%), radial-gradient(0.85px 0.85px at 148px 204px, rgba(255,255,255,0.52), transparent 56%)",
              backgroundSize: "200px 200px",
            }}
          />
          {/* Stars layer 4 – fine dust */}
          <div
            className="pointer-events-none absolute inset-0 z-[3] animate-[twinkle_2.2s_linear_0.4s_infinite]"
            style={{
              backgroundImage:
                "radial-gradient(0.7px 0.7px at 18px 20px, rgba(255,255,255,0.42), transparent 60%), radial-gradient(0.65px 0.65px at 96px 48px, rgba(255,255,255,0.34), transparent 60%), radial-gradient(0.75px 0.75px at 158px 110px, rgba(255,255,255,0.38), transparent 60%), radial-gradient(0.7px 0.7px at 212px 72px, rgba(216,242,77,0.3), transparent 60%), radial-gradient(0.65px 0.65px at 44px 166px, rgba(255,255,255,0.3), transparent 60%)",
              backgroundSize: "120px 120px",
            }}
          />
          <div className="pointer-events-none absolute left-1/2 top-0 z-[2] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-white/7 blur-[130px]" />
        </div>

        <div className="relative z-20 container mx-auto flex min-h-[calc(100vh-7rem)] w-full flex-col items-center justify-center px-5 py-6 text-center sm:min-h-[calc(100vh-7.5rem)] sm:px-6 sm:py-12 md:min-h-[620px] md:py-14">
          <AnimatedSection direction="down" delay={0.1}>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 shadow-[0_0_24px_rgba(255,255,255,0.12)] backdrop-blur-3xl sm:mb-5 sm:px-5 sm:py-2.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">
                Premium Spaces Available
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="mx-auto max-w-5xl">
            <h1 className="mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-[2.65rem] font-bold leading-[0.95] tracking-[-0.05em] text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.22)] sm:mb-5 sm:text-5xl md:text-6xl lg:text-7xl">
              Where People Gather, <br className="hidden md:block" /> Create, and Speak.
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.4} className="mx-auto max-w-3xl">
            <p className="mb-7 max-w-3xl text-[14px] leading-6 text-gray-300 sm:text-base sm:leading-7 md:mb-8 md:text-lg">
              Black Pepper Entertainment brings together{" "}
              <span className="font-semibold text-white">The Arcade</span>, a
              refined community hall, and{" "}
              <span className="font-semibold text-white">Verve Studio</span>, a
              polished recording environment built for premium gatherings,
              memorable sessions, and creator-led conversations.
            </p>
          </AnimatedSection>

          <AnimatedSection
            delay={0.6}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Link
              href="/spaces"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-all hover:bg-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] sm:min-h-14 sm:w-auto sm:px-10 sm:py-4 sm:text-lg sm:tracking-wide"
            >
              Explore Spaces
            </Link>
            <Link
              href="/availability"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] sm:min-h-14 sm:w-auto sm:px-10 sm:py-4 sm:text-lg sm:tracking-wide"
            >
              Check Availability <MoveRight className="h-5 w-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black py-3">
        <AnimatedSection>
          <div className="w-full overflow-hidden bg-black">
            <GlassMarquee />
          </div>
        </AnimatedSection>
      </section>

      <ArcGalleryHeroDemo />

      <section className="relative z-20 bg-black py-5 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-5 md:mb-6">
            <SectionHeading
              eyebrow="Choose Your Space"
              title="Two premium environments, each built for a different kind of moment."
              description="Choose the room that matches your format, your audience, and the experience you want people to remember."
            />
          </AnimatedSection>

          <HomeCardRail
            className="md:grid-cols-2"
            mobileBehavior="slider"
            mobileCardWidthClassName="w-[74vw] max-w-[17.5rem]"
          >
            {spaces.map((space, index) => {
              const Icon = space.icon;

              return (
                <AnimatedSection
                  key={space.title}
                  delay={0.15 + index * 0.12}
                  direction="up"
                  className="h-full"
                >
                  <GlowCard
                    className="h-full"
                    contentClassName="relative h-full min-h-[29rem] overflow-hidden rounded-[2rem] border border-white/10 md:min-h-[32rem]"
                    backgroundColor="#050505"
                    borderRadius={32}
                    glowIntensity={0.82}
                    fillOpacity={0.16}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-60"
                      style={{ backgroundImage: `url(${space.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20" />
                    <div className="relative z-10 flex h-full flex-col justify-end p-7 sm:p-9">
                      <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-200">
                        <Icon className="h-4 w-4" />
                        {space.subtitle}
                      </div>
                      <h3 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                        {space.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                        {space.description}
                      </p>
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={space.detailHref}
                          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition-all hover:border-white/24 hover:bg-white hover:text-black"
                        >
                          View Details
                        </Link>
                        <Link
                          href={space.bookingHref}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-100"
                        >
                          Book This Space
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </GlowCard>
                </AnimatedSection>
              );
            })}
          </HomeCardRail>
        </div>
      </section>

      <section className="bg-black py-5 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-5 md:mb-6">
            <SectionHeading
              eyebrow="Premium Experience"
              title="Why Choose Black Pepper Entertainment"
              description="Every detail is designed to make the experience feel polished, practical, and easy to work with for both events and content creation."
            />
          </AnimatedSection>

          <HomeCardRail className="md:hidden" mobileBehavior="grid" mobileColumns={2}>
            {mobileWhyChooseCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <AnimatedSection key={card.title} delay={0.08 + index * 0.05} direction="up">
                  <div className="group relative flex h-full min-h-[10.75rem] flex-col overflow-hidden rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_34%)]" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[1rem] border border-white/14 bg-white/[0.05]">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="mt-3 text-[1rem] font-semibold leading-tight tracking-[-0.03em] text-white">
                        {card.title}
                      </h3>
                      <p className="mt-2 flex-1 text-[11px] leading-5 text-zinc-300/85">
                        {card.description}
                      </p>
                      <span className="mt-3 inline-flex w-fit rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-200">
                        {card.tag}
                      </span>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </HomeCardRail>

          <div className="hidden auto-rows-fr gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
            {desktopWhyChooseCards.map((card, index) => {
              const Icon = card.icon;
              const visibleHighlights = card.highlights ?? [];
              const rows = Math.max(2, visibleHighlights.length);

              return (
                <AnimatedSection key={card.title} delay={0.12 + index * 0.08} direction="up">
                  <GlowCard
                    className="h-full"
                    contentClassName="group/card relative flex h-full min-h-[24rem] flex-col overflow-hidden rounded-[1.95rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_26px_80px_rgba(0,0,0,0.44)] backdrop-blur-2xl transition-all duration-500 md:hover:-translate-y-1 md:hover:border-white/16 md:hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.024))]"
                    backgroundColor="#050505"
                    borderRadius={30}
                    glowIntensity={0.74}
                    fillOpacity={0.1}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_44%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80" />
                    <div className="absolute right-0 top-0 h-36 w-36 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/[0.07] blur-3xl transition-opacity duration-500 md:group-hover/card:opacity-100 group-active/card:opacity-100" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-300 md:group-hover/card:bg-white/[0.1]">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="mt-6 text-[1.95rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
                        {card.title}
                      </h3>
                      <p className="mt-4 min-h-[5.5rem] text-[15px] leading-7 text-zinc-300/85">
                        {card.description}
                      </p>
                      {visibleHighlights.length ? (
                        <div className="mt-6 grid flex-1 gap-3">
                          {Array.from({ length: rows }).map((_, rowIndex) => {
                            const highlight = visibleHighlights[rowIndex];

                            return (
                            <div
                              key={highlight ?? `placeholder-${rowIndex}`}
                              className={`rounded-[1.15rem] border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors duration-300 md:group-hover/card:bg-white/[0.06] ${
                                highlight ? "" : "pointer-events-none opacity-0"
                              }`}
                            >
                              <p className="flex min-h-[3rem] items-start gap-3 text-sm leading-6 text-zinc-100/90">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/75" />
                                <span>{highlight ?? "\u00A0"}</span>
                              </p>
                            </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </GlowCard>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#050505] py-5 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-5 md:mb-6">
            <SectionHeading
              eyebrow="How Booking Works"
              title="A simple path from discovery to confirmation."
              description="The process stays clear from the first click, and the system keeps policy, availability, and follow-up options close at hand."
            />
          </AnimatedSection>

          <div className="grid gap-5 md:hidden">
            <AnimatedSection delay={0.1} direction="up">
                  <div className="relative min-h-[12rem] overflow-hidden rounded-[1.95rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_34%)]" />
                <div className="relative z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
                    Step 1
                  </span>
                  <h3 className="mt-4 max-w-[13rem] text-[1.95rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
                    {bookingSteps[0]}
                  </h3>
                </div>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 gap-4">
              {bookingSteps.slice(1, 3).map((step, index) => (
                <AnimatedSection key={step} delay={0.16 + index * 0.05} direction="up">
                  <div className="relative min-h-[9rem] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_38%)]" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                        Step {index + 2}
                      </span>
                      <h3 className="mt-4 text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
                        {step}
                      </h3>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {bookingSteps.slice(3, 5).map((step, index) => (
                <AnimatedSection key={step} delay={0.26 + index * 0.05} direction="up">
                  <div className="relative min-h-[9rem] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_38%)]" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                        Step {index + 4}
                      </span>
                      <h3 className="mt-4 text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
                        {step}
                      </h3>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <div className="hidden gap-4 md:grid lg:grid-cols-5">
            {bookingSteps.map((step, index) => (
              <AnimatedSection key={step} delay={0.1 + index * 0.06} direction="up">
                <div className="h-full rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-6">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-white">
                    {step}
                  </h3>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-5 md:py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
            <AnimatedSection direction="none" className="min-w-0">
              <div className="max-w-2xl min-w-0">
                <SectionHeading
                  eyebrow="Availability Preview"
                  title="A calendar flow that keeps availability transparent."
                  description="The live availability experience helps guests understand when a date is open, nearly full, or already booked out, then nudges them toward the next best option."
                  align="left"
                />
                <div className="mt-4 grid w-full max-w-sm gap-3 sm:flex sm:max-w-none sm:items-center">
                  <Link
                    href="/availability"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-100 sm:min-h-12 sm:w-auto sm:px-6"
                  >
                    Check Full Calendar
                    <MoveRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/booking"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black sm:min-h-12 sm:w-auto sm:px-6"
                  >
                    Start Booking
                  </Link>
                </div>
              </div>
            </AnimatedSection>

          <HomeCardRail className="min-w-0 md:grid-cols-2" mobileBehavior="grid" mobileColumns={2}>
              {availabilityHighlights.map((card, index) => {
                const Icon = card.icon;

                return (
                  <AnimatedSection key={card.title} delay={0.12 + index * 0.08} direction="up">
                    <GlowCard
                      className="h-full"
                      contentClassName="group/availability relative h-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.015))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500 md:hover:-translate-y-1 md:hover:border-white/16 active:-translate-y-1 active:border-white/16"
                      backgroundColor="#050505"
                      borderRadius={28}
                      glowIntensity={0.66}
                      fillOpacity={0.08}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_46%)]" />
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70" />
                      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] transition-colors duration-300 md:group-hover/availability:bg-white/[0.09] group-active/availability:bg-white/[0.09]">
                        <Icon className="h-5 w-5 text-white/90" />
                      </div>
                      <h3 className="relative z-10 mt-5 text-xl font-semibold text-white">
                        {card.title}
                      </h3>
                      <p className="relative z-10 mt-3 text-sm leading-7 text-zinc-400">
                        {card.description}
                      </p>
                    </GlowCard>
                  </AnimatedSection>
                );
              })}
            </HomeCardRail>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#060606] py-5 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-5 md:mb-6">
            <SectionHeading
              eyebrow="Packages And Pricing Preview"
              title="Preview the most common booking paths before diving deeper."
              description="Explore the most popular options, then move into the full pricing page for package-level detail and comparisons."
            />
          </AnimatedSection>

          <HomeCardRail
            className="md:grid-cols-3"
            mobileBehavior="slider"
            mobileCardWidthClassName="w-[calc(100vw-7rem)] max-w-[15.75rem]"
          >
            {pricingPreview.map((card, index) => (
              <AnimatedSection key={card.title} delay={0.12 + index * 0.08} direction="up">
                <GlowCard
                  className="h-full"
                  contentClassName="flex h-full min-h-[20rem] flex-col rounded-[1.6rem] p-5 md:min-h-[22.5rem] md:rounded-[1.8rem] md:p-7"
                  backgroundColor="#050505"
                  borderRadius={30}
                  glowIntensity={0.76}
                  fillOpacity={0.16}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                    {card.note}
                  </span>
                  <h3 className="mt-3 text-[1.35rem] font-semibold text-white md:mt-4 md:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white md:mt-4 md:text-4xl">
                    {card.price}
                  </p>
                  <p className="mt-3 text-[13px] leading-6 text-zinc-400 md:mt-4 md:text-sm md:leading-7">
                    {card.description}
                  </p>
                  <div className="mt-auto flex flex-col gap-3 pt-5 md:pt-8">
                    <Link
                      href={card.ctaHref}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-100 md:min-h-12"
                    >
                      View Pricing
                    </Link>
                  </div>
                </GlowCard>
              </AnimatedSection>
            ))}
          </HomeCardRail>
        </div>
      </section>

      <section className="bg-black py-5 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-5 md:mb-6">
            <SectionHeading
              eyebrow="Gallery And Recent Sessions"
              title="A quick look at the atmosphere behind recent events and shoots."
              description="Community moments, creator-led recordings, and behind-the-scenes setup details all live inside the same premium visual world."
            />
          </AnimatedSection>

          <HomeCardRail
            className="md:grid-cols-2 xl:grid-cols-4"
            mobileBehavior="slider"
            mobileCardWidthClassName="w-[calc(100vw-7rem)] max-w-[15.75rem]"
          >
            {galleryPreview.map((item, index) => (
              <AnimatedSection key={item.title} delay={0.12 + index * 0.08} direction="up">
                  <div className="group relative min-h-[17rem] h-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-black md:min-h-[22rem] md:rounded-[2rem]">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-75 transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                  <div className="relative z-10 flex min-h-[17rem] flex-col justify-end p-5 md:min-h-[22rem] md:p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[1rem] border border-white/12 bg-white/[0.05] md:mb-4 md:h-11 md:w-11 md:rounded-2xl">
                      <GalleryHorizontalEnd className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-[1.35rem] font-semibold text-white md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-300 md:mt-3 md:text-sm md:leading-7">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </HomeCardRail>

          <AnimatedSection className="mt-6 text-center">
            <Link
              href="/gallery"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
            >
              Explore Full Gallery
              <MoveRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#050505] py-5 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-5 md:mb-6">
            <SectionHeading
              eyebrow="Upcoming Events"
              title="Ticketed formats, live experiences, and culture-led nights are now part of the lineup."
              description="Explore the richer Events module for workshops, comedy, concerts, and curated community formats without changing the existing venue booking flow."
            />
          </AnimatedSection>

          <div className="md:hidden">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {upcomingEvents.map((event, index) => (
                <AnimatedSection
                  key={event.slug}
                  delay={0.08 + index * 0.05}
                  direction="up"
                  className="w-[calc(100vw-6rem)] max-w-[16.75rem] shrink-0 snap-start"
                >
                  <EventPosterCard event={event} variant="compact" showSummary={false} />
                </AnimatedSection>
              ))}
            </div>
          </div>

          <div className="hidden gap-5 md:grid md:grid-cols-2 xl:grid-cols-4">
            {upcomingEvents.map((event, index) => (
              <AnimatedSection key={event.slug} delay={0.1 + index * 0.06} direction="up" className="h-full">
                <EventPosterCard event={event} variant="compact" showSummary={false} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-6 text-center">
            <Link
              href="/events"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-200"
            >
              View All Events
              <MoveRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-5 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#090909]" />
        <div className="container relative z-10 mx-auto px-6">
          <AnimatedSection className="mx-auto max-w-4xl rounded-[3rem] border border-white/10 bg-white/[0.05] p-10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-3xl md:p-20">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.05]">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              Ready to Host, Record, or Create?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
              Move from browsing into a booking path that keeps the experience premium from the first click through confirmation and follow-up.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/booking"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-100"
              >
                Book Now
              </Link>
              <Link
                href="/availability"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
              >
                Check Availability
                <MoveRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
