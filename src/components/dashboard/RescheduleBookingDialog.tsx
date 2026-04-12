"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, CalendarSync, Clock3, X } from "lucide-react";

import { RescheduleCalendarPicker } from "@/components/dashboard/RescheduleCalendarPicker";

type DashboardSpace = "vsl" | "vsr" | "arcade";

type RescheduleOption = {
  id: string;
  space: DashboardSpace;
  dateKey: string;
  startTime: string;
  endTime: string;
  peakTime: boolean;
  label: string | null;
  note: string | null;
  priceModifier: number;
};

type RescheduleDialogBooking = {
  id: string;
  reference: string;
  space: DashboardSpace;
  dateKey: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  canReschedule: boolean;
  policy: {
    message: string;
  };
  rescheduleOptions: RescheduleOption[];
};

type RescheduleBookingDialogProps = {
  booking: RescheduleDialogBooking;
};

function getSpaceLabel(space: DashboardSpace) {
  switch (space) {
    case "vsl":
      return "Verve Studio Left";
    case "vsr":
      return "Verve Studio Right";
    case "arcade":
    default:
      return "The Arcade";
  }
}

export function RescheduleBookingDialog({
  booking,
}: RescheduleBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!booking.canReschedule) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
      >
        <CalendarSync className="h-4 w-4" />
        Reschedule
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={`Reschedule ${booking.reference}`}
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                aria-label="Close reschedule dialog"
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-[121] max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-t-[2.5rem] border-x border-t border-white/10 bg-[#080808] p-5 shadow-[0_-24px_80px_rgba(0,0,0,0.8)] sm:rounded-[2.5rem] sm:border sm:p-7 sm:shadow-[28px_28px_80px_rgba(0,0,0,0.7),-12px_-12px_24px_rgba(255,255,255,0.02)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                      Reschedule booking
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {booking.reference}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-white/55">
                      Choose a fresh date and time in {getSpaceLabel(booking.space)}.
                      Only live, valid slots are shown below.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:bg-white hover:text-black"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="rounded-[1.6rem] border border-white/8 bg-[#111111] p-4 shadow-[inset_10px_10px_18px_rgba(0,0,0,0.56),inset_-6px_-6px_14px_rgba(255,255,255,0.02)] sm:p-5">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                          Current session
                        </p>
                        <h4 className="mt-2 text-xl font-semibold text-white">
                          {getSpaceLabel(booking.space)}
                        </h4>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="rounded-[1.2rem] border border-white/6 bg-black/30 px-4 py-3">
                          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Session date
                          </p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {booking.dateLabel}
                          </p>
                        </div>

                        <div className="rounded-[1.2rem] border border-white/6 bg-black/30 px-4 py-3">
                          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                            <Clock3 className="h-3.5 w-3.5" />
                            Session time
                          </p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[1.2rem] border border-emerald-500/15 bg-emerald-500/10 px-4 py-3">
                        <p className="text-sm font-semibold text-emerald-100">
                          {booking.policy.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/8 bg-[#111111] p-3 shadow-[inset_10px_10px_18px_rgba(0,0,0,0.56),inset_-6px_-6px_14px_rgba(255,255,255,0.02)] sm:p-4">
                    <RescheduleCalendarPicker
                      bookingId={booking.id}
                      spaceLabel={getSpaceLabel(booking.space)}
                      currentDateKey={booking.dateKey}
                      options={booking.rescheduleOptions}
                    />
                  </div>
                </div>
              </motion.div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
