"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight, RefreshCcw, XCircle } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlowCard } from "@/components/ui/GlowCard";
import { fetchAvailability } from "@/lib/booking/client";
import { formatIsoDate, getSpaceLabel } from "@/lib/booking-utils";
import type { BookingResponse, PublicSlot } from "@/lib/types/booking";

export default function ManageBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref") || "";

  const [data, setData] = useState<BookingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<PublicSlot | null>(null);
  const [candidateSlots, setCandidateSlots] = useState<PublicSlot[]>([]);

  useEffect(() => {
    if (!reference) {
      setError("Missing booking reference.");
      return;
    }

    let active = true;
    setError(null);
    setData(null);

    fetch(`/api/bookings/${encodeURIComponent(reference)}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.message || "Unable to load this booking.");
        }
        return payload as BookingResponse;
      })
      .then((bookingDetails) => {
        if (active) {
          setData(bookingDetails);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load this booking.");
        }
      });

    return () => {
      active = false;
    };
  }, [reference]);

  useEffect(() => {
    if (!data) {
      return;
    }

    let active = true;
    setSelectedSlot(data.nextAvailableSlot);

    fetchAvailability({
      space: data.booking.space,
      date: data.booking.date,
    })
      .then((response) => {
        if (!active) {
          return;
        }

        setCandidateSlots(response.slots.filter((slot) => slot.status === "available"));
      })
      .catch(() => {
        if (active) {
          setCandidateSlots([]);
        }
      });

    return () => {
      active = false;
    };
  }, [data]);

  const booking = data?.booking;
  const policy = data?.policy;
  const canAct = policy?.isAllowed ?? false;

  const statusLabel = useMemo(() => {
    if (!booking) {
      return "Pending";
    }
    return booking.status.replace("-", " ").toUpperCase();
  }, [booking]);

  const handleCancel = async () => {
    if (!reference) return;
    setIsCancelling(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${encodeURIComponent(reference)}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to cancel booking.");
      }

      setData(payload);
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Unable to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRescheduleToSuggestedSlot = async () => {
    if (!reference || !selectedSlot) return;
    setIsRescheduling(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${encodeURIComponent(reference)}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: selectedSlot.id }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to reschedule booking.");
      }

      router.push(payload.confirmationUrl || "/dashboard/bookings");
    } catch (rescheduleError) {
      setError(rescheduleError instanceof Error ? rescheduleError.message : "Unable to reschedule booking.");
    } finally {
      setIsRescheduling(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto max-w-5xl px-6">
        <AnimatedSection className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Manage Booking</h1>
          <p className="text-lg text-gray-400">
            Booking ID: <span className="font-mono text-white">{reference || "PENDING"}</span>
          </p>
        </AnimatedSection>

        {error ? (
          <AnimatedSection className="mb-8">
            <GlowCard contentClassName="p-6" backgroundColor="#12080a" borderRadius={30}>
              <p className="text-red-300">{error}</p>
            </GlowCard>
          </AnimatedSection>
        ) : null}

        {booking ? (
          <>
            <AnimatedSection delay={0.1} className="mb-8">
              <GlowCard contentClassName="relative overflow-hidden p-8" backgroundColor="#0b0812" borderRadius={30}>
                <div className="absolute top-0 inset-x-0 h-1 bg-[#25D366]" />
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#25D366]" />
                      <span className="text-sm font-bold uppercase tracking-widest text-[#25D366]">
                        {statusLabel}
                      </span>
                    </div>
                    <h2 className="mb-2 text-3xl font-bold text-white">
                      {getSpaceLabel(booking.space)}
                    </h2>
                    <p className="text-xl text-gray-300">
                      {formatIsoDate(booking.date)} • {booking.startTime} - {booking.endTime}
                    </p>
                  </div>

                  <div className="w-full shrink-0 rounded-xl border border-white/5 bg-black/50 p-4 text-center sm:w-auto sm:text-right">
                    <p className="mb-1 text-sm uppercase tracking-widest text-gray-500">Reference</p>
                    <p className="font-mono text-sm text-gray-200">{booking.reference}</p>
                  </div>
                </div>
              </GlowCard>
            </AnimatedSection>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <AnimatedSection delay={0.2} direction="up">
                <GlowCard className="group" contentClassName="p-8" backgroundColor="#09070f" borderRadius={30}>
                  <RefreshCcw className="mb-6 h-8 w-8 text-white transition-transform duration-700 group-hover:rotate-180" />
                  <h3 className="mb-2 text-2xl font-bold text-white">Reschedule</h3>
                  <p className="mb-4 text-gray-400">{policy?.message}</p>
                  <button
                    onClick={handleRescheduleToSuggestedSlot}
                    disabled={!canAct || !selectedSlot || isRescheduling}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white px-5 py-4 font-bold text-black transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
                  >
                    {isRescheduling ? "Rescheduling..." : selectedSlot ? "Reschedule to Suggested Slot" : "No Slot Available"}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <Link
                    href={`/calendar?space=${booking.space}`}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Browse all availability
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </GlowCard>
              </AnimatedSection>

              <AnimatedSection delay={0.3} direction="up">
                <GlowCard className="group" contentClassName="p-8" backgroundColor="#12080a" borderRadius={30} colors={["#ef4444", "#f472b6", "#f59e0b"]} fillOpacity={0.18}>
                  <XCircle className="mb-6 h-8 w-8 text-red-500 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="mb-2 text-2xl font-bold text-white">Cancel Booking</h3>
                  <p className="mb-4 text-gray-400">
                    {canAct
                      ? "Cancel your booking according to the active policy window."
                      : "This booking is no longer eligible for cancellation or rescheduling as per policy."}
                  </p>
                  <button
                    onClick={handleCancel}
                    disabled={!canAct || isCancelling}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-bold text-red-400 transition-all hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Booking"}
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </GlowCard>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={0.4} className="mb-8">
              <GlowCard contentClassName="flex items-start gap-4 p-6" backgroundColor="#09070f" borderRadius={24}>
                <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
                <p className="text-sm leading-relaxed text-gray-400">
                  <strong className="text-gray-200">Policy Automation Rule:</strong>{" "}
                  {policy?.message}
                </p>
              </GlowCard>
            </AnimatedSection>

            {selectedSlot ? (
              <AnimatedSection delay={0.5}>
                <GlowCard contentClassName="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between" backgroundColor="#09070f" borderRadius={24}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-400">Suggested next slot</p>
                    <p className="mt-2 text-white">
                      {formatIsoDate(selectedSlot.dateKey, "EEEE, MMMM do")} at {selectedSlot.startTime}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {candidateSlots.length > 0
                      ? `${candidateSlots.length} open slot${candidateSlots.length === 1 ? "" : "s"} currently available on this date.`
                      : "This suggestion is the next available slot across the current schedule."}
                  </div>
                </GlowCard>
              </AnimatedSection>
            ) : null}
          </>
        ) : (
          <AnimatedSection>
            <GlowCard contentClassName="p-8 text-center" backgroundColor="#0b0812" borderRadius={30}>
              <p className="text-lg text-gray-300">Loading booking details or waiting for a valid reference.</p>
            </GlowCard>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
