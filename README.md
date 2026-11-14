# St. Christopher Pilgrimages and Travel

Strona główna biura pielgrzymek **St. Christopher Pilgrimages and Travel** – Next.js
(App Router), TypeScript (strict), Tailwind CSS v4. Interfejs po polsku, dane
przykładowe trzymane lokalnie, bez CDN i zewnętrznych żądań w runtime.

## Komendy

| Komenda                         | Opis                                          |
| ------------------------------- | --------------------------------------------- |
| `npm run dev`                   | Serwer deweloperski (`next dev`)              |
| `npm run build`                 | Build produkcyjny                             |
| `npm run lint`                  | ESLint (`eslint-config-next`)                 |
| `npx tsc --noEmit`              | Kontrola typów TypeScript                     |
| `npm run validate:data`         | Walidacja spójności danych (`scripts/validate-data.ts`) |
| `npm run generate:placeholders` | Generowanie zdjęć-zastępczych do `public/images` |

## Struktura projektu

```
src/
  app/                  # trasy App Router
    layout.tsx          # fonty, Header/Footer, metadane SEO (openGraph, twitter, canonical)
    page.tsx            # strona główna – składa sekcje, wstrzykuje JSON-LD
    robots.ts           # robots.txt
    sitemap.ts          # sitemap.xml
    not-found.tsx       # strona 404
    error.tsx           # obsługa błędów runtime ("Spróbuj ponownie")
    actions.ts          # server actions (formularz kontaktowy – stub)
    globals.css         # tokeny designu (@theme Tailwind v4)
  types/index.ts        # kontrakt typów (Trip, Continent, SiteConfig, …)
  data/                 # DANE – źródło prawdy (później: backend/CMS)
    site.ts, trips.ts, continents.ts, posts.ts
  lib/
    api.ts              # JEDYNE źródło danych dla komponentów (async, Promise)
    format.ts           # formaty PL (ceny, daty, liczba dni)
    seo.ts              # bazowy URL + JSON-LD (TravelAgency)
    validation.ts       # walidacja formularza kontaktowego
  components/
    ui/                 # Container, Button, SectionHeading, Logo, Carousel
    layout/             # Header, Footer (+ StickyHeader, MobileMenu, …)
    cards/              # TripCard, BlogCard
    map/                # WorldMap (d3-geo + topojson, ładowany dynamicznie)
    sections/           # Hero, UpcomingTrips, ContinentExplorer, BlogSection, ContactSection
public/
  design/homepage.png   # projekt graficzny
  images/               # zdjęcia-zastępcze
  video/                # wideo hero i film promocyjny
scripts/                # validate-data.ts, generate-placeholders.ts
```

## Jak podmienić dane z list na backend

Wszystkie dane żyją w **listach/obiektach w `src/data/*.ts`** i są czytane
**wyłącznie przez funkcje z `src/lib/api.ts`** (`getSiteConfig`, `getContinents`,
`getAllTrips`, `getUpcomingTrips`, `getTripsByContinent`, `getBlogPosts`).
Komponenty nie importują `src/data` bezpośrednio.

Przejście na backend = podmiana implementacji funkcji w `api.ts` na `fetch`
(sygnatury: async, zwracają `Promise<T>` – bez zmian w komponentach):

```ts
export async function getAllTrips(): Promise<Trip[]> {
  return fetch(`${process.env.API_URL}/trips`).then((r) => r.json());
}
```

Po zmianie danych uruchom `npm run validate:data` (sprawdza spójność typów,
dat, ścieżek obrazów i unikalność id/slug).

## Jak dodać filmik do hero

1. Wrzuć plik do `public/video/` (mp4; opcjonalnie też webm).
2. W `src/data/site.ts` ustaw:
   - `hero.videoSrc` – wideo w tle hero (`null` = tylko poster),
   - `hero.videoSrcWebm` – opcjonalna wersja webm,
   - `hero.posterSrc` – obraz-podmiana widoczny zanim wideo się załaduje,
   - `hero.filmUrl` – film otwierany przyciskiem „Zobacz film" (`null` = brak przycisku).
3. Wideo w tle nie odtwarza się przy `prefers-reduced-motion` ani przy
   `navigator.connection.saveData` – wtedy widać wyłącznie poster.

## Jak podmienić zdjęcia-zastępcze

Placeholdery (SVG) w `public/images/trips|blog|…` podmieniasz po prostu
docelowymi plikami o **tych samych nazwach** – dane (`src/data/*.ts`)
wskazują ścieżki `/images/...` i nic poza podmianą plików nie wymaga zmian.
Zmiana nazw = aktualizacja pól `image` w danych + `npm run validate:data`.

## Znane ograniczenia i TODO

- [ ] Numer PL: `+48 201 392 42 66` – **potwierdzić cyfry z klientem** (w projekcie
      graficznym był z prefiksem +1 – celowo zachowany jako TODO).
- [ ] Podstrony `/pielgrzymki/[slug]` i `/blog/[slug]` (teraz linki prowadzą na
      sekcje strony głównej), a także `/poradnik`, `/o-nas`, `/faq`.
- [ ] i18n – przełącznik języka „PL" jest na razie tylko UI.
- [ ] RODO/zgody w formularzu kontaktowym + prawdziwa wysyłka (`actions.ts` jest stubem).
- [ ] Prawdziwe zdjęcia i film promocyjny (teraz placeholdery / wideo próbne).
- [ ] Obraz `og:image` – obecnie SVG; wygenerować statyczny og.jpg (1200×630).
- [ ] Sitemap: dodać przyszłe podstrony po ich powstaniu.
