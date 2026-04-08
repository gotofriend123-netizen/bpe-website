import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { Mic, Mic2, Speaker, Headphones, Video, MoveRight, Camera, Armchair, Monitor, Radio as Soundwave } from "lucide-react";
import { InteractiveSelector } from "@/components/ui/interactive-selector";
import { arcadeImages, verveImages } from "@/lib/content/site-images";

export const metadata = {
  title: "Verve Studio | Premium Podcast & Content Studio",
  description: "Book Verve Studio for pristine 4K podcast recordings, interviews, and brand conversations. Fully equipped and professionally lit.",
};

const verveOptions = [
  {
    title: "Broadcast Audio",
    description: "Shure SM7B mics & RØDECaster setup",
    image: verveImages[2],
    icon: <Mic size={24} />
  },
  {
    title: "4K Blackmagic",
    description: "Cinema cameras pre-rigged and balanced",
    image: verveImages[5],
    icon: <Camera size={24} />
  },
  {
    title: "The Left Set",
    description: "Warm, ambient, conversational lighting",
    image: verveImages[0],
    icon: <Armchair size={24} />
  },
  {
    title: "The Right Set",
    description: "Moody, high-contrast neon aesthetics",
    image: verveImages[4],
    icon: <Monitor size={24} />
  },
  {
    title: "Pristine Isolation",
    description: "Triple-layered acoustic soundproofing",
    image: arcadeImages[1],
    icon: <Soundwave size={24} />
  }
];

export default function VerveStudioPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[700px] flex items-center justify-center text-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/90 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-screen"
            style={{ backgroundImage: `url('${verveImages[2]}')` }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <AnimatedSection>
             <span className="text-white/60 font-semibold tracking-widest uppercase text-sm mb-4 block">Podcast Studio</span>
             <h1 className="text-6xl md:text-9xl font-bold text-white mb-6 blur-[0.3px]">Verve Studio</h1>
             <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
               Engineering pristine conversations. The premier podcast and content creator studio delivering uncompromising 4K visual and audio fidelity.
             </p>
             <Link href="/calendar?space=vsl" className="inline-flex items-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/20 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.1)]">
               Book Verve Studio <MoveRight className="w-5 h-5" />
             </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Equipment Showcase */}
      <section className="py-24 border-b border-white/5">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Industry-Standard Gear</h2>
            <p className="text-gray-400">Everything you need to hit record. Unmatched production value built-in.</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedSection delay={0.1} direction="up" className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center hover:bg-white/5 transition-colors">
              <Video className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">4K Cinema Cams</h3>
              <p className="text-sm text-gray-400">Crisp, cinematic visuals with stunning depth of field.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="up" className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center hover:bg-white/5 transition-colors">
              <Mic2 className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Shure SM7B</h3>
              <p className="text-sm text-gray-400">The industry standard for warm, perfect broadcast sound.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.3} direction="up" className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center hover:bg-white/5 transition-colors">
              <Speaker className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Aputure Lighting</h3>
              <p className="text-sm text-gray-400">Beautiful, flattering lighting engineered per set.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.4} direction="up" className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center hover:bg-white/5 transition-colors">
              <Headphones className="w-10 h-10 text-white mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Zero Friction</h3>
              <p className="text-sm text-gray-400">Bring your SD card or hard drive and take raw stems immediately.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Split Sets */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6 max-w-6xl">
           <AnimatedSection className="mb-16 text-center">
             <h2 className="text-4xl font-bold text-white">Two Distinct Aesthetics</h2>
             <p className="text-gray-400 mt-4">Verve Studio offers two uniquely styled podcast corners.</p>
           </AnimatedSection>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Left Set */}
             <AnimatedSection delay={0.1} direction="right" className="group">
               <div className="relative h-[400px] rounded-3xl border border-white/10 overflow-hidden mb-6">
                 <div
                   className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                   style={{ backgroundImage: `url('${verveImages[0]}')` }}
                 />
                 <div className="absolute inset-0 bg-black/20" />
               </div>
               <h3 className="text-3xl font-bold text-white mb-2">Verve Studio - Left</h3>
               <p className="text-gray-400">A dark, moody, neon-accented environment perfect for intense, deep-dive conversations and modern creator branding.</p>
             </AnimatedSection>

             {/* Right Set */}
             <AnimatedSection delay={0.2} direction="left" className="group">
               <div className="relative h-[400px] rounded-3xl border border-white/10 overflow-hidden mb-6">
                 <div
                   className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                   style={{ backgroundImage: `url('${verveImages[5]}')` }}
                 />
                 <div className="absolute inset-0 bg-black/20" />
               </div>
               <h3 className="text-3xl font-bold text-white mb-2">Verve Studio - Right</h3>
               <p className="text-gray-400">A warmer, wood-toned, softer aesthetic designed for intimate interviews, storytelling, and elegant brand visuals.</p>
             </AnimatedSection>
           </div>
        </div>
      </section>

      {/* INTERACTIVE SELECTOR */}
      <InteractiveSelector 
        title="Verve Studio Equipment" 
        description="Everything you need to shoot a hit podcast is included in your booking." 
        options={verveOptions} 
      />

    </div>
  );
}
