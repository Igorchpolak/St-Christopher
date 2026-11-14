import Hero from "@/components/sections/Hero";
import UpcomingTrips from "@/components/sections/UpcomingTrips";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import SectionHeading from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="bg-white py-6">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Logo />
            <div className="rounded bg-navy-900 p-3">
              <Logo variant="light" />
            </div>
          </div>
        </Container>
      </div>

      <UpcomingTrips />

      <section className="py-16">
        <Container className="space-y-10">
          <SectionHeading title="Wybierz kontynent" />
          <SectionHeading as="h3" title="Wybierz w Europie" />

          <div className="flex flex-wrap items-center gap-4">
            <Button href="#">Zobacz nasze pielgrzymki</Button>
            <div className="bg-navy-900">
              <Button href="#" variant="outline-light">
                O nas
              </Button>
            </div>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Mały przycisk</Button>
            <Button disabled>Wyłączony</Button>
            <a href="#kontakt" className="text-sm text-muted underline">
              Link testowy focus-visible
            </a>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="font-heading text-xl text-navy-800">Karta testowa</h3>
            <p className="mt-2 text-sm text-muted">
              Prymitywy UI gotowe – kolejne kroki: dane, sekcje, mapa, karuzele.
            </p>
            <p className="mt-4 text-sm font-semibold text-gold-500">od 2990 PLN</p>
          </div>
        </Container>
      </section>
    </>
  );
}
