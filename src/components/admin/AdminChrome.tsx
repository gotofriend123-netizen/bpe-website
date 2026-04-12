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
  LayoutDashboard,
  Plus,
  Settings2,
  Shield,
  Ticket,
} from "lucide-react";

import { cn } from "@/lib/utils";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
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
    description: "Publish premium event listings",
  },
  {
    href: "/admin/offers#publish-form",
    label: "Post Offer",
    icon: BadgePercent,
    description: "Launch time-sensitive offers",
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
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto w-full max-w-[1720px] px-3 pb-24 pt-24 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-[2.2rem] border border-white/6 bg-[#111111] p-5 shadow-[18px_18px_38px_rgba(0,0,0,0.58),-12px_-12px_28px_rgba(255,255,255,0.025)]">
              <div className="mb-8 rounded-[1.5rem] border border-white/5 bg-[#151515] p-4 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/[0.09] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#d8f24d]">
                  <Shield className="h-3.5 w-3.5" />
                  Admin-only
                </span>
                <h1 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">
                  Black Pepper Control Room
                </h1>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Manage bookings, calendar slots, events, and offers from one protected workspace.
                </p>
              </div>

              <nav className="space-y-3">
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

              <div className="mt-8 space-y-3">
                {POST_LINKS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-[1.2rem] border border-white/5 bg-[#151515] px-4 py-3 text-white shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] transition-all duration-200 hover:text-[#d8f24d]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-[#0b0b0b] shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-white/45">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/5 bg-[#151515] p-4 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                  Signed in as
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/5 bg-[#0b0b0b] text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)]">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{currentUser.name}</p>
                    <p className="truncate text-[10px] uppercase tracking-[0.18em] text-white/45">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-[2.2rem] border border-white/6 bg-[#111111] p-5 shadow-[18px_18px_38px_rgba(0,0,0,0.58),-12px_-12px_28px_rgba(255,255,255,0.025)] sm:p-6">
              <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
                <div className="max-w-3xl space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/[0.09] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d8f24d]">
                    <Shield className="h-4 w-4" />
                    Black Pepper Admin Suite
                  </span>
                  <div className="space-y-2">
                    <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-white md:text-[2.75rem]">
                      Manage bookings, live events, and offers without leaving the control room.
                    </h1>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
                      Use the tabs below to review reservations, update slots, publish events, and keep guest-facing operations tidy.
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
                        "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/5 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] transition-all duration-200 active:scale-[0.98]",
                        postMenuOpen
                          ? "bg-[#d8f24d] text-black shadow-[0_18px_44px_rgba(216,242,77,0.22)]"
                          : "bg-[#151515] text-white shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] hover:text-[#d8f24d]",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                      Post
                      <ChevronDown className={cn("h-4 w-4 transition-transform", postMenuOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {postMenuOpen ? (
                        <motion.div
                          id={postMenuId}
                          role="menu"
                          initial={{ opacity: 0, y: -10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute right-0 top-full z-50 mt-3 w-[min(92vw,320px)] origin-top-right"
                        >
                          <div className="overflow-hidden rounded-[1.6rem] border border-white/6 bg-[#111111] p-2.5 shadow-[18px_18px_38px_rgba(0,0,0,0.58),-12px_-12px_28px_rgba(255,255,255,0.025)] backdrop-blur-2xl">
                            {POST_LINKS.map((item) => {
                              const Icon = item.icon;

                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  role="menuitem"
                                  className="group flex items-center gap-3 rounded-[1.2rem] border border-white/5 bg-[#151515] px-4 py-3 text-white transition-all duration-200 hover:text-[#d8f24d]"
                                >
                                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-[#0b0b0b] text-[#d8f24d] shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                                    <Icon className="h-5 w-5" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block text-sm font-semibold">{item.label}</span>
                                    <span className="block text-xs uppercase tracking-[0.18em] text-white/45">
                                      {item.description}
                                    </span>
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/5 bg-[#151515] px-4 py-3 text-left shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] xl:hidden sm:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                      Signed in as
                    </p>
                    <div className="mt-2 flex items-center gap-3 sm:justify-end">
                      <div className="rounded-full border border-white/5 bg-[#0b0b0b] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:hidden">
                {ADMIN_LINKS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[1.1rem] border border-white/5 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 active:scale-95",
                        active
                          ? "bg-[#0b0b0b] text-[#d8f24d] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.03)]"
                          : "bg-[#151515] text-white/75 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2.25rem] border border-white/6 bg-[#101010] p-4 shadow-[inset_12px_12px_24px_rgba(0,0,0,0.58),inset_-10px_-10px_20px_rgba(255,255,255,0.02)] sm:p-6">
              {children}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
