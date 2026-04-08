import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { MoveRight, Play, LayoutGrid } from "lucide-react";
import { arcadeImages, verveImages } from "@/lib/content/site-images";

export const metadata = {
  title: "Spaces | The Arcade & Verve Studio",
  description: "Explore the premium spaces at Black Pepper Entertainment.",
};

export default function SpacesPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <AnimatedSection className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Our Spaces
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the perfect environment for your next big idea.
          </p>
        </AnimatedSection>

        <div className="space-y-32">
          
          {/* Virtual Split - The Arcade */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="right" className="order-2 lg:order-1 space-y-8 pr-0 lg:pr-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                <LayoutGrid className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-300">
                  Community Hall
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">The Arcade</h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                A massive, flexible canvas designed for events, exhibitions, panel discussions, and creative workshops. Completely customizable layouts with premium lighting control.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full" /> Up to 100 standing / 60 seated</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full" /> Customizable ambient lighting</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full" /> Integrated sound system</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full" /> Lounge styling & decor included</li>
              </ul>
              <div className="pt-4 flex gap-4 flex-wrap">
                <Link href="/the-arcade" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                  View Details
                </Link>
                <Link href="/calendar?space=arcade" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-colors flex items-center gap-2 group">
                  Book Now <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="left" className="order-1 lg:order-2 h-[600px] rounded-3xl border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"
                style={{ backgroundImage: `url('${arcadeImages[3]}')` }}
              />
            </AnimatedSection>
          </div>

          {/* Virtual Split - Verve Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="right" className="h-[600px] rounded-3xl border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"
                style={{ backgroundImage: `url('${verveImages[2]}')` }}
              />
            </AnimatedSection>

            <AnimatedSection direction="left" className="space-y-8 pl-0 lg:pl-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                <Play className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-300">
                  Podcast Studio
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">Verve Studio</h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                The ultimate creator playground. Acoustically treated, heavily stylized, and fully equipped for multi-cam 4K podcast recordings and solo productions.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full" /> Multi-cam 4K setup included</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full" /> Shure SM7B broadcast mics</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full" /> Multiple set designs (Left/Right)</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full" /> Professional audio interfacing</li>
              </ul>
              <div className="pt-4 flex gap-4 flex-wrap">
                <Link href="/verve-studio" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                  View Details
                </Link>
                <Link href="/calendar?space=vsl" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-colors flex items-center gap-2 group">
                  Book Now <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
          </div>

        </div>

      </div>
    </div>
  );
}
