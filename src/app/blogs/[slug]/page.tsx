import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/content/blogs";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Article Not Found | Black Pepper Entertainment",
    };
  }

  return {
    title: `${post.title} | Black Pepper Entertainment`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black pb-24 pt-32">
      <div className="container mx-auto max-w-4xl px-6">
        <Link
          href="/blogs"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Link>

        <AnimatedSection className="mb-12">
          <span className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-300">
            {post.category}
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="mb-12">
          <div
            className="h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-cover bg-center"
            style={{
              backgroundImage: `url('${post.img}?q=80&w=1600&auto=format&fit=crop')`,
            }}
          />
        </AnimatedSection>

        <AnimatedSection
          delay={0.2}
          className="prose prose-invert max-w-none prose-lg"
        >
          <p className="text-xl leading-8 text-zinc-300">{post.excerpt}</p>
          {post.content.map((paragraph) => (
            <p key={paragraph} className="leading-8 text-zinc-400">
              {paragraph}
            </p>
          ))}
        </AnimatedSection>
      </div>
    </div>
  );
}
