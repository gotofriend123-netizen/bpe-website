import { format } from "date-fns";

export function EventDateBadge({ startsAt }: { startsAt: string }) {
  const date = new Date(startsAt);

  return (
    <div className="inline-flex flex-col rounded-2xl border border-white/15 bg-black/70 px-3 py-2 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-400">
        {format(date, "MMM")}
      </span>
      <span className="text-xl font-semibold leading-none">{format(date, "dd")}</span>
    </div>
  );
}
