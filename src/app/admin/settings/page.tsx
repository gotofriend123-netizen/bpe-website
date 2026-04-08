import { AlertTriangle, BellRing, Gauge, RotateCcw, Settings2 } from "lucide-react";

import {
  getAdminOverviewData,
} from "@/lib/admin/admin-dashboard";
import { updateSettingsAction } from "@/app/admin/actions";

function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{caption}</p>
    </div>
  );
}

export default async function AdminSettingsPage() {
  const data = await getAdminOverviewData();
  const settings = data.settings;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Full refund"
          value={`${settings.cancelFullRefundHours}h`}
          caption="Bookings earlier than this window stay fully flexible."
        />
        <StatCard
          label="Partial refund"
          value={`${settings.cancelPartialRefundHours}h`}
          caption="The middle window keeps reschedule support and partial refunds."
        />
        <StatCard
          label="Peak pricing"
          value={`${settings.peakPricingMultiplier.toFixed(2)}x`}
          caption="Applies to premium peak-time sessions."
        />
        <StatCard
          label="Buffers"
          value={`${settings.defaultBufferBefore} / ${settings.defaultBufferAfter}`}
          caption="Before and after buffers in minutes."
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Settings console
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            Policy-ready booking settings for the whole venue.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Keep the cancellation ladder, buffer timings, reminders, and pricing signals in
            one place so the booking flow and admin controls stay aligned.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <RotateCcw className="h-4 w-4 text-zinc-400" />
                Cancellation ladder
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                More than {settings.cancelFullRefundHours} hours: full flexibility.
                Between {settings.cancelPartialRefundHours} and {settings.cancelFullRefundHours} hours: partial refund placeholder.
                Less than {settings.cancelPartialRefundHours} hours: locked by policy.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Gauge className="h-4 w-4 text-zinc-400" />
                Slot engine
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Peak pricing, buffer windows, and waitlist handling all feed the calendar view
                and booking confirmations.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <BellRing className="h-4 w-4 text-zinc-400" />
                Reminder toggles
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Email reminders: {settings.reminderEmailEnabled ? "enabled" : "disabled"}.
                SMS reminders: {settings.reminderSmsEnabled ? "enabled" : "disabled"}.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <AlertTriangle className="h-4 w-4 text-zinc-400" />
                Operational note
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                These controls are intentionally conservative so policy changes remain easy to
                review before they reach customers.
              </p>
            </div>
          </div>
        </div>

        <form
          action={updateSettingsAction}
          className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Live settings
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
            Update the shared booking policy surface
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-300">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Full refund hours
              </span>
              <input
                name="cancelFullRefundHours"
                type="number"
                min="0"
                defaultValue={settings.cancelFullRefundHours}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-300">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Partial refund hours
              </span>
              <input
                name="cancelPartialRefundHours"
                type="number"
                min="0"
                defaultValue={settings.cancelPartialRefundHours}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-300">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Partial refund percentage
              </span>
              <input
                name="partialRefundPercentage"
                type="number"
                min="0"
                max="100"
                defaultValue={settings.partialRefundPercentage}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-300">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Peak pricing multiplier
              </span>
              <input
                name="peakPricingMultiplier"
                type="number"
                min="1"
                step="0.05"
                defaultValue={settings.peakPricingMultiplier}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-300">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Default buffer before
              </span>
              <input
                name="defaultBufferBefore"
                type="number"
                min="0"
                defaultValue={settings.defaultBufferBefore}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-300">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Default buffer after
              </span>
              <input
                name="defaultBufferAfter"
                type="number"
                min="0"
                defaultValue={settings.defaultBufferAfter}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-300 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                WhatsApp number
              </span>
              <input
                name="whatsappNumber"
                defaultValue={settings.whatsappNumber ?? ""}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/20"
                placeholder="9203411611"
              />
            </label>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-black/30 px-4 py-4 text-sm text-zinc-300">
              <input
                type="checkbox"
                name="reminderEmailEnabled"
                defaultChecked={settings.reminderEmailEnabled}
                className="h-4 w-4 rounded border-white/20 bg-transparent text-white"
              />
              Email reminders enabled
            </label>
            <label className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-black/30 px-4 py-4 text-sm text-zinc-300">
              <input
                type="checkbox"
                name="reminderSmsEnabled"
                defaultChecked={settings.reminderSmsEnabled}
                className="h-4 w-4 rounded border-white/20 bg-transparent text-white"
              />
              SMS reminders enabled
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100"
          >
            <Settings2 className="h-4 w-4" />
            Save settings
          </button>
        </form>
      </section>
    </div>
  );
}
