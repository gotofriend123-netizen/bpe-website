import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Sparkles } from "lucide-react";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { UserBookingAccordionCard } from "@/components/dashboard/UserBookingAccordionCard";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/utils";
import {
  getUserDashboardHomeData,
  requireDashboardUser,
} from "@/lib/dashboard/user-dashboard";

export default async function UserDashboardPage() {
  const currentUser = await requireDashboardUser();
  const { frameOverview, upcomingBookings } = await getUserDashboardHomeData(currentUser.id);
  const firstName = currentUser.name.split(" ")[0] ?? currentUser.name;

  return (
    <DashboardFrame
      currentUser={currentUser}
      overview={frameOverview}
      activeTab="overview"
    >
      <section className="space-y-6">
        <GlowCard
          contentClassName="rounded-2xl p-5 sm:p-6"
          backgroundColor="#111111"
          borderRadius={32}
          glowIntensity={0.35}
          fillOpacity={0.08}
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                  {firstName}'s Dashboard
                </h1>
              </div>
              <Link href="/booking" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                Book Now
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-white/8 bg-black/40 px-3 py-3">
                <CalendarDays className="h-4 w-4 text-white/50" />
                <p className="mt-2 text-xl font-bold text-white">{frameOverview.stats.totalBookings}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Total</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/40 px-3 py-3">
                <Clock3 className="h-4 w-4 text-white/50" />
                <p className="mt-2 text-xl font-bold text-white">{frameOverview.stats.upcomingBookings}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Upcoming</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/40 px-3 py-3">
                <Sparkles className="h-4 w-4 text-white/50" />
                <p className="mt-2 text-xl font-bold text-white">{frameOverview.stats.confirmedBookings}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Confirmed</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/40 px-3 py-3">
                <ArrowRight className="h-4 w-4 text-white/50" />
                <p className="mt-2 text-xl font-bold text-white">{frameOverview.stats.pastBookings}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Past</p>
              </div>
            </div>
          </div>
        </GlowCard>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
            Upcoming Sessions
          </h2>
          <Link
            href="/dashboard/bookings"
            className="text-sm text-white/60 hover:text-white"
          >
            See all
          </Link>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className={cn(
            "grid gap-4",
            upcomingBookings.length > 1 && "2xl:grid-cols-2",
          )}>
            {upcomingBookings.slice(0, 2).map((booking) => (
              <UserBookingAccordionCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            title="No upcoming bookings"
            description="Book a session to get started."
            ctaLabel="Book Now"
          />
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            Book Session
          </Link>
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white"
          >
            View All Bookings
          </Link>
        </div>
      </section>
    </DashboardFrame>
  );
}