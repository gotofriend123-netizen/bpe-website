import Link from "next/link";
import { ArrowRight, CalendarClock, MailCheck, Ticket } from "lucide-react";

import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { UserEventBookingCard } from "@/components/dashboard/UserEventBookingCard";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  getUserDashboardEventsPageData,
  requireDashboardUser,
} from "@/lib/dashboard/user-dashboard";

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Ticket;
}) {
  return (
    <GlowCard
      contentClassName="rounded-[1.5rem] border border-white/6 bg-[#151515] p-5 shadow-[18px_18px_36px_rgba(0,0,0,0.5),-12px_-12px_28px_rgba(255,255,255,0.025)]"
      backgroundColor="#111111"
      borderRadius={24}
      glowIntensity={0.24}
      fillOpacity={0.05}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
            {value}
          </p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-[#0b0b0b] text-white/80 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </GlowCard>
  );
}

export default async function UserDashboardEventsPage() {
  const currentUser = await requireDashboardUser();
  const {
    frameOverview,
    eventBookings,
    upcomingEventBookings,
    pastEventBookings,
  } = await getUserDashboardEventsPageData(currentUser.id);

  const confirmationSentCount = eventBookings.filter(
    (booking) => booking.confirmationEmailSent,
  ).length;

  return (
    <DashboardFrame
      currentUser={currentUser}
      overview={frameOverview}
      activeTab="events"
    >
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
              Event tickets
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              Your event confirmations, all in one place
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/55">
              Track your upcoming event plans, revisit past confirmations, and jump back into the event catalog whenever you want another night out.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#d8f24d]"
          >
            Explore events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <MetricCard
            label="Total event bookings"
            value={frameOverview.stats.eventBookings}
            icon={Ticket}
          />
          <MetricCard
            label="Upcoming events"
            value={frameOverview.stats.upcomingEventBookings}
            icon={CalendarClock}
          />
          <MetricCard
            label="Emails confirmed"
            value={confirmationSentCount}
            icon={MailCheck}
          />
        </div>

        {eventBookings.length === 0 ? (
          <DashboardEmptyState
            title="No event tickets yet."
            description="Once you book an event, the confirmation, poster, ticket tier, and venue details will appear here so you can find them quickly."
            ctaHref="/events"
            ctaLabel="Explore events"
          />
        ) : (
          <>
            {upcomingEventBookings.length > 0 ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                      Upcoming events
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/58">
                      Your next ticketed experiences are shown first so the important details stay easy to find.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {upcomingEventBookings.map((booking) => (
                    <UserEventBookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            ) : null}

            {pastEventBookings.length > 0 ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Past or inactive tickets
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/58">
                    Older event confirmations stay here for reference, including cancelled or refunded tickets.
                  </p>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {pastEventBookings.map((booking) => (
                    <UserEventBookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </DashboardFrame>
  );
}
