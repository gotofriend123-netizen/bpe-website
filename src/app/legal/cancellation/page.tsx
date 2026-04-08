import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata = {
  title: "Cancellation & Refund Policy | Black Pepper Entertainment",
};

export default function CancellationPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Cancellation & Refund Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="prose prose-invert max-w-none prose-lg">
          <p className="text-gray-400 leading-relaxed mb-8">
            We understand that plans change. Our policy is designed to be fair to both our clients and our studio scheduling operations.
          </p>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-3">48+ Hours Notice</h3>
              <p className="text-[#25D366] font-semibold mb-2">100% Refund</p>
              <p className="text-gray-400">If you cancel your booking more than 48 hours prior to your scheduled start time, you are eligible for a full refund or a free reschedule.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-3">24 to 48 Hours Notice</h3>
              <p className="text-yellow-500 font-semibold mb-2">50% Refund</p>
              <p className="text-gray-400">Cancellations made within 24 to 48 hours of your scheduled time will receive a 50% refund. Rescheduling may involve an additional fee depending on availability.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-3">Less Than 24 Hours / No-Shows</h3>
              <p className="text-red-500 font-semibold mb-2">No Refund</p>
              <p className="text-gray-400">If you cancel within 24 hours of your start time or fail to show up for your booking, no refunds will be issued.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-16 mb-4 text-white">Refund Processing</h2>
          <p className="text-gray-400 leading-relaxed">
            Approved refunds will be processed back to the original method of payment within 5-7 business days.
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
