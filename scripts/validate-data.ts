/**
 * Walidacja danych – uruchamianie: npm run validate:data
 * Sprawdza treść CMS-a Keystatic (src/content/trips/*.json) oraz statyczne
 * wpisy blogowe (src/data/posts.ts):
 *  - unikalność slug (wyjazdy, wpisy),
 *  - poprawność referencji continent,
 *  - durationDays > 0,
 *  - gdy podane są OBAJE daty: ISO, endDate >= startDate i zgodność
 *    durationDays z różnicą dat (włącznie); jedna data = błąd,
 *  - istnienie plików obrazów w public/,
 *  - dokładnie 3 wyjazdy featured (sekcja „Najbliższe wyjazdy”),
 *  - numeracja dni programu (1..N bez duplikatów),
 *  - wpisy blogowe: date ISO + obraz.
 * Kończy się exit code 1 przy błędzie.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { continents } from "../src/data/continents";
import { posts } from "../src/data/posts";
import { formatDays } from "../src/lib/format";
import type { ContinentId, Currency } from "../src/types";

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
const CONTINENT_IDS = new Set(continents.map((c) => c.id));
const CURRENCIES: Currency[] = ["PLN", "USD", "EUR"];

// --- Wyjazdy (treść CMS-a) ---
const tripsDir = join(root, "src", "content", "trips");
const tripFiles = readdirSync(tripsDir).filter((name) => name.endsWith(".json"));

const tripSlugs = new Set<string>();
let featuredCount = 0;
let tripCount = 0;
const continentCount = new Map<ContinentId, number>();

for (const file of tripFiles) {
  const slug = file.replace(/\.json$/, "");
  const trip = JSON.parse(readFileSync(join(tripsDir, file), "utf8"));
  tripCount += 1;
  const label = `trip "${slug}"`;

  if (tripSlugs.has(slug)) fail(`${label}: duplikat slug`);
  tripSlugs.add(slug);

  if (typeof trip.title !== "string" || trip.title.trim().length === 0) {
    fail(`${label}: brak tytułu`);
  }

  if (!CONTINENT_IDS.has(trip.continent)) {
    fail(`${label}: nieznany continent "${trip.continent}"`);
  } else {
    continentCount.set(trip.continent, (continentCount.get(trip.continent) ?? 0) + 1);
  }

  if (!Number.isInteger(trip.durationDays) || trip.durationDays <= 0) {
    fail(`${label}: durationDays musi być dodatnią liczbą całkowitą`);
  }

  const hasStart = typeof trip.startDate === "string" && trip.startDate.length > 0;
  const hasEnd = typeof trip.endDate === "string" && trip.endDate.length > 0;
  if (hasStart !== hasEnd) {
    fail(`${label}: ustawione musi być OBAJE daty lub żadna (termin „wkrótce”)`);
  } else if (hasStart && hasEnd) {
    if (!ISO_DATE.test(trip.startDate) || !ISO_DATE.test(trip.endDate)) {
      fail(`${label}: startDate/endDate nie są datami ISO (${trip.startDate} / ${trip.endDate})`);
    } else if (trip.endDate < trip.startDate) {
      fail(`${label}: endDate (${trip.endDate}) jest przed startDate (${trip.startDate})`);
    } else if (trip.durationDays !== daysInclusive(trip.startDate, trip.endDate)) {
      fail(`${label}: durationDays=${trip.durationDays}, a różnica dat włącznie to ${daysInclusive(trip.startDate, trip.endDate)}`);
    }
  }

  if (typeof trip.priceFrom === "number" && !CURRENCIES.includes(trip.currency)) {
    fail(`${label}: nieznana waluta "${trip.currency}"`);
  }

  if (typeof trip.image !== "string" || !trip.image.startsWith("/images/")) {
    fail(`${label}: image powinno wskazywać na /images/... (jest: ${trip.image})`);
  } else if (!existsSync(join(root, "public", trip.image))) {
    fail(`${label}: brak pliku obrazu public${trip.image}`);
  }

  if (typeof trip.imageAlt !== "string" || trip.imageAlt.trim().length < 3) {
    warnings.push(`${label}: podejrzanie krótki imageAlt`);
  }

  if (trip.featured === true) featuredCount += 1;

  // Numeracja dni programu
  const program = Array.isArray(trip.program) ? trip.program : [];
  const dayNumbers = program.map((d: { day?: number }) => d?.day);
  dayNumbers.forEach((day: unknown, index: number) => {
    if (day !== index + 1) {
      fail(`${label}: program – dzień nr ${String(day)} na pozycji ${index + 1} (oczekiwano ${index + 1})`);
    }
  });
  if (Number.isInteger(trip.durationDays) && program.length > 0 && program.length !== trip.durationDays) {
    warnings.push(`${label}: durationDays=${trip.durationDays}, a dni w programie: ${program.length}`);
  }
}

if (featuredCount !== 3) {
  fail(`Oczekiwano dokładnie 3 wyjazdów featured, jest: ${featuredCount}`);
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

const perContinent = [...continentCount.entries()]
  .map(([id, count]) => `${id}: ${count}`)
  .join(", ");
console.log(
  `✔ Walidacja danych OK: ${tripCount} wyjazdów z CMS (${perContinent}), ${posts.length} wpisów.`,
);
