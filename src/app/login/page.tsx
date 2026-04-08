import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth/auth-panel";
import { getCurrentUser, normalizeRedirectPath } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams?: {
    next?: string | string[];
    registered?: string | string[];
  };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect(currentUser.role === "admin" ? "/admin" : "/dashboard");
  }

  const nextValue = Array.isArray(searchParams?.next) ? searchParams?.next[0] : searchParams?.next;
  const nextPath = normalizeRedirectPath(nextValue, "/dashboard");

  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8">
        <div className="flex items-center justify-between text-sm text-white/55">
          <Link href="/" className="transition hover:text-white">
            Back to home
          </Link>
          <Link href="/signup" className="transition hover:text-white">
            Create account
          </Link>
        </div>

        {searchParams?.registered ? (
          <div className="rounded-[1.5rem] border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-5 py-4 text-sm text-[#d8f24d]">
            Your account has been successfully created! You may now sign in to your dashboard.
            If verification is enabled, please check your email first.
          </div>
        ) : null}

        <AuthPanel mode="login" nextPath={nextPath} />
      </div>
    </section>
  );
}
