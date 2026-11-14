import type { BlogPost, Continent, ContinentId, SiteConfig, Trip } from "@/types";
import { continents } from "@/data/continents";
import { posts } from "@/data/posts";
import { site } from "@/data/site";
import { trips } from "@/data/trips";

/**
 * Warstwa API symulująca backend. Wszystkie funkcje są async i zwracają
 * KOPIE danych (bez referencji do modułów src/data), więc w przyszłości
 * wystarczy podmienić implementację na fetch do backendu.
 */

// TODO: zastąpić wywołaniem backendu.
export async function getSiteConfig(): Promise<SiteConfig> {
  return structuredClone(site);
}

// TODO: zastąpić wywołaniem backendu.
export async function getContinents(): Promise<Continent[]> {
  return structuredClone(continents);
}

// TODO: zastąpić wywołaniem backendu.
export async function getAllTrips(): Promise<Trip[]> {
  return structuredClone(trips);
}

// TODO: zastąpić wywołaniem backendu.
/** Trips z `featured === true`, posortowane rosnąco po `startDate`. */
export async function getUpcomingTrips(limit = 3): Promise<Trip[]> {
  const featured = trips
    .filter((trip) => trip.featured === true)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
  return structuredClone(featured);
}

// TODO: zastąpić wywołaniem backendu.
/** Wyjazdy z danego kontynentu, posortowane po `startDate`. */
export async function getTripsByContinent(id: ContinentId): Promise<Trip[]> {
  const filtered = trips
    .filter((trip) => trip.continent === id)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return structuredClone(filtered);
}

// TODO: zastąpić wywołaniem backendu.
/** Wpisy blogowe od najnowszych. */
export async function getBlogPosts(limit = 3): Promise<BlogPost[]> {
  const sorted = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
  return structuredClone(sorted);
}
