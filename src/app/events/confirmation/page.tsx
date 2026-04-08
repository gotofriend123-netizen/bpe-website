import Link from "next/link";
import { CheckCircle2, Mail, Ticket } from "lucide-react";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { getEventBookingByReference } from "@/lib/events/service";

type EventConfirmationPageProps = {
  searchParams?: {
    ref?: string;
  };
};

export const metadata = {
  title: "Event Booking Confirmation | Black Pepper Entertainment",
};

export default async function EventConfirmationPage({
  searchParams,
}: EventConfirmationPageProps) {
  const reference = searchParams?.ref ?? "";
  const booking = await getEventBookingByReference(reference);

  return (
    <div className="min-h-screen bg-black px-6 pb-24 pt-36 text-white">
      <div className="mx-auto max-w-3xl">
        <AnimatedSection>
          <div className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.3)] md:p-10">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/15 text-emerald-100">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Your event booking is confirmed.
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-zinc-300 md:text-lg md:leading-8">
              Your booking has been captured in the Events system and a confirmation email has been triggered.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-black/35 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    Booking Reference
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {(booking?.reference ?? reference) || "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    Event
                  </p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {booking?.eventTitle ?? "Your selected event"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    Ticket Tier
                  </p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {booking?.ticketTierLabel ?? "Selected tier"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    Quantity
                  </p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {booking?.quantity ?? 1}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <Mail className="h-5 w-5 text-[#f97316]" />
                <h2 className="mt-4 text-xl font-semibold text-white">Confirmation email</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-400">
                  {booking?.confirmationEmailSent
                    ? "A booking email was sent successfully."
                    : "If email delivery is configured, a confirmation email will land in the guest inbox shortly."}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <Ticket className="h-5 w-5 text-[#f97316]" />
                <h2 className="mt-4 text-xl font-semibold text-white">Need help?</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-400">
                  Reach out to the team if you need support with your booking, access, or event-day questions.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/events"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f97316]"
              >
                Back To Events
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/[0.03] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-200 hover:border-white/24 hover:bg-white/[0.08]"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
