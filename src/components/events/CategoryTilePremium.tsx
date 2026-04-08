import Image from "next/image";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CategoryTilePremiumProps = {
  href: string;
  label: string;
  subtitle: string;
  image: string;
  accentClass: string;
  icon: LucideIcon;
};

export function CategoryTilePremium({
  href,
  label,
  subtitle,
  image,
  accentClass,
  icon: Icon,
}: CategoryTilePremiumProps) {
  return (
    <Link
      href={href}
      className="group relative block h-full w-full overflow-hidden rounded-[1rem] border border-white/8 bg-[#101010] shadow-[0_18px_44px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-white/18 hover:shadow-[0_24px_54px_rgba(255,255,255,0.08)] md:rounded-[1.2rem]"
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={label}
          fill
          className="object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 45vw, 14vw"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.96]", accentClass)} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.34))]" />
      </div>

      <div className="relative z-10 flex aspect-square min-h-0 flex-col items-center justify-center px-2 py-2.5 text-center md:min-h-[9.1rem] md:px-4 md:py-5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[0.95rem] border border-white/18 bg-black/18 text-white/95 backdrop-blur-md transition-transform duration-300 group-hover:scale-105 group-hover:bg-black/28 md:h-12 md:w-12 md:rounded-2xl">
          <Icon className="h-[1.05rem] w-[1.05rem] md:h-5 md:w-5" />
        </span>
        <div>
          <h3 className="mt-2 font-sans text-[0.72rem] font-semibold leading-tight tracking-[-0.02em] text-white md:mt-4 md:text-[1.05rem]">
            {label}
          </h3>
          <p className="mt-0.5 hidden text-[11px] leading-5 text-white/78 md:block">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
