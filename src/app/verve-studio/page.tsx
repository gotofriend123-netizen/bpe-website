import Image from "next/image";
import { verveLeftSetupImages, verveRightSetupImages } from "@/lib/content/site-images";

export const metadata = {
  title: "Verve Studio | Podcast Recording Studio in Raipur | Black Pepper Entertainment",
  description: "Book Verve Studio — Raipur's only professional podcast recording studio with 4K cameras, Shure SM7B microphones, Aputure lighting, and acoustic treatment. From ₹4,000 per session.",
  keywords: [
    "podcast studio Raipur",
    "podcast recording studio Raipur",
    "podcast studio for rent Raipur",
    "Verve Studio Raipur",
    "4K recording studio Raipur",
    "content creation studio Raipur",
    "Shure SM7B studio Raipur",
    "vodcast studio Raipur",
    "interview studio Raipur",
    "creator studio Raipur",
  ],
};

const AMENITIES = [
  "Broadcast-grade Acoustic Treatment",
  "Pre-rigged Cinema Cameras",
  "Shure Mics & Audio Interfaces",
  "DMX Controlled Aputure Lighting",
  "Dedicated Control/Monitoring",
  "Zero-latency Audio Routing",
  "Live Streaming Capabilities",
  "On-site Technical Staff"
];

const verveOptions = [
  {
    title: "The Crimson Crown",
    description: "Verve Left — Bold crimson tones with dramatic lighting",
    image: verveLeftSetupImages[0],
    imageAlt: "The Crimson Crown setup at Verve Studio Raipur - professional podcast recording with red lighting",
    icon: <Mic size={24} />
  },
  {
    title: "The Horizon",
    description: "Verve Left — Warm horizon gradients with ambient backlighting",
    image: verveLeftSetupImages[1],
    imageAlt: "The Horizon setup at Verve Studio Raipur - professional podcast studio with warm gradient backgroun",
    icon: <Camera size={24} />
  },
  {
    title: "The Sage",
    description: "Verve Left — Deep sage palette with earthy, grounded styling",
    image: verveLeftSetupImages[2],
    imageAlt: "The Sage setup at Verve Studio Raipur - professional podcast recording environment with sage green tones",
    icon: <Armchair size={24} />
  },
  {
    title: "The Urban Flame",
    description: "Verve Right — Industrial vibe with flame-toned lighting",
    image: verveRightSetupImages[0],
    imageAlt: "The Urban Flame setup at Verve Studio Raipur - podcast studio with industrial design and orange lighting",
    icon: <Monitor size={24} />
  },
  {
    title: "The Ivory",
    description: "Verve Right — Clean ivory backdrop with minimal styling",
    image: verveRightSetupImages[1],
    imageAlt: "The Ivory setup at Verve Studio Raipur - clean and minimal podcast recording studio",
    icon: <Soundwave size={24} />
  },
];

