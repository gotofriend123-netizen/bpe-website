import Link from "next/link";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { UserBookingCard } from "@/components/dashboard/UserBookingCard";

import { GlowCard } from "@/components/ui/GlowCard";
import {
  getUserDashboardOverview,
  requireDashboardUser,
  getDashboardSpaceLabel,
} from "@/lib/dashboard/user-dashboard";

export default async function UserDashboardPage() {
  const currentUser = await requireDashboardUser();
  const overview = await getUserDashboardOverview(currentUser.id);

  return (
    <DashboardFrame
      currentUser={currentUser}
      overview={overview}
      activeTab="overview"
    >
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                Overview
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                Upcoming sessions
              </h2>
            </div>
            <Link
              href="/dashboard/bookings"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white hover:text-black sm:inline-flex"
            >
              See all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {overview.upcomingBookings.length > 0 ? (
            <div className="grid gap-5">
              {overview.upcomingBookings.slice(0, 2).map((booking) => (
                <UserBookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No upcoming bookings yet."
              description="Once a booking is confirmed, it will appear here with the reference number, session details, and policy window so you can manage it quickly."
              ctaLabel="Book your first session"
            />
          )}
        </div>

        <div className="space-y-6">
          <GlowCard
            contentClassName="rounded-[1.75rem] p-6"
            backgroundColor="#08070f"
            borderRadius={28}
            glowIntensity={0.75}
            fillOpacity={0.14}
          >
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <Sparkles className="h-5 w-5 text-white/80" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                    Quick note
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    Keep your booking details handy
                  </h3>
                </div>
              </div>
              <p className="text-sm leading-7 text-white/60">
                Your booking reference, slot details, and policy eligibility are
                stored together so your next step is always clear. If your
                session falls within the policy window, cancellation and
                rescheduling controls will appear automatically.
              </p>
              <div className="rounded-[1.35rem] border border-white/8 bg-black/35 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Latest booking
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {overview.latestBooking
                    ? `${overview.latestBooking.reference} · ${getDashboardSpaceLabel(overview.latestBooking.space)}`
                    : "No bookings yet"}
                </p>
                {overview.latestBooking ? (
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
                    <Clock3 className="h-4 w-4" />
                    {overview.latestBooking.dateLabel} at {overview.latestBooking.startTime}
                  </p>
                ) : null}
              </div>
            </div>
          </GlowCard>


        </div>
      </section>
    </DashboardFrame>
  );
}
