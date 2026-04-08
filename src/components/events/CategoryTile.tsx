import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CategoryTileProps = {
  href: string;
  label: string;
  subtitle: string;
  image: string;
  accentClass: string;
  icon: LucideIcon;
};

export function CategoryTile({
  href,
  label,
  subtitle,
  image,
  accentClass,
  icon: Icon,
}: CategoryTileProps) {
  return (
    <Link
      href={href}
      className="group relative block min-w-[15rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] p-5 shadow-[0_22px_54px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-white/18"
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={label}
          fill
          className="object-cover opacity-35 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 70vw, 20vw"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-br", accentClass)} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.82))]" />
      </div>

      <div className="relative z-10 flex min-h-[11.5rem] flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/18 bg-black/35 text-white backdrop-blur-md">
            <Icon className="h-5 w-5" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-white/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{label}</h3>
          <p className="mt-2 max-w-[14rem] text-sm leading-6 text-white/72">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
