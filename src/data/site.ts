import type { SiteConfig } from "@/types";

/**
 * Konfiguracja strony (później: backend / CMS).
 * Teksty UI po polsku, struktura zgodna z projektem public/design/homepage.png.
 */
export const site: SiteConfig = {
  name: "St. Christopher Pilgrimages and Travel",
  tagline: [
    "Podróże, które zbliżają do Boga.",
    "Z nami odkryjesz więcej.",
  ],
  nav: [
    { label: "Strona główna", href: "/" },
    { label: "Pielgrzymki", href: "/#pielgrzymki" },
    { label: "Poradnik", href: "/poradnik" },
    { label: "O nas", href: "/o-nas" },
    { label: "Blog", href: "/#blog" },
    { label: "Kontakt", href: "/#kontakt" },
  ],
  phones: [
    {
      id: "phone-us",
      label: "USA & Canada",
      number: "+1 623 282 40 30",
      countryCode: "US",
    },
    {
      // TODO: potwierdzić końcowy numer PL (prefiks +48 zatwierdzony przez klienta, cyfry do weryfikacji).
      id: "phone-pl",
      label: "Poland",
      number: "+48 201 392 42 66",
      countryCode: "PL",
    },
  ],
  email: "office@st-christopher.com",
  address: ["Via della Conciliazione 1,", "00193 Rome, Italy"],
  hero: {
    title: "Podróże, które zbliżają do Boga",
    subtitle: [
      "Pielgrzymki, doświadczanie sacrum, niezapomniane chwile w miejscach o wielkim znaczeniu.",
      "Z nami odkryjesz więcej.",
    ],
    primaryCta: { label: "Zobacz nasze pielgrzymki", href: "/#pielgrzymki" },
    secondaryCta: { label: "O nas", href: "/o-nas" },
    // Tło hero – lokalny plik z public/video (fallback: posterSrc).
    videoSrc: "/video/guadalupe-santuario.mp4",
    videoSrcWebm: null,
    posterSrc: "/images/hero-poster.svg",
    // Film w modalu "Zobacz film" – na razie ten sam plik co tło hero;
    // TODO: podmienić, gdy dotrze docelowy film promocyjny.
    filmUrl: "/video/guadalupe-santuario.mp4",
  },
  footerColumns: [
    {
      title: "Pielgrzymki",
      links: [
        { label: "Europa", href: "/#kontynenty" },
        { label: "Azja", href: "/#kontynenty" },
        { label: "Ameryka Północna", href: "/#kontynenty" },
        { label: "Ameryka Południowa", href: "/#kontynenty" },
        { label: "Afryka", href: "/#kontynenty" },
        { label: "Australia i Oceania", href: "/#kontynenty" },
      ],
    },
    {
      title: "Informacje",
      links: [
        { label: "Pielgrzymki", href: "/#pielgrzymki" },
        { label: "FAQ", href: "/#faq" },
        { label: "Polityka prywatności", href: "/#polityka-prywatnosci" },
        { label: "Warunki korzystania", href: "/#warunki-korzystania" },
        { label: "Kontakt", href: "/#kontakt" },
      ],
    },
    {
      title: "O nas",
      links: [
        { label: "O nas", href: "/o-nas" },
        { label: "Dlaczego my?", href: "/o-nas#dlaczego-my" },
        { label: "Referencje", href: "/o-nas#referencje" },
      ],
    },
    {
      title: "Kontakt",
      links: [
        { label: "+1 623 282 40 30", href: "tel:+16232824030" },
        { label: "+48 201 392 42 66", href: "tel:+482013924266" },
        { label: "office@st-christopher.com", href: "mailto:office@st-christopher.com" },
      ],
    },
  ],
  social: [
    { label: "Facebook", href: "#", icon: "facebook" },
    { label: "YouTube", href: "#", icon: "youtube" },
    { label: "Instagram", href: "#", icon: "instagram" },
  ],
};
