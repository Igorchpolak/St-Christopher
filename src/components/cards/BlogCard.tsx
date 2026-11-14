import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
}

/** Karta wpisu blogowego – cały link do /blog/{slug}. */
export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article>
      {/* TODO: strona wpisu /blog/[slug] powstanie w kolejnym kroku. */}
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg shadow-navy-900/15 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/20"
      >
        <Image
          src={post.image}
          alt={post.imageAlt}
          width={640}
          height={400}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, calc(100vw - 2rem)"
          className="aspect-[16/10] w-full object-cover"
        />
        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          <h3 className="line-clamp-2 font-heading text-lg font-semibold leading-snug text-navy-800">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted">{post.excerpt}</p>
          <p className="mt-auto inline-flex items-center gap-1.5 text-xs text-muted">
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
        </div>
      </Link>
    </article>
  );
}
