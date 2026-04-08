import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  Sparkles,
  Ticket,
  IndianRupee,
  History,
} from "lucide-react";

import { getAdminControlCenterData } from "@/lib/admin/control-center";
import { BOOKING_STATUS_META } from "@/lib/admin/admin-dashboard";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string) {
  return format(parseISO(value), "dd MMM • h:mm a");
}

function StatCard({
  label,
  value,
  caption,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  caption: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
}) {
  const Icon = icon;

  return (
    <div className="rounded-[1.8rem] border border-white/6 bg-[#151515] p-5 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.52),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            {label}
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
            {value}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{caption}</p>
        </div>
        <div className={`rounded-2xl p-[1px] ${accent}`}>
          <div className="rounded-2xl bg-[#0b0b0b] p-3 text-white shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)]">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/6 bg-[#151515] p-6 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.52),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ActivityChart({
  data,
}: {
  data: Array<{ label: string; studioBookings: number; eventTickets: number }>;
}) {
  const width = 560;
  const height = 240;
  const padding = 20;
  const maxValue = Math.max(
    2,
    ...data.flatMap((point) => [point.studioBookings, point.eventTickets]),
  );

  const pointX = (index: number) =>
    padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
  const pointY = (value: number) =>
    height - padding - ((height - padding * 2) * value) / maxValue;

  const buildPath = (values: number[]) =>
    values
      .map((value, index) => `${index === 0 ? "M" : "L"} ${pointX(index)} ${pointY(value)}`)
      .join(" ");

  const studioPath = buildPath(data.map((point) => point.studioBookings));
  const eventPath = buildPath(data.map((point) => point.eventTickets));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.24em] text-zinc-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d8f24d]" />
          Studio bookings
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#6f6bff]" />
          Event tickets
        </span>
      </div>

      <div className="overflow-hidden rounded-[1.6rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[240px] w-full">
          {[0, 1, 2, 3].map((line) => {
            const y = padding + ((height - padding * 2) * line) / 3;
            return (
              <line
                key={line}
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 8"
              />
            );
          })}

          <path
            d={studioPath}
            fill="none"
            stroke="#d8f24d"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d={eventPath}
            fill="none"
            stroke="#6f6bff"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {data.map((point, index) => (
            <g key={point.label}>
              <circle cx={pointX(index)} cy={pointY(point.studioBookings)} r="4.5" fill="#d8f24d" />
              <circle cx={pointX(index)} cy={pointY(point.eventTickets)} r="4.5" fill="#6f6bff" />
              <text
                x={pointX(index)}
                y={height - 2}
                fill="rgba(255,255,255,0.55)"
                fontSize="12"
                textAnchor="middle"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function EventMixChart({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const total = Math.max(1, data.reduce((sum, item) => sum + item.value, 0));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
      <div className="flex h-52 items-center justify-center rounded-[1.6rem] border border-white/5 bg-[#0b0b0b] shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
        <svg viewBox="0 0 220 220" className="h-52 w-52">
          <circle cx="110" cy="110" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="24" />
          {data.map((item) => {
            const length = (item.value / total) * circumference;
            const dashoffset = circumference - offset;
            offset += length;

            return (
              <circle
                key={item.label}
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={dashoffset}
                transform="rotate(-90 110 110)"
              />
            );
          })}
          <circle cx="110" cy="110" r="52" fill="black" />
          <text x="110" y="103" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="12" letterSpacing="3">
            LIVE MIX
          </text>
          <text x="110" y="128" textAnchor="middle" fill="white" fontSize="26" fontWeight="700">
            {total}
          </text>
        </svg>
      </div>

      <div className="grid flex-1 gap-3">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-[1.2rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]"
          >
            <span className="inline-flex items-center gap-3 text-sm text-white">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <span className="text-sm font-semibold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  caption,
}: {
  href: string;
  label: string;
  caption: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[1.4rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:text-[#d8f24d]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">{caption}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-[#d8f24d] transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export default async function AdminOverviewPage() {
  const data = await getAdminControlCenterData();
  const featuredOffers = data.offers.slice(0, 4);
  const featuredEvents = data.eventListings.slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Income"
          value={formatCurrency(data.stats.totalEventIncome)}
          caption="Total ticket volume processed."
          icon={IndianRupee}
          accent="bg-gradient-to-br from-[#d8f24d] via-[#b4cc3c] to-[#728211]"
        />
        <StatCard
          label="Past Events"
          value={data.stats.pastEventsCount}
          caption="Archived and expired events."
          icon={History}
          accent="bg-gradient-to-br from-[#ff8a5c] via-[#d45b31] to-[#7e2614]"
        />
        <StatCard
          label="Studio bookings"
          value={data.stats.studioBookings}
          caption="Hall and studio reservations tracked across the venue pipeline."
          icon={CalendarDays}
          accent="bg-gradient-to-br from-[#d8f24d] via-[#b4cc3c] to-[#728211]"
        />
        <StatCard
          label="Event tickets"
          value={data.stats.eventTickets}
          caption="All event bookings processed through the dedicated events module."
          icon={Ticket}
          accent="bg-gradient-to-br from-[#6f6bff] via-[#514fe0] to-[#2d2b80]"
        />
        <StatCard
          label="Published events"
          value={data.stats.publishedEvents}
          caption="Admin-created listings that are live across discovery and detail routes."
          icon={Sparkles}
          accent="bg-gradient-to-br from-[#ff8a5c] via-[#d45b31] to-[#7e2614]"
        />
        <StatCard
          label="Active offers"
          value={data.stats.activeOffers}
          caption="Live promotional offers available for conversions."
          icon={BadgePercent}
          accent="bg-gradient-to-br from-[#5ad5b0] via-[#2f9b7b] to-[#155848]"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel
          eyebrow="Activity Over Time"
          title="Bookings and event demand in one clean timeline"
          action={
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-300">
              Last 6 months
            </span>
          }
        >
          <ActivityChart data={data.activity} />
        </Panel>

        <Panel
          eyebrow="Events By Type"
          title="Current event mix across the live catalog"
        >
          <EventMixChart data={data.eventMix} />
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Panel
          eyebrow="Command Deck"
          title="Publish, manage, and steer the platform without leaving the admin suite"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <QuickLink
              href="/admin/events#publish-form"
              label="Post an event"
              caption="Launch a new public event with poster, category, and ticket data."
            />
            <QuickLink
              href="/admin/offers#publish-form"
              label="Post an offer"
              caption="Push special deals and event-linked promos from one admin-only route."
            />
            <QuickLink
              href="/admin/bookings"
              label="Manage studio bookings"
              caption="Update booking states, notes, tags, and policy-sensitive actions."
            />
            <QuickLink
              href="/admin/calendar"
              label="Control calendar"
              caption="Block slots, adjust availability, and tune peak-time flow."
            />
          </div>
        </Panel>

        <Panel eyebrow="System Pulse" title="Live capacity and guest-intent checkpoints">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.35rem] border border-white/8 bg-black/25 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Open slots
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">{data.stats.openSlots}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Immediately bookable studio and hall slots still available.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-white/8 bg-black/25 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Active waitlist
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">{data.stats.activeWaitlist}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Guests currently waiting for capacity to reopen on booked-out dates.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-white/8 bg-black/25 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Admin-only posting
              </p>
              <p className="mt-2 text-lg font-semibold text-white">Locked to admins</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Event and offer creation routes live only inside the protected admin suite.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-white/8 bg-black/25 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Surface coverage
              </p>
              <p className="mt-2 text-lg font-semibold text-white">Studio + Events</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                One dashboard for bookings, events, offers, and venue operations.
              </p>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel
          eyebrow="Recent Studio Bookings"
          title="Latest venue reservations"
          action={
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:border-white/20 hover:bg-white hover:text-black"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="space-y-3">
            {data.recentStudioBookings.map((booking) => (
              (() => {
                const meta = BOOKING_STATUS_META[booking.status as keyof typeof BOOKING_STATUS_META];

                return (
                  <div
                    key={booking.id}
                    className="rounded-[1.4rem] border border-white/8 bg-black/25 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{booking.reference}</p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {booking.customerName} · {booking.space}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                          {booking.dateKey}
                        </p>
                      </div>
                      <span
                        className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${meta.className}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                  </div>
                );
              })()
            ))}
          </div>
        </Panel>

        <Panel
          eyebrow="Recent Event Orders"
          title="Latest event ticket confirmations"
          action={
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:border-white/20 hover:bg-white hover:text-black"
            >
              View public events
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="space-y-3">
            {data.recentEventBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-[1.4rem] border border-white/8 bg-black/25 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{booking.eventTitle}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {booking.customerName} · {booking.quantity} tickets
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {booking.reference}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {booking.status.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel
          eyebrow="Published Events"
          title="Live event listings under admin control"
          action={
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d8f24d] transition-all hover:border-[#d8f24d]/35 hover:bg-[#d8f24d] hover:text-black"
            >
              Manage events
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="space-y-3">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-[1.45rem] border border-white/8 bg-black/25 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {event.hot ? (
                        <span className="rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8f24d]">
                          Hot
                        </span>
                      ) : null}
                      {event.featured ? (
                        <span className="rounded-full border border-[#6f6bff]/20 bg-[#6f6bff]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b6b4ff]">
                          Featured
                        </span>
                      ) : null}
                      {!event.published ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                          Draft
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-lg font-semibold text-white">{event.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {event.categoryLabel} · {event.venue}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {formatDateTime(event.startsAt)}
                    </p>
                  </div>
                  <div className="grid gap-2 text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(event.priceFrom)}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {event.bookingsCount} bookings
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          eyebrow="Live Offers"
          title="Current offer stack"
          action={
            <Link
              href="/admin/offers"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:border-white/20 hover:bg-white hover:text-black"
            >
              Manage offers
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="space-y-3">
            {featuredOffers.length > 0 ? (
              featuredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-[1.45rem] border border-white/8 bg-black/25 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-white">{offer.title}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{offer.summary}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                        {offer.venue || "Venue-wide"} · {offer.status}
                      </p>
                    </div>
                    {offer.discountLabel ? (
                      <span className="rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8f24d]">
                        {offer.discountLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/25 p-5 text-sm leading-7 text-zinc-400">
                No offers have been published yet. Use the Post Offer flow to add launch-ready promos and campaign support.
              </div>
            )}
          </div>
        </Panel>
      </section>
    </div>
  );
}
