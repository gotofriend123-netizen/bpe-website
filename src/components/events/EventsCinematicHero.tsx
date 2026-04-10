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

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const fadeSide = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" as const } },
};

export function EventsCinematicHero({ featuredEvent }: EventsCinematicHeroProps) {
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden bg-black md:min-h-[94vh]">
      {/* ─── Immersive Background ─── */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={featuredEvent.coverImage}
          alt={featuredEvent.title}
          fill
          className="object-cover opacity-55"
          priority
        />
      </motion.div>

      {/* ─── Cinematic Overlays ─── */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,0,0,0),rgba(0,0,0,0.7)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/85 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/70 to-transparent" />
        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')]" />
        {/* Animated light sweep */}
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "200%", opacity: 0.07 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatDelay: 8 }}
          className="absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-20deg]"
        />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 container mx-auto flex h-full min-h-[inherit] flex-col justify-end px-6 pb-28 pt-36 sm:pb-32 md:pb-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Badges */}
          <motion.div variants={fadeSide} className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/90 shadow-[0_0_20px_rgba(255,255,255,0.06)] backdrop-blur-xl">
              Featured Experience
            </span>
            <EventStatusBadge status={featuredEvent.availability} />
          </motion.div>

          {/* Title — Staggered character reveal effect via word split */}
          <motion.h1
            variants={fadeUp}
            className="mb-5 font-serif text-[3.2rem] font-bold leading-[0.88] tracking-[-0.05em] text-white sm:text-[5rem] lg:text-[7.5rem]"
          >
            {featuredEvent.title}
          </motion.h1>

          {/* Summary */}
          <motion.p
            variants={fadeUp}
            className="mb-8 max-w-2xl text-base leading-relaxed text-zinc-300/90 sm:text-lg md:text-xl"
          >
            {featuredEvent.summary}
          </motion.p>

          {/* CTA + Meta row */}
          <motion.div variants={fadeUp} className="grid gap-6 sm:flex sm:items-center">
            <Link
              href={`/events/${featuredEvent.slug}`}
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_0_0_rgba(255,255,255,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_50px_6px_rgba(255,255,255,0.15)]"
            >
              <span className="transition-transform duration-300 group-hover:scale-105">
                Get Tickets
              </span>
              <Ticket className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            </Link>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-white/75">
              <motion.div
                variants={scaleIn}
                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 backdrop-blur-md"
              >
                <CalendarDays className="h-4 w-4 text-white/50" />
                <span>{format(new Date(featuredEvent.startsAt), "EEE, d MMM • h:mm a")}</span>
              </motion.div>
              <motion.div
                variants={scaleIn}
                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 backdrop-blur-md"
              >
                <MapPin className="h-4 w-4 text-white/50" />
                <span>{featuredEvent.venue}</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── Scroll Indicator ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-16 right-8 hidden lg:block"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30 [writing-mode:vertical-lr]">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-10 w-px bg-gradient-to-b from-white/30 to-transparent"
            />
          </div>
        </motion.div>
      </div>

      {/* ─── Floating Glass Nav Bar ─── */}
      <div className="absolute bottom-5 left-1/2 z-20 w-full -translate-x-1/2 px-4 sm:w-auto sm:px-6">
        <motion.nav
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/10 bg-black/50 p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        >
          {NAV_ITEMS.map((item, idx) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + idx * 0.08, duration: 0.5 }}
            >
              <Link
                href={item.href}
                className="inline-flex min-h-10 items-center justify-center rounded-full px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:text-white sm:px-5"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>
      </div>

      {/* ─── Decorative Floating Elements ─── */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] top-[20%] z-[2] hidden h-32 w-32 rounded-full border border-white/[0.04] bg-white/[0.02] blur-sm lg:block"
      />
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute left-[5%] top-[35%] z-[2] hidden h-20 w-20 rounded-full border border-white/[0.03] bg-white/[0.015] blur-sm lg:block"
      />
    </section>
  );
}
