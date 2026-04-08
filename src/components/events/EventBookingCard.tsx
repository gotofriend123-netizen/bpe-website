"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { EventItem } from "@/lib/events/catalog";

type EventBookingCardProps = {
  event: EventItem;
};

type SubmissionState = {
  fullName: string;
  email: string;
  phone: string;
  quantity: number;
  ticketTierId: string;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function EventBookingCard({ event }: EventBookingCardProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState<SubmissionState>({
    fullName: "",
    email: "",
    phone: "",
    quantity: 1,
    ticketTierId: event.ticketTiers[0]?.id ?? "",
  });

  const activeTier =
    event.ticketTiers.find((tier) => tier.id === formState.ticketTierId) ?? event.ticketTiers[0];
  const total = (activeTier?.price ?? 0) * formState.quantity;
  const soldOut = event.availability === "sold_out";

  const summaryLines = useMemo(
    () => [
      { label: "Selected pass", value: activeTier?.label ?? "Choose a pass" },
      { label: "Quantity", value: String(formState.quantity) },
      { label: "Total", value: formatPrice(total) },
    ],
    [activeTier?.label, formState.quantity, total],
  );

  async function handleSubmit(eventForm: React.FormEvent<HTMLFormElement>) {
    eventForm.preventDefault();

    if (soldOut) {
      toast.error("This event is currently sold out.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/events/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: event.slug,
          ticketTierId: formState.ticketTierId,
          quantity: formState.quantity,
          fullName: formState.fullName,
          email: formState.email,
          phone: formState.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message ?? "Unable to confirm your event booking.");
        return;
      }

      toast.success("Event booking confirmed.");
      router.push(result.confirmationUrl ?? `/events/confirmation?ref=${result.reference}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected booking error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sticky top-28 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.96),rgba(15,15,15,0.9))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full border border-[#f97316]/25 bg-[#f97316]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-orange-100">
            Ticket Booking
          </span>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
            Reserve your spot
          </h3>
        </div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
          <Ticket className="h-5 w-5" />
        </span>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Ticket Type
          </label>
          <div className="grid gap-3">
            {event.ticketTiers.map((tier) => {
              const active = tier.id === formState.ticketTierId;

              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setFormState((current) => ({ ...current, ticketTierId: tier.id }))}
                  className={`rounded-[1.4rem] border px-4 py-4 text-left transition-all duration-200 ${
                    active
                      ? "border-[#f97316]/40 bg-[#f97316]/12 text-white"
                      : "border-white/10 bg-white/[0.03] text-zinc-200 hover:border-white/18 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold">{tier.label}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{tier.description}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-white">
                      {formatPrice(tier.price)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Quantity
          </label>
          <div className="flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-3 py-2">
            <button
              type="button"
              onClick={() =>
                setFormState((current) => ({
                  ...current,
                  quantity: Math.max(1, current.quantity - 1),
                }))
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-lg font-semibold text-white">{formState.quantity}</span>
            <button
              type="button"
              onClick={() =>
                setFormState((current) => ({
                  ...current,
                  quantity: Math.min(10, current.quantity + 1),
                }))
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Full Name
            </label>
            <input
              required
              value={formState.fullName}
              onChange={(eventInput) =>
                setFormState((current) => ({ ...current, fullName: eventInput.target.value }))
              }
              className="w-full rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition-colors focus:border-[#f97316]/40"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Email
            </label>
            <input
              required
              type="email"
              value={formState.email}
              onChange={(eventInput) =>
                setFormState((current) => ({ ...current, email: eventInput.target.value }))
              }
              className="w-full rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition-colors focus:border-[#f97316]/40"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Phone
            </label>
            <input
              required
              type="tel"
              value={formState.phone}
              onChange={(eventInput) =>
                setFormState((current) => ({ ...current, phone: eventInput.target.value }))
              }
              className="w-full rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition-colors focus:border-[#f97316]/40"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="space-y-3">
            {summaryLines.map((line) => (
              <div key={line.label} className="flex items-center justify-between gap-4">
                <span className="text-sm text-zinc-400">{line.label}</span>
                <span className="text-sm font-semibold text-white">{line.value}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || soldOut}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f97316] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : soldOut ? "Sold Out" : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}
