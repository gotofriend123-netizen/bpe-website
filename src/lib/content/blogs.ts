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
  {
    slug: "2",
    title: "How The Arcade Handled a 100-Person Tech Startup Launch",
    category: "Case Study",
    date: "Nov 05, 2023",
    img: arcadeImages[4],
    excerpt:
      "A behind-the-scenes look at layout planning, lighting cues, and guest flow inside a high-energy launch event.",
    author: "Events Team",
    content: [
      "Large launches only feel smooth when guest flow is designed early. Registration, stage visibility, networking pockets, and service routes all compete for the same floor area.",
      "The Arcade works best when the room is zoned with intent instead of treated like one large open hall.",
      "That approach let the team keep the launch dynamic without letting the space feel crowded or chaotic.",
    ],
  },
  {
    slug: "3",
    title: "Why Audio Quality is More Important Than 4K Video",
    category: "Audio Engineering",
    date: "Dec 18, 2023",
    img: verveImages[0],
    excerpt:
      "Viewers forgive imperfect framing much faster than they forgive harsh, thin, or noisy audio.",
    author: "Audio Team",
    content: [
      "Audiences will stay with a slightly imperfect frame if the conversation is clear and easy to listen to. They rarely stay with distracting audio for long.",
      "That is why room treatment, microphone placement, and gain staging usually matter more than adding another camera angle.",
      "When the sonic foundation is strong, every other production decision becomes easier to appreciate.",
    ],
  },
  {
    slug: "4",
    title: "Designing the Perfect Event Layout for the Community Hall",
    category: "Event Planning",
    date: "Jan 22, 2024",
    img: arcadeImages[1],
    excerpt:
      "How to balance stage focus, circulation, and lounge energy in a flexible multi-use venue.",
    author: "Venue Operations",
    content: [
      "The best layouts guide attention without forcing it. Guests should know where to gather, where to wait, and where to relax almost instantly.",
      "Furniture, lighting, and spacing do as much work as signage when the event starts getting busy.",
      "A premium venue feels generous because every zone has enough breathing room to do its job.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
