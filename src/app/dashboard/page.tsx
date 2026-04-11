import Link from "next/link";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { UserBookingCard } from "@/components/dashboard/UserBookingCard";

import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/utils";
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
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
              Overview
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              Upcoming sessions
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/55">
              Your next booking is always shown first so the important actions stay easy to reach.
            </p>
          </div>
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white hover:text-black sm:self-auto"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {overview.upcomingBookings.length > 0 ? (
          <div
            className={cn(
              "grid gap-5",
              overview.upcomingBookings.length > 1 && "2xl:grid-cols-2",
            )}
          >
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

        <GlowCard
          contentClassName="rounded-[1.75rem] p-6"
          backgroundColor="#08070f"
          borderRadius={28}
          glowIntensity={0.75}
          fillOpacity={0.12}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <Sparkles className="h-5 w-5 text-white/80" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                  Latest booking
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  {overview.latestBooking
                    ? `${overview.latestBooking.reference} · ${getDashboardSpaceLabel(overview.latestBooking.space)}`
                    : "No bookings yet"}
                </h3>
                <p className="mt-2 text-sm leading-7 text-white/60">
                  Keep this reference handy if you need to cancel, reschedule, or contact support.
                </p>
              </div>
            </div>

            {overview.latestBooking ? (
              <div className="rounded-[1.35rem] border border-white/8 bg-black/35 px-4 py-3 lg:min-w-[18rem]">
                <p className="flex items-center gap-2 text-sm text-white/55">
                  <Clock3 className="h-4 w-4" />
                  {overview.latestBooking.dateLabel} at {overview.latestBooking.startTime}
                </p>
              </div>
            ) : null}
          </div>
        </GlowCard>
      </section>
    </DashboardFrame>
  );
}
