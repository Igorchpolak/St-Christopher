import { collection, config, fields } from "@keystatic/core";

/**
 * Konfiguracja Keystatic (CMS nad plikami w repo).
 *
 * Deweloperka (next dev): storage.kind = "local" — zapis do src/content/.
 * Produkcja (Netlify): zamień na:
 *   storage: { kind: "github", repo: "<wlasciciel>/<nazwa-repo>" }
 * i skonfiguruj Keystatic Cloud (logowanie klienta mailem, free do 3 osób).
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
