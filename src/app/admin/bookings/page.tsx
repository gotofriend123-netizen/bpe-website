import Link from "next/link";
import {
  ArrowRight,
  Ban,
  CalendarSync,
  Eye,
  LayoutDashboard,
  Save,
} from "lucide-react";

import {
  BOOKING_STATUS_META,
  formatDateLabel,
  getAdminBookingsData,
} from "@/lib/admin/admin-dashboard";
import {
  cancelAdminBookingAction,
  rescheduleAdminBookingAction,
  updateBookingStatusAction,
} from "@/app/admin/actions";

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

type SearchParams = {
  updated?: string;
  action?: string;
  error?: string;
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const data = await getAdminBookingsData();

  return (
    <div className="space-y-8 pt-6 lg:pt-10">
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
          {searchParams.error}
        </div>
      ) : null}

      {searchParams?.updated ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/75">
          Booking {searchParams.updated}{" "}
          {searchParams.action === "rescheduled"
            ? "rescheduled"
            : searchParams.action === "cancelled"
              ? "cancelled"
              : "updated"}{" "}
          successfully. The admin list reflects the latest slot state.
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total bookings" value={data.stats.totalBookings} caption="Every booking record in the database." />
        <StatCard label="Confirmed" value={data.stats.confirmedBookings} caption="Bookings already locked in for clients." />
        <StatCard label="Pending" value={data.stats.pendingBookings} caption="Requests waiting on approval or resolution." />
        <StatCard label="Rescheduled" value={data.stats.rescheduledBookings} caption="Bookings that moved to a new slot." />
      </section>

      <section className="flex flex-col gap-4">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Booking operations
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                Status, notes, and tag management
              </h1>
            </div>
            <Link
              href="/admin/calendar"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:border-white/20 hover:bg-white hover:text-black"
            >
              Go to calendar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {data.bookings.map((booking) => (
              <details
                key={booking.id}
                className="group overflow-hidden rounded-[1.85rem] border border-white/10 bg-black/25 transition-all open:pb-5"
              >
                <summary className="flex list-none cursor-pointer flex-col justify-between gap-4 p-5 outline-none hover:bg-white/[0.02] sm:flex-row sm:items-center [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
                      {booking.reference}
                    </p>
                    <h2 className="mt-1 break-words text-2xl font-semibold tracking-[-0.03em] text-white [overflow-wrap:anywhere]">
                      {booking.customerName}
                    </h2>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center justify-center rounded-full border px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] ${BOOKING_STATUS_META[booking.status].className}`}
                  >
                    {BOOKING_STATUS_META[booking.status].label}
                  </span>
                </summary>

                <div className="mt-1 grid gap-6 border-t border-white/5 px-4 pt-5 sm:px-5 sm:pt-6 lg:grid-cols-[1.45fr_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.75fr)_minmax(0,390px)]">
                  <div className="min-w-0 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Session
                        </p>
                        <p className="mt-2 text-white">
                          {booking.spaceLabel} · {formatDateLabel(booking.dateKey)}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {booking.startTime} to {booking.endTime}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Customer
                        </p>
                        <p className="mt-2 break-words [overflow-wrap:anywhere] text-white">
                          {booking.customerEmail}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">{booking.customerPhone}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                          {booking.userName ? `Linked to ${booking.userName}` : "Guest booking"}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="min-w-0 space-y-4 lg:sticky lg:top-28 lg:self-start">
                    <form action={updateBookingStatusAction} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <LayoutDashboard className="h-4 w-4 text-zinc-400" />
                        Booking status
                      </div>
                      <div className="mt-3 flex flex-col gap-3 xl:flex-row">
                        <select
                          name="status"
                          defaultValue={booking.status}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                        >
                          {Object.entries(BOOKING_STATUS_META).map(([value, meta]) => (
                            <option key={value} value={value}>
                              {meta.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </button>
                      </div>
                    </form>



                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                      <form action={cancelAdminBookingAction} className="flex h-full min-w-0 flex-col rounded-[1.4rem] border border-rose-500/20 bg-rose-500/10 p-4">
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <div className="flex items-center gap-2 text-sm font-semibold text-rose-100">
                          <Ban className="h-4 w-4" />
                          Cancel booking
                        </div>
                        <p className="mt-2 text-sm leading-6 text-rose-50/80">
                          {booking.canCancel
                            ? "Cancel this reservation and reopen the connected slot immediately."
                            : booking.actionMessage}
                        </p>
                        <button
                          type="submit"
                          disabled={!booking.canCancel}
                          className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Ban className="h-4 w-4" />
                          Cancel booking
                        </button>
                      </form>

                      <form action={rescheduleAdminBookingAction} className="flex h-full min-w-0 flex-col rounded-[1.4rem] border border-sky-500/20 bg-sky-500/10 p-4">
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <div className="flex items-center gap-2 text-sm font-semibold text-sky-100">
                          <CalendarSync className="h-4 w-4" />
                          Reschedule booking
                        </div>
                        <p className="mt-2 text-sm leading-6 text-sky-50/80">
                          {booking.canReschedule
                            ? "Choose a valid future slot in the same space and move the booking safely."
                            : booking.actionMessage}
                        </p>
                        <select
                          name="slotId"
                          defaultValue={booking.rescheduleOptions[0]?.id ?? ""}
                          disabled={!booking.canReschedule || booking.rescheduleOptions.length === 0}
                          className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {booking.rescheduleOptions.length > 0 ? (
                            booking.rescheduleOptions.map((slot) => (
                              <option key={slot.id} value={slot.id}>
                                {slot.dateKey} · {slot.startTime} - {slot.endTime}
                                {slot.peakTime ? " · Peak" : ""}
                                {slot.label ? ` · ${slot.label}` : ""}
                              </option>
                            ))
                          ) : (
                            <option value="">No slot available</option>
                          )}
                        </select>
                        <button
                          type="submit"
                          disabled={!booking.canReschedule || booking.rescheduleOptions.length === 0}
                          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <CalendarSync className="h-4 w-4" />
                          Reschedule booking
                        </button>
                      </form>
                    </div>

                    <Link
                      href={`/booking/manage?ref=${booking.reference}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
                    >
                      <Eye className="h-4 w-4" />
                      View details
                    </Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
