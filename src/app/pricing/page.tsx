import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Pricing & Packages | Black Pepper Entertainment",
  description: "Transparent pricing for The Arcade and Verve Studio.",
};

const ARCADE_PKGS = [
  { name: "Half Day Event", price: "₹15,000", duration: "4 Hours", desc: "Perfect for quick workshops, meetups, and art showcases.", feats: ["Full hall access", "Basic ambient lighting", "P.A system", "On-site tech support"] },
  { name: "Full Day Event", price: "₹25,000", duration: "8 Hours", desc: "Ideal for full-day panels, launch events, and massive parties.", feats: ["Full hall access", "Custom DMX lighting", "Pro audio mixing deck", "Lounge access", "Pre event setup hour"] },
];

const VERVE_PKGS = [
  { name: "Creator Session", price: "₹3,500", duration: "2 Hours", desc: "For straightforward 2-person podcast recordings.", feats: ["2x 4K Cams", "2x Shure SM7B", "Basic lighting", "Raw handover"] },
  { name: "Professional Block", price: "₹6,000", duration: "4 Hours", desc: "For long-form multiset content and brand shoots.", feats: ["Up to 4Cams", "4x Shure SM7B", "Custom aesthetic lighting", "Multi-track audio raw", "Set assistant"] },
];

export default function PricingPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedSection className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Transparent Pricing</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose a package that fits your creative scale. No hidden fees.
          </p>
        </AnimatedSection>

        {/* The Arcade Pricing */}
        <div className="mb-24">
          <AnimatedSection><h2 className="text-3xl font-bold mb-8 text-center">The Arcade (Community Hall)</h2></AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ARCADE_PKGS.map((pkg, i) => (
              <AnimatedSection key={i} delay={0.1 * i} direction="up" className="bg-[#111] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-colors relative flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-gray-400">{pkg.desc}</p>
                </div>
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{pkg.price}</span>
                  <span className="text-gray-500">/ {pkg.duration}</span>
                </div>
                <div className="space-y-4 mb-8 flex-1">
                  {pkg.feats.map((f, j) => (
                    <div key={j} className="flex gap-3 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/calendar?space=arcade" className="w-full py-4 text-center rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                  Select Package
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Verve Studio Pricing */}
        <div>
          <AnimatedSection><h2 className="text-3xl font-bold mb-8 text-center">Verve Studio (Podcast)</h2></AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VERVE_PKGS.map((pkg, i) => (
              <AnimatedSection key={i} delay={0.1 * i} direction="up" className="bg-[#111] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-colors relative flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-gray-400">{pkg.desc}</p>
                </div>
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{pkg.price}</span>
                  <span className="text-gray-500">/ {pkg.duration}</span>
                </div>
                <div className="space-y-4 mb-8 flex-1">
                  {pkg.feats.map((f, j) => (
                    <div key={j} className="flex gap-3 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/calendar?space=vsl" className="w-full py-4 text-center rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                  Select Package
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
