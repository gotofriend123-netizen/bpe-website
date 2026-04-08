import Image from "next/image";
import Link from "next/link";

type PromoBannerLuxuryProps = {
  image: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

export function PromoBannerLuxury({
  image,
  title,
  description,
  href,
  ctaLabel,
}: PromoBannerLuxuryProps) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#080808] shadow-[0_26px_70px_rgba(0,0,0,0.28)]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover object-center opacity-52 transition-transform duration-700 group-hover:scale-[1.03]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(17,11,25,0.9),rgba(79,16,75,0.55),rgba(241,93,105,0.28),rgba(0,0,0,0.82))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,210,78,0.18),transparent_22%),radial-gradient(circle_at_top_right,rgba(159,95,255,0.24),transparent_28%)]" />

      <div className="relative z-10 flex min-h-[8.4rem] flex-col items-center justify-center px-5 py-5 text-center sm:px-8 lg:min-h-[12rem] lg:px-12 lg:py-8">
        <span className="inline-flex w-fit rounded-full border border-[#f4de58]/20 bg-[#f4de58]/[0.08] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#fff4b3]">
          Limited Seats Available
        </span>
        <h3 className="mt-3 max-w-3xl font-sans text-[1.55rem] font-semibold leading-[0.95] tracking-[-0.05em] text-white md:mt-5 md:text-[3.1rem]">
          {title}
        </h3>
        <p className="mt-1.5 max-w-xl text-[12px] leading-5 text-zinc-100/80 md:mt-3 md:max-w-2xl md:text-[16px] md:leading-8">
          {description}
        </p>
        <Link
          href={href}
          className="mt-3 inline-flex min-h-10 w-fit items-center justify-center rounded-full border border-[#f4de58]/30 bg-[#f4de58] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-black shadow-[0_14px_36px_rgba(244,222,88,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white md:mt-6 md:min-h-11 md:px-5 md:py-3 md:text-[11px] md:tracking-[0.24em]"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
