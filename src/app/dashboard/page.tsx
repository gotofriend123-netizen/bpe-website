import Link from "next/link";
import {
  ChevronDown,
  Shield,
  BookOpenCheck,
  Ticket,
  BadgePercent,
  CalendarDays,
  Settings2,
} from "lucide-react";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { UserBookingAccordionCard } from "@/components/dashboard/UserBookingAccordionCard";
import { cn } from "@/lib/utils";
import {
  getUserDashboardHomeData,
  requireDashboardUser,
} from "@/lib/dashboard/user-dashboard";

const ADMIN_LINKS = [
  { href: "/admin", label: "Admin Panel", icon: Shield },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpenCheck },
  { href: "/admin/events", label: "Events", icon: Ticket },
  { href: "/admin/offers", label: "Offers", icon: BadgePercent },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
];

export default async function UserDashboardPage() {
  const currentUser = await requireDashboardUser();
  const { frameOverview, upcomingBookings } = await getUserDashboardHomeData(currentUser.id);

  return (
    <DashboardFrame
      currentUser={currentUser}
      overview={frameOverview}
      activeTab="overview"
    >
      <section className="space-y-6">
        {currentUser.role === "admin" && (
          <details className="group" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-white/8 bg-[#0b0b0b] px-5 py-4 transition-colors hover:bg-black/80 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-white/70" />
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">
                  Admin Commands
                </h2>
              </span>
              <ChevronDown className="h-5 w-5 text-white/50 transition-transform duration-200 group-open:rotate-180" />
            </summary>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ADMIN_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-start gap-3 rounded-[1.3rem] border border-white/6 bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04]">
                      <Icon className="h-4 w-4 text-white/80" />
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </details>
        )}

        {/* Upcoming Sessions — collapsible */}
        <details className="group" open={currentUser.role !== "admin"}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/30 px-5 py-4 transition-colors hover:bg-black/40 [&::-webkit-details-marker]:hidden">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
              Upcoming Sessions
            </h2>
            <ChevronDown className="h-5 w-5 text-white/50 transition-transform duration-200 group-open:rotate-180" />
          </summary>

          <div className="mt-3 flex justify-end px-1">
            <Link
              href="/dashboard/bookings"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              See all →
            </Link>
          </div>

          <div className="mt-3 space-y-4">
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
          </div>
        </details>

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