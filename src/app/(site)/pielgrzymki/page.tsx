import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AllTripsList from "@/components/sections/AllTripsList";
import Container from "@/components/ui/Container";
import { getAllTrips, getContinents } from "@/lib/api";

/**
 * Podstrona /pielgrzymki – wszystkie wyjazdy z CMS Keystatic.
 * Dane pobierane przez warstwę api.ts ("use cache"), strona prerenderowana
 * przy buildzie; filtrowanie po kontynencie działa po stronie klienta.
 */
export const metadata: Metadata = {
  title: "Wszystkie pielgrzymki",
  description:
    "Pełna lista pielgrzymek i wyjazdów St. Christopher Pilgrimages and Travel – Europa, Ameryka Północna i Południowa, Azja oraz Oceania.",
  alternates: {
    canonical: "/pielgrzymki",
  },
  openGraph: {
    title: "Wszystkie pielgrzymki",
    description:
      "Pełna lista pielgrzymek i wyjazdów St. Christopher Pilgrimages and Travel – Europa, Ameryka Północna i Południowa, Azja oraz Oceania.",
    url: "/pielgrzymki",
  },
};

export default async function TripsPage() {
  const [continents, trips] = await Promise.all([getContinents(), getAllTrips()]);

  return (
    <div className="bg-white pb-16 pt-8 md:pt-12">
      <Container>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-500 hover:text-gold-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Strona główna
        </Link>

        <header className="mt-6 max-w-3xl">
          <h1 className="font-heading text-3xl font-semibold leading-tight text-navy-800 md:text-4xl">
            Wszystkie pielgrzymki
          </h1>
          <p className="mt-4 leading-relaxed text-navy-900/80">
            Wybierz kierunek spośród {trips.length} propozycji – od sanktuariów Europy po
            dalekie wyprawy do Ameryki, Azji i Oceanii. Każdy wyjazd zawiera program dzień po
            dniu oraz informacje o cenie i świadczeniach.
          </p>
        </header>

        <div className="mt-10">
          <AllTripsList continents={continents} trips={trips} />
        </div>

        <div className="mt-14 rounded-lg bg-cream p-6 text-center md:p-8">
          <p className="font-heading text-xl font-semibold text-navy-800">
            Nie znalazłeś swojego kierunku?
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-navy-900/80">
            Organizujemy również wyjazdy na indywidualne zamówienie. Napisz do nas lub
            zadzwoń – chętnie przygotujemy ofertę dopasowaną do Twojej grupy.
          </p>
          <Link
            href="/#kontakt"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-500 hover:text-gold-600"
          >
            Skontaktuj się z nami
          </Link>
        </div>
      </Container>
    </div>
  );
}
