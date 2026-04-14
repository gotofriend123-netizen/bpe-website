import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { MoveRight, MapPin } from "lucide-react";
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

      <section className="py-24 border-b border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
             <AnimatedSection delay={0.1} className="p-8 bg-[#111] rounded-3xl border border-white/10">
                <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center"><PaperIcon name="camera" size={56} /></div>
                <h3 className="font-bold text-white text-xl mb-2">Cinematic Angles</h3>
                <p className="text-gray-400">Multiple practical backdrops and rich, textured foregrounds available on site.</p>
             </AnimatedSection>
             <AnimatedSection delay={0.2} className="p-8 bg-[#111] rounded-3xl border border-white/10">
                <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center"><PaperIcon name="lightbulb" size={56} /></div>
                <h3 className="font-bold text-white text-xl mb-2">Aputure Lighting</h3>
                <p className="text-gray-400">Industry-leading RGB lighting setups to dial in your exact mood.</p>
             </AnimatedSection>
             <AnimatedSection delay={0.3} className="p-8 bg-[#111] rounded-3xl border border-white/10">
                <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center"><PaperIcon name="shield" size={56} /></div>
                <h3 className="font-bold text-white text-xl mb-2">Private & Secure</h3>
                <p className="text-gray-400">Locked-down studio access ensuring talent privacy and focus.</p>
             </AnimatedSection>
          </div>
        </div>
      </section>

    </div>
  );
}
