import Link from "next/link";
import {
  CalendarDays,
  Mail,
  MapPin,
  Receipt,
  Ticket,
} from "lucide-react";

import { GlowCard } from "@/components/ui/GlowCard";
import {
  getEventBookingStatusLabel,
  getEventBookingStatusTone,
  type DashboardEventBooking,
} from "@/lib/dashboard/user-dashboard";

type UserEventBookingCardProps = {
  booking: DashboardEventBooking;
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDateParts(isoValue: string) {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date(isoValue));

  return {
    month: parts.find((part) => part.type === "month")?.value?.toUpperCase() ?? "TBA",
    day: parts.find((part) => part.type === "day")?.value ?? "--",
  };
}

export function UserEventBookingCard({ booking }: UserEventBookingCardProps) {
  const statusTone = getEventBookingStatusTone(booking.status);
  const statusLabel = getEventBookingStatusLabel(booking.status);
  const dateParts = getDateParts(booking.eventStartsAt);

  return (
    <GlowCard
      className="group h-full"
      contentClassName="relative h-full overflow-hidden rounded-[1.85rem] border border-white/6 bg-[#151515] shadow-[18px_18px_36px_rgba(0,0,0,0.5),-12px_-12px_28px_rgba(255,255,255,0.025)]"
      backgroundColor="#111111"
      borderRadius={30}
      glowIntensity={0.32}
      fillOpacity={0.05}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%),linear-gradient(180deg,rgba(15,15,15,0.35),rgba(8,8,8,0.96))]">
        {booking.posterImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={booking.posterImage}
            alt={booking.eventTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.1),rgba(6,6,6,0.78))]" />

        <div className="absolute left-4 top-4 flex items-start gap-3">
          <div className="rounded-[1rem] border border-white/12 bg-black/60 px-3 py-2 text-center shadow-[0_16px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
              {dateParts.month}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-white">
              {dateParts.day}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${statusTone}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
              {booking.eventCategory}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              {booking.eventTitle}
            </h3>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65 sm:inline-flex">
            {booking.reference}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col gap-5 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              <CalendarDays className="h-3.5 w-3.5" />
              Event time
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{booking.startsAtLabel}</p>
            <p className="mt-1 text-sm text-white/60">{booking.timeLabel}</p>
          </div>
          <div className="rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              <MapPin className="h-3.5 w-3.5" />
              Venue
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{booking.eventVenue}</p>
            <p className="mt-1 text-sm text-white/60">{booking.organizer}</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              <Ticket className="h-3.5 w-3.5" />
              Ticket tier
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{booking.ticketTierLabel}</p>
          </div>
          <div className="rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              <Receipt className="h-3.5 w-3.5" />
              Quantity
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-[1.35rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              <Receipt className="h-3.5 w-3.5" />
              Total paid
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {formatCurrency(booking.totalAmount, booking.currency)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            {booking.reference}
          </span>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
              booking.confirmationEmailSent
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/20 bg-amber-500/10 text-amber-200"
            }`}
          >
            <Mail className="mr-1.5 h-3.5 w-3.5" />
            {booking.confirmationEmailSent ? "Confirmation sent" : "Confirmation pending"}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:flex-wrap">
          <Link
            href={`/events/${booking.eventSlug}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#d8f24d]"
          >
            View event
          </Link>
          <Link
            href={`/events/confirmation?ref=${booking.reference}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white hover:text-black"
          >
            View confirmation
          </Link>
        </div>
      </div>
    </GlowCard>
  );
}
