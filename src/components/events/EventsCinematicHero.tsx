"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Search, Ticket } from "lucide-react";
import { motion } from "framer-motion";

import type { EventItem } from "@/lib/events/catalog";
import { venueImages } from "@/lib/content/site-images";

type EventsCinematicHeroProps = {
  featuredEvent: EventItem;
  searchQuery?: string;
};

const tileClasses = [
  "left-[-7%] top-[8%] h-[11rem] w-[18rem] md:left-[-3%] md:top-[10%] md:h-[15rem] md:w-[24rem]",
  "left-[12%] top-[2%] h-[10rem] w-[17rem] md:left-[14%] md:top-[-2%] md:h-[14rem] md:w-[23rem]",
  "left-[35%] top-[-10%] h-[11rem] w-[18rem] md:left-[34%] md:h-[15rem] md:w-[24rem]",
  "right-[8%] top-[0%] h-[10rem] w-[17rem] md:right-[12%] md:top-[-4%] md:h-[14rem] md:w-[23rem]",
  "right-[-9%] top-[11%] h-[11rem] w-[18rem] md:right-[-4%] md:h-[15rem] md:w-[24rem]",
  "left-[0%] bottom-[10%] h-[10rem] w-[17rem] md:left-[5%] md:bottom-[4%] md:h-[13rem] md:w-[22rem]",
  "left-[31%] bottom-[-12%] h-[10rem] w-[17rem] md:left-[34%] md:bottom-[-15%] md:h-[14rem] md:w-[23rem]",
  "right-[5%] bottom-[7%] h-[10rem] w-[17rem] md:right-[9%] md:bottom-[2%] md:h-[13rem] md:w-[22rem]",
] as const;

const tileRotations = [
  -18,
  13,
  -10,
  17,
  -15,
  14,
  -12,
  13,
] as const;

function getHeroImages(featuredEvent: EventItem) {
  return [
    featuredEvent.coverImage,
    featuredEvent.posterImage,
    ...venueImages,
  ].filter(Boolean);
}

export function EventsCinematicHero({
  featuredEvent,
  searchQuery = "",
}: EventsCinematicHeroProps) {
  const heroImages = getHeroImages(featuredEvent);
  const router = useRouter();
  const [query, setQuery] = useState(searchQuery);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = query.trim();
    const params = new URLSearchParams();

    if (nextQuery.length > 0) {
      params.set("q", nextQuery);
    }

    const target = params.toString()
      ? `/events?${params.toString()}#upcoming-events`
      : "/events#upcoming-events";

    router.push(target);
  }

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#101010] pt-[6.4rem] text-white sm:pt-[7.4rem] lg:pt-[8.2rem]">
      <div className="relative min-h-[520px] overflow-hidden bg-[#101010] md:min-h-[590px] lg:min-h-[620px]">
        <div className="absolute inset-0 z-0">
          {tileClasses.map((className, index) => (
            <motion.div
              key={`${heroImages[index % heroImages.length]}-${index}`}
              className={`absolute overflow-hidden rounded-[1.8rem] border border-white/[0.045] bg-white/[0.03] shadow-[0_34px_90px_rgba(0,0,0,0.42)] ${className}`}
              initial={{ opacity: 0, y: 24, rotate: tileRotations[index] - 4 }}
              animate={{ opacity: 1, y: 0, rotate: tileRotations[index] }}
              transition={{
                delay: 0.08 + index * 0.04,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Image
                src={heroImages[index % heroImages.length]}
                alt=""
                fill
                sizes="(max-width: 768px) 45vw, 28vw"
                className="object-cover opacity-78 saturate-[0.82]"
                priority={index < 3}
              />
              <div className="absolute inset-0 bg-black/18" />
            </motion.div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_18%,rgba(216,242,77,0.08),transparent_26%),linear-gradient(180deg,rgba(16,16,16,0.34),rgba(16,16,16,0.72)_48%,#101010_98%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-[#101010] via-[#101010]/72 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-52 bg-gradient-to-t from-[#101010] via-[#101010]/88 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-6xl flex-col items-center justify-center px-5 py-16 text-center md:min-h-[590px] lg:min-h-[620px]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55 }}
            className="mb-5 inline-flex rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d8f24d] backdrop-blur-xl"
          >
            Events by Black Pepper
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl text-balance font-sans text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.07em] text-white sm:text-[4.2rem] lg:text-[5.5rem]"
          >
            Experience the joy of being present.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.65 }}
            className="mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base"
          >
            Find curated nights, workshops, live vibes, and community moments hosted with Black Pepper&apos;s premium event atmosphere.
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.65 }}
            className="mt-7 flex w-full max-w-[34rem] gap-2 rounded-[1.6rem] border border-white/10 bg-white/[0.94] p-2 text-black shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:rounded-full"
          >
            <label className="flex min-h-12 flex-1 items-center gap-3 rounded-full px-4 text-left text-sm font-medium text-black/70 transition-colors focus-within:bg-black/[0.045]">
              <Search className="h-4 w-4 text-black/45" />
              <span className="sr-only">Search events</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events, workshops, comedy..."
                className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-black/45"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-black px-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#d8f24d] hover:text-black"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.65 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55"
          >
            <span>{featuredEvent.categoryLabel}</span>
            <span className="h-1 w-1 rounded-full bg-[#d8f24d]" />
            <Link
              href={`/events/${featuredEvent.slug}`}
              className="inline-flex items-center gap-2 text-[#d8f24d] transition-colors hover:text-white"
            >
              <Ticket className="h-3.5 w-3.5" />
              Featured ticket
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
