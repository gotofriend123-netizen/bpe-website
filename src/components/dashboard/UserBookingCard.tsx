import Link from "next/link";
import {
  Ban,
  CalendarDays,
  Clock3,
  Hash,
  Mail,
  MapPin,
  MessageCircle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { RescheduleBookingDialog } from "@/components/dashboard/RescheduleBookingDialog";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  getBookingStatusLabel,
  getBookingStatusTone,
  getDashboardSpaceLabel,
  type DashboardBooking,
} from "@/lib/dashboard/user-dashboard";
import { BUSINESS_SUPPORT_EMAIL } from "@/lib/business/contact";

type UserBookingCardProps = {
  booking: DashboardBooking;
};

function formatPolicyCopy(booking: DashboardBooking) {
  if (booking.status === "cancelled" || booking.status === "rescheduled" || booking.status === "no-show") {
    return "This booking is no longer eligible for cancellation or rescheduling as per policy.";
  }

  return booking.actionMessage;
}

export function UserBookingCard({ booking }: UserBookingCardProps) {
  const spaceLabel = getDashboardSpaceLabel(booking.space);
  const statusTone = getBookingStatusTone(booking.status);
  const statusLabel = getBookingStatusLabel(booking.status);
  const policyCopy = formatPolicyCopy(booking);
  const eligibleActions = booking.canCancel || booking.canReschedule;

  return (
    <GlowCard
      className="group h-full"
      contentClassName="relative h-full overflow-hidden rounded-[1.85rem] border border-white/6 bg-[#151515] p-6 shadow-[18px_18px_36px_rgba(0,0,0,0.5),-12px_-12px_28px_rgba(255,255,255,0.025)] sm:p-7"
      backgroundColor="#111111"
      borderRadius={30}
      glowIntensity={0.3}
      fillOpacity={0.05}
    >
      <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/[0.03] blur-3xl transition-colors group-hover:bg-white/[0.05]" />

      <div className="relative z-10 flex h-full flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${statusTone}`}
          >
            {statusLabel}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            <Hash className="h-3.5 w-3.5" />
            {booking.reference}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                {spaceLabel}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {booking.packageLabel ?? "Private booking"}
                {booking.specificStudio ? ` · ${booking.specificStudio}` : ""}
              </p>
            </div>
            {booking.priceModifier && booking.priceModifier > 1 ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
                <Sparkles className="h-3.5 w-3.5" />
                Peak pricing
              </span>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                <CalendarDays className="h-3.5 w-3.5" />
                Session date
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {booking.dateLabel}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                <Clock3 className="h-3.5 w-3.5" />
                Session time
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {booking.startTime} - {booking.endTime}
              </p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="min-w-0 rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                <MapPin className="h-3.5 w-3.5" />
                Selected slot
              </p>
              <p className="mt-2 text-sm font-medium text-white/80">
                {booking.slot
                  ? `${booking.slot.label ?? "Standard"} · ${booking.slot.bufferBefore}m / ${booking.slot.bufferAfter}m buffer`
                  : "Slot stored in booking record"}
              </p>
            </div>
            <div className="min-w-0 rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                <Mail className="h-3.5 w-3.5" />
                Booking contact
              </p>
              <p className="mt-2 break-words text-sm font-medium text-white/80 [overflow-wrap:anywhere]">
                {booking.customerEmail}
              </p>
              <p className="mt-1 break-all text-sm text-white/55 [overflow-wrap:anywhere]">
                {booking.customerPhone}
              </p>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              <ShieldAlert className="h-3.5 w-3.5" />
              Policy window
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              {policyCopy}
            </p>
          </div>

          {booking.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {booking.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:flex-wrap">
          <Link
            href={`/dashboard/bookings?view=${booking.id}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white hover:text-black"
          >
            <Sparkles className="h-4 w-4" />
            View details
          </Link>

          {eligibleActions ? (
            <>
              {booking.canReschedule ? <RescheduleBookingDialog booking={booking} /> : null}
              {booking.canCancel ? (
                <Link
                  href={`/dashboard/cancel?id=${booking.id}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/15"
                >
                  <Ban className="h-4 w-4" />
                  Cancel booking
                </Link>
              ) : null}
            </>
          ) : null}

          <a
            href={`mailto:${BUSINESS_SUPPORT_EMAIL}?subject=Booking%20help%20${booking.reference}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white hover:text-black"
          >
            <MessageCircle className="h-4 w-4" />
            Contact support
          </a>
        </div>
      </div>
    </GlowCard>
  );
}
