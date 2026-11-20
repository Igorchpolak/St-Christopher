import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogCard from "@/components/cards/BlogCard";
import Container from "@/components/ui/Container";
import { getAllBlogPosts } from "@/lib/api";

/**
 * Podstrona /blog – wszystkie wpisy blogowe (dane z src/data/posts.ts
 * przez warstwę api.ts, "use cache"; strona prerenderowana przy buildzie).
 */
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Pielgrzymki, sanktuaria, przygotowania do drogi i świadectwa – artykuły St. Christopher Pilgrimages and Travel.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog",
    description:
      "Pielgrzymki, sanktuaria, przygotowania do drogi i świadectwa – artykuły St. Christopher Pilgrimages and Travel.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="bg-white pb-16 pt-8 md:pt-12">
      <Container>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-500 hover:text-gold-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Strona główna
        </Link>

        <header className="mt-6 max-w-3xl">
          <h1 className="font-heading text-3xl font-semibold leading-tight text-navy-800 md:text-4xl">
            Blog
          </h1>
          <p className="mt-4 leading-relaxed text-navy-900/80">
            Sanktuaria, przygotowania do drogi, świadectwa pielgrzymów i praktyczne
            wskazówki. Zapraszamy do lektury.
          </p>
        </header>

        <div className="mt-10">
          {posts.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-12 text-center text-sm text-muted">
              Wkrótce pojawią się tu nowe artykuły.
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
