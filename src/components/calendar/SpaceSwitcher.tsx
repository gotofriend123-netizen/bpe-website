"use client";

import { motion } from "framer-motion";
import { Space } from "@/lib/types/booking";

interface SpaceSwitcherProps {
  selected: Space;
  onChange: (space: Space) => void;
}

export const SpaceSwitcher = ({ selected, onChange }: SpaceSwitcherProps) => {
  const options: { id: Space; label: string }[] = [
    { id: 'vsl', label: 'Verve Studio L' },
    { id: 'vsr', label: 'Verve Studio R' },
    { id: 'arcade', label: 'The Arcade' }
  ];

  return (
    <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-full w-full max-w-md mx-auto relative backdrop-blur-xl">
      {options.map((option) => {
        const isActive = selected === option.id;

        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`relative flex-1 py-2.5 px-4 text-sm font-bold text-center rounded-full transition-colors z-10 ${
              isActive ? "text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="space-switcher-active"
                className="absolute inset-0 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
