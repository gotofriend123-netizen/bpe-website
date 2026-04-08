import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth/auth-panel";
import { getCurrentUser, normalizeRedirectPath } from "@/lib/auth/session";

type SignupPageProps = {
  searchParams?: {
    next?: string | string[];
  };
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
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
          <Link href="/login" className="transition hover:text-white">
            Sign in
          </Link>
        </div>

        <AuthPanel mode="signup" nextPath={nextPath} />
      </div>
    </section>
  );
}
