import { arcadeImages, verveImages } from "@/lib/content/site-images";

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  img: string;
  excerpt: string;
  author: string;
  featured?: boolean;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "featured",
    title: "Architecting the Ultimate Premium Space for Digital Communities",
    category: "Featured",
    date: "Feb 10, 2024",
    img: arcadeImages[3],
    excerpt:
      "How Black Pepper blends hospitality, acoustics, and event design into a single premium operating standard.",
    author: "Editorial Team",
    featured: true,
    content: [
      "The strongest spaces do more than look premium. They lower friction for everyone who walks in, from community organizers to podcast hosts to event crew.",
      "At Black Pepper, that means the visual language, lighting controls, booking operations, and support systems all need to feel like one experience instead of separate departments stitched together.",
      "The result is a venue system where creators can move quickly, guests feel taken care of, and the brand remains consistent from discovery to checkout.",
    ],
  },
  {
    slug: "podcast-studio-for-rent-in-raipur",
    title: "Best Podcast Studio for Rent in Raipur — Verve Studio Guide 2025",
    category: "Studio Booking",
    date: "Apr 15, 2025",
    img: verveImages[2],
    excerpt:
      "Looking for a professional podcast studio for rent in Raipur? Verve Studio offers 4K cameras, Shure SM7B microphones, acoustic isolation, and instant online booking from ₹4,000.",
    author: "Studio Team",
    content: [
      "If you're searching for a podcast studio for rent in Raipur, Verve Studio at Black Pepper Entertainment is the only professional-grade option built specifically for creators, podcasters, and content teams.",
      "Verve Studio comes in two independent rooms — Verve Studio Left (VSL) and Verve Studio Right (VSR) — each fitted with Shure SM7B microphones, 4K Sony cameras, Aputure LED lighting, acoustic foam panels, and a professional audio interface. You leave every session with raw 4K footage and multi-track audio on your own storage device.",
      "Booking is transparent: the Urban Flame package starts at ₹4,000 for 2 hours of studio-only access. For a full production setup with cameras, the Standard Setup is ₹6,500. The Premium Setup at ₹8,500 gives you dual-camera angles, two SM7B microphones, and custom aesthetic lighting — perfect for interviews, talk-shows, and brand content.",
      "What makes Verve Studio the best podcast studio for rent in Raipur is not just the equipment — it is the support. A tech crew is on-site for every session. You do not need to know how to set up audio interfaces or color balance your lighting. Just show up and record.",
      "Whether you are launching your first podcast or recording your 100th episode, Verve Studio is designed to make you look and sound like a professional from session one. Book your slot online at blackpepperentertainment.in.",
    ],
  },
  {
    slug: "event-hall-booking-raipur",
    title: "Top Event Halls for Booking in Raipur — Complete 2025 Guide",
    category: "Event Planning",
    date: "Apr 10, 2025",
    img: arcadeImages[0],
    excerpt:
      "Planning an event in Raipur? Discover The Arcade — a premium event hall at Black Pepper Entertainment with AV equipment, DMX lighting, and flexible layouts from ₹15,000.",
    author: "Events Team",
    content: [
      "Finding the right event hall in Raipur for a workshop, product launch, or community gathering can be surprisingly difficult. Most venues are either too basic or too expensive for small-to-medium-scale events. The Arcade at Black Pepper Entertainment was built to solve exactly that problem.",
      "The Arcade is a 2,000+ sq ft community hall in Raipur with premium DMX lighting, a high-power P.A. system, lounge access, and an on-site technical crew. It is built for full-day brand launches, workshops, panel discussions, networking events, comedy nights, and social gatherings of every kind.",
      "Pricing for The Arcade event hall starts at ₹15,000 for a 4-hour half-day block. The full-day package at ₹25,000 includes 8 hours, a custom DMX lighting setup, pro audio mixing, and a one-hour pre-event setup slot. All packages include WiFi, parking, and technical support — no hidden charges.",
      "The layout is flexible. The Arcade can accommodate theatre-style seating for 150+ guests, or be reconfigured into a networking lounge, exhibition space, or intimate performance venue depending on your event format.",
      "If you are looking for event hall booking in Raipur for any format — from a 30-person workshop to a 200-person launch night — The Arcade should be your first stop. Book online at blackpepperentertainment.in or contact us for a custom quote.",
    ],
  },
  {
    slug: "community-hall-shankar-nagar-raipur",
    title: "Community Hall in Shankar Nagar Raipur — The Arcade by Black Pepper",
    category: "Community",
    date: "Apr 5, 2025",
    img: arcadeImages[4],
    excerpt:
      "Looking for a community hall in Shankar Nagar, Raipur? The Arcade by Black Pepper Entertainment is a premium, fully-equipped community space for workshops, meetups, and cultural events.",
    author: "Venue Operations",
    content: [
      "If you are looking for a community hall in Shankar Nagar, Raipur, The Arcade at Black Pepper Entertainment is the premium choice for community groups, NGOs, corporates, and creators.",
      "Unlike traditional community halls in Raipur that offer little more than four walls and some chairs, The Arcade is a production-ready venue with professional AV, ambient and DMX lighting, a lounge area, and a tech crew that stays on site throughout your event.",
      "Community groups and nonprofits frequently use The Arcade for interactive workshops, skill-building sessions, open mics, cultural evenings, and networking events. The space feels welcoming and premium without being intimidating — the right balance for a community hall in Shankar Nagar, Raipur.",
      "The booking process is simple. Slots are available Monday through Sunday from 9 AM to 9 PM. You can check live availability, pick your slot, and confirm your booking entirely online. The Half Day Event package (4 hours) starts at ₹15,000 and includes the full hall, audio, and lighting.",
      "For community groups with recurring bookings or non-commercial events, contact us at blackpepperentertainment.in to discuss custom arrangements.",
    ],
  },
  {
    slug: "photoshoot-studio-raipur",
    title: "Photoshoot Studio in Raipur — Book a Professional Setup at Black Pepper",
    category: "Creator Tips",
    date: "Mar 25, 2025",
    img: verveImages[4],
    excerpt:
      "Need a photoshoot studio in Raipur? Verve Studio's aesthetically-designed interiors, professional lighting rigs, and camera-ready setups make it the best creator studio in the city for visual content.",
    author: "Studio Team",
    content: [
      "Raipur has very few professionally equipped photoshoot studios. Most productions rely on outdoor locations or makeshift home setups. Verve Studio at Black Pepper Entertainment was purpose-built to solve this gap for creators and brands.",
      "With three distinct aesthetic room setups — Ivory, Sage, and Horizon — Verve Studio offers camera-ready environments that do not need additional set decoration. Each room is designed with visual storytelling in mind: thoughtful color palettes, layered lighting, and clean sightlines that make every shot look intentional.",
      "Professional lighting is included in every session. The Aputure LED system supports soft beauty lighting, hard directional light, and dramatic contrast looks — whatever the brief requires. Reflectors, diffusers, and light stands are available on request.",
      "For brand shoots, product photography, or creator content sessions, the Premium Setup at ₹8,500 for 2 hours includes 2x Sony 4K cameras, custom aesthetic lighting, and raw footage handover to your storage device.",
      "If you are looking for a photoshoot studio for rent in Raipur that feels premium without requiring you to bring your own gear, Verve Studio is the answer. Book at blackpepperentertainment.in.",
    ],
  },
  {
    slug: "party-hall-raipur",
    title: "Best Party Halls in Raipur for Private Events — 2025 Guide",
    category: "Event Planning",
    date: "Mar 15, 2025",
    img: arcadeImages[1],
    excerpt:
      "Planning a private party in Raipur? The Arcade at Black Pepper Entertainment is the city's most premium party hall with professional lighting, sound, and a fully customizable layout.",
    author: "Events Team",
    content: [
      "When most people think of party halls in Raipur, they picture outdated banquet spaces with generic decor. The Arcade at Black Pepper Entertainment is nothing like that.",
      "The Arcade is a modern, aesthetically premium party hall in Raipur — designed for birthday parties, anniversary dinners, corporate celebrations, farewell parties, reunion evenings, and any private event that deserves a special setting.",
      "The space features a custom DMX lighting system that can be programmed to create any atmosphere — from sophisticated ambient white to full RGB party mode. The professional PA system handles music at any volume, and the lounge section creates a break-out zone for guests who want a quieter conversation.",
      "Packages for private parties start at ₹15,000 for a half-day (4 hours) and ₹25,000 for a full-day slot (8 hours) including a one-hour setup period. All bookings include on-site technical support, WiFi, and available parking.",
      "The Arcade can accommodate up to 200 guests in standing reception format, or 100 to 120 guests in a seated dinner layout. Custom decor and catering arrangements can be coordinated separately — contact us for recommended partners.",
      "Book your private party hall in Raipur online at blackpepperentertainment.in. Check live availability and secure your preferred date instantly.",
    ],
  },
  {
    slug: "brand-launch-raipur",
    title: "How to Host a Flawless Brand Launch Event in Raipur — A Complete Guide",
    category: "Case Study",
    date: "Mar 1, 2025",
    img: arcadeImages[2],
    excerpt:
      "Planning a brand launch in Raipur? This complete guide covers venue selection, AV requirements, guest flow, and how The Arcade at Black Pepper Entertainment handles brand activation events.",
    author: "Events Team",
    content: [
      "Brand launches are among the most high-stakes events to plan. Every detail — the lighting, the flow, the sound, the timing — shapes how your audience perceives your brand in its first public moment. In Raipur, The Arcade at Black Pepper Entertainment has become the go-to venue for exactly these moments.",
      "The first decision every brand launch planner needs to make is venue. You need a space that feels premium without being sterile, that can handle a crowd without feeling chaotic, and that has the technical infrastructure to support your AV and production requirements. The Arcade has over 2,000 sq ft of flexible floor space, a professional-grade PA system, custom DMX lighting, a built-in tech crew, and a layout that can be configured for presentations, performances, networking, and brand activations all in the same event.",
      "Guest flow is the second most important element of a launch. The Arcade's layout creates natural traffic paths: a registration zone at the entrance, a stage focus zone in the centre, a networking lounge at the perimeter, and a service corridor that keeps catering off the main floor.",
      "Technical requirements for brand launches often include stage lighting, microphone setups, presenter screens, and background music management. The Arcade's Full Day Event package handles all of this — DMX lighting with pre-programmed scenes, professional PA, mixing deck, and an on-site tech operator for the full duration of the event.",
      "The Full Day Event package at ₹25,000 gives you 8 hours of full venue access plus a 1-hour setup slot, meaning your team can arrive early, configure the space, do a full AV check, and be ready before the first guest walks in. For brand launches with specific seating designs or custom builds, contact us at blackpepperentertainment.in for a tailored quote.",
    ],
  },
  {
    slug: "1",
    title: "The Ultimate Guide to Lighting Your Podcast",
    category: "Creator Tips",
    date: "Oct 12, 2023",
    img: verveImages[2],
    excerpt:
      "A practical breakdown of key light, fill, and background contrast for polished podcast visuals.",
    author: "Studio Team",
    content: [
      "Good podcast lighting starts with separation. A strong key light gives shape, but the background needs its own identity so the host does not disappear into the frame.",
      "The fastest improvement is often controlling spill and contrast before adding more fixtures. Better shaping beats more brightness.",
      "Once the technical baseline is stable, small accents in the set can carry most of the brand personality.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
