"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Ticket, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "events", label: "Events", href: "/events", icon: Ticket },
  { key: "login", label: "Login", href: "/login", icon: LogIn },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#0c0c0c] px-2 py-2 pb-safe sm:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-medium transition-colors",
                isActive ? "text-[#d8f24d]" : "text-white/50 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}