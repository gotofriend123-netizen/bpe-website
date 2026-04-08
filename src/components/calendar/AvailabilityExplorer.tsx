"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Space } from "@/lib/types/booking";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SpaceSwitcher } from "@/components/calendar/SpaceSwitcher";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { TimeSlotList } from "@/components/calendar/TimeSlotList";
import { GlowCard } from "@/components/ui/GlowCard";
import { resolveSpaceFromParams } from "@/lib/booking-utils";
import { verveImages } from "@/lib/content/site-images";

export function AvailabilityExplorer() {
  const searchParams = useSearchParams();
  const initialSpace =
    resolveSpaceFromParams({
      bookingType: searchParams.get("bookingType"),
      space: searchParams.get("space"),
      studio: searchParams.get("studio"),
    }) ?? "vsl";

  const [space, setSpace] = useState<Space>(initialSpace);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setSpace(initialSpace);
  }, [initialSpace]);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const handleSpaceChange = (nextSpace: Space) => {
    setSpace(nextSpace);
    setSelectedDate(new Date());
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 text-white font-sans selection:bg-white/30 selection:text-white">
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-20 mix-blend-screen blur-lg"
        style={{ backgroundImage: `url('${verveImages[2]}')` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <AnimatedSection>
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-bold tracking-widest uppercase text-gray-300 drop-shadow-lg mb-6 inline-block shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              Real-Time Availability
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Schedule Your Session
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-medium pb-8 border-b border-white/10">
              Select a space to view calendars, time slots, and peak-pricing metrics.
            </p>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.1} className="mb-16">
          <SpaceSwitcher selected={space} onChange={handleSpaceChange} />
        </AnimatedSection>

        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-8 lg:flex-row lg:gap-12">
          <div className="w-full lg:w-1/2">
            <AnimatedSection delay={0.2} direction="right">
              {selectedDate && (
                <CalendarGrid
                  space={space}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              )}
            </AnimatedSection>
          </div>

          <div className="w-full lg:w-1/2 min-h-[500px]">
            <AnimatedSection delay={0.3} direction="left" className="w-full h-full">
              <GlowCard
                className="min-h-[500px]"
                contentClassName="h-full p-6 md:p-8"
                backgroundColor="#09070f"
                borderRadius={30}
              >
                {selectedDate && <TimeSlotList space={space} selectedDate={selectedDate} />}
              </GlowCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
