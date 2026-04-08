import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata = {
  title: "Privacy Policy | Black Pepper Entertainment",
};

export default function PrivacyPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="prose prose-invert max-w-none prose-lg text-gray-400">
          <p className="leading-relaxed">
            Black Pepper Entertainment (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by us.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-white">1. Information We Collect</h2>
          <p className="leading-relaxed">
            We collect information from you when you book a space through our website, communicate with our support staff, or subscribe to our newsletters. The personal information we collect includes your Name, Email address, Phone number, and Payment information (processed securely via our payment gateways, not stored on our servers).
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-white">2. Security of Your Content</h2>
          <p className="leading-relaxed">
            Any audio, video, or photographic content created within our spaces (Verve Studio & The Arcade) belongs solely to you (the creator). We do not store, copy, or distribute your raw files. Once you leave the studio with your data, it is entirely in your possession.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-white">3. How We Use Your Information</h2>
          <p className="leading-relaxed">
            We use the information we collect to facilitate the booking process, send confirmation emails and reminders, respond to customer service requests, and to improve our website and offerings.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-white">4. Contact Us</h2>
          <p className="leading-relaxed">
            If you have questions or comments about this Privacy Policy, please contact us at hello@blackpepper.ent.
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
