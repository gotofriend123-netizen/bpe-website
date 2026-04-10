import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { arcadeImages, verveImages } from "@/lib/content/site-images";

export const metadata = {
  title: "About Us | Black Pepper Entertainment",
  description:
    "Learn about the mission and vision behind Black Pepper Entertainment's premium creative spaces — Verve Studio and The Arcade.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pb-24 pt-32">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Header */}
        <AnimatedSection className="mb-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
            Est. 2023
          </span>
          <h1 className="mt-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            About Black Pepper
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-gray-400">
            We exist to provide creators, founders, and communities with breathtaking environments
            that elevate their work. From intimate podcast recordings to large-scale events,
            our spaces are engineered for excellence.
          </p>
        </AnimatedSection>

        {/* Story Section */}
        <div className="mb-32 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <AnimatedSection
            direction="right"
            className="relative h-[500px] overflow-hidden rounded-3xl border border-white/10 bg-white/5"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{ backgroundImage: `url('${arcadeImages[4]}')` }}
            />
          </AnimatedSection>

          <AnimatedSection direction="left" className="space-y-6">
            <h2 className="text-3xl font-bold text-white">The Vision</h2>
            <p className="text-lg leading-relaxed text-gray-400">
              Black Pepper Entertainment was founded on a simple premise: your environment dictates
              your output. We noticed a lack of accessible, genuinely premium spaces that cater to
              both modern digital creators and traditional community gatherings.
            </p>
            <p className="text-lg leading-relaxed text-gray-400">
              By bridging the gap between high-end aesthetic appeal and technical functionality, we
              built an ecosystem where{" "}
              <span className="font-semibold text-white">The Arcade</span> and{" "}
              <span className="font-semibold text-white">Verve Studio</span> operate under one
              unified standard of quality.
            </p>
            <div className="flex gap-12 border-t border-white/10 pt-6">
              <div>
                <p className="mb-2 text-4xl font-bold text-white">2023</p>
                <p className="text-sm uppercase tracking-wider text-gray-500">Established</p>
              </div>
              <div>
                <p className="mb-2 text-4xl font-bold text-white">2</p>
                <p className="text-sm uppercase tracking-wider text-gray-500">Premium Spaces</p>
              </div>
              <div>
                <p className="mb-2 text-4xl font-bold text-white">Jan &apos;26</p>
                <p className="text-sm uppercase tracking-wider text-gray-500">Studios Opened</p>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Our Spaces */}
        <AnimatedSection className="mb-32">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Our Spaces</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-base leading-relaxed text-gray-400">
            Both of our premium creative spaces opened in January 2026, marking a new chapter for
            Black Pepper Entertainment.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Verve Studio */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
              <div className="relative h-72 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${verveImages[0]}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="mb-2 text-2xl font-bold text-white">Verve Studio</h3>
                <p className="mb-1 text-sm font-medium text-white/50">
                  Verve Studio Left &amp; Verve Studio Right
                </p>
                <p className="mt-3 leading-relaxed text-gray-400">
                  A dual-room podcasting and content creation powerhouse. Verve Studio Left and
                  Verve Studio Right offer independent setups with professional-grade acoustics,
                  4K recording gear, and designer interiors — perfect for interviews, solo shows,
                  and multi-host productions.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-wider text-white/60">
                    Podcast
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-wider text-white/60">
                    Interviews
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-wider text-white/60">
                    Content
                  </span>
                </div>
              </div>
            </div>

            {/* The Arcade */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
              <div className="relative h-72 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${arcadeImages[0]}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="mb-2 text-2xl font-bold text-white">The Arcade</h3>
                <p className="mb-1 text-sm font-medium text-white/50">
                  Event &amp; Experience Space
                </p>
                <p className="mt-3 leading-relaxed text-gray-400">
                  A versatile, high-energy venue designed to host everything from brand launches and
                  community meetups to dance workshops and live performances. The Arcade combines
                  premium aesthetics with production-ready infrastructure for unforgettable events.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-wider text-white/60">
                    Events
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-wider text-white/60">
                    Workshops
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-wider text-white/60">
                    Community
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Values */}
        <AnimatedSection className="mb-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">What We Stand For</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Uncompromising Quality",
                desc: "Acoustic treatments, 4K gear, and designer furniture as the baseline, never an upgrade.",
              },
              {
                title: "Frictionless Experience",
                desc: "A booking and management process that stays completely out of your way.",
              },
              {
                title: "Community First",
                desc: "Spaces designed for connection, collaboration, and showcasing the best talent.",
              },
            ].map((v, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-[#111] p-8 transition-colors hover:bg-white/5"
              >
                <h3 className="mb-3 text-xl font-bold text-white">{v.title}</h3>
                <p className="text-gray-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
