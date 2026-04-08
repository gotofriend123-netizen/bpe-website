import Image from "next/image";
import Link from "next/link";

type PromoBannerProps = {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

export function PromoBanner({
  image,
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
}: PromoBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#080808] shadow-[0_30px_80px_rgba(0,0,0,0.32)]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover object-center opacity-35"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.55),rgba(0,0,0,0.78))]" />
      <div className="relative z-10 flex min-h-[22rem] flex-col items-start justify-center px-6 py-10 sm:px-8 lg:min-h-[24rem] lg:px-14">
        <span className="inline-flex rounded-full border border-[#f97316]/30 bg-[#f97316]/14 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-100">
          {eyebrow}
        </span>
        <h3 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
          {title}
        </h3>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-zinc-300 md:text-lg md:leading-8">
          {description}
        </p>
        <Link
          href={href}
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f97316] hover:text-black"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
