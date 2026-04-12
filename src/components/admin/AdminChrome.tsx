"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgePercent,
  BellRing,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  Home,
  LayoutDashboard,
  Plus,
  Settings2,
  Shield,
  Ticket,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

const ADMIN_LINKS = [
  { href: "/admin", label: "Home", icon: Home },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpenCheck },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/events", label: "Events", icon: Ticket },
  { href: "/admin/offers", label: "Offers", icon: BadgePercent },
  { href: "/admin/waitlist", label: "Waitlist", icon: BellRing },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
] as const;

const POST_LINKS = [
  {
    href: "/admin/events#publish-form",
    label: "Post Event",
    icon: Ticket,
    description: "Publish event listings",
  },
  {
    href: "/admin/offers#publish-form",
    label: "Post Offer",
    icon: BadgePercent,
    description: "Launch offers",
  },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function MobileBottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#0c0c0c] px-1 py-1.5 pb-safe sm:hidden">
      <div className="flex items-center justify-around">
        {ADMIN_LINKS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[9px] font-medium transition-colors",
                active ? "text-[#d8f24d]" : "text-white/50 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[8px] uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function MobileHeader({ initials, currentUser }: { initials: string; currentUser: AdminUser }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/6 bg-[#050505]/95 px-3 py-2.5 backdrop-blur-md sm:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8f24d]/20 bg-[#151515] text-[10px] font-bold text-[#d8f24d]">
            {initials}
          </div>
          <span className="text-xs font-semibold text-white">Admin</span>
        </div>
        <Link
          href="/admin#post"
          className="flex items-center gap-1 rounded-full bg-[#d8f24d] px-2.5 py-1 text-[10px] font-bold text-black"
        >
          <Plus className="h-3 w-3" />
          Post
        </Link>
      </div>
    </header>
  );
}

export function AdminChrome({
  currentUser,
  children,
}: {
  currentUser: AdminUser;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "/admin";
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const postMenuId = useId();
  const postMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && postMenuRef.current && !postMenuRef.current.contains(target)) {
        setPostMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPostMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setPostMenuOpen(false);
  }, [pathname]);

  const initials = getInitials(currentUser.name);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 sm:pb-0">
      <MobileHeader initials={initials} currentUser={currentUser} />

      <div className="mx-auto w-full max-w-[1720px] px-3 pt-16 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-[2.2rem] border border-white/6 bg-[#111111] p-5 shadow-[18px_18px_38px_rgba(0,0,0,0.58),-12px_-12px_28px_rgba(255,255,255,0.025)]">
              <div className="mb-8 rounded-[1.5rem] border border-white/5 bg-[#151515] p-4 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/[0.09] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#d8f24d]">
                  <Shield className="h-3.5 w-3.5" />
                  Admin-only
                </span>
                <h1 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">
                  Control Room
                </h1>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Manage bookings, calendar slots, events, and offers.
                </p>
              </div>

              <nav className="space-y-2">
                {ADMIN_LINKS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-[1.2rem] border border-white/5 px-4 py-3 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-[#0b0b0b] text-[#d8f24d] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.03)]"
                          : "bg-[#151515] text-white/72 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 space-y-2">
                {POST_LINKS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-[1.2rem] border border-white/5 bg-[#151515] px-4 py-3 text-white shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] transition-all duration-200 hover:text-[#d8f24d]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-[#0b0b0b]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{item.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/5 bg-[#151515] p-4 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                  Signed in as
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-[#0b0b0b] text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {currentUser.name}
                    </p>
                    <p className="truncate text-[10px] uppercase tracking-[0.16em] text-white/45">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <section className="rounded-2xl border border-white/6 bg-[#111111] p-5 shadow-[18px_18px_38px_rgba(0,0,0,0.58),-12px_-12px_28px_rgba(255,255,255,0.025)] sm:rounded-[2rem] sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/[0.09] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d8f24d]">
                    <Shield className="h-3.5 w-3.5" />
                    Admin Suite
                  </span>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-[-0.05em] text-white sm:text-3xl lg:text-4xl">
                      Manage your studio operations
                    </h1>
                    <p className="max-w-2xl text-xs leading-6 text-zinc-400 sm:text-sm">
                      Review bookings, update calendar, publish events, and keep operations tidy.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <div ref={postMenuRef} className="relative shrink-0">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={postMenuOpen}
                      aria-controls={postMenuId}
                      onClick={() => setPostMenuOpen((current) => !current)}
                      className={cn(
                        "inline-flex items-center justify-center gap-1.5 rounded-full border border-white/5 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-200 active:scale-[0.98]",
                        postMenuOpen
                          ? "bg-[#d8f24d] text-black shadow-[0_18px_44px_rgba(216,242,77,0.22)]"
                          : "bg-[#151515] text-white hover:text-[#d8f24d]",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                      Post
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          postMenuOpen && "rotate-180",
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {postMenuOpen ? (
                        <motion.div
                          id={postMenuId}
                          role="menu"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right"
                        >
                          <div className="overflow-hidden rounded-2xl border border-white/6 bg-[#111111] p-2 shadow-[18px_18px_38px_rgba(0,0,0,0.58)]">
                            {POST_LINKS.map((item) => {
                              const Icon = item.icon;

                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  role="menuitem"
                                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#151515] px-3 py-2.5 text-sm font-medium text-white transition-all hover:text-[#d8f24d]"
                                >
                                  <Icon className="h-4 w-4" />
                                  {item.label}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  <div className="hidden rounded-xl border border-white/5 bg-[#151515] px-4 py-2.5 lg:flex lg:items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-[#0b0b0b] text-[10px] font-bold text-white">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 hidden grid-cols-4 gap-2 sm:grid xl:hidden">
                {ADMIN_LINKS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "inline-flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/5 px-2 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200",
                        active
                          ? "bg-[#0b0b0b] text-[#d8f24d]"
                          : "bg-[#151515] text-white/75 hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span className="truncate text-[9px]">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-white/6 bg-[#101010] p-5 shadow-[inset_12px_12px_24px_rgba(0,0,0,0.58),inset_-10px_-10px_20px_rgba(255,255,255,0.02)] sm:rounded-[2rem] sm:p-6">
              {children}
            </section>
          </div>
        </div>
      </div>

      <MobileBottomNav pathname={pathname} />
    </div>
  );
}