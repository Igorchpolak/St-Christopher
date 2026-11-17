export type ContinentId =
  | "north-america"
  | "south-america"
  | "europe"
  | "africa"
  | "asia"
  | "oceania";

export interface Continent {
  id: ContinentId;
  name: string;
  /** Miejscownik, np. "Europie" do nagłówka "Wybierz w Europie". */
  locative: string;
  /** [lng, lat] pinezki na mapie świata. */
  coordinates: [number, number];
}

export type Currency = "PLN" | "USD" | "EUR";

/** Jeden dzień programu wyjazdu (z CMS). */
export interface TripProgramDay {
  /** Numer dnia w programie (1-based). */
  day: number;
  /** Nagłówek dnia, np. "EU-USA, Chicago" (może być pusty). */
  title: string;
  /** Opis dnia. */
  description: string;
}

export interface Trip {
  id: string;
  slug: string;
  title: string;
  continent: ContinentId;
  country: string;
  durationDays: number;
  /** ISO, np. "2027-04-09". Opcjonalne – wyjazd bez ustalonego terminu ("wkrótce"). */
  startDate?: string;
  /** ISO, np. "2027-04-16". */
  endDate?: string;
  /** Liczba osób w grupie ("os." na karcie). Opcjonalne. */
  groupSize?: number;
  /** Cena od (kwota). Opcjonalne – brak = "cena na zapytanie". */
  priceFrom?: number;
  currency: Currency;
  /** Uwagi do ceny, np. "+ przeloty", "cena przy min. 35 uczestnikach". */
  priceNote?: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  /** Krótki opis (SEO / karta wyjazdu). */
  summary?: string;
  /** Program pielgrzymki dzień po dniu (domyślnie pusty). */
  program: TripProgramDay[];
  /** Pozycje "cena zawiera" (domyślnie puste). */
  priceIncludes: string[];
  /** Pozycje "cena nie zawiera" (domyślnie puste). */
  priceExcludes: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** ISO, np. "2025-05-10". */
  date: string;
  image: string;
  imageAlt: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface PhoneNumber {
  id: string;
  /** np. "USA & Canada" */
  label: string;
  number: string;
  countryCode: "US" | "PL";
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface HeroConfig {
  title: string;
  subtitle: string[];
  primaryCta: NavItem;
  secondaryCta: NavItem;
  /** Ścieżka np. /video/hero.mp4 lub null. */
  videoSrc: string | null;
  videoSrcWebm: string | null;
  posterSrc: string;
  /** Film w modalu "Zobacz film". */
  filmUrl: string | null;
}

export interface SiteConfig {
  name: string;
  tagline: string[];
  nav: NavItem[];
  phones: PhoneNumber[];
  email: string;
  address: string[];
  hero: HeroConfig;
  footerColumns: FooterColumn[];
  social: { label: string; href: string; icon: "facebook" | "youtube" | "instagram" }[];
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
