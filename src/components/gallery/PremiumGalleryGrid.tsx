"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

import { verveImages, arcadeImages } from "@/lib/content/site-images";

type GalleryImage = {
  src: string;
  alt: string;
  space: "verve" | "arcade";
  span?: "tall" | "wide" | "featured";
};

const VERVE_GALLERY: GalleryImage[] = verveImages.map((src, i) => ({
  src,
  alt: `Verve Studio ${i + 1}`,
  space: "verve" as const,
}));

const ARCADE_GALLERY: GalleryImage[] = arcadeImages.map((src, i) => ({
  src,
  alt: `The Arcade ${i + 1}`,
  space: "arcade" as const,
}));

type FilterTab = "all" | "verve" | "arcade";

export function PremiumGalleryGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const allImages = [...VERVE_GALLERY, ...ARCADE_GALLERY];
  const displayed =
    activeFilter === "all"
      ? allImages
      : activeFilter === "verve"
        ? VERVE_GALLERY
        : ARCADE_GALLERY;

  const filters: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All Spaces" },
    { key: "verve", label: "Verve Studio" },
    { key: "arcade", label: "The Arcade" },
  ];

  return (
    <>
      {/* Filter Tabs */}
      <div className="mb-10 flex items-center justify-center">
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`relative rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                activeFilter === filter.key
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Uniform Grid */}
      <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {displayed.map((image, idx) => (
            <motion.div
              key={image.src}
              layout
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
              onClick={() => setLightboxImage(image)}
            >
              {/* Image Container with Fixed Aspect Ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  quality={85}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />


                {/* Corner Glow */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.06] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl sm:p-8"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                width={1400}
                height={900}
                className="h-auto max-h-[85vh] w-auto object-contain"
                quality={95}
                priority
              />

              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-xl transition-all duration-200 hover:border-white/30 hover:bg-white hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Image Label */}
              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl">
                  <Sparkles className="h-3.5 w-3.5" />
                  {lightboxImage.space === "verve" ? "Verve Studio" : "The Arcade"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
