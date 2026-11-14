import type { SiteConfig } from "@/types";

/**
 * Wspólne narzędzia SEO (krok 9): bazowy adres strony oraz JSON-LD
 * budowany wyłącznie z danych z src/data/site.ts (przez getSiteConfig()),
 * bez zahardkodowanych duplikatów.
 */

/** Bazowy adres produkcyjny – konfigurowalny przez NEXT_PUBLIC_SITE_URL. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

/** URL absolutny względem bazowego adresu strony. */
export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Dzieli linię "00193 Rome, Italy" na kod pocztowy, miasto i kraj. */
function parseAddressLine(line: string | undefined): {
  postalCode?: string;
  addressLocality?: string;
  addressCountry?: string;
} {
  if (!line) return {};
  const parts = line.split(",").map((part) => part.trim()).filter(Boolean);
  const [first, second] = parts;
  const result: { postalCode?: string; addressLocality?: string; addressCountry?: string } = {};

  if (first) {
    // Formaty: "00193 Rome" (kod + miasto), "00-193" (sam kod), "Rome" (samo miasto).
    const postalAndCity = first.match(/^(\d{2}-?\d{3})\s+(.+)$/);
    if (postalAndCity) {
      result.postalCode = postalAndCity[1];
      result.addressLocality = postalAndCity[2];
    } else if (/^\d{2}-?\d{3}$/.test(first)) {
      result.postalCode = first;
    } else {
      result.addressLocality = first;
    }
  }
  if (second) {
    if (result.addressLocality === undefined) result.addressLocality = second;
    else result.addressCountry = second;
  }
  return result;
}

/** JSON-LD (schema.org/TravelAgency) z danych konfiguracji strony. */
export function buildTravelAgencyJsonLd(site: SiteConfig): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    url: getSiteUrl(),
    description:
      "Pielgrzymki, doświadczanie sacrum i niezapomniane chwile w miejscach o wielkim znaczeniu.",
    email: site.email,
    telephone: site.phones.map((phone) => phone.number.replace(/\s+/g, "")),
    address: {
      "@type": "PostalAddress",
      // Adres jest w danych jako tablica linii ("Ulica,", "Kod, Miasto, Kraj").
      streetAddress: site.address[0]?.replace(/,\s*$/, ""),
      ...parseAddressLine(site.address[1]),
    },
    image: absoluteUrl(site.hero.posterSrc),
    sameAs: site.social
      .filter((item) => item.href.startsWith("http"))
      .map((item) => item.href),
  };
}
