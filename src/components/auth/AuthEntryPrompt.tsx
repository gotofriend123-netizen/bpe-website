"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Sparkles, UserPlus, X } from "lucide-react";

type AuthEntryPromptUser = {
  name: string;
  email: string;
  role: "user" | "admin";
} | null;

type AuthEntryPromptProps = {
  currentUser?: AuthEntryPromptUser;
};

const DISMISS_KEY = "bpe-auth-entry-prompt-dismissed";
const SUPPRESSED_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/dashboard",
  "/admin",
  "/booking",
  "/logout",
] as const;

function shouldSuppressPrompt(pathname: string) {
  return SUPPRESSED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function AuthEntryPrompt({ currentUser = null }: AuthEntryPromptProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const nextPath = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  useEffect(() => {
    if (currentUser || shouldSuppressPrompt(pathname)) {
      setOpen(false);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (window.sessionStorage.getItem(DISMISS_KEY) === "true") {
      setOpen(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setOpen(true);
    }, 900);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [currentUser, pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissPrompt();
      }
    };

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const dismissPrompt = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "true");
    }

    setOpen(false);
  };

  const handlePrimaryAction = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "true");
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-md sm:px-6"
          onClick={dismissPrompt}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-entry-prompt-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[28rem] overflow-hidden rounded-[2rem] border border-white/14 bg-[linear-gradient(180deg,rgba(18,18,18,0.96),rgba(8,8,8,0.92))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.52)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismissPrompt}
              aria-label="Close auth prompt"
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-black/65 text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-all duration-200 hover:border-white/28 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="pr-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/72">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Welcome
              </div>

              <h2
                id="auth-entry-prompt-title"
                className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[2rem]"
              >
                Access your bookings in one polished place.
              </h2>

              <p className="mt-3 max-w-md text-sm leading-7 text-white/68 sm:text-[15px]">
                Sign in to manage bookings, reschedule slots, and access your dashboard whenever you need it.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href={{
                  pathname: "/login",
                  query: nextPath ? { next: nextPath } : undefined,
                }}
                onClick={handlePrimaryAction}
                className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:border-white/26 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Login
              </Link>

              <Link
                href={{
                  pathname: "/signup",
                  query: nextPath ? { next: nextPath } : undefined,
                }}
                onClick={handlePrimaryAction}
                className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-[0_16px_36px_rgba(255,255,255,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Sign Up
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
