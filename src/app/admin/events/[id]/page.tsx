import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminEventComposer } from "@/components/admin/AdminEventComposer";
import { updateEventListingAction } from "@/app/admin/actions";
import { getAdminEventListingById } from "@/lib/admin/control-center";

type AdminEventEditPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
  };
};

export default async function AdminEventEditPage({ params, searchParams }: AdminEventEditPageProps) {
  const event = await getAdminEventListingById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {searchParams?.error ? (
        <div className="rounded-[1.6rem] border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {searchParams.error}
        </div>
      ) : null}

      <div className="flex items-center gap-4">
        <Link
          href="/admin/events"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all hover:bg-white hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
            Editing
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
            {event.title}
          </h1>
        </div>
      </div>

      <AdminEventComposer
        action={updateEventListingAction}
        initialData={event}
        eventId={event.id}
      />
    </div>
  );
}
