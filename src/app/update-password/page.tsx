"use client";

import { useState, useTransition, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase sets the session automatically from the URL hash in the PKCE flow
    // No explicit initialization needed other than ensuring the client exists
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error: updateError } = await supabase.auth.updateUser({ password });

        if (updateError) {
          setError("Failed to update password. " + updateError.message);
        } else {
          setSuccess(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
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
          Security
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Update password
        </h1>

        {success ? (
          <div className="mt-6">
            <div className="rounded-[1.5rem] border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-5 py-4 text-sm text-[#d8f24d]">
              Your password has been successfully updated! Redirecting to your dashboard...
            </div>
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Go to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="text-sm leading-7 text-white/65">
              Please enter your new password below. Make sure it&apos;s secure.
            </p>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-white/82" htmlFor="password">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
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

            {error ? (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending || !password}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d8f24d] px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-[#e4fa67] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Updating..." : "Update password"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
