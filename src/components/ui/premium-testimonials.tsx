"use client";

import { Star } from "lucide-react";

import { arcadeImages, verveImages } from "@/lib/content/site-images";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechFlow Solutions",
    company: "TechFlow",
    avatar: arcadeImages[0],
    rating: 5,
    text: "Black Pepper Entertainment transformed our entire operation. We saw immediate gains in efficiency and the premium venue experience felt polished from arrival to wrap.",
    results: ["300% efficiency increase", "$2M cost savings", "24/7 automation"],
  },
  {
    name: "Marcus Johnson",
    role: "CTO, DataDrive Inc",
    company: "DataDrive",
    avatar: verveImages[1],
    rating: 5,
    text: "The audio spaces are revolutionary. Production quality increased while setup time dropped dramatically. It feels expensive in all the right ways.",
    results: ["40% satisfaction boost", "Instant responses", "Seamless integration"],
  },
  {
    name: "Elena Rodriguez",
    role: "VP Operations, ScaleUp Co",
    company: "ScaleUp",
    avatar: arcadeImages[4],
    rating: 5,
    text: "From creative stages to community halls, Black Pepper handles everything. Our team can finally focus on the session instead of the logistics.",
    results: ["Full automation", "Strategic focus", "Team productivity"],
  },
  {
    name: "David Kim",
    role: "Founder, GrowthLab",
    company: "GrowthLab",
    avatar: verveImages[5],
    rating: 5,
    text: "The custom spaces delivered beyond expectations. Attendance increased, operational overhead dropped, and the whole experience felt premium.",
    results: ["150% revenue growth", "Reduced overhead", "Scalable systems"],
  },
  {
    name: "Lisa Thompson",
    role: "Director, InnovateCorp",
    company: "InnovateCorp",
    avatar: arcadeImages[2],
    rating: 5,
    text: "Exceptional luxury studios that actually deliver. The booking flow was smooth, the ambiance was immediate, and the results justified the investment.",
    results: ["Immediate results", "Smooth integration", "High ROI"],
  },
] as const;

const marqueeTestimonials = [...testimonials, ...testimonials];

export function PremiumTestimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-[#050505] py-10 text-white md:py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="sr-only">What guests and teams say about Black Pepper Entertainment.</h2>
        <p className="sr-only">
          Infinite testimonial slider highlighting premium experiences across The Arcade and Verve Studio.
        </p>

        <div className="overflow-hidden">
          <div className="testimonial-marquee flex w-max gap-4 md:gap-5">
            {marqueeTestimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="w-[18rem] shrink-0 overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.042),rgba(255,255,255,0.01))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:w-[22rem] md:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-sm font-medium text-zinc-300">{testimonial.role}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-[#d6b98c] text-[#d6b98c]"
                    />
                  ))}
                </div>

                <blockquote className="mt-4 text-sm leading-7 text-white/82">
                  &quot;{testimonial.text}&quot;
                </blockquote>

                <div className="mt-4 flex flex-wrap gap-2">
                  {testimonial.results.map((result) => (
                    <span
                      key={`${testimonial.name}-${result}`}
                      className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-zinc-200"
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes testimonial-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .testimonial-marquee {
          animation: testimonial-marquee 34s linear infinite;
          will-change: transform;
        }

        .testimonial-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
