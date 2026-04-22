import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { MapPin, ArrowRight, Camera, Lightbulb, Shield, MoveRight, Star, CheckCircle2 } from "lucide-react";
import { PaperIcon } from "@/components/ui/PaperIcon";
import { verveImages } from "@/lib/content/site-images";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/seo/LocalSchema";

export const metadata = {
  title: "Premium Photoshoot Studio in Raipur | Verve Studio",
  description: "Book an aesthetic, fully lit photoshoot studio in Raipur. Perfect for model portfolios, brand campaigns, and creative agencies.",
};

export default function PhotoshootStudioRaipurPage() {
  return (
    <div className="bg-black min-h-screen paper-texture-dark">
      <OrganizationSchema />
      <LocalBusinessSchema
        title="Verve Studio - Photoshoot Studio in Raipur"
        description={metadata.description}
        url="https://blackpepperentertainment.in/photoshoot-studio-raipur"
        image={verveImages[0]}
      />

      <section className="relative h-[70vh] min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity"
            style={{ backgroundImage: `url('${verveImages[0]}')` }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <AnimatedSection>
             <span className="text-white/80 flex items-center gap-2 font-semibold tracking-widest uppercase text-sm mb-4">
                <MapPin className="w-4 h-4" /> Raipur, Chhattisgarh
             </span>
             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
               Raipur&apos;s Most Aesthetic <br/> Photoshoot Studio
             </h1>
             <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed mb-8">
               A meticulously designed studio space providing deep, dramatic lighting contexts and fully customizable sets. Ideal for high-end fashion, brand campaigns, and creative portraiture.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/calendar?space=vsl" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.1)]">
                  Reserve Studio <MoveRight className="w-5 h-5" />
                </Link>
             </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 md:py-24 border-b border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
             <AnimatedSection delay={0.1}>
              <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center">
                <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center text-white/80"><Camera size={36} /></div>
                <h3 className="font-bold text-white mb-2">Ideal Angles</h3>
                <p className="text-sm text-gray-400">Multiple corners designed for high-end fashion and brand photography.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center">
                <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center text-white/80"><Lightbulb size={36} /></div>
                <h3 className="font-bold text-white mb-2">Premium Lighting</h3>
                <p className="text-sm text-gray-400">Pro Aputure LED setups available for shoot day rentals.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center">
                <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center text-white/80"><Shield size={36} /></div>
                <h3 className="font-bold text-white mb-2">Private & Secure</h3>
                <p className="text-sm text-gray-400">A controlled environment to maintain privacy for high-profile client shoots.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

    </div>
  );
}
