import { BellRing, Link2 } from "lucide-react";
import Link from "next/link";

import {
  WAITLIST_STATUS_META,
  formatDateLabel,
  getAdminWaitlistData,
} from "@/lib/admin/admin-dashboard";
import { updateWaitlistStatusAction } from "@/app/admin/actions";

function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption: string;
}) {
  return (
    <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{caption}</p>
    </div>
  );
}

export default async function AdminWaitlistPage() {
  const data = await getAdminWaitlistData();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active" value={data.activeCount} caption="Currently waiting on an available slot." />
        <StatCard label="Notified" value={data.notifiedCount} caption="People we have already alerted." />
        <StatCard label="Converted" value={data.convertedCount} caption="Waitlist entries that became bookings." />
        <StatCard label="Closed" value={data.closedCount} caption="Expired or manually closed entries." />
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Waitlist management
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
              Keep demand organized when spaces are fully booked.
            </h1>
          </div>
          <Link
            href="/admin/calendar"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/20 hover:bg-white hover:text-black"
          >
            <Link2 className="h-4 w-4" />
            View calendar
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {data.waitlist.map((entry) => {
            const meta = WAITLIST_STATUS_META[entry.status];

            return (
              <article
                key={entry.id}
                className="rounded-[1.75rem] border border-white/10 bg-black/25 p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
                          {entry.spaceLabel}
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                          {entry.name}
                        </h2>
                      </div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${meta.className}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Requested date</p>
                        <p className="mt-2 text-white">{formatDateLabel(entry.dateKey)}</p>
                      </div>
                      <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Contact</p>
                        <p className="mt-2 text-white">{entry.email}</p>
                        <p className="mt-1 text-sm text-zinc-400">{entry.phone}</p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Notes</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        {entry.note ?? "No note added."}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-zinc-500">
                        {entry.bookingReference
                          ? `Linked booking: ${entry.bookingReference}`
                          : "No linked booking"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full max-w-[300px]">
                    <form action={updateWaitlistStatusAction} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                      <input type="hidden" name="waitlistId" value={entry.id} />
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <BellRing className="h-4 w-4 text-zinc-400" />
                        Update status
                      </div>
                      <select
                        name="status"
                        defaultValue={entry.status}
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                      >
                        {Object.entries(WAITLIST_STATUS_META).map(([value, item]) => (
                          <option key={value} value={value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}

          {data.waitlist.length === 0 ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-6 text-center text-zinc-500">
              No waitlist entries yet.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
