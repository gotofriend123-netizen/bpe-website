"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { formatIsoDate, getSpaceLabelFromParams } from "@/lib/booking-utils";
import {
  BUSINESS_SUPPORT_EMAIL,
  BUSINESS_SUPPORT_WHATSAPP_DISPLAY,
  getBusinessSupportWhatsappLink,
} from "@/lib/business/contact";

function getDeliveryTone(state: string | null) {
  if (state === "sent") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-100";
  }

  if (state === "failed") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-100";
  }

  return "border-white/10 bg-white/[0.03] text-zinc-200";
}

function BookingConfirmationPageContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || 'PENDING';
  const space = searchParams.get('space');
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const status = searchParams.get("status") || "confirmed";
  const customerEmailDelivery = searchParams.get("customerEmailDelivery");
  const customerWhatsappDelivery = searchParams.get("customerWhatsappDelivery");

  const spaceName =
    getSpaceLabelFromParams({
      bookingType: space,
      space,
    }) ?? space;

  return (
    <main className="min-h-screen bg-black text-white font-sans pt-32 pb-24 flex items-center justify-center">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-green-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-2xl">
        <AnimatedSection className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl backdrop-blur-3xl text-center">
          
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            {status === "confirmed" ? "Booking Confirmed." : "Booking Request Received."}
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
            {status === "confirmed"
              ? "Your session has been successfully reserved. Your booking reference and delivery status are ready below."
              : "Your request has been received. The team will review the slot and confirm availability shortly."}
          </p>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-10 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
               <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">Reference Number</span>
               <span className="font-mono text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-md">{ref}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                 <span className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><MapPin size={12}/> Space</span>
                 <span className="text-white font-semibold">{spaceName || 'Not Selected'}</span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><CalendarDays size={12}/> Date</span>
                 <span className="text-white font-semibold">{date ? formatIsoDate(date, 'MMMM do, yyyy') : 'TBD'}</span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><Clock size={12}/> Time</span>
                 <span className="text-white font-semibold">{time || 'TBD'}</span>
              </div>
            </div>
          </div>

          <div className="mb-10 grid gap-4 text-left sm:grid-cols-2">
            <div className={`rounded-2xl border p-5 ${getDeliveryTone(customerEmailDelivery)}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                Confirmation email
              </p>
              <p className="mt-3 text-sm leading-7">
                {customerEmailDelivery === "sent"
                  ? "Your confirmation email was sent successfully."
                  : customerEmailDelivery === "failed"
                    ? "Booking succeeded, but email delivery needs a retry or manual follow-up."
                    : "Booking succeeded. Email delivery will be attempted when configuration is ready."}
              </p>
            </div>
            <div className={`rounded-2xl border p-5 ${getDeliveryTone(customerWhatsappDelivery)}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                WhatsApp confirmation
              </p>
              <p className="mt-3 text-sm leading-7">
                {customerWhatsappDelivery === "sent"
                  ? "A WhatsApp confirmation was sent to the booking phone number."
                  : customerWhatsappDelivery === "failed"
                    ? "Booking succeeded, but WhatsApp delivery needs a retry or manual follow-up."
                    : "Booking succeeded. WhatsApp delivery will be attempted when the sandbox setup is ready."}
              </p>
            </div>
          </div>

          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Support contacts
            </p>
            <div className="mt-4 grid gap-3">
              <a
                href={`mailto:${BUSINESS_SUPPORT_EMAIL}?subject=Booking%20help%20${ref}`}
                className="min-w-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left text-sm text-white transition-colors hover:bg-white hover:text-black"
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Email support
                </span>
                <span className="mt-2 block break-all text-sm font-medium leading-6 text-white [overflow-wrap:anywhere]">
                  {BUSINESS_SUPPORT_EMAIL}
                </span>
              </a>
              <a
                href={getBusinessSupportWhatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left text-sm text-white transition-colors hover:bg-white hover:text-black"
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  WhatsApp
                </span>
                <span className="mt-2 block break-all text-sm font-medium leading-6 text-white [overflow-wrap:anywhere]">
                  {BUSINESS_SUPPORT_WHATSAPP_DISPLAY}
                </span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href={`/booking/manage?ref=${ref}`}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
            >
              Manage Booking <ArrowRight size={18} />
            </Link>
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              Return Home
            </Link>
          </div>

        </AnimatedSection>
      </div>
    </main>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black pt-32 text-white" />}>
      <BookingConfirmationPageContent />
    </Suspense>
  );
}
