import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { BookingStepsSection } from "@/components/events/BookingStepsSection";
import { CategoryTilePremium } from "@/components/events/CategoryTilePremium";
import { EventsLuxuryHeader } from "@/components/events/EventsLuxuryHeader";
import { HotTicketCard } from "@/components/events/HotTicketCard";
import { MarqueeStrip } from "@/components/events/MarqueeStrip";
import { PremiumFAQAccordion } from "@/components/events/PremiumFAQAccordion";
import { PromoBannerLuxury } from "@/components/events/PromoBannerLuxury";
import { RelatedEventCard } from "@/components/events/RelatedEventCard";
import { SectionHeadingPremium } from "@/components/events/SectionHeadingPremium";
import { UpcomingEventCard } from "@/components/events/UpcomingEventCard";
import { MoveRight } from "lucide-react";
import {
  EVENT_CATEGORIES,
  type EventCategoryId,
} from "@/lib/events/catalog";
import {
  getAllEventItems,
  getEventsForCategoryItems,
  getFeaturedEventItems,
  getHotSellingEventItems,
  getRelatedEventItems,
  getUpcomingEventItems,
} from "@/lib/events/repository";

export const metadata = {
  title: "Events | Black Pepper Entertainment",
  description:
    "Discover premium events, workshops, concerts, comedy nights, and curated cultural experiences inside Black Pepper Entertainment.",
};

type EventsPageProps = {
  searchParams?: {
    category?: string;
  };
};

const MARQUEE_ITEMS = [
  "LIVE EVENTS",
  "WORKSHOPS",
  "COMEDY NIGHTS",
  "MUSIC EXPERIENCES",
  "CULTURAL EVENINGS",
  "EXCLUSIVE TICKETS",
  "BOOK NOW",
] as const;

