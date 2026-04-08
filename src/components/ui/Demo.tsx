"use client";
import React from "react";
import { motion } from "framer-motion";

export function Demo() {
  const items = [
    "The Arcade",
    "Community Hall",
    "Up to 100 Standing",
    "Up to 60 Seated",
    "Customizable Ambient Lighting",
    "Integrated Sound System",
    "Flexible Event Layouts",
    "Workshops • Exhibitions • Panels",
    "Verve Studio",
    "Premium Podcast Studio",
    "Modern Podcast Setup",
    "Creator-Friendly Space",
    "Interview & Talk Show Ready",
    "Premium Audio Environment",
    "Content Creation Ready",
    "Record • Create • Speak"
  ];

  return (
    <div className="relative flex w-full overflow-hidden bg-black py-1 pointer-events-none">
      <motion.div
        className="flex min-w-max shrink-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          ease: "linear",
          duration: 34,
          repeat: Infinity,
        }}
      >
        <div className="flex shrink-0 items-center justify-around gap-10 pr-10 sm:gap-12 sm:pr-12">
          {items.map((text, i) => (
            <React.Fragment key={i}>
              <span className="whitespace-nowrap px-1 text-sm font-bold uppercase tracking-[0.32em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] sm:text-base md:text-lg lg:text-xl">
                {text}
              </span>
              <span className="mx-2 text-lg font-light text-white/30 sm:text-xl">•</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex shrink-0 items-center justify-around gap-10 pr-10 sm:gap-12 sm:pr-12">
          {items.map((text, i) => (
            <React.Fragment key={i + items.length}>
              <span className="whitespace-nowrap px-1 text-sm font-bold uppercase tracking-[0.32em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] sm:text-base md:text-lg lg:text-xl">
                {text}
              </span>
              <span className="mx-2 text-lg font-light text-white/30 sm:text-xl">•</span>
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
