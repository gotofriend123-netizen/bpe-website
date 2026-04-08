import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowRight, Eye, Flame, Radio, Sparkles } from "lucide-react";

import { createEventListingAction } from "@/app/admin/actions";
import { AdminEventComposer } from "@/components/admin/AdminEventComposer";
import { getAdminEventListings } from "@/lib/admin/control-center";

type AdminEventsPageProps = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default async function AdminEventsPage({ searchParams }: AdminEventsPageProps) {
  const eventListings = await getAdminEventListings();
  const featuredCount = eventListings.filter((item) => item.featured).length;
  const hotCount = eventListings.filter((item) => item.hot).length;
  const publishedCount = eventListings.filter((item) => item.published).length;

  return (
    <div className="space-y-6">
      {searchParams?.success ? (
        <div className="rounded-[1.6rem] border border-emerald-400/15 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
          Event listing published successfully for <span className="font-semibold text-white">{searchParams.success}</span>.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.6rem] border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {searchParams.error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Published</p>
          <p className="mt-3 text-4xl font-semibold text-white">{publishedCount}</p>
          <p className="mt-2 text-sm text-zinc-400">Live event listings currently visible on the public site.</p>
        </div>
        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Featured</p>
          <p className="mt-3 text-4xl font-semibold text-white">{featuredCount}</p>
          <p className="mt-2 text-sm text-zinc-400">Highlighted events pushed harder across discovery surfaces.</p>
        </div>
        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Hot</p>
          <p className="mt-3 text-4xl font-semibold text-white">{hotCount}</p>
          <p className="mt-2 text-sm text-zinc-400">Posters currently marked as hot-selling ticket drivers.</p>
        </div>
      </section>

      <AdminEventComposer action={createEventListingAction} />

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
            {eventListings.map((event) => (
              <div key={event.id} className="rounded-[1.4rem] border border-white/8 bg-black/25 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                        {event.categoryLabel}
                      </span>
                      {event.hot ? (
                        <span className="rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8f24d]">
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
                    <p className="text-lg font-semibold text-white">{event.title}</p>
                    <p className="text-sm text-zinc-400">
                      {event.venue} · {format(parseISO(event.startsAt), "dd MMM yyyy • h:mm a")}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {event.bookingsCount} bookings · Created by {event.createdByName ?? "Admin"}
                    </p>
                  </div>

                  <div className="grid gap-2 text-right">
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                      {event.availability.replaceAll("_", " ")}
                    </span>
                    <p className="text-lg font-semibold text-white">From ₹{event.priceFrom}</p>
                    <div className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {event.published ? <Eye className="h-3.5 w-3.5" /> : <Radio className="h-3.5 w-3.5" />}
                      {event.published ? "Live" : "Draft"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </section>
    </div>
  );
}
