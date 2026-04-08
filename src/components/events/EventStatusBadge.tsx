import { cn } from "@/lib/utils";

type EventStatusBadgeProps = {
  status: "available" | "limited" | "sold_out";
};

const STATUS_LABELS = {
  available: "Tickets Available",
  limited: "Limited Seats",
  sold_out: "Sold Out",
} as const;

const STATUS_STYLES = {
  available: "border-emerald-400/30 bg-emerald-400/15 text-emerald-100",
  limited: "border-amber-400/30 bg-amber-400/15 text-amber-50",
  sold_out: "border-rose-400/30 bg-rose-400/15 text-rose-100",
} as const;

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] backdrop-blur-md",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
