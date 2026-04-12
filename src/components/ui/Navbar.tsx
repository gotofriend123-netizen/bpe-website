"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlideTabs } from "@/components/ui/slide-tabs";
import {
  AccountMenu,
  getAccountMenuItems,
  type CurrentUserSummary,
} from "@/components/ui/account-menu";

type NavDropdownItem = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  dropdown?: readonly NavDropdownItem[];
};

type NavbarProps = {
  currentUser?: CurrentUserSummary | null;
};

const PUBLIC_LINKS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Spaces",
    href: "/spaces",
    dropdown: [
      { label: "The Arcade", href: "/the-arcade" },
      { label: "Verve Studio", href: "/verve-studio" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

const SPACE_ROUTE_MATCHERS = ["/spaces", "/the-arcade", "/verve-studio"];
const AVAILABILITY_HREF = "/availability";
const BOOKING_HREF = "/booking";

function isActivePath(pathname: string, href: string) {
  if (href === "/spaces") {
    return SPACE_ROUTE_MATCHERS.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ currentUser }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const pathname = usePathname() ?? "/";
  const accountItems = getAccountMenuItems(currentUser);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setExpandedDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const { overflow, touchAction, overscrollBehavior } = document.body.style;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.touchAction = touchAction;
      document.body.style.overscrollBehavior = overscrollBehavior;
      document.documentElement.style.overflow = rootOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-transparent transition-opacity duration-300",
            isScrolled ? "opacity-100" : "opacity-90",
          )}
        />

        <div className="relative mx-auto w-full max-w-[1600px] px-4 pt-4 sm:px-6 lg:px-8 xl:px-10">
          <div
            className={cn(
              "rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(8,8,8,0.96),rgba(8,8,8,0.82))] shadow-[0_20px_60px_rgba(0,0,0,0.38)] backdrop-blur-2xl transition-all duration-300",
              isScrolled &&
                "border-white/16 bg-[linear-gradient(180deg,rgba(8,8,8,0.98),rgba(8,8,8,0.88))] shadow-[0_24px_72px_rgba(0,0,0,0.46)]",
            )}
          >
            <div className="flex min-h-[64px] items-center justify-between gap-2 px-2.5 py-2.5 sm:min-h-[82px] sm:px-5 sm:py-3.5 lg:px-6 min-[1280px]:grid min-[1280px]:min-h-[94px] min-[1280px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[1280px]:gap-5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex min-w-0 shrink flex-1 items-center gap-2 pr-1 sm:gap-4 sm:pr-2 min-[1280px]:pr-4"
              >
                <div className="relative flex shrink-0 items-center justify-center py-1.5 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Image
                    src="/BLACK PEPPER LOGO  WIGHT PNG.png"
                    alt="Black Pepper Entertainment Logo"
                    width={260}
                    height={96}
                    className="h-[3.5rem] w-auto object-contain object-left opacity-92 transition-opacity group-hover:opacity-100 min-[400px]:h-[4rem] sm:h-[3.45rem] xl:h-[4.2rem]"
                    priority
                  />
                </div>
              </Link>

              <nav className="hidden min-w-0 items-center justify-center px-2 min-[1280px]:flex">
                <SlideTabs links={PUBLIC_LINKS} className="max-w-full" />
              </nav>

              <div className="hidden shrink-0 items-center justify-end gap-2 min-[1280px]:flex xl:gap-3">
                <Link
                  href={AVAILABILITY_HREF}
                  className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white/12 bg-white/[0.04] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f0debc] transition-all duration-200 hover:border-[#d6b98c]/35 hover:bg-[#d6b98c]/10 hover:text-white active:scale-[0.98] xl:px-5 xl:text-[11px]"
                >
                  Availability
                </Link>

                <Link
                  href={BOOKING_HREF}
                  className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_16px_36px_rgba(255,255,255,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-100 active:scale-[0.98] xl:px-6 xl:text-[11px]"
                >
                  Book Now
                </Link>

                <AccountMenu currentUser={currentUser ?? null} className="shrink-0" />
              </div>

              <div className="flex items-center justify-end gap-1.5 sm:gap-2 min-[1280px]:hidden">
                <Link
                  href={BOOKING_HREF}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-black shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-100 active:scale-95 min-[380px]:px-3 min-[380px]:text-[9px] min-[380px]:tracking-[0.14em] sm:px-4 sm:py-2.5 sm:text-[11px]"
                >
                  <span>Book Now</span>
                </Link>

                {currentUser ? (
                  <AccountMenu currentUser={currentUser} className="shrink-0" />
                ) : (
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex min-h-[2.9rem] min-w-[2.9rem] shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-3 text-[#f0debc] shadow-[0_12px_24px_rgba(0,0,0,0.16)] transition-all duration-200 hover:border-[#d6b98c]/35 hover:bg-[#d6b98c]/10 hover:text-white active:scale-95 min-[430px]:gap-2 min-[430px]:px-3.5"
                    aria-label="Sign up"
                  >
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] min-[430px]:inline sm:text-[11px]">
                      Sign Up
                    </span>
                  </Link>
                )}

                <button
                  type="button"
                  className="relative rounded-xl border border-white/10 bg-white/[0.05] p-2 text-white transition-all hover:bg-white/[0.1] active:scale-95 active:bg-white/[0.15] sm:rounded-2xl sm:p-3"
                  onClick={() => setMobileMenuOpen((current) => !current)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-site-menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-black/60 px-4 pb-8 pt-[6.75rem] backdrop-blur-md sm:px-6 lg:px-8 min-[1280px]:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              id="mobile-site-menu"
              className="relative mx-auto w-full max-w-[1600px] shrink-0 rounded-[2rem] border border-white/12 bg-black/70 p-5 shadow-[0_20px_60px_rgba(255,255,255,0.03)] backdrop-blur-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="space-y-4">
                <section className="rounded-[1.7rem] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
                    Explore
                  </p>
                  <div className="mt-4 grid gap-2">
                    {PUBLIC_LINKS.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.35rem] border border-white/8 bg-black/25 p-1.5"
                      >
                        <Link
                          href={item.dropdown ? "#" : item.href}
                          onClick={(event) => {
                            if (item.dropdown) {
                              event.preventDefault();
                              setExpandedDropdown(
                                expandedDropdown === item.label ? null : item.label,
                              );
                              return;
                            }

                            setMobileMenuOpen(false);
                          }}
                          className={cn(
                            "flex items-center justify-between rounded-[1rem] border px-4 py-3 text-sm font-medium uppercase tracking-[0.14em] transition-all active:scale-[0.98]",
                            isActivePath(pathname, item.href) ||
                              expandedDropdown === item.label
                              ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                              : "border-transparent text-zinc-300 hover:border-white/12 hover:bg-white hover:text-black",
                          )}
                        >
                          <span>{item.label}</span>
                          {item.dropdown ? (
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                expandedDropdown === item.label
                                  ? "rotate-180 opacity-100"
                                  : "opacity-60",
                              )}
                            />
                          ) : null}
                        </Link>

                        {item.dropdown ? (
                          <AnimatePresence>
                            {expandedDropdown === item.label ? (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2 space-y-1 px-2 pb-2">
                                  {item.dropdown.map((dropdownItem) => (
                                    <Link
                                      key={dropdownItem.href}
                                      href={dropdownItem.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={cn(
                                        "block rounded-xl border px-3 py-2 text-sm transition-all active:scale-[0.98]",
                                        pathname === dropdownItem.href
                                          ? "border-white/20 bg-white text-black font-semibold"
                                          : "border-white/8 bg-white/[0.02] text-zinc-300 hover:border-white/16 hover:bg-white hover:text-black",
                                      )}
                                    >
                                      {dropdownItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid gap-3 rounded-[1.7rem] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
                    Booking
                  </p>
                  <Link
                    href={AVAILABILITY_HREF}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-[1.5rem] border border-white/12 bg-white/[0.04] px-5 py-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black active:scale-95"
                  >
                    Availability
                  </Link>
                  <Link
                    href={BOOKING_HREF}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-[1.5rem] bg-white px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-100 active:scale-95"
                  >
                    Book Now
                  </Link>
                </section>

                <section className="rounded-[1.7rem] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
                    Account
                  </p>

                  <div className="mt-4 rounded-[1.35rem] border border-white/8 bg-black/25 p-1.5">
                    <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-4">
                      {currentUser ? (
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-semibold tracking-[0.12em] text-white">
                            {currentUser.name
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                              {currentUser.name}
                            </p>
                            <p className="truncate text-[11px] uppercase tracking-[0.2em] text-white/50">
                              {currentUser.email}
                            </p>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                            {currentUser.role.toUpperCase()}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">
                            Welcome back
                          </p>
                          <p className="text-xs leading-relaxed text-white/55">
                            Sign in to manage bookings, view your dashboard, and keep your account in sync.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 grid gap-1.5">
                      {accountItems.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-[1rem] border px-4 py-3 text-sm font-medium transition-all active:scale-[0.98]",
                              item.tone === "soft"
                                ? "border-white/8 bg-white/[0.03] text-white/75 hover:border-white/18 hover:bg-white hover:text-black"
                                : "border-transparent bg-white/[0.02] text-white/88 hover:border-white/16 hover:bg-white hover:text-black",
                            )}
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.05]">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
