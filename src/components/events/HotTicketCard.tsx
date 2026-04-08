import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { format } from "date-fns";

import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import type { EventItem } from "@/lib/events/catalog";
import { cn } from "@/lib/utils";

type HotTicketCardProps = {
  event: EventItem;
  variant?: "featured" | "standard";
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function HotTicketCard({
  event,
  variant = "standard",
}: HotTicketCardProps) {
  const featured = variant === "featured";
  const date = new Date(event.startsAt);

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group block",
        featured && "lg:h-full"
      )}
    >
      <article className="space-y-3">
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.45rem] border border-white/10 bg-black shadow-[0_18px_52px_rgba(0,0,0,0.24)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-white/18 group-hover:shadow-[0_28px_72px_rgba(214,185,140,0.12)]",
            featured ? "min-h-[19rem] lg:min-h-full" : "aspect-[4/3.45] md:aspect-[4/3.65]",
          )}
        >
          <Image
            src={event.posterImage}
            alt={event.title}
            fill
            className="object-contain bg-[#050505] p-2 transition-transform duration-700 group-hover:scale-[1.02]"
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 55vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
          />
          <div className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.14)_42%,rgba(0,0,0,0.58))] ${event.accent}`} />
          <div className="absolute left-3 top-3 flex items-center gap-3">
            <EventStatusBadge status={event.availability} />
          </div>
          <div className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/92 text-zinc-900 shadow-[0_10px_24px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-transform duration-300 group-hover:scale-105">
            <Heart className="h-4 w-4" />
          </div>
          <div className="absolute bottom-3 left-3 rounded-[0.95rem] bg-[#d8f24d] px-3 py-2 text-black shadow-[0_12px_24px_rgba(216,242,77,0.26)]">
            <div className="text-[9px] font-semibold uppercase tracking-[0.18em] opacity-80">
              {format(date, "MMM")}
            </div>
            <div className="text-[1.1rem] font-semibold leading-none">{format(date, "dd")}</div>
          </div>
        </div>

        <div className="space-y-1 px-1">
          <h3
            className={cn(
              "font-sans font-semibold uppercase tracking-[-0.045em] text-white",
              featured ? "text-[1.65rem] leading-[0.96] md:text-[1.9rem]" : "text-[1.05rem] leading-[0.98] md:text-[1.25rem]",
            )}
          >
            {event.title}
          </h3>
          <p className="text-[12px] text-white/76 md:text-[13px]">
            {event.city}, Chhattisgarh
          </p>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/72">
              {format(date, "dd MMM")}
            </span>
            <span className="text-[12px] font-semibold text-[#d8f24d]">
              From {formatPrice(event.priceFrom)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
