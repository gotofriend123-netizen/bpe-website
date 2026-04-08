import { CalendarSearch, ClipboardCheck, Ticket, UserRoundPen, type LucideIcon } from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const STEPS: readonly Step[] = [
  {
    title: "Choose Your Event",
    description: "Browse the line-up and open the format that matches your mood.",
    icon: CalendarSearch,
  },
  {
    title: "Pick Ticket Type",
    description: "Select the pass, tier, and quantity that fits your plan.",
    icon: Ticket,
  },
  {
    title: "Fill Details",
    description: "Add your name, phone, and email in one clean booking card.",
    icon: UserRoundPen,
  },
  {
    title: "Confirm & Enjoy",
    description: "Receive your reference and confirmation email instantly after checkout.",
    icon: ClipboardCheck,
  },
] as const;

export function BookingStepsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STEPS.map((step, index) => {
        const Icon = step.icon;

        return (
          <div
            key={step.title}
            className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.24)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d6b98c]/35 to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
              Step {index + 1}
            </span>
            <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05] text-white">
              <Icon className="h-5 w-5 text-[#d6b98c]" />
            </div>
            <h3 className="mt-5 font-serif text-[1.45rem] font-semibold tracking-[-0.04em] text-white">
              {step.title}
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-zinc-400">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}
