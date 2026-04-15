import { notFound } from "next/navigation";
import Link from "next/link";
import { format, parseISO, isPast } from "date-fns";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Clock3,
  Copy,
  DollarSign,
  Eye,
  EyeOff,
  ExternalLink,
  MapPin,
  Pencil,
  Ticket,
  Trash2,
  TrendingUp,
  Users,
  Phone,
  Mail,
} from "lucide-react";

import { AdminEventComposer } from "@/components/admin/AdminEventComposer";
import {
  cloneEventAction,
  deleteEventAction,
  getEventAnalytics,
  toggleEventPublishAction,
  updateEventListingAction,
} from "@/app/admin/actions";
import { getAdminEventListingById } from "@/lib/admin/control-center";

type AdminEventDetailPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
    tab?: string;
  };
};

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  accent = "white",
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon: typeof BarChart3;
  accent?: "white" | "emerald" | "rose" | "amber" | "blue";
}) {
  const accentMap = {
    white: "border-white/10 text-white",
    emerald: "border-emerald-400/15 text-emerald-300",
    rose: "border-rose-400/15 text-rose-300",
    amber: "border-amber-400/15 text-amber-300",
    blue: "border-blue-400/15 text-blue-300",
  };

  return (
    <div className="rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,rgba(28,28,28,0.96),rgba(14,14,14,0.94))] p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accentMap[accent]} bg-white/[0.04]`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white">{value}</p>
      {subtext ? <p className="mt-1 text-sm text-zinc-500">{subtext}</p> : null}
    </div>
  );
}

