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
      <article className="space-y-4">
        {/* Full Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0a0a0a] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#d6b98c]/30 group-hover:shadow-[0_20px_60px_rgba(214,185,140,0.15)]">
          <Image
            src={event.posterImage}
            alt={event.title}
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 48vw, 24vw"
          />
          <div className="absolute left-4 top-4">
            <EventStatusBadge status={event.availability} />
          </div>
        </div>

        {/* Details Container Below Image */}
        <div className="rounded-[1.4rem] border border-white/5 bg-[#111] p-5 backdrop-blur-none transition-colors duration-300 group-hover:bg-[#151515]">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d6b98c]">
              {event.categoryLabel}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
              From {formatPrice(event.priceFrom)}
            </span>
          </div>

          <h3 className="mt-4 font-sans text-xl font-bold uppercase leading-[1.1] tracking-[-0.03em] text-white md:text-2xl">
            {event.title}
          </h3>

          <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-400 line-clamp-2">
            {event.summary}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/5 pt-4 text-[13px]">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="h-4 w-4 shrink-0 text-[#d6b98c]" />
                <span className="truncate">{event.city}, {event.venue}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-semibold text-white">
              <CalendarDays className="h-4 w-4 shrink-0 text-[#d6b98c]" />
              <span>{format(new Date(event.startsAt), "dd MMM")}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
