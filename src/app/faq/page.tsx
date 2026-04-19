import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { FAQSchema } from "@/components/seo/LocalSchema";

export const metadata = {
  title: "FAQ About Booking Event Hall & Podcast Studio in Raipur | Black Pepper Entertainment",
  description: "Frequently asked questions about booking The Arcade community hall and Verve Studio podcast studio in Raipur. Pricing, cancellation policy, parking, equipment, and more.",
  keywords: [
    "event hall booking FAQ Raipur",
    "podcast studio FAQ Raipur",
    "Black Pepper Entertainment FAQ",
    "The Arcade booking questions",
    "Verve Studio FAQ",
    "community hall Raipur FAQ",
  ],
};

const FAQS = [
  { q: "How do I book The Arcade or Verve Studio in Raipur?", a: "You can book directly through our online reservation system at blackpepperentertainment.in. Head to the Booking or Availability page, select your desired space (The Arcade or Verve Studio), choose your package, date, and time. Your slot will be instantly confirmed." },
  { q: "What is the price of booking The Arcade event hall in Raipur?", a: "The Arcade event hall pricing starts at ₹15,000 for a 4-hour Half Day Event package. The Full Day Event (8 hours) is ₹25,000 and includes custom DMX lighting, pro audio, lounge access, and a pre-event setup hour. All packages include WiFi, parking, and on-site tech support." },
  { q: "What is the price of booking Verve Studio podcast studio in Raipur?", a: "Verve Studio pricing starts at ₹4,000 for the Urban Flame package (2 hours, studio-only). The Standard Setup with 4K camera and Shure SM7B is ₹6,500. The Premium Setup with dual 4K cameras, 2x SM7B, and custom lighting is ₹8,500 for 2 hours." },
  { q: "Is payment required in advance?", a: "Yes, to secure your slot and lock in your hardware and crew requirements, a full payment or allowed advance payment is required upon confirmation of the booking email." },
  { q: "What is the cancellation policy?", a: "Cancellations made 48 hours before the scheduled time receive a 100% refund. Cancellations made within 24-48 hours receive a 50% refund. No refunds for no-shows or cancellations within 24 hours." },
  { q: "Can I bring my own gear or crew to the studio?", a: "Absolutely. While we provide top-of-the-line 4K equipment and audio interfaces, you are welcome to bring your own directors, DPs, or additional specialized equipment into the space." },
  { q: "Will raw footage be provided immediately after the session?", a: "Yes. Simply bring your own high-speed storage (SSD or SD card), and you leave the studio with your raw 4K video files and multi-track audio immediately after the session." },
  { q: "Do you provide parking at The Arcade or Verve Studio?", a: "We have designated parking spots available on a first-come, first-served basis, alongside safe surrounding street parking. All bookings include parking access at no extra charge." },
  { q: "Where is Black Pepper Entertainment located in Raipur?", a: "Black Pepper Entertainment is located in Raipur, Chhattisgarh. The Arcade community hall and Verve Studio podcast studio are both at the same location. Contact us via blackpepperentertainment.in for the exact address and directions." },
  { q: "Can I book The Arcade for a private party or birthday event in Raipur?", a: "Absolutely. The Arcade is frequently booked for private parties, birthday celebrations, anniversary dinners, and corporate events. Our DMX lighting system can be customized for any party atmosphere. Book through our website or contact us for a custom quote." },
  { q: "Can I do a site visit before booking?", a: "Yes, we welcome site visits before your booking. Contact us through the website to schedule a tour of The Arcade or Verve Studio before you commit." },
  { q: "Does Verve Studio offer photoshoot sessions in Raipur?", a: "Yes. Verve Studio's three aesthetic room setups (Ivory, Sage, and Horizon) are also used for brand photoshoots, creator content sessions, and product photography. The Premium Setup includes professional Aputure lighting and is ideal for visual content creation." },
];

export default function FAQPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <FAQSchema faqs={FAQS} />
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-300 mb-4">Help Centre</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Frequently Asked Questions About Booking in Raipur</h1>
          <p className="text-xl text-gray-400">Everything you need to know before stepping into The Arcade or Verve Studio in Raipur.</p>
        </AnimatedSection>

        <FaqAccordion faqs={FAQS} />
      </div>
    </div>
  );
}
