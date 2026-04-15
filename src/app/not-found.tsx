import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white">
          Error 404
        </p>
        <h1 className="mt-4 mb-3 text-4xl font-semibold tracking-tight text-white">Page not found</h1>
        <p className="mb-8 text-sm leading-7 text-white/60">
          The page or resource you&apos;re looking for doesn&apos;t exist, has been moved, or is temporarily unavailable. Let&apos;s get you back to safe territory.
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
