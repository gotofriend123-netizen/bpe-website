import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/content/blogs";

export const metadata = {
  title: "Journal & Blogs | Black Pepper Entertainment",
  description: "Read the latest news, guides, and creator stories from Black Pepper Entertainment.",
};

export default function BlogsPage() {
  const featuredPost = BLOG_POSTS.find((post) => post.featured);
  const otherPosts = BLOG_POSTS.filter((post) => !post.featured);

  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimatedSection className="mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">The Journal</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Insights, event breakdowns, and creator tips straightforward from our team of engineers and event staff.
          </p>
        </AnimatedSection>

        {/* Featured Blog */}
        {featuredPost ? (
          <AnimatedSection delay={0.1} className="mb-24 group cursor-pointer block">
            <Link href={`/blogs/${featuredPost.slug}`} className="relative h-[500px] w-full rounded-3xl overflow-hidden block">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('${featuredPost.img}?q=80&w=2070&auto=format&fit=crop')` }} />
            <div className="absolute bottom-0 inset-x-0 p-8 md:p-12 z-20">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase text-white mb-4">Featured</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl leading-tight">
                {featuredPost.title}
              </h2>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="font-semibold text-white">{featuredPost.author}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
              </div>
            </div>
            </Link>
          </AnimatedSection>
        ) : null}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {otherPosts.map((blog, i) => (
            <AnimatedSection key={blog.slug} delay={0.1 * i} direction="up" className="group">
              <Link href={`/blogs/${blog.slug}`} className="block">
                <div className="relative h-72 rounded-2xl overflow-hidden mb-6 filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-500">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <div className={`absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700`} style={{ backgroundImage: `url('${blog.img}?q=80&w=1000&auto=format&fit=crop')` }} />
                </div>
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="text-white font-semibold uppercase tracking-widest">{blog.category}</span>
                  <span className="text-gray-500">{blog.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-gray-300 transition-colors line-clamp-2 mb-4">
                  {blog.title}
                </h3>
                <span className="inline-flex items-center gap-2 text-gray-400 font-semibold group-hover:text-white transition-colors">
                  Read Article <MoveRight className="w-4 h-4" />
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </div>
  );
}
