import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { MoveRight, CheckCircle2, MapPin } from "lucide-react";
import { arcadeImages } from "@/lib/content/site-images";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/seo/LocalSchema";

export const metadata = {
  title: "Premium Community Hall in Shankar Nagar, Raipur | The Arcade",
  description: "Looking for a community hall in Shankar Nagar, Raipur? The Arcade is a premium event space perfect for workshops, meetups, exhibitions, and corporate gatherings.",
};

export default function CommunityHallShankarNagarPage() {
  return (
    <div className="bg-black min-h-screen paper-texture-dark">
      <OrganizationSchema />
      <LocalBusinessSchema
        title="The Arcade - Community Hall in Shankar Nagar"
        description={metadata.description}
        url="https://blackpepperentertainment.in/community-hall-shankar-nagar-raipur"
        image={arcadeImages[0]}
      />

      <section className="relative h-[70vh] min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity"
            style={{ backgroundImage: `url('${arcadeImages[0]}')` }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <AnimatedSection>
             <span className="text-white/80 flex items-center gap-2 font-semibold tracking-widest uppercase text-sm mb-4">
                <MapPin className="w-4 h-4" /> Shankar Nagar, Raipur
             </span>
             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
               Raipur&apos;s Most Premium <br/> Community Hall
             </h1>
             <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed mb-8">
               Host your next workshop, corporate gathering, or art exhibition at The Arcade. Located in the heart of Shankar Nagar, Raipur, we provide a sophisticated canvas for real connections.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/calendar?space=arcade" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.1)]">
                  Check Availability <MoveRight className="w-5 h-5" />
                </Link>
                <a href="https://wa.me/919203411611" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 font-bold rounded-full hover:bg-[#25D366]/20 transition-all">
                  WhatsApp Us
                </a>
             </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <AnimatedSection direction="right">
          <h2 className="text-3xl font-bold mb-6">Why host your event in Shankar Nagar?</h2>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            Shankar Nagar represents the bustling, premium heart of Raipur. Your attendees deserve a venue that is easy to reach, beautifully designed, and equipped with industry-standard audio-visual gear.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3 text-gray-300">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
              <span><strong>Capacity:</strong> Fits up to 100 standing / 60 seated guests.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
              <span><strong>Aesthetics:</strong> Cinematic smart lighting and premium architecture.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
              <span><strong>Support:</strong> On-site technical staff for hassle-free execution.</span>
            </li>
          </ul>
        </AnimatedSection>
        <AnimatedSection direction="left">
           <img src={arcadeImages[4]} alt="Event happening at the community hall in Raipur" className="rounded-3xl border border-white/10 shadow-2xl" />
        </AnimatedSection>
      </section>

    </div>
  );
}
