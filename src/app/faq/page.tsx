import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { FAQSchema } from "@/components/seo/LocalSchema";

export const metadata = {
  title: "Booking FAQ | Black Pepper Entertainment Raipur",
  description: "Frequently asked questions for booking The Arcade and Verve Studio in Raipur, Chhattisgarh.",
};

const FAQS = [
  { q: "How do I book a space?", a: "You can book directly through our online reservation system. Just head to the Booking page, select your desired space (The Arcade or Verve Studio), choose your package, date, and time. Your slot will be instantly requested." },
  { q: "Is payment required in advance?", a: "Yes, to secure your slot and lock in your hardware/crew requirements, a full payment or allowed advance payment is required upon confirmation of the booking email." },
  { q: "What is the cancellation policy?", a: "Cancellations made 48 hours before the scheduled time receive a 100% refund. Cancellations made within 24-48 hours receive a 50% refund. No refunds for no-shows or cancellations within 24 hours." },
  { q: "Can I bring my own gear/crew?", a: "Absolutely. While we provide top-of-the-line 4K equipment and audio interfaces, you are welcome to bring your own directors, DPs, or additional specialized equipment into the space." },
  { q: "Will raw footage be provided immediately?", a: "Yes. Simply bring your own high-speed storage (SSD or SD card), and you leave the studio with your raw 4K video files and multi-track audio immediately after the session." },
  { q: "Do you provide parking?", a: "We have designated spots available on a first-come, first-served basis, alongside safe surrounding street parking." }
];

export default function FAQPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <FAQSchema faqs={FAQS} />
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Frequently Asked Questions About Booking in Raipur</h1>
          <p className="text-xl text-gray-400">Everything you need to know before stepping into our spaces.</p>
        </AnimatedSection>

        <FaqAccordion faqs={FAQS} />
      </div>
    </div>
  );
}
