import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminEventComposer } from "@/components/admin/AdminEventComposer";
import { createEventListingAction } from "@/app/admin/actions";

type PostEventPageProps = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default function PostEventPage({ searchParams }: PostEventPageProps) {
  return (
    <div className="space-y-6">
      {/* Success congrats banner */}
      {searchParams?.success ? (
        <div className="rounded-[1.6rem] border border-emerald-400/15 bg-emerald-500/10 p-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/15">
            <span className="text-2xl">🎉</span>
          </div>
          <h3 className="text-xl font-semibold text-white">Congratulations!</h3>
          <p className="mt-2 text-sm text-emerald-200">
            Your event <span className="font-semibold text-white">{searchParams.success}</span> has been published successfully.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black"
            >
              View All Events
            </Link>
            <Link
              href="/events"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-zinc-200"
            >
              See Live on Site →
            </Link>
          </div>
        </div>
      ) : null}

      {searchParams?.error ? (
        <div className="rounded-[1.6rem] border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {searchParams.error}
        </div>
      ) : null}

      {!searchParams?.success ? (
        <>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/events"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all hover:bg-white hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                New Event
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
                Post an Event
              </h1>
            </div>
          </div>

          <AdminEventComposer action={createEventListingAction} />
        </>
      ) : null}
    </div>
  );
}
