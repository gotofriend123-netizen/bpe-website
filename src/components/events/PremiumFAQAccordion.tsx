import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
};

type PremiumFAQAccordionProps = {
  items: readonly FAQItem[];
};

export function PremiumFAQAccordion({ items }: PremiumFAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {items.map((item) => (
        <AccordionItem
          key={item.question}
          value={item.question}
          className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] px-5 shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
        >
          <AccordionTrigger className="py-5 text-[15px] font-semibold leading-6 text-white hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-[14px] leading-7 text-zinc-400">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
