import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { MapPin, ArrowRight, Sparkles, Music, GlassWater, MoveRight, Star, CheckCircle2 } from "lucide-react";
import { arcadeImages } from "@/lib/content/site-images";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/seo/LocalSchema";

export const metadata = {
  title: "Premium Party Hall in Raipur | The Arcade by BPE",
  description: "Searching for a premium party hall in Raipur? The Arcade offers cinematic lighting, heavy acoustics, and private lounges to make your birthday or celebration unforgettable.",
};

export default function PartyHallRaipurPage() {
  return (
    <div className="bg-black min-h-screen paper-texture-dark">
      <OrganizationSchema />
      <LocalBusinessSchema
        title="The Arcade - Party Hall in Raipur"
        description={metadata.description}
        url="https://blackpepperentertainment.in/party-hall-raipur"
        image={arcadeImages[1]}
      />

      <section className="relative h-[70vh] min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity"
            style={{ backgroundImage: `url('${arcadeImages[1]}')` }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <AnimatedSection>
             <span className="text-white/80 flex items-center gap-2 font-semibold tracking-widest uppercase text-sm mb-4">
                <MapPin className="w-4 h-4" /> Raipur, Chhattisgarh
             </span>
             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
               Elevate your next <br/> Private Celebration
             </h1>
             <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed mb-8">
               Move away from generic hotel banquets. Book The Arcade, Raipur&apos;s most exclusive party hall, featuring intelligent DMX lighting, serious sound treatment, and stunning architecture.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/calendar?space=arcade" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.1)]">
                  Check Availability <MoveRight className="w-5 h-5" />
                </Link>
             </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 md:py-24 border-b border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
             <AnimatedSection delay={0.1} className="p-8 bg-[#111] rounded-3xl border border-white/10">
              <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center text-white/80"><Sparkles size={36} /></div>
              <h3 className="font-bold text-white text-xl mb-2">Social Vibe</h3>
              <p className="text-gray-400">Warm accent lighting and open spacing perfect for parties.</p>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="p-8 bg-[#111] rounded-3xl border border-white/10">
              <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center text-white/80"><Music size={36} /></div>
              <h3 className="font-bold text-white text-xl mb-2">JBL Audio</h3>
              <p className="text-gray-400">Integrated sound systems that fill the room naturally.</p>
            </AnimatedSection>
            <AnimatedSection delay={0.3} className="p-8 bg-[#111] rounded-3xl border border-white/10">
              <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center text-white/80"><GlassWater size={36} /></div>
              <h3 className="font-bold text-white text-xl mb-2">Self-Service Zone</h3>
              <p className="text-gray-400">Dedicated F&B areas to keep your guests served and happy.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 max-w-4xl mx-auto px-6">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">A Different Class of Party Hall in Raipur</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Most birthday and party halls in Raipur provide four walls and basic white lighting. The Arcade was designed as a production stage. Whether you&apos;re throwing a chic sweet-sixteen, an exclusive 30th birthday bash, or a company wrap-party, the visuals output from the room ensures unforgettable photographs and atmosphere.
          </p>
        </AnimatedSection>
      </section>

    </div>
  );
}
