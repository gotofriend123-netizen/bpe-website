import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionHeadingPremiumProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeadingPremium({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  align = "left",
  className,
}: SectionHeadingPremiumProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        centered && "items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl min-w-0", centered && "mx-auto")}>
        <span className="inline-flex rounded-full border border-[#d6b98c]/20 bg-[#d6b98c]/[0.08] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#f0debc]">
          {eyebrow}
        </span>
        <h2 className="mt-5 max-w-full font-serif text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white md:text-[3.35rem]">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-7 text-zinc-400 md:text-[16px] md:leading-8">
          {description}
        </p>
      </div>

      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d6b98c]/35 hover:bg-[#d6b98c] hover:text-black"
        >
          {actionLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
