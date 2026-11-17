"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import TripCard from "@/components/cards/TripCard";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Continent, ContinentId, Trip } from "@/types";

/**
 * Mapa ładowana dynamicznie (next/dynamic) – d3-geo, topojson-client i
 * world-atlas trafiają do osobnego chunku, nie do głównego bundla strony.
 * Placeholder ma ten sam stosunek szerokości do wysokości co <svg> mapy
 * (1000×520), więc nie powstaje CLS.
 */
const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      role="presentation"
      className="aspect-[1000/520] w-full animate-pulse bg-cream"
    />
  ),
});

interface ContinentExplorerProps {
  continents: Continent[];
  trips: Trip[];
}

/** Polska odmiana: 1 wyjazd, 2–4 wyjazdy, 5+ wyjazdów. */
function tripsPlural(count: number): string {
  if (count === 1) return "wyjazd";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "wyjazdy";
  return "wyjazdów";
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Sekcja "Wybierz kontynent": mapa z pinezkami + filtrowana lista wyjazdów.
 * Dane przychodzą z propsów (page.tsx woła getContinents()/getAllTrips()) –
 * filtrowanie po stronie klienta na podstawie trip.continent.
 */
export default function ContinentExplorer({ continents, trips }: ContinentExplorerProps) {
  const [selectedId, setSelectedId] = useState<ContinentId>("europe");
  const isFirstRender = useRef(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  const selected = continents.find((c) => c.id === selectedId) ?? continents[0];

  const continentTrips = useMemo(
    () =>
      trips
        .filter((trip) => trip.continent === selectedId)
        .sort((a, b) =>
          (a.startDate ?? "9999-12-31").localeCompare(b.startDate ?? "9999-12-31"),
        ),
    [trips, selectedId],
  );

  // Po kliknięciu pinezki: przewiń do bloku z wyjazdami, jeśli nie jest
  // w pełni widoczny (scroll-margin-top kompensuje sticky header).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const element = resultsRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (!fullyVisible) {
      element.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "nearest",
      });
    }
  }, [selectedId]);

  const handleSelect = (id: ContinentId) => {
    // Ponowne kliknięcie aktywnej pinezki nie odznacza wyboru.
    setSelectedId(id);
  };

  return (
    <section
      id="kontynenty"
      aria-labelledby="kontynenty-title"
      className="scroll-mt-36 bg-cream py-12 md:py-16"
    >
      <Container>
        <SectionHeading id="kontynenty-title" title="Wybierz kontynent" />

        <div className="mt-8 md:mt-10">
          <WorldMap continents={continents} selectedId={selectedId} onSelect={handleSelect} />
        </div>

        {/* Zapasowy sposób wyboru na małych ekranach (pinezki mogą się zbliżać). */}
        <div className="mt-4 lg:hidden">
          <div
            role="group"
            aria-label="Wybierz kontynent z listy"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {continents.map((continent) => (
              <button
                key={continent.id}
                type="button"
                onClick={() => handleSelect(continent.id)}
                aria-pressed={continent.id === selectedId}
                className={`flex-none whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  continent.id === selectedId
                    ? "border-gold-500 bg-gold-500 text-white"
                    : "border-border bg-white text-navy-800 hover:border-gold-500"
                }`}
              >
                {continent.name}
              </button>
            ))}
          </div>
        </div>

        {/* Komunikat dla czytników ekranu o zmianie liczby wyjazdów. */}
        <p aria-live="polite" className="sr-only">
          {selected
            ? `${selected.name}: ${continentTrips.length} ${tripsPlural(continentTrips.length)}`
            : ""}
        </p>

        {/* Wyjazdy wybranego kontynentu. */}
        <div ref={resultsRef} id="pielgrzymki" className="mt-10 scroll-mt-36 md:mt-12">
          <h3 className="text-center font-heading text-2xl font-semibold text-navy-800 md:text-3xl">
            Wybierz w {selected?.locative ?? "…"}
          </h3>

          <div className="mt-8 md:mt-10">
            {continentTrips.length > 0 ? (
              <div
                key={selectedId}
                className="motion-safe:animate-[fade-slide-in_0.45s_ease-out_both]"
              >
                <Carousel
                  ariaLabel={`Wyjazdy: ${selected?.name ?? ""}`}
                  itemsPerView={{ base: 1, sm: 2, lg: 4, xl: 5 }}
                  resetKey={selectedId}
                >
                  {continentTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </Carousel>
              </div>
            ) : (
              <div className="mx-auto max-w-md text-center">
                <p className="font-heading text-lg text-navy-800">
                  Nowe wyjazdy w tym regionie już wkrótce
                </p>
                <Link
                  href="/#kontakt"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-500 hover:text-gold-600"
                >
                  Skontaktuj się z nami
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
