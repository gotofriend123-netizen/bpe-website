import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  LayoutDashboard,
  NotebookTabs,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/utils";
import {
  type CurrentUserSummary,
  type DashboardFrameOverview,
  getDashboardSpaceLabel,
} from "@/lib/dashboard/user-dashboard";

type DashboardTab = "overview" | "bookings" | "events" | "profile";

type DashboardFrameProps = {
  currentUser: CurrentUserSummary;
  overview: DashboardFrameOverview;
  activeTab: DashboardTab;
  children: ReactNode;
};

const tabItems: Array<{
  key: DashboardTab;
  label: string;
  mobileLabel: string;
  href: string;
  icon: typeof LayoutDashboard;
}> = [
  { key: "overview", label: "Overview", mobileLabel: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { key: "bookings", label: "My Bookings", mobileLabel: "Bookings", href: "/dashboard/bookings", icon: NotebookTabs },
  { key: "profile", label: "Profile", mobileLabel: "Profile", href: "/dashboard/profile", icon: UserRound },
];

const eventTabItem = {
  key: "events" as const,
  label: "My Event Tickets",
  href: "/dashboard/events",
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof CalendarDays;
}) {
  return (
    <GlowCard
      contentClassName="h-full rounded-[1.55rem] border border-white/6 bg-[#151515] p-5 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]"
      backgroundColor="#111111"
      borderRadius={26}
      glowIntensity={0.4}
      fillOpacity={0.05}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
            {value}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-[#0b0b0b] text-white/80 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </GlowCard>
  );
}

export function DashboardFrame({
  currentUser,
  overview,
  activeTab,
  children,
}: DashboardFrameProps) {
  const firstName = currentUser.name.split(" ")[0] ?? currentUser.name;
  const latestBooking = overview.latestBooking;
  const latestEventBooking = overview.latestEventBooking;
  const latestBookingLabel = latestBooking
    ? `${getDashboardSpaceLabel(latestBooking.space)} · ${latestBooking.dateLabel}`
    : "No bookings yet";
  const latestEventLabel = latestEventBooking
    ? `${latestEventBooking.eventTitle} · ${latestEventBooking.startsAtLabel}`
    : "No event tickets yet";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-4%] h-[18rem] w-[18rem] rounded-full bg-white/[0.025] blur-[130px]" />
        <div className="absolute right-[-8%] top-[8%] h-[14rem] w-[14rem] rounded-full bg-white/[0.02] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-3 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-[2.15rem] border border-white/6 bg-[#111111] p-5 shadow-[18px_18px_38px_rgba(0,0,0,0.58),-12px_-12px_28px_rgba(255,255,255,0.025)]">
              <div className="rounded-[1.5rem] border border-white/5 bg-[#151515] p-4 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#0b0b0b] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/62">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#d8f24d]" />
                  Private dashboard
                </span>
                <h1 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">
                  Welcome back, {firstName}
                </h1>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Track your studio bookings and account details from one premium workspace.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {tabItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.key;

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-[1.2rem] border border-white/5 px-4 py-3 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-[#0b0b0b] text-white shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.03)]"
                          : "bg-[#151515] text-white/70 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] hover:text-white",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active && "text-[#d8f24d]")} />
                      {item.label}
                    </Link>
                  );
                })}

                <details
                  className="group rounded-[1.35rem] border border-white/5 bg-[#151515] p-3 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)]"
                  open={activeTab === "events"}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-[1.1rem] border border-white/5 bg-[#0f0f0f] px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 items-center gap-3">
                      <Ticket className="h-4 w-4 text-[#d8f24d]" />
                      <span className="truncate">Events</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                        {overview.stats.eventBookings}
                      </span>
                      <ChevronDown className="h-4 w-4 text-white/55 transition-transform duration-200 group-open:rotate-180" />
                    </span>
                  </summary>

                  <div className="mt-3 space-y-3">
                    <Link
                      href={eventTabItem.href}
                      className={cn(
                        "flex items-center gap-3 rounded-[1.1rem] border border-white/5 px-4 py-3 text-sm font-medium transition-all duration-200",
                        activeTab === "events"
                          ? "bg-[#0b0b0b] text-white shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.03)]"
                          : "bg-[#121212] text-white/72 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.45),inset_-4px_-4px_10px_rgba(255,255,255,0.02)] hover:text-white",
                      )}
                    >
                      <Ticket className={cn("h-4 w-4", activeTab === "events" && "text-[#d8f24d]")} />
                      {eventTabItem.label}
                    </Link>

                    <div className="rounded-[1.1rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">
                        Latest event
                      </p>
                      <p className="mt-2 text-sm font-medium text-white/75">
                        {latestEventLabel}
                      </p>
                    </div>
                  </div>
                </details>
              </div>

              <div className="mt-8 space-y-3 rounded-[1.5rem] border border-white/5 bg-[#151515] p-4 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/5 bg-[#0b0b0b] text-white/90 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{currentUser.name}</p>
                    <p className="truncate text-[10px] uppercase tracking-[0.18em] text-white/45">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[1.1rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">Role</p>
                    <p className="mt-2 text-sm font-semibold text-white">{currentUser.role}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">Latest booking</p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {latestBooking ? latestBooking.reference : "None"}
                    </p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">Next focus</p>
                    <p className="mt-2 text-sm font-medium text-white/75">{latestBookingLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-5">
        <AnimatedSection className="flex flex-col gap-5">
          <GlowCard
            className="order-1"
            contentClassName="rounded-[1.5rem] border border-white/6 bg-[#111111] p-4 shadow-[18px_18px_38px_rgba(0,0,0,0.58),-12px_-12px_28px_rgba(255,255,255,0.025)] sm:rounded-[2rem] sm:p-6 lg:p-10"
            backgroundColor="#111111"
            borderRadius={32}
            glowIntensity={0.28}
            fillOpacity={0.05}
          >
            <div className="flex flex-col gap-4 sm:gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#0b0b0b] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/65 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#d8f24d]" />
                  Private account area
                </span>
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-2xl font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                    Welcome back, {firstName}.
                  </h1>
                  <p className="max-w-2xl text-xs leading-5 text-white/55 sm:text-sm sm:leading-7">
                    Your bookings and account details are kept
                    in one polished place. Review your upcoming sessions, manage
                    policy windows, and jump back into the booking flow whenever
                    you need to.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 rounded-full bg-[#d8f24d] px-5 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/dashboard/bookings"
                    className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#151515] px-5 py-3 text-sm font-semibold text-white transition-colors hover:text-[#d8f24d]"
                  >
                    View bookings
                  </Link>
                </div>
              </div>

              <div className="grid gap-2.5 rounded-[1.25rem] border border-white/5 bg-[#151515] p-3 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.025)] sm:gap-3 sm:rounded-[1.75rem] sm:p-4 sm:min-w-[18rem] xl:hidden">
                <div className="flex items-center gap-3 rounded-[1.2rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-[#111111] text-white/90 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {currentUser.name}
                    </p>
                    <p className="truncate text-[11px] uppercase tracking-[0.18em] text-white/45">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.15rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                      Role
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {currentUser.role}
                    </p>
                  </div>
                  <div className="rounded-[1.15rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                      Latest booking
                    </p>
                    <p className="mt-2 truncate text-sm font-semibold text-white">
                      {latestBooking ? latestBooking.reference : "None"}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.15rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.025)]">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                    Next focus
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/75">
                    {latestBookingLabel}
                  </p>
                </div>
              </div>
            </div>
          </GlowCard>

          <div className="order-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <StatCard
              label="Total bookings"
              value={overview.stats.totalBookings}
              icon={CalendarDays}
            />
            <StatCard
              label="Upcoming"
              value={overview.stats.upcomingBookings}
              icon={Clock3}
            />
            <StatCard
              label="Past"
              value={overview.stats.pastBookings}
              icon={NotebookTabs}
            />
            <StatCard
              label="Confirmed"
              value={overview.stats.confirmedBookings}
              icon={ShieldCheck}
            />

          </div>

          <div className="order-2 grid grid-cols-3 gap-2 rounded-[1.45rem] border border-white/6 bg-[#111111] p-2.5 shadow-[18px_18px_32px_rgba(0,0,0,0.46),-10px_-10px_24px_rgba(255,255,255,0.02)] backdrop-blur-xl xl:hidden">
            {tabItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-[1rem] border border-white/5 px-2 py-2 text-center text-[11px] font-medium leading-tight transition-all duration-200 active:scale-95",
                    active
                      ? "bg-[#0b0b0b] text-[#d8f24d] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.03)]"
                      : "bg-[#151515] text-white/70 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.mobileLabel}</span>
                </Link>
              );
            })}
          </div>

          <details
            className="group order-3 rounded-[1.45rem] border border-white/6 bg-[#111111] p-2.5 shadow-[18px_18px_32px_rgba(0,0,0,0.46),-10px_-10px_24px_rgba(255,255,255,0.02)] xl:hidden"
            open={activeTab === "events"}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-[1rem] border border-white/5 bg-[#0b0b0b] px-4 py-3 text-sm font-medium text-white/82 [&::-webkit-details-marker]:hidden">
              <span className="flex min-w-0 items-center gap-3">
                <Ticket className="h-4 w-4 text-[#d8f24d]" />
                <span className="truncate">Events</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                  {overview.stats.eventBookings}
                </span>
                <ChevronDown className="h-4 w-4 text-white/55 transition-transform duration-200 group-open:rotate-180" />
              </span>
            </summary>

            <div className="mt-3 space-y-3">
              <p className="px-1 text-xs leading-6 text-white/52">
                Keep your event confirmations, ticket tiers, and venue details together in one place.
              </p>

              <Link
                href={eventTabItem.href}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-3 rounded-[1rem] border border-white/5 px-4 py-3 text-sm font-medium transition-all duration-200",
                  activeTab === "events"
                    ? "bg-[#0b0b0b] text-[#d8f24d] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.03)]"
                    : "bg-[#151515] text-white/75 shadow-[12px_12px_24px_rgba(0,0,0,0.42),-8px_-8px_18px_rgba(255,255,255,0.02)] hover:text-white",
                )}
              >
                <span className="flex items-center gap-3">
                  <Ticket className="h-4 w-4" />
                  {eventTabItem.label}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </details>
        </AnimatedSection>

            <div className="space-y-6 rounded-[1.85rem] border border-white/6 bg-[#101010] p-3.5 shadow-[inset_12px_12px_24px_rgba(0,0,0,0.58),inset_-10px_-10px_20px_rgba(255,255,255,0.02)] sm:space-y-8 sm:rounded-[2rem] sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
