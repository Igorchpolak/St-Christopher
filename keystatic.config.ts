import { collection, config, fields } from "@keystatic/core";

/**
 * Konfiguracja Keystatic (CMS nad plikami w repo).
 *
 * Tryb storage jest na sztywno "local": panel zapisuje pliki bezpośrednio
 * do src/content/ i działa wyłącznie przy `next dev`. Edycja treści wygląda
 * tak: panel na http://localhost:3000/keystatic → zapis → commit i push
 * do GitHub → rebuild Netlify → strona się aktualizuje.
 *
 * Dlaczego nie warunek na process.env (tryb "github" na produkcji):
 *  1. Konfiguracja jest oceniana także w przeglądarce (panel to komponent
 *     kliencki), a odwołanie process.env bez wartości inline powoduje
 *     w bundlu klienta zależność od polifillu `process`, którego chunk
 *     nie jest ładowany — moduł konfiguracji wybucha przy imporcie i panel
 *     milcząco się nie renderuje (pusta strona).
 *  2. Sam tryb "github" na Next 16 jest dotknięty bugiem Keystatic #1549
 *     (https://github.com/Thinkmill/keystatic/issues/1549): UI w tym trybie
 *     renderuje się jako pusta strona (zbadane na Next 16.4.6, dev i prod).
 *
 * Po naprawie #1549 wystarczy zmienić storage na:
 *   { kind: "github", repo: "Igorchpolak/St-Christopher" }
 * i ustawić zmienne z .env.example (KEYSTATIC_GITHUB_CLIENT_ID itd.)
 * w Netlify.
 */
export default config({
  storage: {
    kind: "local",
  },
  ui: {
    navigation: {
      Treść: ["trips", "posts"],
    },
  },
  collections: {
    trips: collection({
      label: "Wyjazdy i pielgrzymki",
      slugField: "title",
      path: "src/content/trips/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({
          name: { label: "Tytuł" },
          slug: {
            label: "Slug (adres URL)",
            description: "Małe litery, myślniki, np. wlochy-rzym-i-watykan",
          },
        }),
        continent: fields.select({
          label: "Kontynent",
          options: [
            { label: "Ameryka Północna", value: "north-america" },
            { label: "Ameryka Południowa", value: "south-america" },
            { label: "Europa", value: "europe" },
            { label: "Afryka", value: "africa" },
            { label: "Azja", value: "asia" },
            { label: "Oceania", value: "oceania" },
          ],
          defaultValue: "europe",
        }),
        country: fields.text({ label: "Kraj / kraje" }),
        durationDays: fields.integer({
          label: "Czas trwania (liczba dni)",
          validation: { isRequired: true },
        }),
        // Opcjonalne: wyjazdy "wkrótce" bez ustalonego terminu zostawiają
        // te pola puste, a strona pokazuje wtedy "Termin wkrótce".
        startDate: fields.date({ label: "Data rozpoczęcia" }),
        endDate: fields.date({ label: "Data zakończenia" }),
        groupSize: fields.integer({ label: "Wielkość grupy (os.)" }),
        priceFrom: fields.number({
          label: "Cena od",
          description: "Kwota bez waluty, np. 2990 (puste = cena na zapytanie)",
        }),
        currency: fields.select({
          label: "Waluta",
          options: [
            { label: "PLN", value: "PLN" },
            { label: "USD", value: "USD" },
            { label: "EUR", value: "EUR" },
          ],
          defaultValue: "PLN",
        }),
        priceNote: fields.text({
          label: "Uwagi do ceny",
          description: "Np. „+ przeloty”, „cena przy min. 35 uczestnikach”",
        }),
        summary: fields.text({
          label: "Krótki opis (SEO / karta)",
          multiline: true,
          description: "1–3 zdania o wyjeździe",
        }),
        image: fields.image({
          label: "Zdjęcie",
          directory: "public/images/trips",
          publicPath: "/images/trips/",
        }),
        imageAlt: fields.text({
          label: "Opis zdjęcia (alt)",
          description: "Ważne dla dostępności i SEO",
        }),
        featured: fields.checkbox({
          label: "Wyróżniony",
          description: "Pokazuj w karuzeli „Najbliższe wyjazdy”",
        }),
        program: fields.array(
          fields.object({
            day: fields.integer({
              label: "Dzień nr",
              validation: { isRequired: true },
            }),
            title: fields.text({ label: "Nagłówek dnia" }),
            description: fields.text({
              label: "Opis dnia",
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Program dzień po dniu",
            itemLabel: (props) =>
              `Dzień ${props.fields.day.value || "–"}${
                props.fields.title.value ? `: ${props.fields.title.value}` : ""
              }`,
          },
        ),
        priceIncludes: fields.array(fields.text({ label: "Pozycja" }), {
          label: "Cena zawiera",
          itemLabel: (props) => props.value || "Pozycja",
        }),
        priceExcludes: fields.array(fields.text({ label: "Pozycja" }), {
          label: "Cena nie zawiera",
          itemLabel: (props) => props.value || "Pozycja",
        }),
      },
    }),
    posts: collection({
      label: "Wpisy na bloga",
      slugField: "title",
      path: "src/content/posts/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({
          name: { label: "Tytuł" },
          slug: { label: "Slug (adres URL)" },
        }),
        excerpt: fields.text({
          label: "Zajawka",
          description: "Krótki opis na karcie wpisu",
          multiline: true,
        }),
        date: fields.date({
          label: "Data publikacji",
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: "Zdjęcie",
          directory: "public/images/posts",
          publicPath: "/images/posts/",
        }),
        imageAlt: fields.text({ label: "Opis zdjęcia (alt)" }),
      },
    }),
  },
});
