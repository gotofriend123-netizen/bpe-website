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
  "/verve-studio/DSC02475.webp",
  "/verve-studio/DSC02464.webp",
  "/verve-studio/DSC02469 (1).webp",
  "/verve-studio/DSC02496.webp",
  "/verve-studio/dsc02531.webp",
  "/verve-studio/DSC02464.webp",
  "/verve-studio/DSC02469 (1).webp",
  "/verve-studio/DSC02505 (1).webp",
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
