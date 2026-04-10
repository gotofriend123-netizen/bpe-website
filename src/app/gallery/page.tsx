import { Suspense } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { PremiumGalleryGrid } from "@/components/gallery/PremiumGalleryGrid";

export const metadata = {
  title: "Gallery | Black Pepper Entertainment",
  description:
    "Explore the incredible moments captured at Verve Studio and The Arcade — the premium creative spaces by Black Pepper Entertainment.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-black pb-24 pt-32">
      <div className="container mx-auto max-w-[1680px] px-4 sm:px-6">
        {/* Header */}
        <AnimatedSection className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 backdrop-blur-xl">
            Our Visual Story
          </span>
          <h1 className="mt-6 font-serif text-5xl font-bold tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
            Gallery
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Step inside Verve Studio and The Arcade — our two premium creative
            spaces designed for podcasts, events, interviews, and unforgettable
            brand experiences.
          </p>
        </AnimatedSection>

        {/* Gallery Grid */}
        <AnimatedSection delay={0.15}>
          <Suspense fallback={null}>
            <PremiumGalleryGrid />
          </Suspense>
        </AnimatedSection>
      </div>
    </div>
  );
}
