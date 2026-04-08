import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";

import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import type { EventItem } from "@/lib/events/catalog";

type UpcomingEventCardProps = {
  event: EventItem;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function UpcomingEventCard({ event }: UpcomingEventCardProps) {
  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article className="space-y-3">
        <div className="relative aspect-[4/5.25] overflow-hidden rounded-[1.7rem] border border-white/10 bg-black shadow-[0_22px_55px_rgba(0,0,0,0.34)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#d6b98c]/25 group-hover:shadow-[0_30px_70px_rgba(214,185,140,0.12)]">
          <Image
            src={event.posterImage}
            alt={event.title}
            fill
            className="object-contain p-2 transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 82vw, (max-width: 1200px) 48vw, 24vw"
          />
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.34)_40%,rgba(0,0,0,0.92))] ${event.accent}`}
          />

          <div className="absolute left-4 top-4">
            <EventStatusBadge status={event.availability} />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <div className="rounded-[1.35rem] border border-white/12 bg-black/35 px-4 py-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full border border-white/12 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#f0debc]">
                  {event.categoryLabel}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                  From {formatPrice(event.priceFrom)}
                </span>
              </div>

              <h3 className="mt-3 font-sans text-[1.4rem] font-semibold uppercase leading-[0.96] tracking-[-0.05em] text-white md:text-[1.7rem]">
                {event.title}
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-white/72 md:text-[13px]">
                {event.summary}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-1 text-[13px] text-zinc-300">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-white/72">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#d6b98c]" />
              <span className="truncate">{event.city}, {event.venue}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-semibold text-white">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#d6b98c]" />
            <span>{format(new Date(event.startsAt), "dd MMM")}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
