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
  "/verve-studio/DSC02475.JPG",
  "/verve-studio/dsc02531.jpg",
  "/verve-studio/dsc02534.jpg",
  "/verve-studio/DSC02464.JPG",
  "/verve-studio/DSC02469 (1).JPG",
  "/verve-studio/DSC02496.JPG",
  "/verve-studio/DSC02501 (1).JPG",
  "/verve-studio/DSC02505 (1).JPG",
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
