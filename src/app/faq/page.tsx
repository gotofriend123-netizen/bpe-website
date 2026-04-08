"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "How do I book a space?", a: "You can book directly through our online reservation system. Just head to the Booking page, select your desired space (The Arcade or Verve Studio), choose your package, date, and time. Your slot will be instantly requested." },
  { q: "Is payment required in advance?", a: "Yes, to secure your slot and lock in your hardware/crew requirements, a full payment or allowed advance payment is required upon confirmation of the booking email." },
  { q: "What is the cancellation policy?", a: "Cancellations made 48 hours before the scheduled time receive a 100% refund. Cancellations made within 24-48 hours receive a 50% refund. No refunds for no-shows or cancellations within 24 hours." },
  { q: "Can I bring my own gear/crew?", a: "Absolutely. While we provide top-of-the-line 4K equipment and audio interfaces, you are welcome to bring your own directors, DPs, or additional specialized equipment into the space." },
  { q: "Will raw footage be provided immediately?", a: "Yes. Simply bring your own high-speed storage (SSD or SD card), and you leave the studio with your raw 4K video files and multi-track audio immediately after the session." },
  { q: "Do you provide parking?", a: "We have designated spots available on a first-come, first-served basis, alongside safe surrounding street parking." }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">FAQ</h1>
          <p className="text-xl text-gray-400">Everything you need to know before stepping into our spaces.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-lg text-white">{faq.q}</span>
                  <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform duration-300", isOpen && "rotate-180")} />
                </button>
                <div 
                  className={cn(
                    "px-6 text-gray-400 overflow-hidden transition-all duration-300",
                    isOpen ? "pb-5 max-h-96 opacity-100" : "max-h-0 opacity-0 pb-0"
                  )}
                >
                  {faq.a}
                </div>
              </div>
            )
          })}
        </AnimatedSection>
      </div>
    </div>
  );
}
