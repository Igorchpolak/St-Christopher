import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  Bus,
  FileText,
  HeartPulse,
  Luggage,
  Plane,
  Route,
  ScrollText,
  ShieldCheck,
  Shirt,
  Ship,
  Train,
  UserCheck,
} from "lucide-react";
import Container from "@/components/ui/Container";

/**
 * Podstrona /poradnik – „Poradnik pielgrzyma” oparty na materiale
 * informacyjnym biura: program, pilot, transport, ubezpieczenie,
 * noclegi, dokumenty, ubranie, bagaż, zdrowie i zwyczaje pielgrzymie.
 */
export const metadata: Metadata = {
  title: "Poradnik pielgrzyma",
  description:
    "Praktyczny poradnik przed pielgrzymką: dokumenty, bagaż, ubezpieczenie, transport, noclegi i wyżywienie oraz wskazówki dla pielgrzymów.",
  alternates: {
    canonical: "/poradnik",
  },
  openGraph: {
    title: "Poradnik pielgrzyma",
    description:
      "Praktyczny poradnik przed pielgrzymką: dokumenty, bagaż, ubezpieczenie, transport, noclegi i wyżywienie.",
    url: "/poradnik",
  },
};

/** Sekcje spisu treści (kotwice do sekcji poniżej). */
const toc = [
  { id: "program", label: "Program zwiedzania" },
  { id: "pilot", label: "Pilot" },
  { id: "transport", label: "Transport" },
  { id: "ubezpieczenie", label: "Ubezpieczenie" },
  { id: "noclegi", label: "Noclegi i wyżywienie" },
  { id: "dokumenty", label: "Dokumenty" },
  { id: "ubranie", label: "Ubranie pielgrzyma" },
  { id: "bagaz", label: "Bagaż" },
  { id: "zdrowie", label: "Zdrowie" },
  { id: "wyposazenie", label: "Wyposażenie pielgrzyma" },
  { id: "przykazania", label: "Przykazania pielgrzyma" },
];

