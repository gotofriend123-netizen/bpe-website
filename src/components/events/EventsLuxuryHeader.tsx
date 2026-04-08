import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, Sparkles, Ticket } from "lucide-react";

import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import type { EventItem } from "@/lib/events/catalog";

type EventsLuxuryHeaderProps = {
  featuredEvent: EventItem;
};

const NAV_ITEMS = [
  { label: "Upcoming", href: "#upcoming-events" },
  { label: "Categories", href: "#explore-by-category" },
  { label: "Hot Tickets", href: "#hot-selling-tickets" },
  { label: "How To Book", href: "#how-to-book-events" },
  { label: "FAQ", href: "#event-faq" },
] as const;

export function EventsLuxuryHeader({ featuredEvent }: EventsLuxuryHeaderProps) {
  return (
    <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,9,9,0.96),rgba(9,9,9,0.88))] shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
      <div className="border-b border-white/8 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2.5">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-[10px] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${
                index === 0
                  ? "border border-[#d6b98c]/25 bg-[#d6b98c]/[0.1] text-[#f0debc]"
                  : "border border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-7">
        <div className="min-w-0">
          <span className="inline-flex rounded-full border border-[#d6b98c]/20 bg-[#d6b98c]/[0.08] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#f0debc]">
            Events by Black Pepper
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.35rem] font-semibold leading-[0.94] tracking-[-0.06em] text-white md:text-[4.4rem]">
            Premium nights, curated formats, and poster-led discovery.
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-7 text-zinc-400 md:text-[16px] md:leading-8">
            Explore a more cinematic event marketplace built around live experiences, sharper visual storytelling, and a cleaner ticket-buying path.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#upcoming-events"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d6b98c]"
            >
              Explore Events
            </Link>
            <Link
              href="#hot-selling-tickets"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:border-[#d6b98c]/30 hover:bg-white/[0.08]"
            >
              Book Your Ticket Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Ticket, label: "Fast booking flow" },
              { icon: CalendarClock, label: "Curated weekly drops" },
              { icon: Sparkles, label: "Premium event styling" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <Icon className="h-4 w-4 text-[#d6b98c]" />
                  <p className="mt-3 text-[12px] font-medium text-zinc-200">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a]">
          <div className="relative min-h-[19rem] overflow-hidden">
            <Image
              src={featuredEvent.coverImage}
              alt={featuredEvent.title}
              fill
              className="object-cover opacity-82"
              sizes="(max-width: 1024px) 100vw, 44vw"
              priority
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${featuredEvent.accent}`} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.9))]" />
            <div className="absolute left-4 top-4">
              <EventStatusBadge status={featuredEvent.availability} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f0debc]">
                Featured This Week
              </p>
              <h2 className="mt-3 font-serif text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                {featuredEvent.title}
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-zinc-200">{featuredEvent.teaser}</p>
              <Link
                href={`/events/${featuredEvent.slug}`}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-white/16 bg-black/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md transition-all duration-300 hover:border-[#d6b98c]/35 hover:bg-[#d6b98c] hover:text-black"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
