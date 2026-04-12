import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import Link from "next/link";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { UserBookingAccordionCard } from "@/components/dashboard/UserBookingAccordionCard";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  type DashboardBooking,
  getUserDashboardBookingsPageData,
  requireDashboardUser,
  getDashboardSpaceLabel,
} from "@/lib/dashboard/user-dashboard";

type SearchParams = {
  view?: string;
  updated?: string;
  action?: string;
  error?: string;
  filter?: string;
};

type BookingFilter = "all" | "upcoming" | "past" | "cancelled" | "rescheduled";

const bookingFilters: Array<{
  key: BookingFilter;
  label: string;
  helper: string;
}> = [
  { key: "upcoming", label: "Upcoming", helper: "Future sessions that still need your attention." },
  { key: "past", label: "Past", helper: "Completed or already-finished bookings." },
  { key: "cancelled", label: "Cancelled", helper: "Bookings that are no longer active." },
  { key: "rescheduled", label: "Rescheduled", helper: "Bookings moved into a new slot." },
  { key: "all", label: "All bookings", helper: "Every booking tied to your account in one place." },
];

function getFilteredBookings(
  bookings: DashboardBooking[],
  filter: BookingFilter,
) {
  switch (filter) {
    case "upcoming":
      return bookings.filter((booking) => booking.isUpcoming);
    case "past":
      return bookings.filter(
        (booking) =>
          !booking.isUpcoming &&
          booking.status !== "cancelled" &&
          !booking.tags.includes("rescheduled"),
      );
    case "cancelled":
      return bookings.filter((booking) => booking.status === "cancelled");
    case "rescheduled":
      return bookings.filter((booking) => booking.tags.includes("rescheduled"));
    case "all":
    default:
      return bookings;
  }
}

export default async function UserBookingsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const currentUser = await requireDashboardUser();
  const {
    frameOverview,
    bookings,
    upcomingBookings,
    pastBookings,
  } = await getUserDashboardBookingsPageData(currentUser.id);
  const activeFilter = (searchParams?.filter as BookingFilter | undefined) ?? "upcoming";
  const selectedFilter = bookingFilters.find((filter) => filter.key === activeFilter) ?? bookingFilters[0];
  const filteredBookings = getFilteredBookings(bookings, selectedFilter.key);

  return (
    <DashboardFrame
      currentUser={currentUser}
      overview={frameOverview}
      activeTab="bookings"
    >
      <section className="space-y-6">
        {searchParams?.error ? (
          <GlowCard
            contentClassName="rounded-[1.5rem] p-5"
            backgroundColor="#12080a"
            borderRadius={24}
            glowIntensity={0.72}
            fillOpacity={0.18}
          >
            <p className="text-sm font-semibold text-rose-100">
              {searchParams.error}
            </p>
          </GlowCard>
        ) : null}

        {searchParams?.updated ? (
          <GlowCard
            contentClassName="rounded-[1.5rem] p-5"
            backgroundColor="#08070f"
            borderRadius={24}
            glowIntensity={0.72}
            fillOpacity={0.14}
          >
            <p className="text-sm font-semibold text-white">
              Booking{" "}
              {searchParams.action === "rescheduled"
                ? "rescheduled"
                : searchParams.action === "cancelled"
                  ? "cancelled"
                  : "updated"}{" "}
              successfully.
            </p>
            <p className="mt-2 text-sm leading-7 text-white/60">
              The dashboard has been refreshed so the latest booking status and slot availability are visible immediately.
            </p>
          </GlowCard>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
              My bookings
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              Every reservation in one place
            </h2>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5"
          >
            Book another session
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <GlowCard
          contentClassName="rounded-[1.75rem] p-4 sm:p-5"
          backgroundColor="#08070f"
          borderRadius={28}
          glowIntensity={0.72}
          fillOpacity={0.14}
        >
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                Booking filters
              </p>
              <p className="mt-2 text-sm leading-7 text-white/60">
                {selectedFilter.helper}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {bookingFilters.map((filter) => {
                const isActive = filter.key === selectedFilter.key;
                const params = new URLSearchParams();

                if (filter.key !== "upcoming") {
                  params.set("filter", filter.key);
                }

                if (searchParams?.view) {
                  params.set("view", searchParams.view);
                }

                return (
                  <Link
                    key={filter.key}
                    href={`/dashboard/bookings${params.toString() ? `?${params.toString()}` : ""}`}
                    className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "border border-white/10 bg-white text-black"
                        : "border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white hover:text-black"
                    }`}
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </GlowCard>

        <GlowCard
          contentClassName="rounded-[1.75rem] p-6"
          backgroundColor="#08070f"
          borderRadius={28}
          glowIntensity={0.72}
          fillOpacity={0.14}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                Upcoming
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {upcomingBookings.length}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                Past
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {pastBookings.length}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                Total
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {frameOverview.stats.totalBookings}
              </p>
            </div>
          </div>
        </GlowCard>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
                {selectedFilter.label}
              </h3>
              <span className="text-sm text-white/50">
                {filteredBookings.length}
              </span>
            </div>
            {filteredBookings.length > 0 ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredBookings.map((booking) => (
                  <UserBookingAccordionCard
                    key={booking.id}
                    booking={booking}
                    defaultOpen={searchParams?.view === booking.id}
                  />
                ))}
              </div>
            ) : (
              <DashboardEmptyState
                title={`No ${selectedFilter.label.toLowerCase()} yet.`}
                description={selectedFilter.helper}
                ctaHref={selectedFilter.key === "past" ? "/spaces" : "/booking"}
                ctaLabel={selectedFilter.key === "past" ? "Explore spaces" : "Book a session"}
              />
            )}
          </div>
        ) : (
          <DashboardEmptyState
            title="You have no bookings yet."
            description="Once you book a space, this area will show the full reservation history, slot details, and policy eligibility for each booking."
            ctaLabel="Start booking"
          />
        )}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <GlowCard
          contentClassName="rounded-[1.75rem] p-6"
          backgroundColor="#08070f"
          borderRadius={28}
          glowIntensity={0.72}
          fillOpacity={0.14}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <CalendarDays className="h-5 w-5 text-white/80" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                Upcoming detail
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Your next confirmed session
              </h3>
            </div>
          </div>

          <div className="mt-5 rounded-[1.35rem] border border-white/8 bg-black/35 p-4">
            {upcomingBookings[0] ? (
              <>
                <p className="text-sm font-semibold text-white">
                  {upcomingBookings[0].reference} ·{" "}
                  {getDashboardSpaceLabel(upcomingBookings[0].space)}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
                  <Clock3 className="h-4 w-4" />
                  {upcomingBookings[0].dateLabel} at{" "}
                  {upcomingBookings[0].startTime}
                </p>
              </>
            ) : (
              <p className="text-sm text-white/60">
                No upcoming session is currently scheduled.
              </p>
            )}
          </div>
        </GlowCard>

        <GlowCard
          contentClassName="rounded-[1.75rem] p-6"
          backgroundColor="#08070f"
          borderRadius={28}
          glowIntensity={0.72}
          fillOpacity={0.14}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <Clock3 className="h-5 w-5 text-white/80" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                Policy reminder
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Clear cancellation and reschedule windows
              </h3>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-white/60">
            More than 72 hours before the slot allows full flexibility. Between
            24 and 72 hours you stay eligible for rescheduling and a partial
            refund placeholder. Under 24 hours, the action is locked.
          </p>
        </GlowCard>
      </section>
    </DashboardFrame>
  );
}
