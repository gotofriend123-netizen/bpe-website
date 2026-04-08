import React, {
  useRef,
  useState,
  useEffect,
  type ForwardedRef,
} from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Position = {
  left: number;
  width: number;
  opacity: number;
};

type TabItem = {
  label: string;
  href: string;
  dropdown?: readonly { label: string; href: string }[];
};

export const SlideTabs = ({
  links,
  className,
}: {
  links: readonly TabItem[];
  className?: string;
}) => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const pathname = usePathname();
  
  // Find currently active link index
  const activeIndex = links.findIndex((item) => {
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
  const selected = activeIndex >= 0 ? activeIndex : 0;

  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const selectedTab = tabsRef.current[selected];
    if (selectedTab) {
      const { width } = selectedTab.getBoundingClientRect();
      setPosition({
        left: selectedTab.offsetLeft,
        width,
        opacity: 1,
      });
    }
  }, [selected]);

  return (
    <ul
      onMouseLeave={() => {
        setHoveredTab(null);
        const selectedTab = tabsRef.current[selected];
        if (selectedTab) {
          const { width } = selectedTab.getBoundingClientRect();
          setPosition({
            left: selectedTab.offsetLeft,
            width,
            opacity: 1,
          });
        }
      }}
      className={cn(
        "relative mx-auto flex w-fit max-w-full rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.96),rgba(10,10,10,0.84))] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl",
        className,
      )}
    >
      {links.map((tab, i) => (
        <Tab
          key={tab.label}
          ref={(el) => {
            tabsRef.current[i] = el;
          }}
          setPosition={setPosition}
          setHoveredTab={setHoveredTab}
          hoveredTab={hoveredTab}
          label={tab.label}
          href={tab.href}
          dropdown={tab.dropdown}
          isActive={selected === i || (tab.dropdown?.some(d => pathname.startsWith(d.href)) ?? false)}
        >
          {tab.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
};

const Tab = React.forwardRef(function Tab(
  {
    children,
    setPosition,
    setHoveredTab,
    hoveredTab,
    label,
    href,
    dropdown,
    isActive,
  }: {
    children: React.ReactNode;
    setPosition: React.Dispatch<React.SetStateAction<Position>>;
    setHoveredTab: React.Dispatch<React.SetStateAction<string | null>>;
    hoveredTab: string | null;
    label: string;
    href: string;
    dropdown?: readonly { label: string; href: string }[];
    isActive: boolean;
  },
  ref: ForwardedRef<HTMLLIElement>,
) {
  const tabRef = useRef<HTMLLIElement | null>(null);

  return (
    <li
      ref={(node) => {
        tabRef.current = node;

        if (typeof ref === "function") {
          ref(node);
          return;
        }

        if (ref) {
          ref.current = node;
        }
      }}
      onMouseEnter={() => {
        setHoveredTab(label);
        const current = tabRef.current;
        if (!current) return;

        const { width } = current.getBoundingClientRect();
        setPosition({
          left: current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer"
    >
      {/* If the cursor is physically behind this tab, make the text black so it is readable on the white background */}
        <Link
        href={href}
        className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 active:scale-95 xl:px-4 xl:text-[12px] ${
          (hoveredTab !== null ? hoveredTab === label : isActive)
            ? "text-[#f0debc]"
            : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        {children}
        {dropdown ? (
          <svg className={`h-3 w-3 transition-transform duration-200 ${hoveredTab === label ? "rotate-180" : "opacity-70"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : null}
      </Link>

      {dropdown && hoveredTab === label && (
        <div className="absolute left-1/2 top-full min-w-[200px] -translate-x-1/2 pt-4">
          <div className="rounded-2xl border border-white/15 bg-black/60 p-2 shadow-[0_10px_40px_rgba(255,255,255,0.05)] backdrop-blur-xl">
            {dropdown.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="block whitespace-nowrap rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-zinc-300 transition-all active:scale-95 hover:border-white/10 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </li>
  );
});

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute top-1 z-0 h-[38px] rounded-full border border-[#d6b98c]/25 bg-[linear-gradient(180deg,rgba(214,185,140,0.14),rgba(214,185,140,0.08))] shadow-[0_0_22px_rgba(214,185,140,0.12)]"
    />
  );
};
