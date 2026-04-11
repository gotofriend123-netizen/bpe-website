import { ArcGalleryHero } from "@/components/ui/arc-gallery-hero-component";

const galleryImages = [
  {
    src: "/the-arcade/dsc02541.jpg",
    width: 7008,
    height: 4672,
    alt: "The Arcade lounge seating",
  },
  {
    src: "/the-arcade/dsc02546.jpg",
    width: 7008,
    height: 4672,
    alt: "The Arcade hall interior",
  },
  {
    src: "/the-arcade/dsc02547.jpg",
    width: 7008,
    height: 4672,
    alt: "The Arcade entry corridor",
  },
  {
    src: "/the-arcade/dsc02552.jpg",
    width: 4096,
    height: 3072,
    alt: "The Arcade event setup",
  },
  {
    src: "/the-arcade/dsc02553.jpg",
    width: 4096,
    height: 3072,
    alt: "The Arcade guest-facing view",
  },
  {
    src: "/the-arcade/dsc02557.jpg",
    width: 4096,
    height: 3072,
    alt: "The Arcade premium ambience",
  },
  {
    src: "/verve-studio/DSC02505 (1).JPG",
    width: 7008,
    height: 3072,
    alt: "Verve Studio wide room view",
  },
  {
    src: "/verve-studio/dsc02518.jpg",
    width: 4096,
    height: 3072,
    alt: "Verve Studio recording setup",
  },
  {
    src: "/verve-studio/DSC02464.JPG",
    width: 4096,
    height: 3072,
    alt: "Verve Studio premium interview corner",
  },
  {
    src: "/verve-studio/DSC02469 (1).JPG",
    width: 4096,
    height: 3072,
    alt: "Verve Studio accent backdrop",
  },
  {
    src: "/verve-studio/DSC02496.JPG",
    width: 7008,
    height: 3072,
    alt: "Verve Studio styled seating composition",
  },
];

export function ArcGalleryHeroDemo() {
  return (
    <ArcGalleryHero
      images={galleryImages}
      title="See the spaces in motion before you book."
      description="A cinematic first look at The Arcade and Verve Studio, using the real spaces to set the tone before a booking begins."
      primaryCtaLabel="View Gallery"
      primaryCtaHref="/gallery"
      className="mt-3 min-h-[30rem] w-full bg-black pb-4 text-white sm:mt-5 sm:min-h-[36rem] md:mt-6 md:pb-0"
      startAngle={16}
      endAngle={164}
      radiusLg={500}
      radiusMd={360}
      radiusSm={244}
      cardSizeLg={112}
      cardSizeMd={90}
      cardSizeSm={72}
    />
  );
}
