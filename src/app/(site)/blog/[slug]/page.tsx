import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Container from "@/components/ui/Container";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";

/**
 * Strona wpisu /blog/[slug] – treść z src/data/posts.ts (przez api.ts),
 * prerenderowana przy buildzie dla każdego wpisu.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      images: [{ url: absoluteUrl(post.image), alt: post.imageAlt }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white pb-16 pt-8 md:pt-12">
      <Container>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-500 hover:text-gold-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Wszystkie wpisy
        </Link>

        <article className="mx-auto mt-6 max-w-3xl">
          <header>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-navy-800 md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-navy-900/80">{post.excerpt}</p>
          </header>

          <figure className="mt-8 overflow-hidden rounded-lg shadow-lg shadow-navy-900/15">
            <Image
              src={post.image}
              alt={post.imageAlt}
              width={800}
              height={500}
              priority
              className="aspect-[16/10] w-full object-cover"
            />
          </figure>

          <div className="mt-8 space-y-5">
            {post.content.map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-navy-900/80">
                {paragraph}
              </p>
            ))}
          </div>

          <footer className="mt-10 border-t border-navy-900/10 pt-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-500 hover:text-gold-600"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Wróć do listy wpisów
            </Link>
          </footer>
        </article>
      </Container>
    </div>
  );
}
