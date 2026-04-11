"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Mail, Sparkles, UserRound } from "lucide-react";

type AuthMode = "login" | "signup";

type AuthPanelProps = {
  mode: AuthMode;
  nextPath?: string;
};

const copy = {
  login: {
    title: "Welcome back",
    description: "Sign in to manage bookings, view your dashboard, and keep everything in one place.",
    action: "Sign in",
    switchCopy: "Need an account?",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your account",
    description: "Join with a user account to book spaces, manage your reservations, and access your dashboard.",
    action: "Create account",
    switchCopy: "Already have an account?",
    switchHref: "/login",
  },
} as const;

export function AuthPanel({ mode, nextPath }: AuthPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const payload = useMemo(() => {
    if (mode === "signup") {
      return {
        name,
        email,
        password,
        confirmPassword,
        nextPath,
      };
    }

    return {
      email,
      password,
      nextPath,
    };
  }, [confirmPassword, email, mode, name, nextPath, password]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; redirectTo?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.assign(data?.redirectTo ?? nextPath ?? "/dashboard");
    });
  };

  const currentCopy = copy[mode];

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Black Pepper Entertainment
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {currentCopy.title}
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
          {currentCopy.description}
        </p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-white/82" htmlFor="name">
                Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  className="w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-black/40"
                  placeholder="Your name"
                  required
                />
                <UserRound className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" aria-hidden="true" />
              </div>
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-medium text-white/82" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-black/40"
                placeholder="name@company.com"
                required
              />
              <Mail className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/82" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-black/40"
                placeholder="At least 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === "signup" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-white/82" htmlFor="confirmPassword">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-black/40"
                  placeholder="Repeat password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-white/92 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Please wait..." : currentCopy.action}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60">
          <span>{currentCopy.switchCopy}</span>
          <div className="flex items-center gap-3">
            {mode === "login" ? (
              <Link className="transition hover:text-white/80" href="/forgot-password">
                Forgot password?
              </Link>
            ) : null}
            <Link className="font-medium text-white transition hover:text-white/80" href={currentCopy.switchHref}>
              {mode === "login" ? "Create account" : "Sign in"}
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
}
