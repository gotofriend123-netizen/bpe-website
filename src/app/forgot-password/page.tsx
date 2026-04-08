"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });

        if (resetError) {
          setError("Failed to send reset link. Please check the email or try again later.");
        } else {
          setSuccess(true);
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d8f24d]">
          Password reset
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Forgot your password?
        </h1>

        {success ? (
          <div className="mt-6">
            <div className="rounded-[1.5rem] border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-5 py-4 text-sm text-[#d8f24d]">
              If an account exists for {email}, a reset link has been sent. Please check your inbox.
            </div>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="text-sm leading-7 text-white/65">
              Enter the email address associated with your account, and we&apos;ll send you a link to reset your password.
            </p>

            <div className="mt-4">
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

            {error ? (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending || !email}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d8f24d] px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-[#e4fa67] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Sending..." : "Send reset link"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/60">
              <Link className="font-medium text-white transition hover:text-white/80" href="/login">
                Back to login
              </Link>
              <Link className="transition hover:text-white/80" href="/signup">
                Create account
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
