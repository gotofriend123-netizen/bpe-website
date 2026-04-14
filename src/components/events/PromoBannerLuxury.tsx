import Link from "next/link";
import { MoveRight } from "lucide-react";

type PromoBannerLuxuryProps = {
  image?: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

export function PromoBannerLuxury({
  title,
  description,
  href,
  ctaLabel,
}: PromoBannerLuxuryProps) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_26px_70px_rgba(0,0,0,0.28)] bg-gradient-to-br from-[#1a1025] via-[#0f0a14] to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,185,140,0.15),transparent_50%)]" />
      
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center sm:px-8 lg:px-12 lg:py-16">
        <span className="inline-flex w-fit rounded-full border border-[#d6b98c]/20 bg-[#d6b98c]/[0.08] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d6b98c]">
          Limited Seats Available
        </span>
        <h3 className="mt-4 max-w-3xl font-sans text-3xl font-bold leading-tight tracking-tight text-white md:mt-6 md:text-5xl">
          {title}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 md:mt-5 md:max-w-2xl md:text-base">
          {description}
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={href}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#d6b98c]/30 bg-[#d6b98c] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black shadow-[0_14px_36px_rgba(214,185,140,0.24)] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
          >
            {ctaLabel}
          </Link>
          
          <Link
            href="/events"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
          >
            Explore All Events
            <MoveRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