export default function GuidePage() {
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
            Poradnik pielgrzyma
          </h1>
          <p className="mt-4 leading-relaxed text-navy-900/80">
            Wszystko, co warto wiedzieć przed wyjazdem: jak wygląda organizacja pielgrzymki,
            co zabrać ze sobą, jak przygotować dokumenty i jak zadbać o zdrowie w drodze.
            Zachęcamy do lektury przed każdym wyjazdem.
          </p>
        </header>

        {/* Spis treści */}
        <nav
          aria-label="Spis treści poradnika"
          className="mt-8 rounded-lg bg-cream p-5 md:p-6"
        >
          <h2 className="font-heading text-lg font-semibold text-navy-800">Spis treści</h2>
          <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-navy-900/80 underline-offset-2 hover:text-gold-600 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 max-w-3xl space-y-12">
          {/* Program zwiedzania */}
          <section id="program" className="scroll-mt-36" aria-labelledby="program-title">
            <h2
              id="program-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <Route className="size-6 text-gold-500" aria-hidden="true" />
              Program zwiedzania
            </h2>
            <p className="mt-3 leading-relaxed text-navy-900/80">
              Program zwiedzania jest dostosowany do norm obowiązujących w turystyce, a jego
              realizacja wymaga od uczestników dyscypliny i współpracy z pilotem. Nie
              wszystkie programy obejmują w świadczeniach koszty zwiedzania – dlatego przed
              wyjazdem warto uważnie zapoznać się z programem i listą świadczeń w cenie.
            </p>
          </section>

          {/* Pilot */}
          <section id="pilot" className="scroll-mt-36" aria-labelledby="pilot-title">
            <h2
              id="pilot-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <UserCheck className="size-6 text-gold-500" aria-hidden="true" />
              Pilot
            </h2>
            <p className="mt-3 leading-relaxed text-navy-900/80">
              Grupie towarzyszy i przewodzi profesjonalny, licencjonowany pilot. Jest
              przedstawicielem biura, realizuje program pielgrzymki i służy grupie wiedzą
              oraz pomocą przez cały czas trwania wyjazdu.
            </p>
          </section>

          {/* Transport */}
          <section id="transport" className="scroll-mt-36" aria-labelledby="transport-title">
            <h2
              id="transport-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <Bus className="size-6 text-gold-500" aria-hidden="true" />
              Transport
            </h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-navy-800">
                  <Bus className="size-5 text-gold-500" aria-hidden="true" />
                  Autobusem
                </h3>
                <p className="mt-2 leading-relaxed text-navy-900/80">
                  Standard określa program. Autobus komfortowy wyposażony jest w lotnicze
                  siedzenia, klimatyzację, mikrofon, radio, CD/Video oraz barek (napoje
                  płatne we własnym zakresie) i WC. Autobus turystyczny ma lotnicze
                  siedzenia i mikrofon.
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy-900/80">
                  <li>
                    W dniu wyjazdu zajmujemy miejsca po sprawdzeniu listy uczestników przez
                    pilota.
                  </li>
                  <li>Dobór miejsc w autokarze jest dowolny; na życzenie grupy możliwa jest rotacja.</li>
                  <li>
                    Prosimy o pozostawienie pierwszego rzędu dla obsługi pielgrzymki: pilota
                    i kapłana.
                  </li>
                  <li>
                    Prosimy o zachowanie czystości podczas jazdy – przy fotelach znajdują się
                    worki na śmieci.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-navy-800">
                  <Plane className="size-5 text-gold-500" aria-hidden="true" />
                  Samolotem
                </h3>
                <p className="mt-2 leading-relaxed text-navy-900/80">
                  Linie lotnicze przydzielają miejsca na podstawie biletu – zgodnie z
                  życzeniem pasażera na odprawie, zwykle 2 godziny przed odlotem (wyjątek:
                  Izrael – 3 godziny). Bagaż główny to najczęściej do 20 kg, a podręczny
                  5–8 kg; w bagażu podręcznym nie wolno przewozić kosmetyków, płynów ani
                  ostrych przedmiotów.
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-navy-800">
                  <Ship className="size-5 text-gold-500" aria-hidden="true" />
                  Promem
                </h3>
                <p className="mt-2 leading-relaxed text-navy-900/80">
                  Miejsca lotnicze bez miejscówek. Standard kabin 2-, 3- i 4-osobowych
                  określa program. Biuro zastrzega sobie prawo przydziału kabin.
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-navy-800">
                  <Train className="size-5 text-gold-500" aria-hidden="true" />
                  Koleją
                </h3>
                <p className="mt-2 leading-relaxed text-navy-900/80">
                  Standard miejsc w pociągu określa program. Biuro zastrzega sobie prawo
                  przydziału miejscówek, przedziałów i kuszetek.
                </p>
              </div>
            </div>
          </section>

          {/* Ubezpieczenie */}
          <section id="ubezpieczenie" className="scroll-mt-36" aria-labelledby="ubezpieczenie-title">
            <h2
              id="ubezpieczenie-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <ShieldCheck className="size-6 text-gold-500" aria-hidden="true" />
              Ubezpieczenie
            </h2>
            <p className="mt-3 leading-relaxed text-navy-900/80">
              Każdy uczestnik pielgrzymki jest ubezpieczony od kosztów leczenia (KL) oraz
              następstw nieszczęśliwych wypadków (NNW) – na kwotę 10 000 EUR w Europie lub
              25 000 EUR poza Europą – a także w zakresie OC, zgodnie z obowiązującą ustawą o
              turystyce.
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy-900/80">
              <li>Nie każdy pakiet obejmuje ubezpieczenie bagażu – informacja znajduje się w programie.</li>
              <li>
                Polecamy dodatkowe ubezpieczenie od kosztów rezygnacji z podróży – zazwyczaj
                około 2% ceny imprezy.
              </li>
            </ul>
          </section>

          {/* Noclegi i wyżywienie */}
          <section id="noclegi" className="scroll-mt-36" aria-labelledby="noclegi-title">
            <h2
              id="noclegi-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <BedDouble className="size-6 text-gold-500" aria-hidden="true" />
              Noclegi i wyżywienie
            </h2>
            <p className="mt-3 leading-relaxed text-navy-900/80">
              Staramy się zapewnić pielgrzymom godziwe warunki noclegowe i żywieniowe w
              przystępnej cenie. HP (półpension) oznacza:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy-900/80">
              <li>nocleg w pokoju 2–3-osobowym z łazienką (w miarę możliwości) w hotelu lub Domu Pielgrzyma,</li>
              <li>śniadanie, zazwyczaj kontynentalne,</li>
              <li>gorącą, trzydaniową kolację (przystawka, danie główne, deser).</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-navy-900/80">
              Przy trasach, na których każdego dnia nocleg jest w innym hotelu, przydział
              pokoi dostosowujemy do możliwości obiektu, zachowując zasadę intymności
              małżeńskiej i rodzinnej. Przydziału pokoi dokonuje pilot.
            </p>
          </section>

          {/* Dokumenty */}
          <section id="dokumenty" className="scroll-mt-36" aria-labelledby="dokumenty-title">
            <h2
              id="dokumenty-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <FileText className="size-6 text-gold-500" aria-hidden="true" />
              Dokumenty
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy-900/80">
              <li>
                Poza granicami kraju dokumentem tożsamości jest paszport. W Unii Europejskiej
                i Szwajcarii wystarczy nowy dowód osobisty.
              </li>
              <li>
                Ważność paszportu powinna wynosić co najmniej 6 miesięcy od daty powrotu –
                sugerujemy jednak rok.
              </li>
              <li>
                W przypadku obowiązku wizowania organizator informuje uczestników o
                potrzebnych dodatkowych dokumentach i wymogach.
              </li>
              <li>
                Obcokrajowcy winni zapoznać się przed wyjazdem z obowiązującymi przepisami
                celno-dewizowymi; konieczne wizy organizują we własnym kraju we własnym
                zakresie.
              </li>
              <li>
                Paszport i pieniądze należy starannie zabezpieczyć przed kradzieżą – zalecamy
                nie przechowywać ich w tym samym miejscu.
              </li>
              <li>
                Osoby poniżej 18 roku życia powinny jechać pod opieką osoby dorosłej lub
                dostarczyć do biura zaświadczenie o zgodzie rodziców i pełnej prawnej
                odpowiedzialności.
              </li>
            </ul>
          </section>

          {/* Ubranie */}
          <section id="ubranie" className="scroll-mt-36" aria-labelledby="ubranie-title">
            <h2
              id="ubranie-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <Shirt className="size-6 text-gold-500" aria-hidden="true" />
              Ubranie pielgrzyma
            </h2>
            <p className="mt-3 leading-relaxed text-navy-900/80">
              Na pielgrzymkę zabieramy rzeczy niezbędne, praktyczne i wygodne. Prosimy zabrać:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy-900/80">
              <li>odpowiednią i wygodną odzież, najlepiej bawełnianą,</li>
              <li>odzież chroniącą przed deszczem i słońcem (parasol, nakrycie głowy, okulary słoneczne),</li>
              <li>strój plażowy,</li>
              <li>wygodne obuwie, najlepiej na niskim obcasie, obuwie zastępcze oraz pantofle,</li>
              <li>latarkę kieszonkową,</li>
              <li>aparat fotograficzny lub kamerę.</li>
            </ul>
            <p className="mt-3 rounded-lg bg-cream p-4 text-sm leading-relaxed text-navy-900/80">
              Uwaga! Do miejsc sakralnych należy się odpowiednio ubrać – niewskazane są
              krótkie spodenki i bluzki z odkrytymi ramionami.
            </p>
          </section>

          {/* Bagaż */}
          <section id="bagaz" className="scroll-mt-36" aria-labelledby="bagaz-title">
            <h2
              id="bagaz-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <Luggage className="size-6 text-gold-500" aria-hidden="true" />
              Bagaż
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy-900/80">
              <li>
                Rzeczy najlepiej spakować w jednej dużej torbie lub walizce na kółeczkach,
                przechowywanej w dolnym luku autokaru.
              </li>
              <li>Ciężar bagażu nie powinien przekraczać 20 kg.</li>
              <li>Prosimy o oznaczenie bagażu wizytówką z adresem.</li>
              <li>
                Rzeczy podręczne polecamy spakować w plecaku lub torebce zabieranych na
                pokład autokaru/samolotu.
              </li>
              <li>
                Biuro nie odpowiada za rzeczy wartościowe – zabieramy je na własną
                odpowiedzialność.
              </li>
            </ul>
          </section>

          {/* Zdrowie */}
          <section id="zdrowie" className="scroll-mt-36" aria-labelledby="zdrowie-title">
            <h2
              id="zdrowie-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <HeartPulse className="size-6 text-gold-500" aria-hidden="true" />
              Zdrowie
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy-900/80">
              <li>Apteczka podróżna powinna zawierać podstawowe leki i środki opatrunkowe.</li>
              <li>
                Osoby chore powinny zawiadomić biuro oraz pilota przed wyjazdem o swoich
                dolegliwościach i zabrać potrzebne lekarstwa.
              </li>
              <li>
                Osoby powyżej 65 roku życia powinny przed wyjazdem skonsultować się z
                lekarzem, by upewnić się, że nie ma przeciwwskazań zdrowotnych.
              </li>
            </ul>
          </section>

          {/* Wyposażenie pielgrzyma */}
          <section id="wyposazenie" className="scroll-mt-36" aria-labelledby="wyposazenie-title">
            <h2
              id="wyposazenie-title"
              className="flex items-center gap-2 font-heading text-2xl font-semibold text-navy-800"
            >
              <ScrollText className="size-6 text-gold-500" aria-hidden="true" />
              Wyposażenie pielgrzyma
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy-900/80">
              <li>różaniec,</li>
              <li>śpiewnik i modlitewnik,</li>
              <li>serce i uśmiech dla bliźniego.</li>
            </ul>
          </section>

          {/* Przykazania pielgrzyma */}
          <section id="przykazania" className="scroll-mt-36" aria-labelledby="przykazania-title">
            <h2
              id="przykazania-title"
              className="font-heading text-2xl font-semibold text-navy-800"
            >
              Przykazania pielgrzyma
            </h2>
            <blockquote className="mt-4 border-l-4 border-gold-500 pl-4 font-heading text-lg italic text-navy-800">
              „Miłuj bliźniego swego jak siebie samego”
            </blockquote>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-navy-900/80">
              <li>Niech Ciało Chrystusa stanie się Twoim pokarmem duchowym.</li>
              <li>Niech Twoja modlitwa będzie nieustannym dziękczynieniem i uwielbieniem Boga i Maryi.</li>
              <li>Miej otwarte serce dla każdego.</li>
              <li>Miej uśmiech i dobry humor w każdej sytuacji.</li>
              <li>Powtarzaj każdemu i wielokrotnie: „dobrze, że jesteś”.</li>
              <li>Udzielaj zawsze i każdemu pomocy.</li>
              <li>Nie zakłócaj ciszy nocnej.</li>
              <li>Miej zaufanie do pilota grupy, dostosowując się do jego poleceń.</li>
              <li>Przestrzegaj dyscypliny i punktualności w grupie.</li>
              <li>Nigdy nie oddalaj się samodzielnie od grupy bez zgłoszenia tego pilotowi.</li>
            </ul>
          </section>
        </div>
      </Container>
    </div>
  );
}
