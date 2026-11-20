import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BedDouble,
  Bus,
  Compass,
  MapPinned,
  Plane,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import Container from "@/components/ui/Container";

/**
 * Podstrona /o-nas – treść oparta na materiale źródłowym biura
 * (historia od 1997 r., oferta dla grup i osób indywidualnych,
 * atuty, doświadczenie i partnerzy).
 */
export const metadata: Metadata = {
  title: "O nas",
  description:
    "Biuro Pielgrzymkowe St. Christopher – od 1997 roku organizujemy pielgrzymki do sanktuariów Polski, Europy i świata. Sprawdzone programy, doświadczeni piloci i stali partnerzy na sześciu kontynentach.",
  alternates: {
    canonical: "/o-nas",
  },
  openGraph: {
    title: "O nas",
    description:
      "Biuro Pielgrzymkowe St. Christopher – od 1997 roku organizujemy pielgrzymki do sanktuariów Polski, Europy i świata.",
    url: "/o-nas",
  },
};

/** Atuty wymienione w materiale źródłowym biura. */
const advantages = [
  {
    icon: MapPinned,
    title: "Atrakcyjny program",
    description:
      "Trasy pielgrzymkowe obejmują sanktuaria, miejsca historyczne i przyrodnicze – wielokrotnie przejechane i sprawdzone.",
  },
  {
    icon: BedDouble,
    title: "Sprawdzona baza noclegów",
    description:
      "Stali partnerzy w Europie, Ziemi Świętej, USA i Meksyku zapewniają dobrze położone hotele o różnym standardzie.",
  },
  {
    icon: Bus,
    title: "Dobrej jakości transport",
    description:
      "Współpracujemy z przewoźnikami dysponującymi autokarami Mercedes, Setra i Neoplan oraz renomowanymi liniami lotniczymi.",
  },
  {
    icon: UserCheck,
    title: "Fachowa obsługa pilota-przewodnika",
    description:
      "Doświadczeni piloci i przewodnicy opiekują się grupą od zbiórki na lotnisku aż po powrót do domu.",
  },
  {
    icon: ShieldCheck,
    title: "Ubezpieczenie KL + NW + bagaż",
    description:
      "Uczestnicy objęci są ubezpieczeniem kosztów leczenia, następstw nieszczęśliwych wypadków i bagażu.",
  },
];

/** Punkty z sekcji „Wieloletnie doświadczenie”. */
const experiencePoints = [
  "Opracowywanie nowych pielgrzymek i wycieczek do krajów Europy i świata.",
  "Korygowanie istniejących programów pod kątem tras, zwiedzania sanktuariów i miejsc przyrodniczych.",
  "Dostosowanie standardów jakościowych (hotele, przeloty, autokary) wraz z nową kalkulacją ceny.",
];

