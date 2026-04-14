"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function FaqAccordion({ faqs }: { faqs: { q: string; a: string; }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <AnimatedSection delay={0.2} className="space-y-4">
      {faqs.map((faq, i) => {
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
  );
}
