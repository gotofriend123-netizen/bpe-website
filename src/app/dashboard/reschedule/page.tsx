import Link from "next/link";
import { AlertTriangle, ArrowLeft, Mail, Sparkles } from "lucide-react";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { RescheduleCalendarPicker } from "@/components/dashboard/RescheduleCalendarPicker";
import { UserBookingCard } from "@/components/dashboard/UserBookingCard";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  getUserDashboardOverview,
  getDashboardRescheduleContextForUser,
  requireDashboardUser,
  getDashboardSpaceLabel,
} from "@/lib/dashboard/user-dashboard";
import { BUSINESS_SUPPORT_EMAIL } from "@/lib/business/contact";

type SearchParams = {
  id?: string;
  error?: string;
};

export default async function RescheduleBookingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentUser = await requireDashboardUser();
  const overview = await getUserDashboardOverview(currentUser.id);
  const bookingId = searchParams.id;
  const booking = bookingId
    ? await getDashboardRescheduleContextForUser(currentUser.id, bookingId)
    : null;
  const suggestedSlotLabel = booking?.nextAvailableSlot
    ? new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(`${booking.nextAvailableSlot.dateKey}T00:00:00+05:30`))
    : null;

  return (
    <DashboardFrame
      currentUser={currentUser}
      overview={overview}
      activeTab="bookings"
    >
      <section className="space-y-6">
        {searchParams.error ? (
          <div className="rounded-[1.5rem] border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
            {searchParams.error}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
              Reschedule booking
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              Review reschedule eligibility
            </h2>
          </div>
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to bookings
          </Link>
        </div>

        {booking ? (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <UserBookingCard booking={booking} />

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
                    <Sparkles className="h-5 w-5 text-white/80" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                      Slot suggestion
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-white">
                      Next available option
                    </h3>
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-white/8 bg-black/35 p-4">
                  {booking.nextAvailableSlot ? (
                    <>
                      <p className="text-sm font-semibold text-white">
                        {getDashboardSpaceLabel(booking.nextAvailableSlot.space)}
                      </p>
                      <p className="mt-2 text-sm text-white/60">
                        {suggestedSlotLabel ?? booking.nextAvailableSlot.dateKey} at{" "}
                        {booking.nextAvailableSlot.startTime} -{" "}
                        {booking.nextAvailableSlot.endTime}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-white/60">
                      No immediate alternate slot is available for this booking
                      yet. The team can still help you look for a new time.
                    </p>
                  )}
                </div>

                {booking.canReschedule ? (
                  <div className="rounded-[1.35rem] border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <p className="text-sm font-semibold text-emerald-200">
                      This booking is eligible for rescheduling under policy.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-emerald-100/80">
                      Open the booking controls to move this reservation into the next eligible slot or browse current availability.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-[1.35rem] border border-rose-500/20 bg-rose-500/10 p-4">
                    <p className="flex items-start gap-2 text-sm leading-7 text-rose-100">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      This booking is no longer eligible for cancellation or
                      rescheduling as per policy.
                    </p>
                  </div>
                )}

                {booking.canReschedule ? (
                  <RescheduleCalendarPicker
                    bookingId={booking.id}
                    spaceLabel={getDashboardSpaceLabel(booking.space)}
                    currentDateKey={booking.dateKey}
                    options={booking.rescheduleOptions}
                  />
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href={`mailto:${BUSINESS_SUPPORT_EMAIL}?subject=Reschedule%20booking%20${booking.reference}&body=Hi%20team,%20please%20reschedule%20booking%20${booking.reference}%20for%20${booking.dateLabel}.`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/75 transition-colors hover:bg-white hover:text-black"
                  >
                    <Mail className="h-4 w-4" />
                    Contact support
                  </a>
                  <Link
                    href="/dashboard/bookings"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/75 transition-colors hover:bg-white hover:text-black"
                  >
                    Keep booking
                  </Link>
                </div>
              </div>
            </GlowCard>
          </div>
        ) : (
          <DashboardEmptyState
            title="Pick a booking to review."
            description="Select one of your confirmed bookings from the bookings page to see the reschedule policy and the request options."
            ctaHref="/dashboard/bookings"
            ctaLabel="Browse bookings"
          />
        )}
      </section>
    </DashboardFrame>
  );
}
