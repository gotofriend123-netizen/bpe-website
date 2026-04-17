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
  ArrowRight
} from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SpaceSwitcher } from "@/components/calendar/SpaceSwitcher";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { TimeSlotList } from "@/components/calendar/TimeSlotList";
import { GlowCard } from "@/components/ui/GlowCard";
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
import type { Space, PublicSlot } from "@/lib/types/booking";
import { cn } from "@/lib/utils";

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

  const [selectedSpace, setSelectedSpace] = useState<Space>(
    (searchParams.get("space") as Space) || "vsl",
  );
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date(),
  );
  const [selectedSlot, setSelectedSlot] = useState<PublicSlot | null>(null);
  const [showForm, setShowForm] = useState(!!slotId);

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
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-white md:text-7xl underline decoration-white/10 decoration-wavy underline-offset-8">
              Secure your session.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
              Follow our simple three-step process to finalize your booking and secure your creative space.
            </p>
          </AnimatedSection>
        </div>

        <div className="flex flex-col gap-24 max-w-5xl mx-auto">
          {/* Stage 1: Availability Selection */}
          <section className={cn("space-y-10 transition-all duration-500", showForm && "opacity-50 blur-[2px] pointer-events-none scale-[0.98] origin-top")}>
            <div className="flex flex-col items-center justify-center text-center space-y-4">
               <h2 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
                 <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black text-xl">1</span>
                 Pick your Space & Time
               </h2>
               <p className="text-zinc-400 max-w-md">Our calendars are always live. Select a slot below to ensure your session is confirmed instantly.</p>
            </div>
            
            <SpaceSwitcher
              selected={selectedSpace}
              onChange={(s) => {
                setSelectedSpace(s);
                setSelectedSlot(null);
              }}
            />

            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="flex-1">
                <CalendarGrid
                  space={selectedSpace}
                  selectedDate={selectedDateObj}
                  onSelectDate={(d) => {
                    setSelectedDateObj(d);
                    setSelectedSlot(null);
                  }}
                />
              </div>
              <div className="flex-1">
                <GlowCard
                  className="h-full min-h-[400px]"
                  contentClassName="p-6 md:p-8"
                  backgroundColor="#09070f"
                  borderRadius={30}
                >
                  <TimeSlotList
                    space={selectedSpace}
                    selectedDate={selectedDateObj}
                    onSelectSlot={(slot) => {
                      setSelectedSlot(slot);
                      setShowForm(true);
                      // Scroll to form
                      setTimeout(() => {
                        document.getElementById('booking-form-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 200);
                    }}
                  />
                </GlowCard>
              </div>
            </div>
          </section>

          {/* Stage 2: Booking Form */}
          <section id="booking-form-section" className={cn("space-y-10 transition-all duration-500", !showForm && "opacity-30 blur-[4px] pointer-events-none")}>
             <div className="flex flex-col items-center justify-center text-center space-y-4">
               <h2 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
                 <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black text-xl">2</span>
                 Finalize your Details
               </h2>
               {!showForm ? (
                  <p className="text-zinc-500">Please select a time slot above to continue.</p>
               ) : (
                  <button 
                  onClick={() => setShowForm(false)}
                  className="text-sm px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                  >
                    ← Change Space or Time
                  </button>
               )}
            </div>

            <BookingForm
              initialData={{
                  ...initialData,
                  date: selectedSlot?.dateKey || dateParam || "",
                  time: selectedSlot?.startTime || timeParam || "",
                  bookingType: selectedSlot 
                      ? (selectedSlot.space === 'arcade' ? 'arcade' : (selectedSlot.space === 'vsl' ? 'verve-studio-left' : 'verve-studio-right'))
                      : (resolvedBookingType || "")
              }}
              slotId={selectedSlot?.id || slotId || undefined}
              onValuesChange={handleValuesChange}
            />
          </section>

          {/* Stage 3: Summary & Policy */}
          <section className={cn("space-y-10 transition-all duration-500", !showForm && "opacity-30 blur-[4px]")}>
            <div className="flex flex-col items-center justify-center text-center space-y-4">
               <h2 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
                 <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black text-xl">3</span>
                 Review Booking Summary
               </h2>
               <p className="text-zinc-400">Everything looks good? Proceed with your reservation.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <AnimatedSection direction="up" delay={0.1}>
                <section className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl h-full">
                  <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-white">
                        <Star className="h-6 w-6 text-amber-400" />
                        Summary
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-zinc-300">
                      {slot ? "Instant Selection" : "Request"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                       <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 mb-2">Space</p>
                       <p className="text-xl font-semibold text-white">{selectedSpaceLabel}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 mb-2">Date</p>
                        <p className="text-lg font-semibold text-white">{selectedDateLabel}</p>
                      </div>
                      <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 mb-2">Time Slot</p>
                        <p className="text-lg font-semibold text-white">{selectedTimeLabel}</p>
                      </div>
                    </div>

                    <div className="mt-6 p-6 rounded-[1.75rem] border border-white/10 bg-white/5">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-zinc-500 text-sm">Package Selection</span>
                          <span className="text-white font-medium">{selectedPackage?.name ?? "Pick your setup in step 2"}</span>
                       </div>
                       <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <span className="text-zinc-500 text-sm font-semibold">ESTIMATED PRICE</span>
                          <span className="text-white font-bold text-lg">{pricingHint}</span>
                       </div>
                    </div>
                  </div>
                </section>
              </AnimatedSection>

              <AnimatedSection direction="up" delay={0.2}>
                <section className="rounded-[2.5rem] border border-white/10 bg-[#0b0b0b]/90 p-8 shadow-2xl backdrop-blur-xl h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <ShieldAlert className="h-6 w-6 text-zinc-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Cancellation Policy</h3>
                      <p className="mt-3 text-sm leading-7 text-zinc-400">
                        Full Refund: Cancel/reschedule 72h+ in advance. <br/>
                        Partial Refund: Requests between 24h-72h. <br/>
                        Under 24h bookings are generally locked.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-white/10">
                    <a
                      href={getBusinessSupportWhatsappLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 px-6 py-5 text-sm font-bold text-[#25D366] transition-all hover:bg-[#25D366]/10"
                    >
                      <MessageCircle className="h-6 w-6" />
                      Chat with Concierge <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </section>
              </AnimatedSection>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
