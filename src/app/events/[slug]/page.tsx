import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { EventBookingCard } from "@/components/events/EventBookingCard";
import { EventPosterCard } from "@/components/events/EventPosterCard";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { SectionHeader } from "@/components/events/SectionHeader";
import type { EventFaq } from "@/lib/events/catalog";
import { getEventItemBySlug, getRelatedEventItems } from "@/lib/events/repository";
import { incrementEventPageView } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type EventDetailPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: EventDetailPageProps) {
  const event = await getEventItemBySlug(params.slug);

  if (!event) {
    return {
      title: "Event Not Found | Black Pepper Entertainment",
    };
  }

  return {
    title: `${event.title} | Events`,
    description: event.teaser,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await getEventItemBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = await getRelatedEventItems(event.slug, 3);
  const usesPosterAsHero = event.coverImage === event.posterImage;

  // Track page view (fire-and-forget — never blocks render)
  incrementEventPageView(event.slug);

  return (
    <div className="min-h-screen bg-black pb-24 pt-24 text-white sm:pt-28 event-page-bg">
      <section className="px-0 sm:container sm:mx-auto sm:px-6">
        <AnimatedSection>
          <div className="grid md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-10">
            <div className="space-y-6 sm:space-y-8">
              <div className="relative aspect-[4/5] sm:aspect-video md:aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className={usesPosterAsHero ? "object-contain bg-[#050505] p-2 sm:p-4 lg:p-8" : "object-cover"}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute left-4 top-4 sm:left-6 z-20">
                  <EventStatusBadge status={event.availability} />
                </div>
              </div>

              <div className="px-5 sm:px-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f97316]">
                  {event.categoryLabel}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  {event.title}
                </h1>
                <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8 md:text-lg">
                  {event.teaser}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-100">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md">
                    <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f97316]" />
                    {format(new Date(event.startsAt), "EEE, d MMM")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md">
                    <Clock3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f97316]" />
                    {format(new Date(event.startsAt), "h:mm a")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f97316]" />
                    {event.venue}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-0">
              <div className="sticky top-28">
                <EventBookingCard event={event} />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="container mx-auto mt-16 grid gap-12 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-12">
          <AnimatedSection>
            <SectionHeader
              eyebrow="About this event"
              title="A polished event page with the details guests actually need."
              description="Pricing tiers, venue clarity, highlights, policies, and a premium booking card all stay visible without pushing the main experience into clutter."
            />
            <div className="mt-8 space-y-5 text-[15px] leading-8 text-zinc-300 md:text-lg">
              {event.description.map((paragraph: string) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid gap-6 md:grid-cols-2">
              {event.highlights.map((highlight: string) => (
                <div
                  key={highlight}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#f97316]" />
                  <p className="mt-4 text-base font-medium text-white">{highlight}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <SectionHeader
              eyebrow="FAQs"
              title="Questions guests usually ask before they book."
              description="We keep the event detail flow confident and transparent, especially around access, timing, and attendance expectations."
            />
            <div className="mt-8 space-y-4">
              {event.faq.map((item: EventFaq) => (
                <div
                  key={item.question}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
                >
                  <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{item.answer}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <SectionHeader
              eyebrow="Policy"
              title="Clean, visible terms for a smoother event experience."
              description="Each event keeps its booking rules visible before checkout so the purchase still feels premium instead of confusing."
            />
            <div className="mt-8 space-y-4">
              {event.policies.map((policy: string) => (
                <div
                  key={policy}
                  className="flex items-start gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-5 py-4"
                >
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#f97316]" />
                  <p className="text-sm leading-7 text-zinc-300">{policy}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <div className="space-y-8">
          <AnimatedSection>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
                Event snapshot
              </p>
              <div className="mt-5 space-y-4 text-sm text-zinc-300">
                <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                  <span>Organizer</span>
                  <span className="font-medium text-white">{event.organizer}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                  <span>Venue</span>
                  <span className="font-medium text-white">{event.venue}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                  <span>City</span>
                  <span className="font-medium text-white">{event.city}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Price</span>
                  <span className="font-medium text-white">From ₹{event.priceFrom.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <SectionHeader
              eyebrow="Related Events"
              title="Keep exploring"
              description="A premium discovery flow should keep suggesting the next event naturally."
            />
            <div className="mt-8 space-y-6">
              {relatedEvents.map((relatedEvent) => (
                <EventPosterCard
                  key={relatedEvent.slug}
                  event={relatedEvent}
                  variant="compact"
                  showSummary={false}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
