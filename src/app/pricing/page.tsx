import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Pricing for Event Hall & Podcast Studio in Raipur | Black Pepper Entertainment",
  description: "Book The Arcade community hall from ₹15,000 or Verve Studio podcast recording studio from ₹3,500 in Raipur. Transparent packages, no hidden fees. Check availability and book online.",
  keywords: [
    "event hall booking price Raipur",
    "podcast studio rent price Raipur",
    "community hall booking charges Raipur",
    "Verve Studio pricing",
    "The Arcade pricing",
    "podcast studio hourly rate Raipur",
    "event venue cost Raipur",
  ],
};

const ARCADE_PKGS = [
  { name: "Half Day Event", price: "₹15,000", duration: "4 Hours", desc: "Perfect for quick workshops, meetups, and art showcases in Raipur.", feats: ["Full hall access", "Basic ambient lighting", "P.A system", "On-site tech support"], popular: false },
  { name: "Full Day Event", price: "₹25,000", duration: "8 Hours", desc: "Ideal for full-day panels, brand launches, and large parties in Raipur.", feats: ["Full hall access", "Custom DMX lighting", "Pro audio mixing deck", "Lounge access", "Pre event setup hour"], popular: true },
];

const VERVE_PKGS = [
  { name: "The Urban Flame", price: "₹4,000", duration: "2 Hours", desc: "Baseline studio-only setup for self-guided podcast creators in Raipur.", feats: ["Acoustic isolation", "Standard ambient lighting", "Raw access", "Add-on mics/cams available"], popular: false },
  { name: "Standard Setup (Crimson Crown, Wave)", price: "₹6,500", duration: "2 Hours", desc: "Most popular setup for straightforward podcast recordings.", feats: ["1x 4K Camera", "1x Shure SM7B", "Aputure Set Lighting", "Raw clips included"], popular: false },
  { name: "Premium Setup (Ivory, Sage, Horizon)", price: "₹8,500", duration: "2 Hours", desc: "Best-in-class dual angle recording setup for interviews and professional podcasts.", feats: ["2x 4K Cameras", "2x Shure SM7B", "Custom aesthetic lighting", "Raw handover"], popular: true },
];

const INCLUDED_IN_ALL = [
  "Free parking (first-come basis)",
  "High-speed WiFi throughout the space",
  "On-site technical support",
  "Access to lounge area",
  "No hidden charges or setup fees",
  "Online booking & instant confirmation",
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "The Arcade — Event Hall Booking Raipur",
      provider: { "@type": "LocalBusiness", name: "Black Pepper Entertainment" },
      areaServed: "Raipur, Chhattisgarh",
      offers: [
        { "@type": "Offer", name: "Half Day Event", price: "15000", priceCurrency: "INR", description: "4 hour event hall booking at The Arcade, Raipur" },
        { "@type": "Offer", name: "Full Day Event", price: "25000", priceCurrency: "INR", description: "8 hour full day event hall booking at The Arcade, Raipur" },
      ],
    },
    {
      "@type": "Service",
      name: "Verve Studio — Podcast Recording Studio Raipur",
      provider: { "@type": "LocalBusiness", name: "Black Pepper Entertainment" },
      areaServed: "Raipur, Chhattisgarh",
      offers: [
        { "@type": "Offer", name: "Urban Flame", price: "4000", priceCurrency: "INR", description: "2 hour podcast studio session Raipur" },
        { "@type": "Offer", name: "Standard Setup", price: "6500", priceCurrency: "INR", description: "2 hour podcast recording with 4K camera and Shure SM7B in Raipur" },
        { "@type": "Offer", name: "Premium Setup", price: "8500", priceCurrency: "INR", description: "2 hour dual-camera premium podcast studio session in Raipur" },
      ],
    },
  ],
};

export default function PricingPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-300 mb-4">Transparent Pricing</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Pricing for Event Hall &amp; Podcast Studio in Raipur</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Book The Arcade from <strong className="text-white">₹15,000</strong> or Verve Studio from <strong className="text-white">₹3,500</strong>. No hidden fees. Instant online confirmation.
          </p>
        </AnimatedSection>

        {/* What Every Booking Includes */}
        <AnimatedSection className="mb-16">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-xl font-bold text-white mb-6 text-center">What Every Booking Includes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {INCLUDED_IN_ALL.map((item) => (
                <div key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-white/60 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* The Arcade Pricing */}
        <div className="mb-24">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">The Arcade</h2>
            <p className="text-center text-gray-400 mb-8">Premium community hall &amp; event space in Raipur — for workshops, launches &amp; parties</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ARCADE_PKGS.map((pkg, i) => (
              <AnimatedSection key={i} delay={0.1 * i} direction="up" className={`relative border rounded-3xl p-8 hover:bg-white/5 transition-colors flex flex-col bg-[#111] ${pkg.popular ? "border-white/30" : "border-white/10"}`}>
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest">
                    ★ Most Popular
                  </span>
                )}
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
                <Link href="/availability?space=arcade" className="w-full py-4 text-center rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                  Book This Package
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Verve Studio Pricing */}
        <div className="mb-16">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-2 text-center">Verve Studio</h2>
            <p className="text-center text-gray-400 mb-8">Professional podcast recording studio in Raipur — 4K cameras, Shure SM7B, acoustic treatment</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VERVE_PKGS.map((pkg, i) => (
              <AnimatedSection key={i} delay={0.1 * i} direction="up" className={`relative border rounded-3xl p-8 hover:bg-white/5 transition-colors flex flex-col bg-[#111] ${pkg.popular ? "border-white/30" : "border-white/10"}`}>
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest">
                    ★ Most Popular
                  </span>
                )}
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
                <Link href="/availability?space=vsl" className="w-full py-4 text-center rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                  Book This Package
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* CTA */}
        <AnimatedSection className="text-center mt-8">
          <p className="text-gray-400 mb-4">Need a custom quote for your event or brand session?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white hover:bg-white hover:text-black transition-all">
            Get a Custom Quote
          </Link>
        </AnimatedSection>
        
      </div>
    </div>
  );
}
