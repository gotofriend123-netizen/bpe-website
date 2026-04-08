import type { CSSProperties, ReactNode } from "react";
import type { BorderGlowProps } from "@/components/ui/BorderGlow";
import { cn } from "@/lib/utils";

interface GlowCardProps
  extends Omit<BorderGlowProps, "children" | "className"> {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function GlowCard({
  children,
  className,
  contentClassName,
  backgroundColor = "#050505",
  borderRadius = 28,
  fillOpacity = 0.22,
}: GlowCardProps) {
  const surfaceStyle: CSSProperties = {
    backgroundColor,
    borderRadius,
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 48px rgba(0,0,0,0.32)",
  };

  const veilStyle: CSSProperties = {
    background: `linear-gradient(180deg, rgba(255,255,255,${Math.max(
      fillOpacity * 0.22,
      0.03,
    ).toFixed(3)}) 0%, rgba(255,255,255,${Math.max(
      fillOpacity * 0.08,
      0.015,
    ).toFixed(3)}) 100%)`,
    borderRadius: `calc(${borderRadius}px - 1px)`,
  };

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden border border-white/10",
        className,
      )}
      style={surfaceStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_34%)]"
        style={veilStyle}
      />
      <div className={cn("relative h-full w-full", contentClassName)}>{children}</div>
    </div>
  );
}
