/* eslint-disable @next/next/no-img-element */
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { MapPin, Mic2, Camera, Users, MoveRight } from "lucide-react";
import { verveImages } from "@/lib/content/site-images";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/seo/LocalSchema";

export const metadata = {
  title: "Premium Podcast Studio in Raipur | Verve Studio",
  description: "Record your podcast at Verve Studio in Raipur, Chhattisgarh. Fully equipped with Shure SM7B mics, 4K Blackmagic cameras, and professional lighting.",
};

export default function PodcastStudioRaipurPage() {
  return (
    <div className="bg-black min-h-screen paper-texture-dark">
      <OrganizationSchema />
      <LocalBusinessSchema
        title="Verve Studio - Podcast Studio in Raipur"
        description={metadata.description}
        url="https://blackpepperentertainment.in/podcast-studio-raipur"
        image={verveImages[2]}
      />

      <section className="relative h-[70vh] min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity"
            style={{ backgroundImage: `url('${verveImages[2]}')` }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <AnimatedSection>
             <span className="text-white/80 flex items-center gap-2 font-semibold tracking-widest uppercase text-sm mb-4">
                <MapPin className="w-4 h-4" /> Raipur, Chhattisgarh
             </span>
             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
               Raipur&apos;s #1 Dedicated <br/> Podcast Studio
             </h1>
             <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed mb-8">
               Don&apos;t compromise on audio quality or lighting. Verve Studio is a fully soundproofed environment equipped with industry-standard 4K cameras and Shure microphones designed for creators in Chhattisgarh.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/calendar?space=vsl" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.1)]">
                  Book Studio Time <MoveRight className="w-5 h-5" />
                </Link>
             </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 md:py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <AnimatedSection direction="right">
          <h2 className="text-3xl font-bold mb-6">Designed for Seamless Video Podcasts</h2>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            Whether you are recording an interview, launching a video series, or conducting corporate training, Verve Studio removes the friction of production. Just bring your SD cards or hard-drive, sit down, and hit record.
          </p>
          <ul className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-6 bg-white/[0.04] border border-white/10 rounded-2xl">
              <div className="shrink-0 text-white/70"><Mic2 size={24} /></div>
              <div>
                <h3 className="font-bold text-white mb-1">Shure SM7B Setup</h3>
                <p className="text-gray-400 text-sm">Professional audio chain for that rich, broadcast vocal sound.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-white/[0.04] border border-white/10 rounded-2xl">
              <div className="shrink-0 text-white/70"><Camera size={24} /></div>
              <div>
                <h3 className="font-bold text-white mb-1">Multi-Cam 4K</h3>
                <p className="text-gray-400 text-sm">Every session is captured in stunning 4K with cinema-grade Sony gear.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-white/[0.04] border border-white/10 rounded-2xl">
              <div className="shrink-0 text-white/70"><Users size={24} /></div>
              <div>
                <h3 className="font-bold text-white mb-1">Host & Guest Staging</h3>
                <p className="text-gray-400 text-sm">Two distinct sets (VSL & VSR) built for interviews and solo shows.</p>
              </div>
            </div>
          </ul>
        </AnimatedSection>
        <AnimatedSection direction="left">
           <img src={verveImages[5]} alt="Podcast Studio recording setup in Raipur" className="rounded-3xl border border-white/10 shadow-2xl" />
        </AnimatedSection>
      </section>

    </div>
  );
}