const FAQ_ITEMS = [
  {
    question: "How do I book an event?",
    answer:
      "Open the event detail page, choose your ticket type and quantity, fill in your details, and confirm the booking through the dedicated Events booking card.",
  },
  {
    question: "Will I receive a confirmation after booking?",
    answer:
      "Yes. After a successful event booking, the system generates a booking reference and triggers a confirmation email to the guest inbox.",
  },
  {
    question: "Can I cancel or reschedule my event booking?",
    answer:
      "For now, event cancellation and transfer handling depends on the specific event policy shown on the detail page. Contact support for any event-specific request.",
  },
  {
    question: "What happens if tickets are sold out?",
    answer:
      "Sold-out events are clearly marked in the discovery flow. When inventory is limited, the page shows a limited-seats badge before the final sellout state.",
  },
  {
    question: "Do you host private or exclusive events?",
    answer:
      "Yes. Black Pepper can support premium private formats, invite-led community events, workshops, and brand-led experiences through the host-an-event flow.",
  },
  {
    question: "Can I contact support for assistance?",
    answer:
      "Yes. If you need help before or after your booking, use the site contact flow and the team can guide you on access, ticketing, and event-day questions.",
  },
] as const;

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const selectedCategory = (searchParams?.category as EventCategoryId | undefined) ?? null;
  const allEvents = await getAllEventItems();
  const featuredEvents = await getFeaturedEventItems(1);
  const hotSelling = await getHotSellingEventItems(3);
  const heroEvent = featuredEvents[0] ?? hotSelling[0] ?? allEvents[0];
  const upcomingEvents = selectedCategory
    ? await getEventsForCategoryItems(selectedCategory, 4)
    : await getUpcomingEventItems(4);
  const relatedEvents = heroEvent ? await getRelatedEventItems(heroEvent.slug, 4) : allEvents.slice(0, 4);

  return (
    <div className="min-h-screen bg-black pb-12 pt-24 text-white md:pb-18 md:pt-28">
      <section className="pb-5 md:pb-8">
        <div className="container mx-auto px-6">
          {heroEvent ? (
            <AnimatedSection>
              <EventsLuxuryHeader featuredEvent={heroEvent} />
            </AnimatedSection>
          ) : null}
        </div>
      </section>

      <section className="pb-5 md:pb-8">
        <div className="container mx-auto px-6">
          <AnimatedSection delay={0.05}>
            <MarqueeStrip items={MARQUEE_ITEMS} />
          </AnimatedSection>
        </div>
      </section>

      <section id="upcoming-events" className="py-7 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-7 md:mb-9">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <h2 className="font-sans text-[1.9rem] font-semibold tracking-[-0.05em] text-white md:text-[2.4rem]">
                    {selectedCategory ? "Filtered Event Picks" : "Events You Can't Miss"}
                  </h2>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d6b98c]/20 bg-[#d6b98c]/[0.08] text-[#d6b98c]">
                    <MoveRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 max-w-xl text-[14px] leading-7 text-zinc-400">
                  {selectedCategory
                    ? `A tighter poster-led selection for ${selectedCategory.replace("-", " ")}, designed to scan quickly and feel more premium.`
                    : "A sharper first drop of posters, dates, and city-ready event picks with the same premium energy as modern ticket platforms."}
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d6b98c]/35 hover:bg-[#d6b98c] hover:text-black"
              >
                View All Events
                <MoveRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
            {upcomingEvents.map((event, index) => (
              <AnimatedSection key={event.slug} delay={0.06 + index * 0.05} direction="up">
                <UpcomingEventCard event={event} />
              </AnimatedSection>
            ))}
          </div>

          <div className="-mx-6 md:hidden">
            <div className="flex snap-x gap-4 overflow-x-auto px-6 pb-1">
              {upcomingEvents.map((event, index) => (
                <AnimatedSection
                  key={event.slug}
                  delay={0.06 + index * 0.05}
                  direction="up"
                  className="w-[18.25rem] shrink-0 snap-start"
                >
                  <UpcomingEventCard event={event} />
                </AnimatedSection>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              {upcomingEvents.map((event, index) => (
                <span
                  key={event.slug}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === 0 ? "w-2.5 bg-[#d8f24d]" : "w-2.5 bg-white/65"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="explore-by-category" className="py-6 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <h2 className="font-sans text-[1.8rem] font-semibold tracking-[-0.05em] text-white md:text-[2.2rem]">
                Explore By Category
              </h2>
              <span className="text-[1.5rem] font-semibold text-[#d8f24d]">›</span>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-4 gap-3 md:gap-4 xl:grid-cols-8">
            {EVENT_CATEGORIES.map((category, index) => (
              <AnimatedSection key={category.id} delay={0.04 + index * 0.04} direction="up">
                <div className="min-w-0">
                  <CategoryTilePremium {...category} />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 md:py-10">
        <div className="container mx-auto px-6">
          {heroEvent ? (
            <AnimatedSection>
              <PromoBannerLuxury
                image={heroEvent.coverImage}
                title="Book Your Tickets Now"
                description="Discover curated events, premium experiences, and unforgettable nights shaped with Black Pepper’s darker, richer event language."
                href={heroEvent ? `/events/${heroEvent.slug}` : "/events"}
                ctaLabel="Book Your Ticket Now"
              />
            </AnimatedSection>
          ) : null}
        </div>
      </section>

      <section id="hot-selling-tickets" className="py-7 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-6 md:mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-sans text-[1.8rem] font-semibold tracking-[-0.05em] text-white md:text-[2.2rem]">
                  Hot-Selling Ticket
                </h2>
                <span className="text-[1.5rem] font-semibold text-[#d8f24d]">›</span>
              </div>

              <Link
                href="/events"
                className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#d8f24d] transition-colors duration-300 hover:text-white"
              >
                View All
              </Link>
            </div>
          </AnimatedSection>

          <div className="-mx-6 md:hidden">
            <div className="flex snap-x gap-4 overflow-x-auto px-6 pb-1">
              {hotSelling.slice(0, 3).map((event, index) => (
                <AnimatedSection
                  key={event.slug}
                  delay={0.08 + index * 0.05}
                  direction="up"
                  className="w-[18.25rem] shrink-0 snap-start"
                >
                  <HotTicketCard event={event} />
                </AnimatedSection>
              ))}
            </div>
          </div>

          <div className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-3">
            {hotSelling.slice(0, 3).map((event, index) => (
              <AnimatedSection key={event.slug} delay={0.08 + index * 0.05} direction="up">
                <HotTicketCard event={event} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="how-to-book-events" className="py-7 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-10 md:mb-12">
            <SectionHeadingPremium
              eyebrow="How To Book The Events"
              title="The purchase flow stays fast, clear, and confidently premium."
              description="We reduce friction without flattening the experience, so guests know what to do next at every step."
              align="center"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <BookingStepsSection />
          </AnimatedSection>
        </div>
      </section>

      <section id="event-faq" className="py-7 md:py-12">
        <div className="container mx-auto grid gap-10 px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <AnimatedSection direction="up">
            <SectionHeadingPremium
              eyebrow="FAQ"
              title="Answers kept visible before guests commit."
              description="A premium event flow feels clearer when common questions around confirmation, support, and sold-out situations are handled upfront."
            />
          </AnimatedSection>

          <AnimatedSection delay={0.08} direction="up">
            <PremiumFAQAccordion items={FAQ_ITEMS} />
          </AnimatedSection>
        </div>
      </section>

      <section className="py-7 md:py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection className="mb-10 md:mb-12">
            <SectionHeadingPremium
              eyebrow="You May Also Like"
              title="A final discovery push for the next event that fits the same taste."
              description="Related picks stay smaller and more compact here, so the page closes with a lighter but still persuasive conversion layer."
              actionHref="/events"
              actionLabel="View All Events"
            />
          </AnimatedSection>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedEvents.map((event, index) => (
              <AnimatedSection key={event.slug} delay={0.06 + index * 0.05} direction="up">
                <RelatedEventCard event={event} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
