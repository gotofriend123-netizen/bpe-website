'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type ArcGalleryImage = {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
};

type ArcGalleryHeroProps = {
  images: Array<string | ArcGalleryImage>;
  startAngle?: number;
  endAngle?: number;
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  className?: string;
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const FALLBACK_IMAGE = "/BLACK%20PEPPER%20LOGO%20%20WIGHT%20PNG.png";

export const ArcGalleryHero: React.FC<ArcGalleryHeroProps> = ({
  images,
  startAngle = 20,
  endAngle = 160,
  radiusLg = 500,
  radiusMd = 380,
  radiusSm = 270,
  cardSizeLg = 124,
  cardSizeMd = 102,
  cardSizeSm = 82,
  className = "",
  title = "Rediscover Your Memories with AI",
  description =
    "Our intelligent platform finds, organizes, and brings your most cherished moments back to life.",
  primaryCtaLabel = "Explore Your Past",
  primaryCtaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref,
}) => {
  const denseArc = images.length >= 10;
  const [layout, setLayout] = useState({
    radius: radiusLg,
    cardSize: cardSizeLg,
    arcHeight: radiusLg * 1.16,
    sectionMinHeight: 820,
    localStartAngle: startAngle,
    localEndAngle: endAngle,
    contentOffset: -220,
    topClearance: 40,
  });
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const compactRadiusLg = denseArc ? radiusLg + 12 : radiusLg;
      const compactRadiusMd = denseArc ? radiusMd + 10 : radiusMd;
      const compactRadiusSm = denseArc ? radiusSm + 8 : radiusSm;
      const compactCardLg = denseArc ? Math.min(cardSizeLg, 104) : cardSizeLg;
      const compactCardMd = denseArc ? Math.min(cardSizeMd, 86) : cardSizeMd;
      const compactCardSm = denseArc ? Math.min(cardSizeSm, 68) : cardSizeSm;
      const compactStart = denseArc ? Math.max(startAngle, 14) : startAngle;
      const compactEnd = denseArc ? Math.min(endAngle, 166) : endAngle;

      if (width < 640) {
        const fittedCardSize = Math.max(52, Math.min(compactCardSm, Math.floor(width * 0.12)));
        const fittedRadius = Math.max(138, Math.min(compactRadiusSm, Math.floor(width * 0.34)));

        setLayout({
          radius: fittedRadius,
          cardSize: fittedCardSize,
          arcHeight: fittedRadius * (denseArc ? 2.02 : 1.88),
          sectionMinHeight: denseArc ? 560 : 540,
          localStartAngle: denseArc ? 32 : 40,
          localEndAngle: denseArc ? 148 : 140,
          contentOffset: denseArc ? -58 : -64,
          topClearance: denseArc ? 28 : 22,
        });
      } else if (width < 1024) {
        setLayout({
          radius: compactRadiusMd,
          cardSize: compactCardMd,
          arcHeight: compactRadiusMd * (denseArc ? 1.42 : 1.3),
          sectionMinHeight: denseArc ? 700 : 680,
          localStartAngle: denseArc ? 14 : 18,
          localEndAngle: denseArc ? 166 : 162,
          contentOffset: denseArc ? -82 : -96,
          topClearance: denseArc ? 38 : 30,
        });
      } else {
        setLayout({
          radius: compactRadiusLg,
          cardSize: compactCardLg,
          arcHeight: compactRadiusLg * (denseArc ? 1.18 : 1.08),
          sectionMinHeight: denseArc ? 760 : 720,
          localStartAngle: compactStart,
          localEndAngle: compactEnd,
          contentOffset: denseArc ? -156 : -188,
          topClearance: denseArc ? 58 : 44,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [
    radiusLg,
    radiusMd,
    radiusSm,
    cardSizeLg,
    cardSizeMd,
    cardSizeSm,
    startAngle,
    endAngle,
    denseArc,
  ]);

  const count = Math.max(images.length, 2);
  const step = (layout.localEndAngle - layout.localStartAngle) / (count - 1);

  return (
    <section
      className={`relative flex w-full flex-col overflow-hidden bg-black text-white ${className}`}
      style={{ minHeight: `${layout.sectionMinHeight}px` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-[420px] w-[420px] rounded-full bg-white/5 blur-[120px] mix-blend-screen animate-pulse sm:h-[500px] sm:w-[500px]" />
      </div>

      <div
        className="relative w-full"
        style={{
          height: layout.arcHeight + layout.topClearance,
          paddingTop: layout.topClearance,
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          {images.map((image, i) => {
            const angle = layout.localStartAngle + step * i;
            const angleRad = (angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * layout.radius;
            const y = Math.sin(angleRad) * layout.radius;
            const cardRotation = (angle - 90) / 3.6;
            const imageConfig =
              typeof image === "string"
                ? { src: image, width: 400, height: 400, alt: `Memory ${i + 1}` }
                : image;
            const displaySrc = imageErrors[i] ? FALLBACK_IMAGE : imageConfig.src;
            const aspectRatio =
              imageConfig.width && imageConfig.height
                ? imageConfig.width / imageConfig.height
                : 1;
            const clampedAspectRatio = Math.min(Math.max(aspectRatio, 0.82), 1.52);
            const cardHeight = layout.cardSize;
            const cardWidth = layout.cardSize * clampedAspectRatio;
            const floatDuration = 8 + (i % 4);
            const swayDuration = 7 + (i % 5);

            return (
              <div
                key={`${displaySrc}-${i}`}
                className="absolute opacity-0 animate-fade-in-up"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  left: `calc(50% + ${x}px)`,
                  bottom: `${y}px`,
                  transform: "translate(-50%, 50%)",
                  animationDelay: `${i * 90}ms`,
                  animationFillMode: "forwards",
                  zIndex: count - i,
                }}
              >
                <div
                  className="group relative h-full w-full overflow-hidden rounded-[1.65rem] border border-white/14 bg-white/[0.04] shadow-[0_18px_40px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-white/8 transition-transform duration-300 hover:scale-[1.04]"
                  style={{
                    ["--card-rotation" as string]: `${cardRotation}deg`,
                    transform: `rotate(${cardRotation}deg)`,
                    animation: `card-sway ${swayDuration}s ease-in-out ${i * 110}ms infinite alternate`,
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent_36%,rgba(0,0,0,0.08))]" />
                  <Image
                    src={displaySrc}
                    alt={imageConfig.alt ?? `Memory ${i + 1}`}
                    fill
                    sizes={`${Math.round(cardWidth)}px`}
                    className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{
                      animation: `image-float ${floatDuration}s ease-in-out ${i * 120}ms infinite alternate`,
                    }}
                    draggable={false}
                    quality={70}
                    onError={() => {
                      setImageErrors((current) => {
                        if (current[i]) {
                          return current;
                        }

                        return { ...current, [i]: true };
                      });
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="relative z-10 flex flex-1 items-center justify-center px-4 pb-14 sm:px-6 sm:pb-20"
        style={{ marginTop: `${layout.contentOffset}px` }}
      >
        <div
          className="max-w-4xl px-2 text-center opacity-0 animate-fade-in sm:px-4"
          style={{ animationDelay: "900ms", animationFillMode: "forwards" }}
        >
          <h2 className="text-[2rem] font-bold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-[5.25rem]">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-[14px] leading-6 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-relaxed">
            {description}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4">
            <Link
              href={primaryCtaHref}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/14 bg-white px-6 py-3 text-base font-semibold text-black shadow-[0_18px_45px_rgba(255,255,255,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-100 sm:min-h-14 sm:w-auto sm:px-8 sm:text-lg"
            >
              {primaryCtaLabel}
            </Link>
            {secondaryCtaLabel && secondaryCtaHref ? (
              <Link
                href={secondaryCtaHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/8 sm:min-h-14 sm:w-auto sm:px-8 sm:text-lg"
              >
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, 60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 50%);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes image-float {
          0% {
            transform: scale(1.01) translate3d(0, 0, 0);
          }
          100% {
            transform: scale(1.08) translate3d(2%, -2%, 0);
          }
        }
        @keyframes card-sway {
          0% {
            transform: rotate(var(--card-rotation, 0deg)) translateY(0px);
          }
          100% {
            transform: rotate(calc(var(--card-rotation, 0deg) + 1.4deg)) translateY(-4px);
          }
        }
        .animate-fade-in-up {
          animation-name: fade-in-up;
          animation-duration: 0.8s;
          animation-timing-function: ease-out;
        }
        .animate-fade-in {
          animation-name: fade-in;
          animation-duration: 0.8s;
          animation-timing-function: ease-out;
        }
      `}</style>
    </section>
  );
};
