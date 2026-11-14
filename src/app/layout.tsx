import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getSiteConfig } from "@/lib/api";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

// TODO: w kolejnym kroku wygenerować statyczny obraz og.jpg (1200×630, PNG/JPG)
// – SVG jako og:image nie jest obsługiwane przez wszystkie sieci społecznościowe.
export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getSiteConfig();
  const ogImage = absoluteUrl(hero.posterSrc);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: "St. Christopher Pilgrimages and Travel – Pielgrzymki i podróże",
      template: "%s | St. Christopher Pilgrimages and Travel",
    },
    description:
      "Pielgrzymki, doświadczanie sacrum i niezapomniane chwile w miejscach o wielkim znaczeniu. Z nami odkryjesz więcej.",
    keywords: [
      "pielgrzymki",
      "podróże",
      "wyjazdy pielgrzymkowe",
      "Rzym",
      "Ziemia Święta",
      "Fatima",
      "Santiago de Compostela",
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: "/",
      siteName: "St. Christopher Pilgrimages and Travel",
      title: "St. Christopher Pilgrimages and Travel – Pielgrzymki i podróże",
      description:
        "Pielgrzymki, doświadczanie sacrum i niezapomniane chwile w miejscach o wielkim znaczeniu. Z nami odkryjesz więcej.",
      images: [{ url: ogImage, width: 1600, height: 900, alt: "Bazylika św. Piotra o zachodzie słońca" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "St. Christopher Pilgrimages and Travel – Pielgrzymki i podróże",
      description:
        "Pielgrzymki, doświadczanie sacrum i niezapomniane chwile w miejscach o wielkim znaczeniu.",
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1730",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pl"
      className={`${sourceSerif.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Przejdź do treści
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
