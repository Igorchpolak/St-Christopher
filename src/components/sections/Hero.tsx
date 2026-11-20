import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { getSiteConfig } from "@/lib/api";
import HeroBackground from "./HeroBackground";

/**
 * Hero (Server Component) – dane z getSiteConfig().hero.
 * Interaktywna część (wideo w tle) jest Client Componentem (HeroVideo).
 * Sticky header jest w przepływie dokumentu, więc hero zaczyna się tuż pod nim.
 */
export default async function Hero() {
  const { hero } = await getSiteConfig();

  return (
    <section className="relative flex min-h-[460px] items-center overflow-hidden bg-navy-900 md:min-h-[560px] lg:min-h-[600px]">
      <HeroBackground hero={hero} />

      <Container className="relative z-10 py-16 md:py-20 lg:py-24">
        <div className="max-w-[560px]">
          <h1 className="font-heading text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            {hero.title}
          </h1>

          <div className="mt-5 space-y-1">
            {hero.subtitle.map((line, index) => (
              <p key={index} className="text-sm leading-relaxed text-white/90 md:text-base">
                {line}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="outline-light">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Container>

      {/* Fala na dolnej krawędzi (kolor tła strony) – dekoracja, ignorowana
          przez czytniki ekranu i nawigację klawiaturą. */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="absolute bottom-0 left-0 h-10 w-full md:h-14"
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
      >
        <path
          d="M0 56 V30 C240 10 520 4 840 12 C1120 20 1320 26 1440 22 V56 Z"
          className="fill-cream"
        />
      </svg>
    </section>
  );
}
