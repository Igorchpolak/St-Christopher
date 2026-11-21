/**
 * Generator indeksu wyjazdów – uruchamiane: npm run generate:trip-index
 * (włączone w skrypt `build`, więc dzieje się automatycznie przy każdym
 * buildzie, także na Netlify).
 *
 * Zamiast czytać src/content/trips/*.json z dysku przez Reader API w czasie
 * działania (fs.readdir), generuje moduł ze statycznymi importami wszystkich
 * plików JSON. Dzięki temu treść jest częścią bundlu:
 *  - prerender przy buildzie ma pełne dane,
 *  - regeneracja cache ("use cache") w środowisku serverless (Netlify
 *    Functions) też działa, bo nie sięga do systemu plików. Reader API tam
 *    nie widzi katalogu src/content/trips i po cichu zwracał pustą listę
 *    (readdir → ENOENT → []), co „zerowało” pielgrzymki na listach po ok.
 *    15 minutach od wdrożenia (domyślny revalidate profilu `default`).
 *
 * Panel /admin dalej zapisuje pliki w repo (tryb github), a zapis uruchamia
 * rebuild Netlify, który generuje ten indeks na nowo.
 */
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// npm uruchamia skrypty zawsze z korzenia projektu.
const tripsDir = join(process.cwd(), "src/content/trips");
const outFile = join(process.cwd(), "src/lib/trips.generated.ts");

const slugs = readdirSync(tripsDir)
  .filter((name) => name.endsWith(".json"))
  .map((name) => name.slice(0, -".json".length))
  .sort((a, b) => a.localeCompare(b, "pl"));

if (slugs.length === 0) {
  throw new Error(`Brak plików JSON w ${tripsDir}`);
}

/** Poprawny identyfikator TS: slug jest kebab-case i może zaczynać się cyfrą. */
function toIdentifier(slug: string): string {
  const camel = slug
    .split("-")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join("");
  return `trip_${camel}`;
}

const usedIdentifiers = new Set<string>();
const imports: string[] = [];
const listItems: string[] = [];

for (const slug of slugs) {
  let identifier = toIdentifier(slug);
  while (usedIdentifiers.has(identifier)) {
    identifier = `${identifier}_2`;
  }
  usedIdentifiers.add(identifier);
  imports.push(`import ${identifier} from "@/content/trips/${slug}.json";`);
  listItems.push(`  { slug: "${slug}", entry: ${identifier} }`);
}

const file = `// AUTO-GENERATED – plik tworzy skrypt npm run generate:trip-index. Nie edytuj ręcznie.
//
// Statyczne importy wszystkich wyjazdów z src/content/trips/*.json (CMS
// Keystatic). Importy są częścią bundlu, więc dane pielgrzymek są dostępne
// zawsze – także przy regeneracji cache w czasie działania w środowisku
// serverless (Netlify), gdzie Reader API czytające z dysku nie widzi katalogu
// z treścią. Zmiany treści w /admin trafiają do repo (tryb github) i
// uruchamiają rebuild, który generuje ten plik na nowo.

${imports.join("\n")}

export const tripEntries: ReadonlyArray<{ slug: string; entry: unknown }> = [
${listItems.join(",\n")},
];
`;

writeFileSync(outFile, file);
console.log(`generate:trip-index: zapisano ${outFile} (${slugs.length} wyjazdów)`);
