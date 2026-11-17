/**
 * Generator placeholderów obrazów (SVG, lokalnie – zero zewnętrznych żądań).
 * Uruchamianie: npx tsx scripts/generate-placeholders.ts
 *
 * Generuje:
 *  - public/images/trips/<slug>.svg        (4:3)  – ze slugów wpisów CMS (src/content/trips)
 *  - public/images/blog/<slug>.svg         (16:10) – z src/data/posts.ts
 *  - public/images/hero-poster.svg         (16:9)
 *  - public/images/contact-bg.svg          (4:5, krzyż na ścieżce)
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { posts } from "../src/data/posts";

/** Slugi + tytuły wyjazdów z treści CMS-a Keystatic. */
function tripsFromContent(): Array<{ slug: string; title: string }> {
  const tripsDir = join(root, "src", "content", "trips");
  return readdirSync(tripsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const slug = name.replace(/\.json$/, "");
      const data = JSON.parse(readFileSync(join(tripsDir, name), "utf8"));
      return { slug, title: String(data.title ?? slug) };
    });
}

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const publicDir = join(root, "public", "images");

function labelFor(name: string): string {
  return name
    .replace(/\.[a-z]+$/i, "")
    .split(/[-_]/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => {
      const first = word[0]?.toUpperCase() ?? "";
      return first + word.slice(1);
    })
    .join(" ");
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Gradient navy/gold + nazwa w środku (tekst łamany na maks. 2 linie). */
function placeholderSvg(label: string, width: number, height: number): string {
  const cx = width / 2;
  const cy = height / 2;
  const goldCrossSize = Math.min(width, height) * 0.12;
  const fontSize = Math.round(width * 0.06);

  const words = label.split(" ");
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
  const hasSecondLine = line2.length > 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#12233F"/>
      <stop offset="100%" stop-color="#0B1730"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C8913A" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#C8913A" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${cy}" r="${Math.max(width, height) * 0.42}" fill="url(#glow)"/>
  <g stroke="#C8913A" stroke-width="${Math.max(2, goldCrossSize * 0.09)}" stroke-linecap="round" opacity="0.9">
    <line x1="${cx}" y1="${cy - goldCrossSize / 2 - height * 0.06}" x2="${cx}" y2="${cy - height * 0.02}"/>
    <line x1="${cx - goldCrossSize / 2}" y1="${cy - goldCrossSize * 0.28 - height * 0.06}" x2="${cx + goldCrossSize / 2}" y2="${cy - goldCrossSize * 0.28 - height * 0.06}"/>
  </g>
  <text x="${cx}" y="${cy + height * 0.09}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="#FAF7F2" opacity="0.92">${escapeXml(line1)}</text>
  ${hasSecondLine ? `<text x="${cx}" y="${cy + height * 0.09 + fontSize * 1.25}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="#FAF7F2" opacity="0.92">${escapeXml(line2)}</text>` : ""}
  <rect x="0" y="${height - height * 0.015}" width="${width}" height="${height * 0.015}" fill="#C8913A"/>
</svg>`;
}

/** Stylizowany krzyż na śladzie pielgrzymów (4:5) – sekcja kontaktowa. */
function contactBgSvg(): string {
  const width = 800;
  const height = 1000;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Krzyż na ścieżce pielgrzymów">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#12233F"/>
      <stop offset="70%" stop-color="#3A3F55"/>
      <stop offset="100%" stop-color="#C8913A"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FAF7F2" stop-opacity="0"/>
      <stop offset="100%" stop-color="#FAF7F2" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#sky)"/>
  <circle cx="200" cy="180" r="90" fill="#FAF7F2" opacity="0.85"/>
  <path d="M0 640 L800 560 L800 1000 L0 1000 Z" fill="#5A4A32"/>
  <path d="M0 660 L800 585" stroke="#C8913A" stroke-width="10" opacity="0.7" fill="none"/>
  <g stroke="#0B1730" stroke-width="18" stroke-linecap="round" opacity="0.9">
    <line x1="330" y1="420" x2="330" y2="640"/>
    <line x1="255" y1="480" x2="405" y2="480"/>
  </g>
  <g fill="#0B1730" opacity="0.45">
    <ellipse cx="180" cy="800" rx="26" ry="10"/>
    <ellipse cx="280" cy="840" rx="26" ry="10"/>
    <ellipse cx="380" cy="800" rx="26" ry="10"/>
    <ellipse cx="480" cy="850" rx="26" ry="10"/>
    <ellipse cx="580" cy="810" rx="26" ry="10"/>
  </g>
  <rect width="${width}" height="${height}" fill="url(#fade)"/>
</svg>`;
}

function writeSvg(relPath: string, svg: string): void {
  const target = join(publicDir, relPath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, svg, "utf8");
  console.log(`✔ ${relPath}`);
}

// Wyjazdy (4:3)
for (const trip of tripsFromContent()) {
  writeSvg(join("trips", `${trip.slug}.svg`), placeholderSvg(labelFor(trip.slug), 800, 600));
}

// Blog (16:10)
for (const post of posts) {
  writeSvg(join("blog", `${post.slug}.svg`), placeholderSvg(labelFor(post.slug), 800, 500));
}

// Hero poster (16:9)
writeSvg("hero-poster.svg", placeholderSvg("St Christopher Pilgrimages", 1600, 900));

// Tło sekcji kontaktowej (4:5)
writeSvg("contact-bg.svg", contactBgSvg());

console.log("Gotowe – placeholdery zapisane w public/images.");
