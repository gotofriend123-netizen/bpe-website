"use client";

import { SlideTabs } from "@/components/ui/slide-tabs";

const demoLinks = [
  { label: "Home", href: "/" },
  { label: "Spaces", href: "/spaces" },
  { label: "Pricing", href: "/pricing" },
] as const;

export default function DemoOne() {
  return (
    <div className="grid h-screen w-full place-content-center bg-white dark:bg-black">
      <SlideTabs links={demoLinks} />
    </div>
  );
}
