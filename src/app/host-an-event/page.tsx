import Link from "next/link";
import { ArrowRight, CalendarCheck2, LayoutGrid, Mic2 } from "lucide-react";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/events/SectionHeader";

export const metadata = {
  title: "Host An Event | Black Pepper Entertainment",
  description:
    "Bring your event concept to Black Pepper Entertainment and host it in The Arcade or Verve Studio.",
};

export default function HostAnEventPage() {
  return (
    <div className="min-h-screen bg-black pb-24 pt-32 text-white">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(255,255,255,0.03),rgba(0,0,0,0.85))] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.3)] md:p-12">
            <SectionHeader
              eyebrow="For Organizers"
              title="Want to host your event with us?"
              description="If you have a workshop, community format, live session, or ticketed experience worth building, we can help shape it into a premium event flow."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: LayoutGrid,
                  title: "The Arcade",
                  description: "Best for larger audience formats, launches, workshops, and event-led experiences.",
                },
                {
                  icon: Mic2,
                  title: "Verve Studio",
                  description: "Ideal for tighter premium formats, intimate live sets, and creator-led sessions.",
                },
                {
                  icon: CalendarCheck2,
                  title: "Hosted Support",
                  description: "We can help you think through timing, ticket flow, and the event-day experience.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.75rem] border border-white/10 bg-black/30 p-6"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] text-white">
                      <Icon className="h-5 w-5 text-[#f97316]" />
                    </span>
                    <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-zinc-300">{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f97316]"
              >
                Contact The Team
              </Link>
              <Link
                href="/events"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.03] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-200 hover:border-white/24 hover:bg-white/[0.08]"
              >
                Explore Event Formats <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
