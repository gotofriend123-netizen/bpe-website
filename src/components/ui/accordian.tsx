"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accessibility,
  Code,
  Info,
  LucideIcon,
  Minus,
  Plus,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type AccordianItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  content: string;
};

const items: AccordianItem[] = [
  {
    id: "1",
    icon: Info,
    title: "What is the core philosophy of Origin UI?",
    content:
      "Origin UI emphasizes developer experience by offering lightweight, accessible components with strong TypeScript support and excellent documentation.",
  },
  {
    id: "2",
    icon: Settings,
    title: "How do I customize styles in Origin UI?",
    content:
      "You can easily customize styles using CSS variables, Tailwind, or traditional CSS by overriding classNames or using the style prop.",
  },
  {
    id: "3",
    icon: Code,
    title: "How performant is Origin UI?",
    content:
      "Optimized for performance with minimal bundle size, tree shaking, and fast rendering to keep your apps light and fast.",
  },
  {
    id: "4",
    icon: Accessibility,
    title: "Is accessibility a priority in Origin UI?",
    content:
      "Absolutely! All components follow WAI-ARIA guidelines and support keyboard navigation and screen readers out of the box.",
  },
];

type ComponentProps = {
  items?: AccordianItem[];
  title?: string;
  className?: string;
  initialOpenItem?: string | null;
};

export const Component = ({
  items: customItems = items,
  title = "FAQs",
  className,
  initialOpenItem = "1",
}: ComponentProps) => {
  const [openItem, setOpenItem] = useState<string | null>(initialOpenItem);

  const toggleItem = (id: string) => {
    setOpenItem((current) => (current === id ? null : id));
  };

  return (
    <div
      className={cn(
        "w-full rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-500",
        className,
      )}
    >
      <h2 className="px-5 pt-5 text-2xl font-extrabold text-white select-none">
        {title}
      </h2>

      <div>
        {customItems.map(({ id, icon: Icon, title: itemTitle, content }) => {
          const isOpen = openItem === id;

          return (
            <div
              key={id}
              className="border-t border-white/10 last:border-b-0"
            >
              <button
                onClick={() => toggleItem(id)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between bg-transparent px-5 py-4 text-base font-medium text-white transition-colors duration-300 hover:bg-white/[0.04] focus:outline-none"
              >
                <div className="flex items-center gap-3 pr-4 text-left">
                  <Icon
                    className="h-4 w-4 shrink-0 text-white"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>{itemTitle}</span>
                </div>

                <div className="relative h-4 w-4 flex-shrink-0">
                  <Plus
                    className={cn(
                      "absolute inset-0 text-white transition-opacity duration-300",
                      isOpen ? "opacity-0" : "opacity-100",
                    )}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <Minus
                    className={cn(
                      "absolute inset-0 text-white transition-opacity duration-300",
                      isOpen ? "opacity-100" : "opacity-0",
                    )}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-5 pb-5 text-sm leading-relaxed text-gray-300 select-text">
                  {content}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { items as accordianItems };
