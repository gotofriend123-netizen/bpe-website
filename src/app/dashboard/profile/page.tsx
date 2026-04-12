import Link from "next/link";
import { ArrowRight, CalendarDays, Mail, UserRound } from "lucide-react";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  getDashboardSpaceLabel,
  getUserDashboardFrameData,
  requireDashboardUser,
} from "@/lib/dashboard/user-dashboard";

export default async function UserProfilePage() {
  const currentUser = await requireDashboardUser();
  const overview = await getUserDashboardFrameData(currentUser.id);

  return (
    <DashboardFrame
      currentUser={currentUser}
      overview={overview}
      activeTab="profile"
    >
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlowCard
          contentClassName="rounded-[1.75rem] p-6 sm:p-8"
          backgroundColor="#08070f"
          borderRadius={28}
          glowIntensity={0.75}
          fillOpacity={0.14}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <UserRound className="h-5 w-5 text-white/80" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                  Profile basics
                </p>
                <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-white">
                  Account snapshot
                </h2>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Name
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {currentUser.name}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Email
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {currentUser.email}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Role
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {currentUser.role}
                </p>
              </div>
            </div>
          </div>
        </GlowCard>

        <div className="space-y-6">
          <GlowCard
            contentClassName="rounded-[1.75rem] p-6 sm:p-8"
            backgroundColor="#08070f"
            borderRadius={28}
            glowIntensity={0.75}
            fillOpacity={0.14}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <CalendarDays className="h-5 w-5 text-white/80" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                  Account activity
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Booking and waitlist overview
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  Bookings
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {overview.stats.totalBookings}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  Upcoming
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {overview.stats.upcomingBookings}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  Waitlist
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {overview.stats.waitlistEntries}
                </p>
              </div>
            </div>
          </GlowCard>

          <GlowCard
            contentClassName="rounded-[1.75rem] p-6 sm:p-8"
            backgroundColor="#08070f"
            borderRadius={28}
            glowIntensity={0.75}
            fillOpacity={0.14}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                  Recent booking
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Latest reservation details
                </h3>
              </div>
              {overview.latestBooking ? (
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white hover:text-black"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            {overview.latestBooking ? (
              <div className="mt-5 rounded-[1.35rem] border border-white/8 bg-black/35 p-4">
                <p className="text-sm font-semibold text-white">
                  {overview.latestBooking.reference} ·{" "}
                  {getDashboardSpaceLabel(overview.latestBooking.space)}
                </p>
                <p className="mt-2 text-sm text-white/60">
                  {overview.latestBooking.dateLabel} at {overview.latestBooking.startTime}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
                  <Mail className="h-4 w-4" />
                  {currentUser.email}
                </p>
              </div>
            ) : (
              <DashboardEmptyState
                title="No bookings to show yet."
                description="Your profile view becomes more useful once you create a booking. It will then show your latest reservation, status, and support details."
                ctaLabel="Create booking"
              />
            )}
          </GlowCard>
        </div>
      </section>
    </DashboardFrame>
  );
}
