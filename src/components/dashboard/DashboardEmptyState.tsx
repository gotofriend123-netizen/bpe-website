import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";

type DashboardEmptyStateProps = {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function DashboardEmptyState({
  title,
  description,
  ctaHref = "/booking",
  ctaLabel = "Book a session",
}: DashboardEmptyStateProps) {
  return (
    <GlowCard
      contentClassName="rounded-[1.75rem] border border-white/6 bg-[#151515] p-6 shadow-[18px_18px_36px_rgba(0,0,0,0.5),-12px_-12px_28px_rgba(255,255,255,0.025)] sm:p-8"
      backgroundColor="#111111"
      borderRadius={28}
      glowIntensity={0.22}
      fillOpacity={0.05}
    >
      <div className="max-w-2xl space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#0b0b0b] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
          <Sparkles className="h-3.5 w-3.5" />
          Dashboard note
        </span>
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          {title}
        </h3>
        <p className="text-sm leading-7 text-white/60">{description}</p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#d8f24d] px-5 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </GlowCard>
  );
}
