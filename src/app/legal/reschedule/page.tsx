import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata = {
  title: "Reschedule Policy | Black Pepper Entertainment",
};

export default function ReschedulePolicyPage() {
  return (
    <div className="min-h-screen bg-black pb-24 pt-32">
      <div className="container mx-auto max-w-4xl px-6">
        <AnimatedSection className="mb-16">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Reschedule Policy
          </h1>
          <p className="text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </AnimatedSection>

        <AnimatedSection
          delay={0.1}
          className="prose prose-invert max-w-none prose-lg"
        >
          <p className="text-gray-400 leading-relaxed">
            We do our best to keep the booking flow flexible while protecting the
            production calendar for all clients.
          </p>

          <div className="mt-10 space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="mb-3 text-2xl font-bold text-white">
                48+ Hours Before Session
              </h2>
              <p className="font-semibold text-[#25D366]">No reschedule fee</p>
              <p className="mt-3 text-gray-400">
                Reschedules requested more than 48 hours before the scheduled
                start time can be moved once without penalty, subject to slot
                availability.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="mb-3 text-2xl font-bold text-white">
                24 to 48 Hours Before Session
              </h2>
              <p className="font-semibold text-yellow-500">
                Subject to approval
              </p>
              <p className="mt-3 text-gray-400">
                We review these requests manually. Alternate slots may involve a
                partial rescheduling fee depending on crew, equipment, and peak
                demand.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="mb-3 text-2xl font-bold text-white">
                Less Than 24 Hours
              </h2>
              <p className="font-semibold text-red-500">
                Self-service rescheduling unavailable
              </p>
              <p className="mt-3 text-gray-400">
                Requests inside 24 hours must be handled directly with the team
                and may not be possible. Any approved change can incur an urgent
                rescheduling fee.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