export default async function AdminEventDetailPage({ params, searchParams }: AdminEventDetailPageProps) {
  const event = await getAdminEventListingById(params.id);

  if (!event) {
    notFound();
  }

  const analytics = await getEventAnalytics(event.slug);
  const isExpired = isPast(new Date(event.endsAt));
  const activeTab = searchParams?.tab ?? "analytics";

  return (
    <div className="space-y-6">
      {/* Error banner */}
      {searchParams?.error ? (
        <div className="rounded-[1.6rem] border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {searchParams.error}
        </div>
      ) : null}

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/events"
            className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all hover:bg-white hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {event.published ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  <Eye className="h-3 w-3" /> Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  <EyeOff className="h-3 w-3" /> Draft
                </span>
              )}
              {isExpired ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-300">
                  <Clock3 className="h-3 w-3" /> Expired
                </span>
              ) : null}
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                {event.categoryLabel}
              </span>
            </div>
            <h1 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
              {event.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {event.venue}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> {format(parseISO(event.startsAt), "dd MMM yyyy • h:mm a")}
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <form action={toggleEventPublishAction}>
            <input type="hidden" name="eventId" value={event.id} />
            <button
              type="submit"
              className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all sm:w-auto sm:px-4 sm:text-[11px] sm:tracking-[0.18em] ${
                event.published
                  ? "border border-rose-400/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                  : "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              }`}
            >
              {event.published ? (
                <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
              ) : (
                <><Eye className="h-3.5 w-3.5" /> Publish</>
              )}
            </button>
          </form>

          {event.published ? (
            <Link
              href={`/events/${event.slug}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-white hover:text-black sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Live
            </Link>
          ) : null}

          <form action={cloneEventAction}>
            <input type="hidden" name="eventId" value={event.id} />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-white hover:text-black sm:w-auto sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
            >
              <Copy className="h-3.5 w-3.5" /> Clone
            </button>
          </form>

          {!event.published ? (
            <form action={deleteEventAction}>
              <input type="hidden" name="eventId" value={event.id} />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-rose-500/15 bg-rose-500/[0.07] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-400 transition-all hover:bg-rose-500/20 sm:w-auto sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </form>
          ) : null}
        </div>
      </div>

      {/* Tab Navigation — horizontally scrollable on mobile */}
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex min-w-0 gap-1 rounded-[1.2rem] border border-white/8 bg-white/[0.02] p-1">
          <Link
            href={`/admin/events/${event.id}?tab=analytics`}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[0.9rem] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all sm:flex-1 sm:px-4 sm:tracking-[0.18em] ${
              activeTab === "analytics"
                ? "bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.1)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Analytics
          </Link>
          <Link
            href={`/admin/events/${event.id}?tab=customers`}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[0.9rem] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all sm:flex-1 sm:px-4 sm:tracking-[0.18em] ${
              activeTab === "customers"
                ? "bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.1)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="h-3.5 w-3.5" /> Customers
          </Link>
          <Link
            href={`/admin/events/${event.id}?tab=edit`}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[0.9rem] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all sm:flex-1 sm:px-4 sm:tracking-[0.18em] ${
              activeTab === "edit"
                ? "bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.1)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
        </div>
      </div>

      {/* ── Analytics Tab ── */}
      {activeTab === "analytics" ? (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Revenue"
              value={`₹${analytics.totalRevenue.toLocaleString("en-IN")}`}
              subtext={`${analytics.cancelledRevenue > 0 ? `₹${analytics.cancelledRevenue.toLocaleString("en-IN")} cancelled` : "No cancellations"}`}
              icon={DollarSign}
              accent="emerald"
            />
            <StatCard
              label="Tickets Sold"
              value={analytics.totalTicketsSold}
              subtext={`${analytics.confirmedBookings} confirmed bookings`}
              icon={Ticket}
              accent="blue"
            />
            <StatCard
              label="Page Views"
              value={analytics.pageViews.toLocaleString("en-IN")}
              subtext={`${analytics.conversionRate}% conversion rate`}
              icon={Eye}
              accent="amber"
            />
            <StatCard
              label="Total Bookings"
              value={analytics.totalBookings}
              subtext={`${analytics.cancelledBookings} cancelled`}
              icon={Users}
              accent="white"
            />
          </div>

          {/* Conversion insight */}
          {analytics.pageViews > 0 ? (
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-white">Conversion Insight</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {analytics.conversionRate > 5
                      ? `Strong conversion at ${analytics.conversionRate}%. This event is performing well.`
                      : analytics.conversionRate > 1
                        ? `${analytics.conversionRate}% conversion. Consider boosting visibility with featured or hot-selling tags.`
                        : `Low conversion at ${analytics.conversionRate}%. Try updating the poster, adjusting pricing, or featuring the event.`}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Recent bookings table */}
          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(19,19,19,0.98),rgba(11,11,11,0.94))] p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  Booking Activity
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
                  Recent Bookings
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {analytics.recentBookings.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                  No bookings yet for this event.
                </p>
              ) : null}

              {analytics.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-2 rounded-[1.2rem] border border-white/6 bg-white/[0.02] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{booking.customerName}</p>
                    <p className="text-xs text-zinc-500">
                      {booking.customerEmail} · {booking.ticketTierLabel} × {booking.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium text-white">
                      ₹{booking.totalAmount.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        booking.status === "confirmed"
                          ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                          : "border border-rose-400/20 bg-rose-500/10 text-rose-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {format(new Date(booking.createdAt), "dd MMM")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {/* ── Customers Tab ── */}
      {activeTab === "customers" ? (
        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(19,19,19,0.98),rgba(11,11,11,0.94))] p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Customer Directory
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
                All Customers ({analytics.recentBookings.length})
              </h2>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {analytics.recentBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">
                No customers yet for this event.
              </p>
            ) : null}

            {analytics.recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-[1.2rem] border border-white/6 bg-white/[0.02] px-5 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="text-base font-semibold text-white">{booking.customerName}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-zinc-500" />
                        {booking.customerEmail}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-zinc-500" />
                        {booking.customerPhone}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">₹{booking.totalAmount.toLocaleString("en-IN")}</p>
                      <p className="text-[11px] text-zinc-500">{booking.ticketTierLabel} × {booking.quantity}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        booking.status === "confirmed"
                          ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                          : "border border-rose-400/20 bg-rose-500/10 text-rose-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Edit Tab ── */}
      {activeTab === "edit" ? (
        <AdminEventComposer
          action={updateEventListingAction}
          initialData={event}
          eventId={event.id}
        />
      ) : null}
    </div>
  );
}
