import { Sparkles } from "lucide-react";

type MarqueeStripProps = {
  items: readonly string[];
};

export function MarqueeStrip({ items }: MarqueeStripProps) {
  const loopItems = [...items, ...items];

  return (
    <div className="overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
      <div className="flex min-w-max animate-[events-marquee_28s_linear_infinite] py-3">
        {loopItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-4 px-5 text-[11px] font-semibold uppercase tracking-[0.42em] text-zinc-200 md:px-7"
          >
            <span>{item}</span>
            <Sparkles className="h-3.5 w-3.5 text-[#d6b98c]/70" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes events-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
