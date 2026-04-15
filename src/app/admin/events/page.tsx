import Link from "next/link";
import { format, isPast, parseISO } from "date-fns";
import {
  ArrowRight,
  BarChart3,
  Clock3,
  Copy,
  DollarSign,
  Eye,
  EyeOff,
  Flame,
  Pencil,
  Radio,
  Sparkles,
  Ticket,
  Trash2,
} from "lucide-react";

import {
  cloneEventAction,
  createEventListingAction,
  deleteEventAction,
  toggleEventPublishAction,
} from "@/app/admin/actions";
import { AdminEventComposer } from "@/components/admin/AdminEventComposer";
import { getAdminEventListings } from "@/lib/admin/control-center";
import { prisma } from "@/lib/prisma";

type AdminEventsPageProps = {
  searchParams?: {
    success?: string;
    error?: string;
    deleted?: string;
    cloned?: string;
  };
};

export default async function AdminEventsPage({ searchParams }: AdminEventsPageProps) {
  const [eventListings, revenueAggregate] = await Promise.all([
    getAdminEventListings(),
    prisma.eventBooking.aggregate({
      where: { status: "confirmed" },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
  ]);

  const featuredCount = eventListings.filter((item) => item.featured).length;
  const hotCount = eventListings.filter((item) => item.hot).length;
  const publishedCount = eventListings.filter((item) => item.published).length;
  const totalRevenue = revenueAggregate._sum.totalAmount ?? 0;
  const totalTickets = revenueAggregate._count._all;

  return (
    <div className="space-y-6">
      {/* ── Feedback banners ── */}
      {searchParams?.success ? (
        <div className="rounded-[1.6rem] border border-emerald-400/15 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
          Event listing published successfully for{" "}
          <span className="font-semibold text-white">{searchParams.success}</span>.
        </div>
      ) : null}
      {searchParams?.deleted ? (
        <div className="rounded-[1.6rem] border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          Event <span className="font-semibold text-white">{searchParams.deleted}</span> has been deleted.
        </div>
      ) : null}
      {searchParams?.cloned ? (
        <div className="rounded-[1.6rem] border border-white/15 bg-white/5 px-5 py-4 text-sm text-white">
          Event cloned as a draft. Find it in the list below.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.6rem] border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {searchParams.error}
        </div>
      ) : null}

      {/* ── Stats ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Published</p>
          <p className="mt-3 text-4xl font-semibold text-white">{publishedCount}</p>
          <p className="mt-2 text-sm text-zinc-400">Live on public site</p>
        </div>
        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Featured</p>
          <p className="mt-3 text-4xl font-semibold text-white">{featuredCount}</p>
          <p className="mt-2 text-sm text-zinc-400">Discovery surfaces</p>
        </div>
        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Hot</p>
          <p className="mt-3 text-4xl font-semibold text-white">{hotCount}</p>
          <p className="mt-2 text-sm text-zinc-400">Hot-selling drivers</p>
        </div>
        <div className="rounded-[1.6rem] border border-emerald-400/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Total Revenue</p>
          </div>
          <p className="mt-3 text-4xl font-semibold text-emerald-300">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-sm text-zinc-400">From confirmed bookings</p>
        </div>
        <div className="rounded-[1.6rem] border border-blue-400/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-blue-400" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Tickets Sold</p>
          </div>
          <p className="mt-3 text-4xl font-semibold text-blue-300">{totalTickets}</p>
          <p className="mt-2 text-sm text-zinc-400">Across all events</p>
        </div>
      </section>

      {/* ── Create new event ── */}
      <AdminEventComposer action={createEventListingAction} />

      {/* ── Event listings with actions ── */}
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(19,19,19,0.98),rgba(11,11,11,0.94))] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Live inventory
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Event listings under admin control
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:border-white/20 hover:bg-white hover:text-black"
          >
            Open events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {eventListings.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">No event listings yet. Create one above.</p>
          ) : null}

          {eventListings.map((event) => {
            const isExpired = isPast(parseISO(event.startsAt));

            return (
              <div
                key={event.id}
                className="rounded-[1.4rem] border border-white/8 bg-black/25 p-4 transition-all hover:border-white/14"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left — event info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2">
                      {/* Publish status badge */}
                      {event.published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                          <Eye className="h-3 w-3" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                      {isExpired ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-300">
                          <Clock3 className="h-3 w-3" />
                          Expired
                        </span>
                      ) : null}
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                        {event.categoryLabel}
                      </span>
                      {event.hot ? (
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                          <Flame className="mr-1 inline h-3 w-3" />
                          Hot
                        </span>
                      ) : null}
                      {event.featured ? (
                        <span className="rounded-full border border-[#6f6bff]/20 bg-[#6f6bff]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b6b4ff]">
                          <Sparkles className="mr-1 inline h-3 w-3" />
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <p className="text-lg font-semibold text-white truncate">{event.title}</p>
                    <p className="text-sm text-zinc-400">
                      {event.venue} · {format(parseISO(event.startsAt), "dd MMM yyyy • h:mm a")}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {event.bookingsCount} bookings · ₹{event.priceFrom} from · Created by {event.createdByName ?? "Admin"}
                    </p>
                  </div>

                  {/* Right — action buttons */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end lg:gap-2">
                    {/* Analytics */}
                    <Link
                      href={`/admin/events/${event.id}?tab=analytics`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/15 bg-blue-500/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300 transition-all hover:bg-blue-500/20"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      Analytics
                    </Link>

                    {/* Publish / Unpublish */}
                    <form action={toggleEventPublishAction}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all ${
                          event.published
                            ? "border border-rose-400/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                            : "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                        }`}
                      >
                        {event.published ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            Publish
                          </>
                        )}
                      </button>
                    </form>

                    {/* Edit */}
                    <Link
                      href={`/admin/events/${event.id}?tab=edit`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-black"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>

                    {/* View live page (only if published) */}
                    {event.published ? (
                      <Link
                        href={`/events/${event.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-black"
                      >
                        <Radio className="h-3.5 w-3.5" />
                        View
                      </Link>
                    ) : null}

                    {/* Clone */}
                    <form action={cloneEventAction}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-black"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Clone
                      </button>
                    </form>

                    {/* Delete (only draft or archive) */}
                    {!event.published ? (
                      <form action={deleteEventAction}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/15 bg-rose-500/[0.07] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400 transition-all hover:bg-rose-500/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
