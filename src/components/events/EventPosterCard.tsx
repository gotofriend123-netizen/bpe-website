import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Heart, MapPin, Ticket } from "lucide-react";
import { format } from "date-fns";

import { EventDateBadge } from "@/components/events/EventDateBadge";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import type { EventItem } from "@/lib/events/catalog";
import { cn } from "@/lib/utils";

type EventPosterCardProps = {
  event: EventItem;
  href?: string;
  variant?: "poster" | "featured" | "compact";
  showSummary?: boolean;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function EventPosterCard({
  event,
  href = `/events/${event.slug}`,
  variant = "poster",
  showSummary = true,
}: EventPosterCardProps) {
  const poster = variant === "featured";
  const compactCard = variant === "compact";

  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-[1.85rem] border border-white/10 bg-[#090909] shadow-[0_18px_50px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-white/18 hover:shadow-[0_24px_70px_rgba(249,115,22,0.12)]",
        poster ? "h-full" : "",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-[#050505]",
          variant === "poster" && "aspect-[4/4.35]",
          variant === "compact" && "aspect-[4/4.1]",
          variant === "featured" && "aspect-[16/10]",
        )}
      >
        <Image
          src={event.posterImage}
          alt={event.title}
          fill
          className="object-contain p-2 transition-transform duration-700 group-hover:scale-[1.02]"
          sizes={
            variant === "featured"
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          }
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.9))]" />
        <div className="absolute left-4 top-4 z-10">
          <EventStatusBadge status={event.availability} />
        </div>
        <div
          className={cn(
            "absolute right-4 top-4 z-10 inline-flex items-center justify-center rounded-full border border-white/16 bg-black/40 text-white/80 backdrop-blur-xl transition-colors duration-200 group-hover:bg-white group-hover:text-black",
            compactCard ? "h-10 w-10" : "h-11 w-11",
          )}
        >
          <Heart className="h-4 w-4" />
        </div>
        <div className="absolute bottom-4 left-4 z-10">
          <EventDateBadge startsAt={event.startsAt} />
        </div>
      </div>

      <div className={cn(compactCard ? "p-4 sm:p-5" : "p-5 sm:p-6")}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
              {event.categoryLabel}
            </p>
            <h3
              className={cn(
                "mt-3 font-semibold tracking-[-0.04em] text-white",
                compactCard ? "text-[1.45rem] leading-[1.02]" : "text-2xl",
              )}
            >
              {event.title}
            </h3>
          </div>
        </div>

        {showSummary ? (
          <p
            className={cn(
              "mt-3 text-zinc-400",
              compactCard ? "line-clamp-2 text-[13px] leading-6" : "text-sm leading-7",
            )}
          >
            {event.summary}
          </p>
        ) : null}

        <div
          className={cn(
            "flex flex-col text-zinc-300",
            compactCard ? "mt-4 gap-2 text-[13px]" : "mt-5 gap-2.5 text-sm",
          )}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#f97316]" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#f97316]" />
            <span>{format(new Date(event.startsAt), "EEE, d MMM • h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-[#f97316]" />
            <span>From {formatPrice(event.priceFrom)}</span>
          </div>
        </div>

        <div className={cn("flex items-center justify-between border-t border-white/8", compactCard ? "mt-4 pt-3.5" : "mt-5 pt-4")}>
          <span className={cn("uppercase tracking-[0.24em] text-zinc-500", compactCard ? "text-[10px]" : "text-xs")}>
            {event.metadataLine}
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-200 group-hover:text-[#f97316]">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
