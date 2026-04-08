"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  FolderKanban,
  CheckSquare,
  LineChart,
  Users,
  Settings,
  MoonStar,
  SunMedium,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "team", label: "Team", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

const shellTone = {
  light: "bg-[#d9d9d9] text-[#2c2c2c]",
  dark: "bg-[#080808] text-white",
};

const shellShadow = {
  light:
    "shadow-[18px_18px_36px_rgba(163,163,163,0.55),-18px_-18px_36px_rgba(255,255,255,0.95)]",
  dark:
    "shadow-[18px_18px_36px_rgba(0,0,0,0.58),-12px_-12px_28px_rgba(255,255,255,0.03)]",
};

const insetShadow = {
  light:
    "shadow-[inset_8px_8px_16px_rgba(163,163,163,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.9)]",
  dark:
    "shadow-[inset_8px_8px_16px_rgba(0,0,0,0.55),inset_-8px_-8px_16px_rgba(255,255,255,0.03)]",
};

export function DashboardTemplateNeumorphism() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const tone = isDarkMode ? "dark" : "light";

  return (
    <div
      className={cn(
        "min-h-screen w-full transition-colors duration-300",
        shellTone[tone],
      )}
    >
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 p-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:p-6">
        <aside
          className={cn(
            "rounded-[2rem] border border-white/5 p-5 transition-all duration-300",
            shellTone[tone],
            shellShadow[tone],
            isCollapsed ? "w-full lg:w-24" : "w-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="mb-8 flex items-center justify-between gap-3">
              {!isCollapsed ? (
                <div
                  className={cn(
                    "rounded-[1.15rem] px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em]",
                    insetShadow[tone],
                  )}
                >
                  Template
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDarkMode((current) => !current)}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border border-white/5 transition-all duration-200",
                    shellTone[tone],
                    shellShadow[tone],
                  )}
                >
                  {isDarkMode ? (
                    <SunMedium className="h-4 w-4 text-[#d8f24d]" />
                  ) : (
                    <MoonStar className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCollapsed((current) => !current)}
                  className={cn(
                    "hidden h-11 w-11 items-center justify-center rounded-full border border-white/5 transition-all duration-200 lg:flex",
                    shellTone[tone],
                    shellShadow[tone],
                  )}
                >
                  {isCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <nav className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeItem === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveItem(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[1.15rem] border border-white/5 px-4 py-3 text-left transition-all duration-200",
                      active ? insetShadow[tone] : shellShadow[tone],
                      active
                        ? "text-[#d8f24d]"
                        : isDarkMode
                          ? "text-white/70 hover:text-white"
                          : "text-black/70 hover:text-black",
                      isCollapsed && "justify-center px-0",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed ? (
                      <span className="text-sm font-medium">{item.label}</span>
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4 pt-8">
              <div
                className={cn(
                  "flex items-center gap-3 rounded-[1.25rem] border border-white/5 p-3",
                  insetShadow[tone],
                  isCollapsed && "justify-center",
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border border-white/5",
                    shellShadow[tone],
                  )}
                >
                  <UserRound className="h-5 w-5" />
                </div>
                {!isCollapsed ? (
                  <div>
                    <p className="text-sm font-semibold">DalexDev</p>
                    <p className="text-xs uppercase tracking-[0.14em] opacity-55">
                      byDalexDev@exm.com
                    </p>
                  </div>
                ) : null}
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 rounded-[1rem] border border-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em]",
                  insetShadow[tone],
                  isCollapsed && "justify-center",
                )}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                {!isCollapsed ? <span>Online</span> : null}
              </div>
            </div>
          </div>
        </aside>

        <main
          className={cn(
            "rounded-[2.2rem] border border-white/5 p-5 sm:p-6 lg:p-8",
            shellTone[tone],
            insetShadow[tone],
          )}
        >
          <div
            className={cn(
              "flex min-h-[70vh] flex-col items-center justify-center rounded-[1.85rem] border border-white/5 p-8 text-center",
              shellShadow[tone],
            )}
          >
            <h2 className="text-3xl font-bold tracking-[-0.04em]">
              {menuItems.find((item) => item.id === activeItem)?.label}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 opacity-65">
              You selected {menuItems.find((item) => item.id === activeItem)?.label}. This is the
              main content area where the information corresponding to the selected section would be
              displayed.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={cn(
                    "flex h-24 w-24 items-center justify-center rounded-[1.4rem] border border-white/5 font-bold",
                    shellShadow[tone],
                  )}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export const Component = DashboardTemplateNeumorphism;
export default DashboardTemplateNeumorphism;
