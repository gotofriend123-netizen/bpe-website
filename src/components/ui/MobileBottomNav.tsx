"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Ticket, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "events", label: "Events", href: "/events", icon: Ticket },
  { key: "scan-qr", label: "Scan QR", href: "/scan-qr", icon: ScanLine },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Background */}
      <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:w-auto">
        <div className="relative flex items-center justify-center gap-1 rounded-full border border-white/10 bg-[#0a0a0a]/95 px-2 py-2 shadow-[0_0_40px_rgba(0,0,0,0.6),0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d8f24d]/5 via-transparent to-[#d8f24d]/5 pointer-events-none" />
          
          <div className="relative flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "group relative flex flex-col items-center gap-0.5 rounded-full px-3 py-2 transition-all duration-300",
                    isActive
                      ? "text-[#d8f24d]"
                      : "text-white/50 hover:text-white",
                  )}
                >
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#d8f24d] shadow-[0_0_8px_#d8f24d]" />
                  )}
                  
                  <div className={cn(
                    "relative flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-[#d8f24d]/10 shadow-[0_0_20px_rgba(216,242,77,0.3)]"
                      : "bg-white/5 group-hover:bg-white/10",
                  )}>
                    <Icon className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isActive && "scale-110",
                    )} />
                  </div>
                  
                  <span className={cn(
                    "text-[9px] font-medium uppercase tracking-wider transition-all duration-300",
                    isActive ? "text-[#d8f24d]" : "text-white/50",
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Safe Area Spacer */}
      <div className="h-20 sm:hidden" />
    </>
  );
}