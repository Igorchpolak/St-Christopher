"use client";

import { useMemo, useState } from "react";
import TripCard from "@/components/cards/TripCard";
import type { Continent, ContinentId, Trip } from "@/types";

interface AllTripsListProps {
  continents: Continent[];
  trips: Trip[];
}

/** Filtr "wszystkie" + id kontynentów. */
type Filter = "all" | ContinentId;

/** Polska odmiana: 1 wyjazd, 2–4 wyjazdy, 5+ wyjazdów. */
function tripsPlural(count: number): string {
  if (count === 1) return "wyjazd";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "wyjazdy";
  return "wyjazdów";
}

/**
 * Lista wszystkich wyjazdów z filtrem po kontynencie.
 * Dane przychodzą z serwera (page.tsx woła getAllTrips()/getContinents()),
 * filtrowanie odbywa się lokalnie – bez dodatkowych zapytań.
 */
export default function AllTripsList({ continents, trips }: AllTripsListProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? trips : trips.filter((trip) => trip.continent === filter)),
    [trips, filter],
  );

  // Pokazujemy tylko kontynenty, które mają wyjazdy (kolejność jak w danych).
  const filters = useMemo(
    () => continents.filter((continent) => trips.some((trip) => trip.continent === continent.id)),
    [continents, trips],
  );

  return (
    <div>
      {/* Filtry kontynentów */}
      <div
        role="group"
        aria-label="Filtruj pielgrzymki po kontynencie"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
      >
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={`flex-none whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
            filter === "all"
              ? "border-gold-500 bg-gold-500 text-white"
              : "border-border bg-white text-navy-800 hover:border-gold-500"
          }`}
        >
          Wszystkie ({trips.length})
        </button>
        {filters.map((continent) => {
          const count = trips.filter((trip) => trip.continent === continent.id).length;
          return (
            <button
              key={continent.id}
              type="button"
              onClick={() => setFilter(continent.id)}
              aria-pressed={filter === continent.id}
              className={`flex-none whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                filter === continent.id
                  ? "border-gold-500 bg-gold-500 text-white"
                  : "border-border bg-white text-navy-800 hover:border-gold-500"
              }`}
            >
              {continent.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Komunikat dla czytników ekranu o zmianie liczby wyjazdów. */}
      <p aria-live="polite" className="sr-only">
        {filtered.length} {tripsPlural(filtered.length)}
      </p>

      {/* Siatka wyjazdów */}
      <div className="mt-8 md:mt-10">
        {filtered.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((trip) => (
              <li key={trip.id}>
                <TripCard trip={trip} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-12 text-center font-heading text-lg text-navy-800">
            Brak wyjazdów w tym regionie – nowe terminy już wkrótce.
          </p>
        )}
      </div>
    </div>
  );
}
