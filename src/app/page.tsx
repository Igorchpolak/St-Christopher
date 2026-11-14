import ContactSection from "@/components/sections/ContactSection";
import ContinentExplorer from "@/components/sections/ContinentExplorer";
import BlogSection from "@/components/sections/BlogSection";
import Hero from "@/components/sections/Hero";
import UpcomingTrips from "@/components/sections/UpcomingTrips";
import { getAllTrips, getContinents, getSiteConfig } from "@/lib/api";
import { buildTravelAgencyJsonLd } from "@/lib/seo";

/**
 * Strona główna (Server Component) – krok 9: złożenie sekcji.
 * Dane pobierane równolegle przez warstwę api.ts; sekcje Hero, UpcomingTrips,
 * BlogSection i ContactSection pobierają własne dane wewnętrznie, a
 * ContinentExplorer dostaje kontynenty i wyjazdy przez propsy.
 */
export default async function HomePage() {
  const [site, continents, trips] = await Promise.all([
    getSiteConfig(),
    getContinents(),
    getAllTrips(),
  ]);

  return (
    <>
      {/* Dane strukturalne (SEO) – zbudowane z konfiguracji strony, bez duplikatów. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildTravelAgencyJsonLd(site)) }}
      />

      <Hero />
      <UpcomingTrips />
      <ContinentExplorer continents={continents} trips={trips} />
      <BlogSection />
      <ContactSection />
    </>
  );
}
