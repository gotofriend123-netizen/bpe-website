"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  Star,
} from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SPECIFIC_STUDIOS } from "@/config/data";
import { getBusinessSupportWhatsappLink } from "@/lib/business/contact";
import {
  addHoursToTime,
  formatIsoDate,
  getSpaceLabel,
  getSpaceLabelFromParams,
  isBookingTypeId,
  resolveBookingTypeFromParams,
} from "@/lib/booking-utils";
import { formatBookingDurationLabel } from "@/lib/booking/duration";
import { useBookingStore } from "@/lib/store/bookingStore";
import type { BookingFormValues } from "@/lib/validations";

type BookingSnapshot = Pick<
  BookingFormValues,
  "bookingType" | "date" | "time" | "specificStudio" | "selectedPackage"
>;

export function BookingPageClient({
  defaultBookingDurationHours,
}: {
  defaultBookingDurationHours: number;
}) {
  const searchParams = useSearchParams();
  const spaceParam = searchParams.get("space");
  const studioParam = searchParams.get("studio");
  const bookingTypeParam = searchParams.get("bookingType");
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const slotId = searchParams.get("slotId");

  const resolvedBookingType = useMemo(
    () =>
      resolveBookingTypeFromParams({
        bookingType: bookingTypeParam,
        space: spaceParam,
        studio: studioParam,
      }),
    [bookingTypeParam, spaceParam, studioParam],
  );

  const allSlots = useBookingStore((state) => state.slots);
  const slot = useMemo(() => {
    return slotId ? allSlots.find((item) => item.id === slotId) : undefined;
  }, [allSlots, slotId]);

  const [bookingSnapshot, setBookingSnapshot] = useState<BookingSnapshot>({
    bookingType: resolvedBookingType ?? "",
    date: dateParam ?? "",
    time: timeParam ?? "",
    specificStudio: "",
    selectedPackage: "",
  });

  useEffect(() => {
    setBookingSnapshot((current) => {
      const nextSnapshot = {
        bookingType: resolvedBookingType ?? "",
        date: dateParam ?? "",
        time: timeParam ?? "",
        specificStudio: "",
        selectedPackage: "",
      };

      return current.bookingType === nextSnapshot.bookingType &&
        current.date === nextSnapshot.date &&
        current.time === nextSnapshot.time &&
        current.specificStudio === nextSnapshot.specificStudio &&
        current.selectedPackage === nextSnapshot.selectedPackage
        ? current
        : nextSnapshot;
    });
  }, [dateParam, resolvedBookingType, timeParam]);

  const handleValuesChange = useCallback(
    (values: Partial<BookingFormValues>) => {
      setBookingSnapshot((current) => {
        const nextSnapshot = {
          ...current,
          ...values,
        };

        return current.bookingType === nextSnapshot.bookingType &&
          current.date === nextSnapshot.date &&
          current.time === nextSnapshot.time &&
          current.specificStudio === nextSnapshot.specificStudio &&
          current.selectedPackage === nextSnapshot.selectedPackage
          ? current
          : nextSnapshot;
      });
    },
    [],
  );

  const selectedPackage = useMemo(() => {
    if (!bookingSnapshot.specificStudio || !bookingSnapshot.selectedPackage) {
      return null;
    }

    return SPECIFIC_STUDIOS.find(
      (studio) => studio.id === bookingSnapshot.specificStudio,
    )?.packages.find((pkg) => pkg.id === bookingSnapshot.selectedPackage);
  }, [bookingSnapshot.selectedPackage, bookingSnapshot.specificStudio]);

  const selectedSpaceLabel =
    getSpaceLabel(
      isBookingTypeId(bookingSnapshot.bookingType)
        ? bookingSnapshot.bookingType
        : null,
    ) ??
    getSpaceLabel(slot?.space ?? null) ??
    getSpaceLabelFromParams({
      bookingType: bookingTypeParam,
      space: spaceParam,
      studio: studioParam,
    }) ??
    "Not Selected";

  const selectedDateLabel = bookingSnapshot.date
    ? formatIsoDate(bookingSnapshot.date)
    : "Not Selected";

  const startTime = slot?.startTime ?? bookingSnapshot.time;
  const endTime =
    slot?.endTime ??
    (bookingSnapshot.time
      ? addHoursToTime(bookingSnapshot.time, defaultBookingDurationHours)
      : "");
  const selectedTimeLabel = startTime
    ? `${startTime}${endTime ? ` - ${endTime}` : ""}`
    : "Not Selected";

  const pricingHint = slot?.isPeakTime
    ? slot.label ?? "Peak pricing applies to this slot."
    : selectedPackage?.pricePreview ?? "Package pricing is finalized once you pick your setup.";

  const bookingMode = slot
    ? "This slot will be locked immediately after submission."
    : "This booking will be reviewed and confirmed by the team.";

  const initialData: Partial<BookingFormValues> = {
    bookingType: resolvedBookingType ?? "",
    date: dateParam ?? "",
    time: timeParam ?? "",
  };

  return (
    <main className="min-h-screen bg-[#020202] pb-24 pt-32 text-white selection:bg-white/30">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[8%] h-[34rem] w-[34rem] rounded-full bg-amber-400/5 blur-[140px]" />
        <div className="absolute bottom-[-8%] right-[-8%] h-[30rem] w-[30rem] rounded-full bg-slate-200/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <AnimatedSection>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-zinc-300">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Premium Reservation Flow
            </span>
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-white md:text-7xl">
              Secure your session with confidence.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
              Finalize your booking details below. Your summary stays in sync as
              you choose the space, date, setup, and session time.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-14">
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <AnimatedSection direction="right" delay={0.1}>
              <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
                <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-white">
                      <Star className="h-6 w-6 text-amber-400" />
                      Booking Summary
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      Live details from your booking form.
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-zinc-300">
                    {slot ? "Instant" : "Request"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                        <MapPin className="h-5 w-5 text-zinc-300" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                          Selected Space
                        </p>
                        <p className="mt-2 text-xl font-semibold text-white">
                          {selectedSpaceLabel}
                        </p>
                        {bookingSnapshot.bookingType === "" && studioParam === "verve" ? (
                          <p className="mt-2 text-sm text-zinc-400">
                            Choose Left or Right inside the form to lock the exact set.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                        <CalendarCheck className="h-5 w-5 text-zinc-300" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                          Session Date
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {selectedDateLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                        <Clock3 className="h-5 w-5 text-zinc-300" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                          Time Window
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {selectedTimeLabel}
                        </p>
                        {startTime ? (
                          <p className="mt-2 text-sm text-zinc-400">
                            Standard block duration: {formatBookingDurationLabel(defaultBookingDurationHours)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Booking Status
                    </h3>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
                      {slot?.isPeakTime ? "Peak Slot" : "Standard"}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-zinc-300">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-zinc-500">Flow</span>
                      <span className="max-w-[18rem] text-right">{bookingMode}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-zinc-500">Package</span>
                      <span className="max-w-[18rem] text-right">
                        {selectedPackage?.name ?? "Choose your package in the form"}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-zinc-500">Pricing Note</span>
                      <span className="max-w-[18rem] text-right">{pricingHint}</span>
                    </div>
                  </div>
                </div>
              </section>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
              <section className="rounded-[2rem] border border-white/10 bg-[#0b0b0b]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-zinc-300" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Cancellation Policy
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">
                      Cancel or reschedule at least 72 hours before your session
                      for the smoothest outcome. Requests between 24 and 72 hours
                      may still be reviewed, but availability and refund rules become stricter.
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <a
                    href={getBusinessSupportWhatsappLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-4 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Need help? Chat on WhatsApp
                  </a>
                </div>
              </section>
            </AnimatedSection>
          </div>

          <div className="min-w-0">
            <AnimatedSection direction="left" delay={0.3}>
            <BookingForm
              initialData={initialData}
              slotId={slotId ?? undefined}
              onValuesChange={handleValuesChange}
            />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </main>
  );
}
