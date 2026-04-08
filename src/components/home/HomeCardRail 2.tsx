"use client";

import {
  Children,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface HomeCardRailProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  mobileBehavior?: "grid" | "marquee";
  mobileCardWidthClassName?: string;
  marqueeDurationSeconds?: number;
}

export function HomeCardRail({
  children,
  className,
  itemClassName,
  mobileBehavior = "grid",
  mobileCardWidthClassName,
  marqueeDurationSeconds,
}: HomeCardRailProps) {
  const items = Children.toArray(children);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const shouldUseMarquee = mobileBehavior === "marquee" && items.length > 1;
  const mobileDuration = marqueeDurationSeconds ?? Math.max(24, items.length * 5);

  const pause = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    setIsPaused(true);
  };

  const resumeSoon = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      resumeTimerRef.current = null;
    }, 1200);
  };

  return (
    <>
      {shouldUseMarquee ? (
        <div className="relative md:hidden">
          <div
            className="overflow-hidden px-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            onMouseEnter={pause}
            onMouseLeave={resumeSoon}
            onTouchStart={pause}
            onTouchEnd={resumeSoon}
            onTouchCancel={resumeSoon}
            onFocusCapture={pause}
            onBlurCapture={resumeSoon}
          >
            <div
              className="flex w-max gap-4 py-1 will-change-transform"
              style={{
                ["--marquee-duration" as string]: `${mobileDuration}s`,
                animation: "home-card-marquee var(--marquee-duration) linear infinite",
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {[0, 1].map((copyIndex) => (
                <div key={copyIndex} className="flex shrink-0 gap-4 pr-4">
                  {items.map((item, index) => (
                    <div
                      key={`${copyIndex}-${index}`}
                      className={cn(
                        "w-[84vw] max-w-[22rem] shrink-0 transition-transform duration-300 active:scale-[0.985]",
                        mobileCardWidthClassName,
                        itemClassName,
                      )}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "grid grid-cols-1 gap-5 sm:grid-cols-2",
          shouldUseMarquee ? "hidden md:grid" : "",
          className,
        )}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "min-w-0",
              itemClassName,
            )}
          >
            {item}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes home-card-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(calc(-50% - 0.5rem), 0, 0);
          }
        }
      `}</style>
    </>
  );
}
