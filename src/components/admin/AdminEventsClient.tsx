"use client";

import Link from "next/link";
import { useState } from "react";
import { format, isPast, parseISO } from "date-fns";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Clock3,
  Copy,
  DollarSign,
  Eye,
  EyeOff,
  Flame,
  Pencil,
  Plus,
  Radio,
  Sparkles,
  Ticket,
  Trash2,
} from "lucide-react";

import type { AdminEventListingRecord } from "@/lib/admin/control-center";

type AdminEventsClientProps = {
  eventListings: AdminEventListingRecord[];
  publishedCount: number;
  featuredCount: number;
  hotCount: number;
  totalRevenue: number;
  totalTickets: number;
  successMessage?: string;
  deletedMessage?: string;
  clonedMessage?: string;
  errorMessage?: string;
};

function EventRow({ event }: { event: AdminEventListingRecord }) {
  const [expanded, setExpanded] = useState(false);
  const isExpired = isPast(parseISO(event.startsAt));

  return (
    <div className="rounded-[1.4rem] border border-white/8 bg-black/25 transition-all hover:border-white/14">
      {/* Collapsed header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {event.published ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <Eye className="h-2.5 w-2.5" /> Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                <EyeOff className="h-2.5 w-2.5" /> Draft
              </span>
            )}
            {isExpired ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                <Clock3 className="h-2.5 w-2.5" /> Expired
              </span>
            ) : null}
            {event.hot ? (
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                <Flame className="mr-0.5 inline h-2.5 w-2.5" /> Hot
              </span>
            ) : null}
            {event.featured ? (
              <span className="rounded-full border border-[#6f6bff]/20 bg-[#6f6bff]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b6b4ff]">
                <Sparkles className="mr-0.5 inline h-2.5 w-2.5" /> Featured
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 break-words text-base font-semibold text-white">{event.title}</p>
          <p className="mt-0.5 text-xs text-zinc-500 break-words">
            {event.venue} · {format(parseISO(event.startsAt), "dd MMM yyyy")} · {event.bookingsCount} bookings · ₹{event.priceFrom}
          </p>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded actions */}
      {expanded ? (
        <div className="border-t border-white/6 px-4 pb-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {/* Analytics */}
            <Link
              href={`/admin/events/${event.id}?tab=analytics`}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/15 bg-blue-500/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300 transition-all hover:bg-blue-500/20"
            >
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Link>

            {/* Edit */}
            <Link
              href={`/admin/events/${event.id}?tab=edit`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-black"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>

            {/* Publish / Unpublish */}
            <form action="/admin/events" method="post">
              <input type="hidden" name="eventId" value={event.id} />
              <button
                type="submit"
                formAction={`/admin/events`}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all ${
                  event.published
                    ? "border border-rose-400/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                    : "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                }`}
              >
                {event.published ? (
                  <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
                ) : (
                  <><Eye className="h-3.5 w-3.5" /> Publish</>
                )}
              </button>
            </form>

            {/* View live */}
            {event.published ? (
              <Link
                href={`/events/${event.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-black"
              >
                <Radio className="h-3.5 w-3.5" /> View
              </Link>
            ) : null}

            {/* Clone */}
            <Link
              href={`/admin/events/${event.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-black"
            >
              <Copy className="h-3.5 w-3.5" /> Clone
            </Link>

            {/* Delete (only draft) */}
            {!event.published ? (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/15 bg-rose-500/[0.07] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400 transition-all hover:bg-rose-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminEventsClient({
  eventListings,
  publishedCount,
  featuredCount,
  hotCount,
  totalRevenue,
  totalTickets,
  successMessage,
  deletedMessage,
  clonedMessage,
  errorMessage,
}: AdminEventsClientProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* ── Feedback banners ── */}
      {successMessage ? (
        <div className="rounded-[1.6rem] border border-emerald-400/15 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
          Event listing published successfully for{" "}
          <span className="font-semibold text-white">{successMessage}</span>.
        </div>
      ) : null}
      {deletedMessage ? (
        <div className="rounded-[1.6rem] border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          Event <span className="font-semibold text-white">{deletedMessage}</span> has been deleted.
        </div>
      ) : null}
      {clonedMessage ? (
        <div className="rounded-[1.6rem] border border-white/15 bg-white/5 px-5 py-4 text-sm text-white">
          Event cloned as a draft. Find it in the list below.
        </div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-[1.6rem] border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {errorMessage}
        </div>
      ) : null}

      {/* ── Header with dropdown ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">Event Management</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">Events</h1>
        </div>

        {/* Dropdown button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Create
            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen ? (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
              {/* Menu */}
              <div className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#1a1a1a] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <Link
                  href="/admin/events/new"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    🎤
                  </span>
                  Post Event
                </Link>
                <Link
                  href="/admin/offers"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 border-t border-white/6 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    🎁
                  </span>
                  Post Offer
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Published</p>
          <p className="mt-2 text-3xl font-semibold text-white">{publishedCount}</p>
        </div>
        <div className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Featured</p>
          <p className="mt-2 text-3xl font-semibold text-white">{featuredCount}</p>
        </div>
        <div className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Hot</p>
          <p className="mt-2 text-3xl font-semibold text-white">{hotCount}</p>
        </div>
        <div className="rounded-[1.4rem] border border-emerald-400/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-4">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Revenue</p>
          </div>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="col-span-2 rounded-[1.4rem] border border-blue-400/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-4 lg:col-span-1">
          <div className="flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5 text-blue-400" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Tickets</p>
          </div>
          <p className="mt-2 text-3xl font-semibold text-blue-300">{totalTickets}</p>
        </div>
      </section>

      {/* ── Event list (collapsible rows) ── */}
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(19,19,19,0.98),rgba(11,11,11,0.94))] p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">Inventory</p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-white break-words">
              All Events ({eventListings.length})
            </h2>
          </div>
          <Link
            href="/events"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:bg-white hover:text-black"
          >
            Public page <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 space-y-2">
          {eventListings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-zinc-500">No events yet.</p>
              <Link
                href="/admin/events/new"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200"
              >
                <Plus className="h-4 w-4" /> Post Your First Event
              </Link>
            </div>
          ) : null}

          {eventListings.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
