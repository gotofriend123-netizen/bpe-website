import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { arcadeImages } from "@/lib/content/site-images";

export const metadata = {
  title: "About Us | Black Pepper Entertainment",
  description: "Learn about the mission and vision behind Black Pepper Entertainment's premium spaces.",
};

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
            About Black Pepper
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We exist to provide creators, founders, and communities with breathtaking environments that elevate their work. From intimate podcast recordings to large-scale gallery events, our spaces are engineered for excellence.
          </p>
        </AnimatedSection>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <AnimatedSection direction="right" className="relative h-[500px] rounded-3xl overflow-hidden bg-white/5 border border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{ backgroundImage: `url('${arcadeImages[4]}')` }}
            />
          </AnimatedSection>
          
          <AnimatedSection direction="left" className="space-y-6">
            <h2 className="text-3xl font-bold">The Vision</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Black Pepper Entertainment was founded on a simple premise: your environment dictates your output. We noticed a lack of accessible, genuinely premium spaces that cater to both modern digital creators and traditional community gatherings.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg">
              By bridging the gap between high-end aesthetic appeal and technical functionality, we built an ecosystem where <span className="text-white font-semibold">The Arcade</span> and <span className="text-white font-semibold">Verve Studio</span> operate under one unified standard of quality.
            </p>
            <div className="pt-6 border-t border-white/10 flex gap-12">
              <div>
                <p className="text-4xl font-bold text-white mb-2">2023</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Established</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white mb-2">2</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Unique Spaces</p>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Values */}
        <AnimatedSection className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Uncompromising Quality", desc: "Acoustic treatments, 4K gear, and designer furniture as the baseline, never an upgrade." },
              { title: "Frictionless Experience", desc: "A booking and management process that stays completely out of your way." },
              { title: "Community First", desc: "Spaces designed for connection, collaboration, and showcasing the best talent." }
            ].map((v, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:bg-white/5 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-gray-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
