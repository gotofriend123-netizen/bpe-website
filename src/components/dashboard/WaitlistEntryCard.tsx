import { CalendarDays, Clock3, Hash, MapPin, MessagesSquare } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  getDashboardSpaceLabel,
  getWaitlistStatusLabel,
  getWaitlistStatusTone,
  type DashboardWaitlistEntry,
} from "@/lib/dashboard/user-dashboard";

type WaitlistEntryCardProps = {
  entry: DashboardWaitlistEntry;
};

export function WaitlistEntryCard({ entry }: WaitlistEntryCardProps) {
  return (
    <GlowCard
      contentClassName="rounded-[1.6rem] border border-white/6 bg-[#151515] p-5 shadow-[18px_18px_36px_rgba(0,0,0,0.5),-12px_-12px_28px_rgba(255,255,255,0.025)]"
      backgroundColor="#111111"
      borderRadius={24}
      glowIntensity={0.25}
      fillOpacity={0.05}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${getWaitlistStatusTone(entry.status)}`}
          >
            {getWaitlistStatusLabel(entry.status)}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            <Hash className="h-3.5 w-3.5" />
            {entry.bookingReference ?? "Waitlist"}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.25rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              <MapPin className="h-3.5 w-3.5" />
              Space
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {getDashboardSpaceLabel(entry.space)}
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              <CalendarDays className="h-3.5 w-3.5" />
              Target date
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {entry.dateLabel}
            </p>
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-white/5 bg-[#0b0b0b] p-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
            <MessagesSquare className="h-3.5 w-3.5" />
            Note
          </p>
          <p className="mt-2 text-sm leading-6 text-white/65">
            {entry.note ?? "No note added to this waitlist entry."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4 text-sm text-white/55">
          <span className="flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            Joined {new Date(entry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
          <span className="text-white/45">{entry.email}</span>
        </div>
      </div>
    </GlowCard>
  );
}
