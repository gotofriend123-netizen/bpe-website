"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, Clock3, X } from "lucide-react";

import { DashboardSubmitButton } from "@/components/dashboard/DashboardSubmitButton";
import { cancelDashboardBookingAction } from "@/app/dashboard/actions";

type CancelDialogBooking = {
  id: string;
  reference: string;
  space: "vsl" | "vsr" | "arcade";
  dateKey: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  canCancel: boolean;
  policy: {
    message: string;
  };
};

type CancelBookingDialogProps = {
  booking: CancelDialogBooking;
};

function getSpaceLabel(space: "vsl" | "vsr" | "arcade") {
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

export function CancelBookingDialog({
  booking,
}: CancelBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!booking.canCancel) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/20"
      >
        <AlertTriangle className="h-4 w-4" />
        Cancel Booking
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] flex items-end justify-center p-3 sm:items-center sm:p-4"
              role="dialog"
              aria-modal="true"
              aria-label={`Cancel ${booking.reference}`}
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-[121] w-full max-w-lg overflow-y-auto rounded-2xl border border-rose-500/20 bg-[#0c0505] p-5 shadow-[0_-24px_80px_rgba(0,0,0,0.8)] sm:rounded-[2rem] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10">
                      <AlertTriangle className="h-5 w-5 text-rose-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                        Cancel booking
                      </p>
                      <h3 className="text-xl font-semibold text-white">{booking.reference}</h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:bg-white hover:text-black"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-white/8 bg-[#151515] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/50">Session</p>
                    <p className="mt-1 text-lg font-semibold text-white">{getSpaceLabel(booking.space)}</p>
                    <div className="mt-3 flex gap-4">
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <CalendarDays className="h-4 w-4" />
                        {booking.dateLabel}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Clock3 className="h-4 w-4" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-rose-300/80">Policy</p>
                    <p className="mt-2 text-sm text-rose-200">{booking.policy.message}</p>
                  </div>

                  <form action={cancelDashboardBookingAction} className="space-y-4">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    
                    <div className="rounded-xl border border-white/8 bg-black/40 p-4">
                      <p className="text-sm text-white/70">
                        Are you sure you want to cancel this booking? This action cannot be undone.
                      </p>
                    </div>

                    <DashboardSubmitButton variant="cancel" />
                  </form>
                </div>
              </motion.div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}