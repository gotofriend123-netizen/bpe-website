"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgePercent,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings2,
  SquareArrowOutUpRight,
  UserRound,
  CalendarDays,
  BookOpenCheck,
  Shield,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AccountRole = "user" | "admin";

export type CurrentUserSummary = {
  name: string;
  email: string;
  role: AccountRole;
  avatarUrl?: string | null;
};

export type AccountMenuItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  tone?: "default" | "soft";
};

export function getAccountMenuItems(
  currentUser: CurrentUserSummary | null | undefined,
): AccountMenuItem[] {
  if (!currentUser) {
    return [
      { label: "Login", href: "/login", icon: SquareArrowOutUpRight },
      { label: "Sign Up", href: "/signup", icon: UserRound },
    ];
  }

  if (currentUser.role === "admin") {
    return [
      { label: "Admin Panel", href: "/admin", icon: Shield },
      { label: "Bookings", href: "/admin/bookings", icon: BookOpenCheck },
      { label: "Events", href: "/admin/events", icon: Ticket },
      { label: "Offers", href: "/admin/offers", icon: BadgePercent },
      { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
      { label: "Settings", href: "/admin/settings", icon: Settings2 },
      { label: "Logout", href: "/logout", icon: LogOut, tone: "soft" },
    ];
  }

  return [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/bookings", icon: BookOpenCheck },
    { label: "Profile", href: "/dashboard/profile", icon: Settings2 },
    { label: "Logout", href: "/logout", icon: LogOut, tone: "soft" },
  ];
}

const ROLE_LABELS: Record<AccountRole, string> = {
  user: "User",
  admin: "Admin",
};

function getInitials(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }

  return (
    parts[0]?.slice(0, 2) ??
    email
      .split("@")[0]
      .slice(0, 2)
      .toUpperCase()
  );
}

type AccountMenuProps = {
  currentUser?: CurrentUserSummary | null;
  className?: string;
  onNavigate?: () => void;
};

export function AccountMenu({ currentUser, className, onNavigate }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const items = getAccountMenuItems(currentUser);
  const isLoggedIn = Boolean(currentUser);
  const initials = currentUser ? getInitials(currentUser.name, currentUser.email) : "";
  const accountName = currentUser?.name ?? "Account";
  const accountEmail = currentUser?.email ?? "Access your account";
  const accountRoleLabel = currentUser ? ROLE_LABELS[currentUser.role] : "Login / Sign Up";
  const accountTriggerLabel = currentUser?.name.split(/\s+/)[0] ?? "Account";

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
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
    setOpen(false);
  }, [currentUser?.email, currentUser?.role, pathname]);

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "group inline-flex min-h-[48px] max-w-[13rem] items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-2 text-left text-white shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.12] active:scale-[0.98]",
          open && "border-white/22 bg-white/[0.12] shadow-[0_18px_40px_rgba(255,255,255,0.05)]",
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] text-[11px] font-semibold tracking-[0.12em] text-white">
          {isLoggedIn ? (
            initials
          ) : (
            <UserRound className="h-5 w-5 text-white/90" aria-hidden="true" />
          )}
        </span>

        <span className="hidden min-w-0 max-w-[8.5rem] flex-col text-left min-[1460px]:flex">
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
            {accountTriggerLabel}
          </span>
          <span className="truncate text-[9px] uppercase tracking-[0.18em] text-white/50">
            {accountRoleLabel}
          </span>
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-white/70 transition-transform duration-200",
            open ? "rotate-180" : "group-hover:text-white",
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,320px)] origin-top-right"
          >
            <div className="overflow-hidden rounded-[1.75rem] border border-white/14 bg-[linear-gradient(180deg,rgba(18,18,18,0.98),rgba(12,12,12,0.92))] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-[11px] font-semibold tracking-[0.12em] text-white">
                    {isLoggedIn ? initials : <UserRound className="h-5 w-5" aria-hidden="true" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {isLoggedIn ? accountName : "Welcome"}
                    </p>
                    <p className="truncate text-[11px] uppercase tracking-[0.2em] text-white/50">
                      {accountEmail}
                    </p>
                  </div>
                </div>

                {isLoggedIn ? (
                  <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    {accountRoleLabel}
                  </div>
                ) : null}
              </div>

              <div className="mt-2 grid gap-1.5">
                {items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className={cn(
                        "group flex items-center gap-3 rounded-[1.15rem] border px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                        item.tone === "soft"
                          ? "border-white/8 bg-white/[0.03] text-white/80 hover:border-white/18 hover:bg-white hover:text-black"
                          : "border-transparent bg-white/[0.02] text-white/90 hover:border-white/20 hover:bg-white hover:text-black",
                      )}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.05] transition-all duration-200 group-hover:border-black/10 group-hover:bg-black/5">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
