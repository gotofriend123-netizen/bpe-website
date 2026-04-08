export const arcadeImages = [
  "/the-arcade/dsc02541.jpg",
  "/the-arcade/dsc02546.jpg",
  "/the-arcade/dsc02547.jpg",
  "/the-arcade/dsc02552.jpg",
  "/the-arcade/dsc02553.jpg",
  "/the-arcade/dsc02557.jpg",
] as const;

export const verveImages = [
  "/verve-studio/dsc02511.jpg",
  "/verve-studio/dsc02518.jpg",
  "/verve-studio/dsc02520.jpg",
  "/verve-studio/dsc02529.jpg",
  "/verve-studio/dsc02531.jpg",
  "/verve-studio/dsc02534.jpg",
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
