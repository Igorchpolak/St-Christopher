/**
 * Walidacja danych (krok 2) – uruchamianie: npm run validate:data
 * Sprawdza:
 *  - unikalność id/slug (wyjazdy, wpisy),
 *  - poprawność referencji continent,
 *  - endDate >= startDate,
 *  - zgodność durationDays z różnicą dat (włącznie),
 *  - istnienie plików obrazów w public/,
 *  - dokładnie 3 wyjazdy featured,
 *  - dokładnie 0 wyjazdów w 'oceania',
 *  - co najmniej 5 wyjazdów w 'europe'.
 * Kończy się exit code 1 przy błędzie.
 */
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { continents } from "../src/data/continents";
import { posts } from "../src/data/posts";
import { trips } from "../src/data/trips";
import { formatDays } from "../src/lib/format";
import type { ContinentId } from "../src/types";

// npm uruchamia skrypty zawsze z korzenia projektu.
const root = resolve(process.cwd());

const errors: string[] = [];
const warnings: string[] = [];

function fail(message: string): void {
  errors.push(message);
}

function daysInclusive(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00Z`);
  const end = new Date(`${endIso}T00:00:00Z`);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// --- Kontynenty ---
const continentIds = new Set<ContinentId>();
for (const continent of continents) {
  if (continentIds.has(continent.id)) {
    fail(`Duplicat continent.id: "${continent.id}"`);
  }
  continentIds.add(continent.id);
}

// --- Wyjazdy ---
const tripIds = new Set<string>();
const tripSlugs = new Set<string>();

for (const trip of trips) {
  const label = `trip "${trip.slug}"`;

  if (tripIds.has(trip.id)) fail(`Duplicat trips.id: "${trip.id}"`);
  tripIds.add(trip.id);

  if (tripSlugs.has(trip.slug)) fail(`Duplicat trips.slug: "${trip.slug}"`);
  tripSlugs.add(trip.slug);

  if (!continentIds.has(trip.continent)) {
    fail(`${label}: nieznany continent "${trip.continent}"`);
  }

  if (!ISO_DATE.test(trip.startDate) || !ISO_DATE.test(trip.endDate)) {
    fail(`${label}: startDate/endDate nie są datami ISO (${trip.startDate} / ${trip.endDate})`);
    continue;
  }

  if (trip.endDate < trip.startDate) {
    fail(`${label}: endDate (${trip.endDate}) jest przed startDate (${trip.startDate})`);
  } else {
    const diff = daysInclusive(trip.startDate, trip.endDate);
    if (trip.durationDays !== diff) {
      fail(`${label}: durationDays=${trip.durationDays}, a różnica dat włącznie to ${diff}`);
    }
  }

  const imagePath = join(root, "public", trip.image);
  if (!trip.image.startsWith("/images/")) {
    fail(`${label}: image powinno wskazywać na /images/... (jest: ${trip.image})`);
  } else if (!existsSync(imagePath)) {
    fail(`${label}: brak pliku obrazu public${trip.image} (uruchom npm run generate:placeholders)`);
  }

  if (trip.image.trim().length < 3) {
    warnings.push(`${label}: podejrzanie krótki imageAlt`);
  }
}

const featuredCount = trips.filter((trip) => trip.featured === true).length;
if (featuredCount !== 3) {
  fail(`Oczekiwano dokładnie 3 wyjazdów featured, jest: ${featuredCount}`);
}

const oceaniaCount = trips.filter((trip) => trip.continent === "oceania").length;
if (oceaniaCount !== 0) {
  fail(`Oceania ma mieć celowo 0 wyjazdów, jest: ${oceaniaCount}`);
}

const europeCount = trips.filter((trip) => trip.continent === "europe").length;
if (europeCount < 5) {
  fail(`Europa powinna mieć co najmniej 5 wyjazdów, jest: ${europeCount}`);
}

// --- Wpisy blogowe ---
const postIds = new Set<string>();
const postSlugs = new Set<string>();

for (const post of posts) {
  const label = `post "${post.slug}"`;

  if (postIds.has(post.id)) fail(`Duplicat posts.id: "${post.id}"`);
  postIds.add(post.id);

  if (postSlugs.has(post.slug)) fail(`Duplicat posts.slug: "${post.slug}"`);
  postSlugs.add(post.slug);

  if (!ISO_DATE.test(post.date)) {
    fail(`${label}: date nie jest datą ISO (${post.date})`);
  }

  const imagePath = join(root, "public", post.image);
  if (!post.image.startsWith("/images/")) {
    fail(`${label}: image powinno wskazywać na /images/... (jest: ${post.image})`);
  } else if (!existsSync(imagePath)) {
    fail(`${label}: brak pliku obrazu public${post.image} (uruchom npm run generate:placeholders)`);
  }
}

// --- Format/formatDays smoke test ---
for (const [input, expected] of [[1, "1 dzień"], [2, "2 dni"], [4, "4 dni"], [5, "5 dni"], [22, "22 dni"]] as const) {
  const actual = formatDays(input);
  if (actual !== expected) {
    fail(`formatDays(${input}) = "${actual}", oczekiwano "${expected}"`);
  }
}

// --- Raport ---
for (const warning of warnings) console.warn(`⚠ ${warning}`);

if (errors.length > 0) {
  console.error(`\n✖ Walidacja danych NIE powiodła się (${errors.length} błędów):`);
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log(`✔ Walidacja danych OK: ${trips.length} wyjazdów, ${posts.length} wpisów, ${continents.length} kontynentów.`);
