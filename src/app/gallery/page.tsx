import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { venueImages } from "@/lib/content/site-images";

export const metadata = {
  title: "Gallery | Black Pepper Entertainment",
  description: "Explore the incredible moments, events, and podcasts created at Black Pepper Entertainment.",
};

const ITEMS = [
  { url: venueImages[0], category: "Events" },
  { url: venueImages[1], category: "Podcast" },
  { url: venueImages[2], category: "Community" },
  { url: venueImages[3], category: "Workshop" },
  { url: venueImages[4], category: "Events" },
  { url: venueImages[5], category: "Podcast" },
  { url: venueImages[6], category: "Brands" },
  { url: venueImages[7], category: "Interviews" },
  { url: venueImages[8], category: "Interviews" },
];

export default function GalleryPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Gallery</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A visual showcase of the incredible work and memorable events created at Black Pepper Entertainment.
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={0.2}>
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {ITEMS.map((item, i) => (
              <div key={i} className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                  <span className="text-white font-semibold backdrop-blur-md px-4 py-2 rounded-full bg-white/10 uppercase tracking-widest text-xs border border-white/20">
                    {item.category}
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.url}
                  alt={`Showcase ${item.category}`}
                  className="w-full h-auto rounded-2xl group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
