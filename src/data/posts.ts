import type { BlogPost } from "@/types";

/** Przykładowe wpisy blogowe (później: backend / CMS). */
export const posts: BlogPost[] = [
  {
    id: "post-001",
    slug: "pielgrzymka-wedrowka-ku-pokojowi",
    title: "Pielgrzymka – wędrówka ku pokojowi",
    excerpt: "Dlaczego pielgrzymki są ważne w naszym życiu?",
    date: "2025-05-10",
    image: "/images/blog/pielgrzymka-wedrowka-ku-pokojowi.svg",
    imageAlt: "Pielgrzymi idący drogą o zachodzie słońca",
  },
  {
    id: "post-002",
    slug: "rozaniec-w-podrozy",
    title: "Różaniec w podróży – małe narzędzie, wielka moc",
    excerpt: "Jak modlitwa towarzyszy nam w drodze.",
    date: "2025-04-24",
    image: "/images/blog/rozaniec-w-podrozy.svg",
    imageAlt: "Różaniec zwisający z plecaka pielgrzyma",
  },
  {
    id: "post-003",
    slug: "pielgrzymka-z-pasja-wloskie-sanktuaria",
    title: "Pielgrzymka z pasją: włoskie sanktuaria",
    excerpt: "Najpiękniejsze miejsca duchowej podróży we Włoszech.",
    date: "2025-03-27",
    image: "/images/blog/pielgrzymka-z-pasja-wloskie-sanktuaria.svg",
    imageAlt: "Asyż – bazylika św. Franciszka na tle wzgórza",
  },
  {
    id: "post-004",
    slug: "jak-przygotowac-sie-do-pielgrzymki",
    title: "Jak przygotować się do pierwszej pielgrzymki?",
    excerpt: "Praktyczne wskazówki: pakowanie, kondycja i postawa serca.",
    date: "2025-02-14",
    image: "/images/blog/jak-przygotowac-sie-do-pielgrzymki.svg",
    imageAlt: "Plecak, buty i mapa leżące na drewnianym stole",
  },
  {
    id: "post-005",
    slug: "camino-droga-ktora-zmienia",
    title: "Camino – droga, która zmienia",
    excerpt: "Świadectwa pielgrzymów ze szlaku do Santiago de Compostela.",
    date: "2025-01-20",
    image: "/images/blog/camino-droga-ktora-zmienia.svg",
    imageAlt: "Droga do Santiago ze strzałkami szlaku Camino",
  },
];
