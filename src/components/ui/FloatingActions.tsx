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
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
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
              className="bg-black/40 backdrop-blur-xl border border-white/20 text-white pl-4 pr-6 py-3 rounded-full font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:bg-black/60 transition-all group uppercase tracking-widest text-sm"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                 <Calendar className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </div>
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
