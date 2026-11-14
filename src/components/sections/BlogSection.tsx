import BlogCard from "@/components/cards/BlogCard";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBlogPosts } from "@/lib/api";

/** Sekcja "Blog" – karuzela najnowszych wpisów. */
export default async function BlogSection() {
  const posts = await getBlogPosts(5);

  return (
    <section id="blog" aria-labelledby="blog-title" className="scroll-mt-36 bg-white py-12 md:py-16">
      <Container>
        <SectionHeading
          id="blog-title"
          title="Blog"
          linkHref="/#blog"
          linkLabel="Zobacz wszystkie"
        />
        <div className="mt-8 md:mt-10">
          {posts.length > 0 ? (
            <Carousel ariaLabel="Wpisy na blogu" itemsPerView={{ base: 1, sm: 2, lg: 3 }}>
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </Carousel>
          ) : (
            <p className="text-center text-sm text-muted">
              Wkrótce pojawią się tu nowe artykuły.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
