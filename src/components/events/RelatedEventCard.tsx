import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, MoveRight } from "lucide-react";
import { format } from "date-fns";

import type { EventItem } from "@/lib/events/catalog";

type RelatedEventCardProps = {
  event: EventItem;
};

export function RelatedEventCard({ event }: RelatedEventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex overflow-hidden rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] shadow-[0_18px_44px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-white/16"
    >
      <div className="relative w-[6.75rem] shrink-0 overflow-hidden">
        <Image
          src={event.posterImage}
          alt={event.title}
          fill
          className="object-contain bg-[#050505] p-2 transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="120px"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.15))]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#d6b98c]/80">
            {event.categoryLabel}
          </p>
          <h3 className="mt-2 font-serif text-[1.35rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            {event.shortTitle}
          </h3>
        </div>
        <div className="mt-4 space-y-2 text-[12px] text-zinc-400">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-[#d6b98c]" />
            <span>{format(new Date(event.startsAt), "d MMM • h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#d6b98c]" />
            <span>{event.venue}</span>
          </div>
        </div>
        <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-300 group-hover:text-[#d6b98c]">
          View Details
          <MoveRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
