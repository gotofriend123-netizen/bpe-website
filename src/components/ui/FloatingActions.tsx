"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingActions() {
  const pathname = usePathname();
  
  // Hide sticky CTA while the user is already inside the booking flow.
  const showBookingBtn = !pathname?.includes("/booking") && !pathname?.includes("/calendar");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
      
      {/* Floating WhatsApp */}
      <motion.a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-transform hover:scale-110 sm:h-14 sm:w-14"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.a>

      {/* Sticky Book Now (Hides inside booking flow routes) */}
      <AnimatePresence>
        {showBookingBtn && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: 1.2, type: "spring" }}
          >
            <Link
              href="/calendar"
              className="group flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_30px_rgba(255,255,255,0.2)] backdrop-blur-xl transition-all hover:bg-black/60 hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] sm:gap-3 sm:px-4 sm:pr-6 sm:py-3 sm:text-sm sm:tracking-widest"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 sm:h-8 sm:w-8">
                <Calendar className="h-3.5 w-3.5 text-white transition-transform group-hover:scale-110 sm:h-4 sm:w-4" />
              </div>
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
