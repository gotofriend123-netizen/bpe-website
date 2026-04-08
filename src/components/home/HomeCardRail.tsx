"use client";

import { Children, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface HomeCardRailProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  mobileBehavior?: "grid" | "slider";
  mobileCardWidthClassName?: string;
  mobileColumns?: 1 | 2;
}

export function HomeCardRail({
  children,
  className,
  itemClassName,
  mobileBehavior = "grid",
  mobileCardWidthClassName,
  mobileColumns = 1,
}: HomeCardRailProps) {
  const items = Children.toArray(children);
  const useSlider = mobileBehavior === "slider" && items.length > 1;

  return (
    <>
      {useSlider ? (
        <div className="md:hidden">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 pl-1 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "w-[calc(100vw-5.75rem)] max-w-[19rem] min-w-0 shrink-0 snap-start",
                  mobileCardWidthClassName,
                  itemClassName,
                )}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          mobileColumns === 2
            ? "grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-2"
            : "grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2",
          useSlider ? "hidden md:grid" : "",
          className,
        )}
      >
        {items.map((item, index) => (
          <div key={index} className={cn("min-w-0 h-full", itemClassName)}>
            {item}
          </div>
        ))}
      </div>
    </>
  );
}
