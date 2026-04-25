export const arcadeImages = [
  "/the-arcade/dsc02541.webp",
  "/the-arcade/dsc02546.webp",
  "/the-arcade/dsc02547.webp",
  "/the-arcade/dsc02552.webp",
  "/the-arcade/dsc02553.webp",
  "/the-arcade/dsc02557.webp",
] as const;

export const verveImages = [
  "/verve-studio/DSC02505 (1).webp",
  "/verve-studio/dsc02518.webp",
  "/verve-studio/DSC02464.webp",
  "/verve-studio/DSC02469 (1).webp",
  "/verve-studio/dsc02531.webp",
  "/verve-studio/dsc02534.webp",
  "/verve-studio/left/the-horizon.webp",
  "/verve-studio/left/the-sage.jpg",
  "/verve-studio/right/the-urban-flame.webp",
] as const;

export const venueImages = [
  arcadeImages[0],
  verveImages[0],
  arcadeImages[1],
  verveImages[1],
  arcadeImages[2],
  verveImages[2],
  arcadeImages[3],
  verveImages[3],
  arcadeImages[4],
  verveImages[4],
  arcadeImages[5],
  verveImages[5],
] as const;

export function pickVenueImage(index: number) {
  return venueImages[index % venueImages.length];
}

/** Per-studio-setup preview images keyed by studio ID from SPECIFIC_STUDIOS */
export const studioSetupImages: Record<string, string> = {
  // Verve Studio Left setups
  "the-crimson-crown": "/verve-studio/left/the-crimson-crown.jpg",
  "the-horizon": "/verve-studio/left/the-horizon.webp",
  "the-sage": "/verve-studio/left/the-sage.jpg",
  // Verve Studio Right setups
  "the-urban-flame": "/verve-studio/right/the-urban-flame.webp",
  "the-ivory": "/verve-studio/right/the-ivory.webp",
  "the-wave": "/verve-studio/right/the-wave.jpg",
};

export const verveLeftSetupImages = [
  "/verve-studio/left/the-crimson-crown.jpg",
  "/verve-studio/left/the-horizon.webp",
  "/verve-studio/left/the-sage.jpg",
] as const;

export const verveRightSetupImages = [
  "/verve-studio/right/the-urban-flame.webp",
  "/verve-studio/right/the-ivory.webp",
  "/verve-studio/right/the-wave.jpg",
] as const;
