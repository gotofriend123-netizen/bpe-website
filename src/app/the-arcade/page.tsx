import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { Users, MoveRight, Lightbulb, Focus, Video, Maximize, CheckCircle2, Music } from "lucide-react";
import { InteractiveSelector } from "@/components/ui/interactive-selector";
import { arcadeImages, verveImages } from "@/lib/content/site-images";

export const metadata = {
  title: "The Arcade | Community Hall by Black Pepper",
  description: "Book The Arcade, our highly versatile community hall for events, pop-ups, workshops, and gatherings.",
};

const AMENITIES = [
  "Customizable Intelligent Lighting",
  "High-Fidelity Audio System",
  "Modular Stage & Seating",
  "High-Speed Wi-Fi",
  "Projector & Screen Setup",
  "Climate Control",
  "Lounge / Green Room Access",
  "On-site Support Staff"
];

const arcadeOptions = [
  {
    title: "Expansive Capacity",
    description: "Comfortably host up to 100 standing guests",
    image: arcadeImages[3],
    icon: <Users size={24} />
  },
  {
    title: "Cinematic Lighting",
    description: "Fully DMX programmable Aputure array",
    image: arcadeImages[1],
    icon: <Lightbulb size={24} />
  },
  {
    title: "Modular Layouts",
    description: "Rearrange the space for any use-case",
    image: arcadeImages[0],
    icon: <Maximize size={24} />
  },
  {
    title: "Acoustic Tuning",
    description: "Engineered panels and heavy curtains",
    image: verveImages[3],
    icon: <Focus size={24} />
  },
  {
    title: "Live Transmission",
    description: "Fiber internet built for streaming",
    image: arcadeImages[5],
    icon: <Video size={24} />
  }
];

export default function TheArcadePage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity"
            style={{ backgroundImage: `url('${arcadeImages[3]}')` }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <AnimatedSection>
             <span className="text-white/60 font-semibold tracking-widest uppercase text-sm mb-4 block">Community Hall</span>
             <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">The Arcade</h1>
             <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed mb-8">
               A vast, flexible canvas built for connection. The ultimate backdrop for your next creative or corporate event.
             </p>
             <Link href="/calendar?space=arcade" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.05)]">
               Book The Arcade <MoveRight className="w-5 h-5" />
             </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats/Specs */}
      <section className="py-12 border-b border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedSection delay={0.1} className="flex flex-col items-center justify-center text-center">
              <Users className="w-8 h-8 text-gray-500 mb-3" />
              <p className="text-2xl font-bold text-white">100 / 60</p>
              <p className="text-sm text-gray-400">Standing / Seated</p>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="flex flex-col items-center justify-center text-center">
              <Maximize className="w-8 h-8 text-gray-500 mb-3" />
              <p className="text-2xl font-bold text-white">1,500 sq ft</p>
              <p className="text-sm text-gray-400">Usable Floor Area</p>
            </AnimatedSection>
            <AnimatedSection delay={0.3} className="flex flex-col items-center justify-center text-center">
              <Music className="w-8 h-8 text-gray-500 mb-3" />
              <p className="text-2xl font-bold text-white">Acoustic</p>
              <p className="text-sm text-gray-400">Treated Space</p>
            </AnimatedSection>
            <AnimatedSection delay={0.4} className="flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-8 h-8 text-gray-500 mb-3" />
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-sm text-gray-400">Availability</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Description & Use Cases */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <AnimatedSection direction="right">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed to adapt to your imagination.</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                The Arcade isn&apos;t just an empty room; it&apos;s a meticulously engineered environment. With smart lighting arrays that can match your brand colors and an open floor plan that accommodates any seating arrangement, The Arcade transforms to meet your exact needs.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Ideal for product launches, art exhibitions, community meetups, panel discussions, and creative workshops.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AMENITIES.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="left" className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div
                  className="h-64 rounded-2xl border border-white/10 bg-white/5 bg-cover bg-center"
                  style={{ backgroundImage: `url('${arcadeImages[4]}')` }}
                />
                <div
                  className="h-40 rounded-2xl border border-white/10 bg-white/5 bg-cover bg-center"
                  style={{ backgroundImage: `url('${arcadeImages[0]}')` }}
                />
              </div>
              <div className="space-y-4 pt-12">
                <div
                  className="h-40 rounded-2xl border border-white/10 bg-white/5 bg-cover bg-center"
                  style={{ backgroundImage: `url('${arcadeImages[1]}')` }}
                />
                <div
                  className="h-64 rounded-2xl border border-white/10 bg-white/5 bg-cover bg-center"
                  style={{ backgroundImage: `url('${arcadeImages[5]}')` }}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mini Pricing Sneak Peek */}
      <section className="py-24 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-6">Transparent Pricing</h2>
            <p className="text-gray-400 text-lg mb-12">Flexible booking options designed for events of every size.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full sm:w-[300px]">
                <p className="text-gray-400 mb-2">Half Day (4 hrs)</p>
                <p className="text-4xl font-bold text-white">₹15,000</p>
              </div>
              <div className="bg-white/5 border border-white/20 rounded-2xl p-8 w-full sm:w-[300px] scale-105 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <p className="text-gray-300 mb-2">Full Day (8 hrs)</p>
                <p className="text-4xl font-bold text-white">₹25,000</p>
              </div>
            </div>
            <div className="mt-12">
               <Link href="/pricing" className="text-white hover:text-gray-300 underline underline-offset-4 decoration-white/30 transition-colors">
                 View all packages & add-ons
               </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* INTERACTIVE SELECTOR */}
      <InteractiveSelector 
        title="Explore The Arcade Features" 
        description="Experience the versatility and premium infrastructure of our expansive community hall." 
        options={arcadeOptions} 
      />

      {/* 6. FINAL CTA */}
      <section className="py-24 border-t border-white/10 bg-gradient-to-t from-[#0a0a0a] to-black">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to host your next event?</h2>
            <Link 
              href="/calendar?space=arcade"
              className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.1)]"
            >
              Book The Arcade Now
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
