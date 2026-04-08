import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Sparkles, Settings2 } from "lucide-react";

import {
  SLOT_STATUS_META,
  formatDateLabel,
  getAdminCalendarData,
  getDefaultMonthKey,
  getMonthNavigation,
} from "@/lib/admin/admin-dashboard";
import {
  setDaySlotStatusAction,
  updateSlotDetailsAction,
  updateSlotStatusAction,
} from "@/app/admin/actions";

function normalizeMonthKey(value?: string) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return getDefaultMonthKey();
  }

  return value;
}

function summaryClass(status: "available" | "limited" | "fully-booked" | "unavailable") {
  switch (status) {
    case "available":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
    case "limited":
      return "border-amber-500/20 bg-amber-500/10 text-amber-200";
    case "fully-booked":
      return "border-rose-500/20 bg-rose-500/10 text-rose-200";
    default:
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-200";
  }
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams?: { month?: string | string[] };
}) {
  const rawMonth = Array.isArray(searchParams?.month)
    ? searchParams?.month[0]
    : searchParams?.month;
  const month = normalizeMonthKey(rawMonth);
  const data = await getAdminCalendarData(month);
  const navigation = getMonthNavigation(data.monthKey);

  const totalSlots = data.spaces.reduce(
    (sum, space) => sum + space.days.reduce((daySum, day) => daySum + day.totalSlots, 0),
    0,
  );
  const availableSlots = data.spaces.reduce(
    (sum, space) => sum + space.days.reduce((daySum, day) => daySum + day.availableSlots, 0),
    0,
  );
  const bookedSlots = data.spaces.reduce(
    (sum, space) => sum + space.days.reduce((daySum, day) => daySum + day.bookedSlots, 0),
    0,
  );
  const blockedSlots = data.spaces.reduce(
    (sum, space) => sum + space.days.reduce((daySum, day) => daySum + day.blockedSlots, 0),
    0,
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Availability calendar
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            Premium slot control across VSL, VSR, and The Arcade.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Block, reopen, and fine-tune slot details while keeping buffer windows and
            peak-time pricing visible at a glance.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/admin/calendar?month=${navigation.previousMonthKey}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/20 hover:bg-white hover:text-black"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-200">
              <CalendarDays className="h-4 w-4 text-amber-300" />
              {data.monthLabel}
            </div>
            <Link
              href={`/admin/calendar?month=${navigation.nextMonthKey}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/20 hover:bg-white hover:text-black"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Total slots", value: totalSlots, caption: "Month preview across all spaces." },
            { label: "Open slots", value: availableSlots, caption: "Immediately bookable inventory." },
            { label: "Booked slots", value: bookedSlots, caption: "Locked sessions already confirmed." },
            { label: "Blocked slots", value: blockedSlots, caption: "Manually blocked or unavailable." },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.65rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {data.spaces.map((space) => (
        <section key={space.key} className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                {space.label}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                {space.name}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-200">
                <Sparkles className="h-4 w-4 text-amber-300" />
                {space.days.filter((day) => day.peakSlots > 0).length} peak days
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {space.days.map((day) => (
              <article
                key={day.dateKey}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">{day.label}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                      {formatDateLabel(day.dateKey)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${summaryClass(day.status)}`}
                  >
                    {day.status.replace("-", " ")}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-200">
                    {day.totalSlots} slots
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-200">
                    {day.bookingCount} bookings
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-200">
                    {day.peakSlots} peak
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={setDaySlotStatusAction}>
                    <input type="hidden" name="space" value={space.key} />
                    <input type="hidden" name="dateKey" value={day.dateKey} />
                    <input type="hidden" name="mode" value="open" />
                    <button
                      type="submit"
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/20 hover:bg-white hover:text-black"
                    >
                      Open day
                    </button>
                  </form>
                  <form action={setDaySlotStatusAction}>
                    <input type="hidden" name="space" value={space.key} />
                    <input type="hidden" name="dateKey" value={day.dateKey} />
                    <input type="hidden" name="mode" value="blocked" />
                    <button
                      type="submit"
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/20 hover:bg-white hover:text-black"
                    >
                      Block day
                    </button>
                  </form>
                </div>

                <div className="mt-5 space-y-3">
                  {day.slots.length === 0 ? (
                    <p className="rounded-[1.25rem] border border-white/8 bg-black/25 p-4 text-sm text-zinc-500">
                      No slots seeded for this date yet.
                    </p>
                  ) : (
                    day.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-[1.35rem] border border-white/8 bg-black/25 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {slot.startTime} to {slot.endTime}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                              {slot.statusLabel} · {slot.bookingCount} bookings
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
                              {slot.peakTime ? (
                                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-amber-200">
                                  Peak
                                </span>
                              ) : null}
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
                                {slot.bufferBefore}m before
                              </span>
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
                                {slot.bufferAfter}m after
                              </span>
                            </div>
                          </div>

                          <form action={updateSlotStatusAction} className="flex w-full flex-col gap-2 sm:w-[220px]">
                            <input type="hidden" name="slotId" value={slot.id} />
                            <select
                              name="status"
                              defaultValue={slot.status}
                              className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                            >
                              {Object.entries(SLOT_STATUS_META).map(([value, meta]) => (
                                <option key={value} value={value}>
                                  {meta.label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-zinc-100"
                            >
                              Save status
                            </button>
                          </form>
                        </div>

                        <details className="mt-4 rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-3">
                          <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                            Advanced details
                          </summary>
                          <form
                            action={updateSlotDetailsAction}
                            className="mt-4 grid gap-3 sm:grid-cols-2"
                          >
                            <input type="hidden" name="slotId" value={slot.id} />
                            <label className="space-y-2 text-sm text-zinc-300">
                              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Internal label
                              </span>
                              <input
                                name="label"
                                defaultValue={slot.label ?? ""}
                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/20"
                              />
                            </label>
                            <label className="space-y-2 text-sm text-zinc-300">
                              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Price modifier
                              </span>
                              <input
                                name="priceModifier"
                                type="number"
                                step="0.05"
                                min="1"
                                defaultValue={slot.priceModifier}
                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/20"
                              />
                            </label>
                            <label className="space-y-2 text-sm text-zinc-300">
                              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Buffer before
                              </span>
                              <input
                                name="bufferBefore"
                                type="number"
                                min="0"
                                defaultValue={slot.bufferBefore}
                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/20"
                              />
                            </label>
                            <label className="space-y-2 text-sm text-zinc-300">
                              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Buffer after
                              </span>
                              <input
                                name="bufferAfter"
                                type="number"
                                min="0"
                                defaultValue={slot.bufferAfter}
                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/20"
                              />
                            </label>
                            <label className="space-y-2 text-sm text-zinc-300 sm:col-span-2">
                              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Internal note
                              </span>
                              <textarea
                                name="note"
                                defaultValue={slot.note ?? ""}
                                rows={2}
                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/20"
                              />
                            </label>
                            <label className="space-y-2 text-sm text-zinc-300">
                              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Internal tag
                              </span>
                              <input
                                name="tag"
                                defaultValue={slot.tag ?? ""}
                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/20"
                              />
                            </label>
                            <label className="flex items-center gap-3 self-end rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-300">
                              <input
                                name="peakTime"
                                type="checkbox"
                                defaultChecked={slot.peakTime}
                                className="h-4 w-4 rounded border-white/20 bg-transparent text-white"
                              />
                              Peak time
                            </label>
                            <div className="sm:col-span-2">
                              <button
                                type="submit"
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
                              >
                                Save advanced details
                              </button>
                            </div>
                          </form>
                        </details>
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Calendar policy note
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
              Open and block controls stay aligned with the same booking rules.
            </h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-200">
            <Settings2 className="h-4 w-4 text-amber-300" />
            Buffer + peak pricing visible
          </span>
        </div>
      </section>
    </div>
  );
}
