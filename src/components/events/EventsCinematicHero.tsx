'use client';

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import type { EventItem } from "@/lib/events/catalog";

type EventsCinematicHeroProps = {
  featuredEvent: EventItem;
};

const NAV_ITEMS = [
  { label: "Upcoming", href: "#upcoming-events" },
  { label: "Categories", href: "#explore-by-category" },
  { label: "Hot Tickets", href: "#hot-selling-tickets" },
  { label: "How To Book", href: "#how-to-book-events" },
  { label: "FAQ", href: "#event-faq" },
] as const;

export function EventsCinematicHero({ featuredEvent }: EventsCinematicHeroProps) {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-black md:min-h-[92vh]">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={featuredEvent.coverImage}
          alt={featuredEvent.title}
          fill
          className="object-cover opacity-60 transition-transform duration-[10s] ease-linear hover:scale-110"
          priority
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.1),transparent_50%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent" />
        
        {/* Animated Noise/Grain for texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <div className="relative z-10 container mx-auto flex h-full min-h-[inherit] flex-col justify-end px-6 pb-20 pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-md">
              Featured Experience
            </span>
            <EventStatusBadge status={featuredEvent.availability} />
          </div>

          <h1 className="mb-6 font-serif text-5xl font-bold leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl lg:text-[7rem]">
            {featuredEvent.title}
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
            {featuredEvent.summary}
          </p>

          <div className="grid gap-6 sm:flex sm:items-center">
            <Link
              href={`/events/${featuredEvent.slug}`}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Get Tickets
              <Ticket className="h-5 w-5" />
            </Link>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-white/80">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-white/40" />
                <span>{format(new Date(featuredEvent.startsAt), "EEE, d MMM • h:mm a")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-white/40" />
                <span>{featuredEvent.venue}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 right-6 hidden lg:block"
        >
          <div className="flex flex-col items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 [writing-mode:vertical-lr]">
            Scroll to explore
            <div className="h-12 w-px bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Floating Glass Nav Bar */}
      <div className="absolute bottom-6 left-1/2 z-20 w-full -translate-x-1/2 px-6 sm:w-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/40 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-10 items-center justify-center rounded-full px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:text-white sm:px-6"
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