export default function AboutPage() {
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

        {/* Wstęp */}
        <header className="mt-6 max-w-3xl">
          <h1 className="font-heading text-3xl font-semibold leading-tight text-navy-800 md:text-4xl">
            O nas
          </h1>
          <p className="mt-4 leading-relaxed text-navy-900/80">
            Biuro Pielgrzymkowe St. Christopher istnieje od 1997 roku. Organizujemy i
            obsługujemy ruch pielgrzymkowy do sanktuariów Polski, Europy i świata – od Ziemi
            Świętej, Fatimy, Lourdes i Guadalupe po najdalsze zakątki: Akitę w Japonii,
            Australię z Nową Zelandią, USA i Kanadę, Brazylię, Argentynę, Peru oraz RPA.
          </p>
          <p className="mt-3 leading-relaxed text-navy-900/80">
            Służymy zarówno zorganizowanym grupom pielgrzymkowym, jak i osobom
            indywidualnym, które dołączają do grup w miarę posiadanych miejsc.
          </p>
        </header>

        {/* Liczby */}
        <dl className="mt-10 grid gap-4 rounded-lg bg-cream p-6 sm:grid-cols-3 md:p-8">
          <div className="text-center">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Na rynku od
            </dt>
            <dd className="mt-1 font-heading text-3xl font-bold text-navy-800">1997</dd>
          </div>
          <div className="text-center">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Kierunków na
            </dt>
            <dd className="mt-1 font-heading text-3xl font-bold text-navy-800">
              6 kontynentach
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Formuła wyjazdów
            </dt>
            <dd className="mt-1 font-heading text-3xl font-bold text-navy-800">grupy i osoby</dd>
          </div>
        </dl>

        {/* Dlaczego my? */}
        <section id="dlaczego-my" className="mt-14 scroll-mt-36" aria-labelledby="dlaczego-my-title">
          <h2
            id="dlaczego-my-title"
            className="font-heading text-2xl font-semibold text-navy-800 md:text-3xl"
          >
            Dlaczego my?
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map(({ icon: Icon, title, description }) => (
              <li key={title} className="rounded-lg border border-navy-900/10 p-5 md:p-6">
                <Icon className="size-6 text-gold-500" aria-hidden="true" />
                <h3 className="mt-3 font-heading text-lg font-semibold text-navy-800">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-900/80">{description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Dla grup / indywidualnie */}
        <section className="mt-14 grid gap-8 md:grid-cols-2" aria-label="Oferta dla grup i osób indywidualnych">
          <div className="rounded-lg border border-navy-900/10 p-6 md:p-8">
            <Users className="size-6 text-gold-500" aria-hidden="true" />
            <h2 className="mt-3 font-heading text-xl font-semibold text-navy-800 md:text-2xl">
              Dla grup zorganizowanych
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-900/80">
              Obsługujemy grupy diecezjalne, parafialne, środowiskowe i zakładowe.
              Przygotowujemy programy dostosowane do szczegółowych życzeń organizatorów i
              czuwamy nad sprawnym przebiegiem imprezy na każdym etapie – od rezerwacji po
              powrót grupy.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy-900/80">
              Opracowujemy również zupełnie nowe wyjazdy, korygujemy istniejące trasy oraz
              dobieramy standard hoteli, przelotów i autokarów wraz z kalkulacją ceny.
            </p>
          </div>
          <div className="rounded-lg border border-navy-900/10 p-6 md:p-8">
            <Compass className="size-6 text-gold-500" aria-hidden="true" />
            <h2 className="mt-3 font-heading text-xl font-semibold text-navy-800 md:text-2xl">
              Indywidualnie dla Ciebie
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-900/80">
              Każdy z naszych klientów jest inny – dlatego do każdego podchodzimy
              indywidualnie, wiedząc, że każdy ma inne wymagania i budżet. Aby przygotować
              ofertę, prosimy o:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-navy-900/80">
              <li>
                zarys programu – co chcecie Państwo zobaczyć, zwiedzić i gdzie wypocząć,
              </li>
              <li>
                standard świadczeń noclegowych (hotele od 2* do 5*) i żywieniowych,
              </li>
              <li>rodzaj i standard transportu oraz dodatkowe uwagi,</li>
              <li>
                budżet, w jakim pielgrzymka ma się zamknąć – określimy wtedy, co jest
                możliwe w tej cenie.
              </li>
            </ul>
          </div>
        </section>

        {/* Doświadczenie i partnerzy */}
        <section className="mt-14" aria-labelledby="doswiadczenie-title">
          <h2
            id="doswiadczenie-title"
            className="font-heading text-2xl font-semibold text-navy-800 md:text-3xl"
          >
            Wieloletnie doświadczenie
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="leading-relaxed text-navy-900/80">
                Nasze programy pielgrzymkowe są wielokrotnie przejechane i sprawdzone, ale
                pozostajemy otwarci na nowe propozycje i życzenia organizatorów grup,
                wykraczające poza naszą ofertę:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-navy-900/80">
                {experiencePoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-navy-900/80">
                Oprócz pielgrzymek organizujemy wyjazdy narciarskie (w tym heliski w USA,
                Alasce i Kanadzie), wczasy, wycieczki turystyczne oraz imprezy na zamówienie.
              </p>
            </div>
            <div className="rounded-lg bg-cream p-6 md:p-8">
              <h3 className="font-heading text-lg font-semibold text-navy-800">
                Nasi partnerzy
              </h3>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-navy-900/80">
                <li className="flex gap-3">
                  <Plane className="mt-0.5 size-5 shrink-0 text-gold-500" aria-hidden="true" />
                  <span>
                    Renomowane linie lotnicze, m.in. PLL LOT i Lufthansa.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Bus className="mt-0.5 size-5 shrink-0 text-gold-500" aria-hidden="true" />
                  <span>
                    Przewoźnicy autokarowi z autokarami Mercedes, Setra i Neoplan,
                    spełniającymi normy komfortu i bezpieczeństwa.
                  </span>
                </li>
                <li className="flex gap-3">
                  <BedDouble className="mt-0.5 size-5 shrink-0 text-gold-500" aria-hidden="true" />
                  <span>
                    Stali partnerzy w Europie, Ziemi Świętej, USA i Meksyku oraz na innych
                    kontynentach – sieć dobrze położonych hoteli.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Referencje */}
        <section id="referencje" className="mt-14 scroll-mt-36" aria-labelledby="referencje-title">
          <h2
            id="referencje-title"
            className="font-heading text-2xl font-semibold text-navy-800 md:text-3xl"
          >
            Referencje
          </h2>
          <div className="mt-6 rounded-lg bg-cream p-6 md:p-8">
            <p className="max-w-3xl leading-relaxed text-navy-900/80">
              Najlepiej mówią o nas sami pielgrzymi – wielu z nich wraca do nas kolejny raz
              i poleca nasze wyjazdy swoim bliskim. Chętnie podzielimy się referencjami oraz
              kontaktem do organizatorów wcześniejszych grup. Wystarczy, że napiszesz lub
              zadzwonisz.
            </p>
            <Link
              href="/#kontakt"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-500 hover:text-gold-600"
            >
              Poproś o referencje
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-4 rounded-lg bg-navy-800 p-8 text-center md:p-10">
          <Award className="size-8 text-gold-500" aria-hidden="true" />
          <p className="font-heading text-xl font-semibold text-white md:text-2xl">
            Zaplanujmy razem Twoją pielgrzymkę
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-white/80">
            Opowiedz nam o swoich oczekiwaniach – przygotujemy program dopasowany do Twojej
            grupy i budżetu.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pielgrzymki"
              className="rounded-full bg-gold-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gold-600"
            >
              Zobacz pielgrzymki
            </Link>
            <Link
              href="/#kontakt"
              className="rounded-full border border-white/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-gold-500 hover:text-gold-500"
            >
              Skontaktuj się
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
