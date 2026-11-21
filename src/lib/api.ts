import type { BlogPost, Continent, ContinentId, SiteConfig, Trip } from "@/types";
import { continents } from "@/data/continents";
import { posts } from "@/data/posts";
import { site } from "@/data/site";
import { tripEntries } from "./trips.generated";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Warstwa API. Treść wyjazdów pochodzi z CMS Keystatic (pliki JSON w
 * src/content/trips/, edytowane w panelu /admin).
 *
 * W produkcji treść jest importowana statycznie (src/lib/trips.generated.ts,
 * generowany przy buildzie przez scripts/generate-trip-index.ts), więc jest
 * częścią bundlu i działa także przy regeneracji cache w środowisku
 * serverless (Netlify Functions), gdzie odczyt z dysku katalogu z treścią
 * nie działa. W dev treść czytana jest z dysku, aby wpisy dodane w panelu
 * /admin pojawiały się bez restartu serwera.
 *
 * Funkcje z "use cache" pozwalają Next.js prerenderować dane przy buildzie
 * (cacheComponents), więc treść CMS-a jest wklejana statycznie, a każdy
 * zapis w panelu (commit do repo) uruchamia rebuild.
 */

interface TripEntry {
  title: string;
  continent: ContinentId;
  country: string;
  durationDays: number;
  startDate: string | null;
  endDate: string | null;
  groupSize: number | null;
  priceFrom: number | null;
  currency: "PLN" | "USD" | "EUR";
  priceNote: string | null;
  summary: string | null;
  image: string;
  imageAlt: string;
  featured: boolean | null;
  program: Array<{
    day: number;
    title: string;
    description: string;
  }> | null;
  priceIncludes: string[] | null;
  priceExcludes: string[] | null;
}

function toTrip(slug: string, entry: TripEntry): Trip {
  return {
    id: slug,
    slug,
    title: entry.title,
    continent: entry.continent,
    country: entry.country,
    durationDays: entry.durationDays,
    startDate: entry.startDate ?? undefined,
    endDate: entry.endDate ?? undefined,
    groupSize: entry.groupSize ?? undefined,
    priceFrom: entry.priceFrom ?? undefined,
    currency: entry.currency,
    priceNote: entry.priceNote ?? undefined,
    summary: entry.summary ?? undefined,
    image: entry.image,
    imageAlt: entry.imageAlt,
    featured: entry.featured === true,
    program: entry.program ?? [],
    priceIncludes: entry.priceIncludes ?? [],
    priceExcludes: entry.priceExcludes ?? [],
  };
}

/** Data rosnąco; wyjazdy bez ustalonego terminu na końcu (stabilnie po tytule). */
function byStartDate(a: Trip, b: Trip): number {
  const aDate = a.startDate ?? "9999-12-31";
  const bDate = b.startDate ?? "9999-12-31";
  return aDate.localeCompare(bDate) || a.title.localeCompare(b.title, "pl");
}

/**
 * Wszystkie wpisy wyjazdów: slug + surowe dane z pliku JSON.
 * Produkcja: statyczne importy z wygenerowanego indeksu (część bundlu).
 * Dev: odczyt z dysku, aby nowe wpisy z panelu /admin były widoczne
 * od razu, bez restartu `next dev`.
 */
function loadEntries(): Array<{ slug: string; entry: unknown }> {
  if (process.env.NODE_ENV === "production") {
    return [...tripEntries];
  }
  const dir = join(process.cwd(), "src/content/trips");
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b, "pl"))
    .map((name) => ({
      slug: name.slice(0, -".json".length),
      entry: JSON.parse(readFileSync(join(dir, name), "utf8")) as unknown,
    }));
}

/** Wszystkie wyjazdy z CMS-a, posortowane po terminie. */
export async function getAllTrips(): Promise<Trip[]> {
  "use cache";
  const trips = loadEntries().map(({ slug, entry }) => toTrip(slug, entry as TripEntry));
  return trips.sort(byStartDate);
}

/** Trips z `featured === true`, posortowane rosnąco po `startDate`. */
export async function getUpcomingTrips(limit = 3): Promise<Trip[]> {
  "use cache";
  const trips = loadEntries()
    .map(({ slug, entry }) => toTrip(slug, entry as TripEntry))
    .filter((trip) => trip.featured)
    .sort(byStartDate)
    .slice(0, limit);
  return trips;
}

/** Wyjazdy z danego kontynentu, posortowane po `startDate`. */
export async function getTripsByContinent(id: ContinentId): Promise<Trip[]> {
  "use cache";
  const trips = loadEntries()
    .map(({ slug, entry }) => toTrip(slug, entry as TripEntry))
    .filter((trip) => trip.continent === id)
    .sort(byStartDate);
  return trips;
}

/** Pojedynczy wyjazd po slugu (strona szczegółów). */
export async function getTripBySlug(slug: string): Promise<Trip | null> {
  "use cache";
  const found = loadEntries().find((item) => item.slug === slug);
  return found ? toTrip(found.slug, found.entry as TripEntry) : null;
}

/** Slugi wszystkich wyjazdów (generateStaticParams). */
export async function getAllTripSlugs(): Promise<string[]> {
  "use cache";
  return loadEntries().map(({ slug }) => slug);
}

// TODO: kontynenty i wpisy blogowe podpiąć pod CMS analogicznie do trips.
export async function getSiteConfig(): Promise<SiteConfig> {
  "use cache";
  return structuredClone(site);
}

export async function getContinents(): Promise<Continent[]> {
  "use cache";
  return structuredClone(continents);
}

/** Wpisy blogowe od najnowszych. */
export async function getBlogPosts(limit = 3): Promise<BlogPost[]> {
  "use cache";
  const sorted = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
  return structuredClone(sorted);
}

/** Wszystkie wpisy blogowe od najnowszych (strona /blog). */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  "use cache";
  const sorted = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
  return structuredClone(sorted);
}

/** Pojedynczy wpis blogowy po slugu (/blog/[slug]). */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  "use cache";
  const post = posts.find((item) => item.slug === slug);
  return post ? structuredClone(post) : null;
}
