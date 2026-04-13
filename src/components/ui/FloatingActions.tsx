"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBusinessSupportWhatsappLink } from "@/lib/business/contact";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const pathname = usePathname();
  const showBookingBtn = !pathname?.includes("/booking") && !pathname?.includes("/calendar");
  const whatsappLink = getBusinessSupportWhatsappLink();

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-4 sm:bottom-6 sm:right-6">
      {/* WhatsApp */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-transform hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>

      {/* Book Now */}
      <AnimatePresence>
        {showBookingBtn && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: 1.2, type: "spring" }}
          >
            <Link
              href="/booking"
              className={cn(
                "group flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(255,255,255,0.2)] backdrop-blur-xl transition-all hover:bg-black/80 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Calendar className="h-4 w-4 text-white transition-transform group-hover:scale-110" />
              </div>
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}