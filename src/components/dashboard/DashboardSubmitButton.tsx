"use client";

import { useFormStatus } from "react-dom";
import { Ban, CalendarSync, Loader2 } from "lucide-react";

type SubmitButtonProps = {
  variant: "cancel" | "reschedule";
  disabled?: boolean;
};

export function DashboardSubmitButton({ variant, disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  if (variant === "cancel") {
    return (
      <button
        type="submit"
        disabled={isDisabled}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Cancelling...
          </>
        ) : (
          <>
            <Ban className="h-4 w-4" />
            Cancel this booking
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Rescheduling...
        </>
      ) : (
        <>
          <CalendarSync className="h-4 w-4" />
          Reschedule booking
        </>
      )}
    </button>
  );
}
