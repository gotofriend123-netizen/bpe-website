import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Mail,
  MapPin,
  Receipt,
  Ticket,
} from "lucide-react";

import {
  getEventBookingStatusLabel,
  getEventBookingStatusTone,
  type DashboardEventBooking,
} from "@/lib/dashboard/user-dashboard";

type UserEventBookingAccordionCardProps = {
  booking: DashboardEventBooking;
  defaultOpen?: boolean;
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

export function UserEventBookingAccordionCard({
  booking,
  defaultOpen = false,
}: UserEventBookingAccordionCardProps) {
  const statusTone = getEventBookingStatusTone(booking.status);
  const statusLabel = getEventBookingStatusLabel(booking.status);
  const dateParts = getDateParts(booking.eventStartsAt);

  return (
    <details
      className="group overflow-hidden rounded-[1.8rem] border border-white/8 bg-[#141414] shadow-[18px_18px_36px_rgba(0,0,0,0.48),-10px_-10px_24px_rgba(255,255,255,0.02)]"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none flex-col gap-4 p-4 outline-none transition-colors hover:bg-white/[0.02] sm:p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex gap-4">
          <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(15,15,15,0.35),rgba(8,8,8,0.96))]">
            {booking.posterImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={booking.posterImage}
                alt={booking.eventTitle}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.12),rgba(6,6,6,0.82))]" />
            <div className="absolute left-2 top-2 rounded-[0.9rem] border border-white/12 bg-black/60 px-2 py-1 text-center shadow-[0_16px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
                {dateParts.month}
              </p>
              <p className="mt-0.5 text-lg font-semibold tracking-[-0.05em] text-white">
                {dateParts.day}
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${statusTone}`}
              >
                {statusLabel}
              </span>
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                {booking.reference}
              </span>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                {booking.eventCategory}
              </p>
              <h3 className="mt-2 break-words text-xl font-semibold tracking-[-0.04em] text-white [overflow-wrap:anywhere]">
                {booking.eventTitle}
              </h3>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-[1rem] border border-white/6 bg-black/30 px-3 py-2.5">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/38">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Date
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white">{booking.startsAtLabel}</p>
              </div>
              <div className="rounded-[1rem] border border-white/6 bg-black/30 px-3 py-2.5">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/38">
                  <MapPin className="h-3.5 w-3.5" />
                  Venue
                </p>
                <p className="mt-1.5 truncate text-sm font-semibold text-white">{booking.eventVenue}</p>
              </div>
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 transition-colors group-open:text-white">
          Tap to view details
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
        </span>
      </summary>

      <div className="border-t border-white/6 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-white/6 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                <CalendarDays className="h-3.5 w-3.5" />
                Event time
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{booking.startsAtLabel}</p>
              <p className="mt-1 text-sm text-white/58">{booking.timeLabel}</p>
            </div>

            <div className="rounded-[1.2rem] border border-white/6 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                <MapPin className="h-3.5 w-3.5" />
                Venue
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{booking.eventVenue}</p>
              <p className="mt-1 text-sm text-white/58">{booking.organizer}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.2rem] border border-white/6 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                <Ticket className="h-3.5 w-3.5" />
                Ticket tier
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{booking.ticketTierLabel}</p>
            </div>

            <div className="rounded-[1.2rem] border border-white/6 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                <Receipt className="h-3.5 w-3.5" />
                Quantity
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-white/6 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                <Receipt className="h-3.5 w-3.5" />
                Total paid
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {formatCurrency(booking.totalAmount, booking.currency)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
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

          <div className="flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:flex-wrap">
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
      </div>
    </details>
  );
}
