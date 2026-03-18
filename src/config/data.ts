export const BOOKING_TYPES = [
  { id: "verve-studio-left", label: "Verve Studio Left" },
  { id: "verve-studio-right", label: "Verve Studio Right" },
  { id: "the-arcade", label: "The Arcade" },
] as const;

export type BookingTypeId = (typeof BOOKING_TYPES)[number]["id"];

export const SPECIFIC_STUDIOS = [
  {
    id: "the-urban-flame",
    name: "The Urban Flame",
    packages: [
      {
        id: "tuf-1",
        name: "Studio Only",
        pricePreview: "₹4,000 / 2 hrs | ₹10,000 full day",
      },
      {
        id: "tuf-2",
        name: "Studio + 1 Mic + 1 Light",
        pricePreview: "₹5,000 / 2 hrs | ₹12,500 full day",
      },
    ],
  },
  {
    id: "the-crimson-crown",
    name: "The Crimson Crown",
    packages: [
      {
        id: "tcc-1",
        name: "Studio + 1 Camera + 1 Mic + 1 Light",
        pricePreview: "₹6,500 / 2 hrs | ₹16,500 full day",
      },
      {
        id: "tcc-2",
        name: "With 1 Camera Person Raw Clips Only",
        pricePreview: "₹7,500 / 2 hrs | ₹18,750 full day",
      },
      {
        id: "tcc-3",
        name: "With 1 Full Podcast Edit + 3 Reels Edit",
        pricePreview: "₹12,000 / 2 hrs | ₹30,000 full day",
      },
    ],
  },
  {
    id: "the-wave",
    name: "The Wave",
    packages: [
      {
        id: "tw-1",
        name: "Studio + 1 Camera + 1 Mic + 1 Light",
        pricePreview: "₹6,500 / 2 hrs | ₹16,500 full day",
      },
      {
        id: "tw-2",
        name: "With 1 Camera Person Raw Clips Only",
        pricePreview: "₹7,500 / 2 hrs | ₹18,750 full day",
      },
      {
        id: "tw-3",
        name: "With 1 Full Podcast Edit + 3 Reels Edit",
        pricePreview: "₹12,000 / 2 hrs | ₹30,000 full day",
      },
    ],
  },
  {
    id: "the-ivory",
    name: "The Ivory",
    packages: [
      {
        id: "ti-1",
        name: "Studio + 2 Camera + 2 Mic + 2 Light",
        pricePreview: "₹8,500 / 2 hrs | ₹21,250 full day",
      },
      {
        id: "ti-2",
        name: "With 2 Camera Person Raw Clips Only",
        pricePreview: "₹10,000 / 2 hrs | ₹25,000 full day",
      },
      {
        id: "ti-3",
        name: "With 1 Full Podcast Edit + 3 Reels Edit",
        pricePreview: "₹15,000 / 2 hrs | ₹37,500 full day",
      },
    ],
  },
  {
    id: "the-sage",
    name: "The Sage",
    packages: [
      {
        id: "ts-1",
        name: "Studio + 2 Camera + 2 Mic + 2 Light",
        pricePreview: "₹8,500 / 2 hrs | ₹21,250 full day",
      },
      {
        id: "ts-2",
        name: "With 2 Camera Person Raw Clips Only",
        pricePreview: "₹10,000 / 2 hrs | ₹25,000 full day",
      },
      {
        id: "ts-3",
        name: "With 1 Full Podcast Edit + 3 Reels Edit",
        pricePreview: "₹15,000 / 2 hrs | ₹37,500 full day",
      },
    ],
  },
  {
    id: "the-horizon",
    name: "The Horizon",
    packages: [
      {
        id: "th-1",
        name: "Studio + 2 Camera + 2 Mic + 2 Light",
        pricePreview: "₹8,500 / 2 hrs | ₹21,250 full day",
      },
      {
        id: "th-2",
        name: "With 2 Camera Person Raw Clips Only",
        pricePreview: "₹10,000 / 2 hrs | ₹25,000 full day",
      },
      {
        id: "th-3",
        name: "With 1 Full Podcast Edit + 3 Reels Edit",
        pricePreview: "₹15,000 / 2 hrs | ₹37,500 full day",
      },
    ],
  },
];

export const CONFIG = {
  adminEmail: "adityasingh808589@gmail.com",
  adminName: "Aditya Singh",
  senderName: "Verve Studio Team",
  termsAndConditionsLink: "/terms", // adjust to the actual Terms URL
};