export default function VerveStudioPage() {
  return (
    <div className="bg-black min-h-screen paper-texture-dark">
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[700px] flex items-center justify-center text-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/90 z-10" />
          <Image
            src={verveLeftSetupImages[0]}
            alt="Verve Studio - Raipur's premier podcast and content creation studio interior"
            fill
            priority
            className="object-cover opacity-50 mix-blend-screen"
          />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <AnimatedSection>
             <span className="text-white/60 font-semibold tracking-widest uppercase text-sm mb-4 block">Podcast Studio — Raipur</span>
             <h1 className="text-6xl md:text-9xl font-bold text-white mb-6 blur-[0.3px]">Verve Studio</h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
               Raipur&apos;s premier podcast &amp; content creation studio. 4K cameras, Shure SM7B microphones, Aputure lighting, and acoustic treatment &mdash; all included. Book from ₹4,000.
             </p>
             <Link href="/availability?space=vsl" className="inline-flex items-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/20 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.1)]">
               Book Verve Studio <MoveRight className="w-5 h-5" />
             </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Equipment Showcase */}
      <section className="py-24 border-b border-white/5">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Industry-Standard Gear</h2>
            <p className="text-gray-400">Everything you need to hit record. Unmatched production value built-in.</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedSection delay={0.1} direction="up" className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center hover:bg-white/5 transition-colors">
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center"><PaperIcon name="video" size={56} /></div>
              <h3 className="font-bold text-white mb-2">4K Cinema Cams</h3>
              <p className="text-sm text-gray-400">Crisp, cinematic visuals with stunning depth of field.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="up" className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center hover:bg-white/5 transition-colors">
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center"><PaperIcon name="microphone" size={56} /></div>
              <h3 className="font-bold text-white mb-2">Shure SM7B</h3>
              <p className="text-sm text-gray-400">The industry standard for warm, perfect broadcast sound.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.3} direction="up" className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center hover:bg-white/5 transition-colors">
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center"><PaperIcon name="speaker" size={56} /></div>
              <h3 className="font-bold text-white mb-2">Aputure Lighting</h3>
              <p className="text-sm text-gray-400">Beautiful, flattering lighting engineered per set.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.4} direction="up" className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl text-center hover:bg-white/5 transition-colors">
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center"><PaperIcon name="headphones" size={56} /></div>
              <h3 className="font-bold text-white mb-2">Zero Friction</h3>
              <p className="text-sm text-gray-400">Bring your SD card or hard drive and take raw stems immediately.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Description & Use Cases (Photo Grid) */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <AnimatedSection direction="right">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Engineered for excellence.</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Verve Studio is designed from the ground up for high-fidelity audio and video production. With acoustically isolated spaces and pre-lit modular corners, you can walk in and start recording broadcast-quality content immediately.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Ideal for podcast recording & talk shows, content creation & reels, brand videos & digital campaigns, interviews & creative shoots.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AMENITIES.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="left" className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 lg:h-64 rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-transform hover:scale-[1.02]">
                  <Image src={verveLeftSetupImages[0]} alt="Podcast session at Verve Studio Raipur - The Crimson Crown setup" fill className="object-cover" />
                </div>
                <div className="relative h-48 lg:h-40 rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-transform hover:scale-[1.02]">
                  <Image src={verveLeftSetupImages[1]} alt="Video podcast recording at Verve Studio Raipur - The Horizon setup" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 lg:pt-12">
                <div className="relative h-48 lg:h-40 rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-transform hover:scale-[1.02]">
                  <Image src={verveLeftSetupImages[2]} alt="Professional audio recording at Verve Studio Raipur - The Sage setup" fill className="object-cover" />
                </div>
                <div className="relative h-48 lg:h-64 rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-transform hover:scale-[1.02]">
                  <Image src={verveRightSetupImages[0]} alt="Creator studio session at Verve Studio Raipur - The Urban Flame setup" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-6 hidden lg:block">
                <div className="relative h-56 rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-transform hover:scale-[1.02]">
                  <Image src={verveRightSetupImages[1]} alt="Modern interview recording at Verve Studio Raipur - The Ivory setup" fill className="object-cover" />
                </div>
                <div className="relative h-48 rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-transform hover:scale-[1.02]">
                  <Image src={verveRightSetupImages[2]} alt="Content creation setup at Verve Studio Raipur - The Wave setup" fill className="object-cover" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Studio Setups Showcase */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6 max-w-6xl">
           <AnimatedSection className="mb-16 text-center">
             <h2 className="text-4xl font-bold text-white">Six Unique Studio Setups</h2>
             <p className="text-gray-400 mt-4">Each setup is designed with a distinct mood to match your brand perfectly.</p>
           </AnimatedSection>

           {/* LEFT SETUPS */}
           <AnimatedSection className="mb-8">
             <h3 className="text-2xl font-bold text-white mb-2">Verve Studio — Left</h3>
             <p className="text-gray-500 mb-6">Dark, moody, neon-accented environments for intense conversations.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {[
                { name: "The Crimson Crown", img: verveLeftSetupImages[0], desc: "Bold crimson tones with dramatic overhead lighting", alt: "The Crimson Crown podcast setup at Verve Studio Raipur" },
                { name: "The Horizon", img: verveLeftSetupImages[1], desc: "Warm horizon gradients with ambient backlighting", alt: "The Horizon podcast setup at Verve Studio Raipur" },
                { name: "The Sage", img: verveLeftSetupImages[2], desc: "Deep sage green palette with earthy, grounded styling", alt: "The Sage podcast setup at Verve Studio Raipur" },
              ].map((setup, i) => (
                <AnimatedSection key={setup.name} delay={i * 0.1} direction="up" className="group">
                  <div className="relative h-[280px] rounded-2xl border border-white/10 overflow-hidden mb-4">
                    <Image
                      src={setup.img}
                      alt={setup.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 px-5 py-4">
                      <h4 className="text-lg font-bold text-white">{setup.name}</h4>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{setup.desc}</p>
                </AnimatedSection>
              ))}
            </div>
           </AnimatedSection>

           {/* RIGHT SETUPS */}
           <AnimatedSection className="mb-8">
             <h3 className="text-2xl font-bold text-white mb-2">Verve Studio — Right</h3>
             <p className="text-gray-500 mb-6">Warm, wood-toned, softer aesthetics for intimate storytelling.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "The Urban Flame", img: verveRightSetupImages[0], desc: "Urban-industrial vibe with strategic flame-toned lighting", alt: "The Urban Flame podcast setup at Verve Studio Raipur" },
                { name: "The Ivory", img: verveRightSetupImages[1], desc: "Clean ivory backdrop with elegant, minimal styling", alt: "The Ivory podcast setup at Verve Studio Raipur" },
                { name: "The Wave", img: verveRightSetupImages[2], desc: "Flowing wave-inspired contours with soft blue accents", alt: "The Wave podcast setup at Verve Studio Raipur" },
              ].map((setup, i) => (
                <AnimatedSection key={setup.name} delay={i * 0.1} direction="up" className="group">
                  <div className="relative h-[280px] rounded-2xl border border-white/10 overflow-hidden mb-4">
                    <Image
                      src={setup.img}
                      alt={setup.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 px-5 py-4">
                      <h4 className="text-lg font-bold text-white">{setup.name}</h4>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{setup.desc}</p>
                </AnimatedSection>
              ))}
            </div>
           </AnimatedSection>
        </div>
      </section>

      {/* INTERACTIVE SELECTOR */}
      <InteractiveSelector 
        title="Verve Studio Equipment" 
        description="Everything you need to shoot a hit podcast is included in your booking." 
        options={verveOptions} 
      />

      {/* Final CTA + Cross-Space Link */}
      <section className="py-24 border-t border-white/10 bg-gradient-to-t from-[#0a0a0a] to-black">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Raipur&apos;s Best Podcast Studio</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">Check live availability for Verve Studio and secure your session instantly online.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/availability?space=vsl"
                className="inline-block bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all"
              >
                Book Verve Studio Now
              </Link>
              <Link
                href="/the-arcade"
                className="inline-block border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
              >
                Also Explore The Arcade →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
