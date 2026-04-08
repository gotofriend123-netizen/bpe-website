import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata = {
  title: "Terms & Conditions | Black Pepper Entertainment",
};

export default function TermsPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Terms & Conditions</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="prose prose-invert max-w-none prose-lg">
          <p>
            Welcome to Black Pepper Entertainment. By booking and utilizing our spaces (The Arcade and Verve Studio), you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-white">1. Booking & Payments</h2>
          <p className="text-gray-400 leading-relaxed">
            All bookings are subject to availability and confirmation. A booking is only considered confirmed once the required payment (either full or the agreed advance) has been received and a confirmation email is dispatched by our system.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-white">2. Usage of Space</h2>
          <p className="text-gray-400 leading-relaxed">
            You agree to use the booked space solely for the purpose indicated during the booking process. Any illegal, dangerous, or unauthorized activities are strictly prohibited. You are responsible for any damage caused to the equipment, furniture, or structure of the space during your booking period.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-white">3. Overtime Charges</h2>
          <p className="text-gray-400 leading-relaxed">
            If your session exceeds the allotted booked time, overtime charges will be billed at increments of 30 minutes based on the standard hourly rate of the respective studio.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-white">4. Equipment Policy (Verve Studio)</h2>
          <p className="text-gray-400 leading-relaxed">
            Our 4K cinema cameras, lighting arrays, and audio interfaces are finely calibrated. Any physical repositioning of heavy equipment must be done under the supervision of our on-site technical staff. Memory cards and storage devices provided by the client must be formatted properly prior to the shoot.
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
