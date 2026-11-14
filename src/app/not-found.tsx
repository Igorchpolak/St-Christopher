import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

/** Strona 404 w stylu strony (działa wewnątrz layoutu – z Headerem i Footerm). */
export default function NotFound() {
  return (
    <section className="bg-cream">
      <Container className="flex flex-col items-center py-20 text-center md:py-32">
        <p className="font-heading text-7xl font-semibold text-gold-500 md:text-8xl" aria-hidden="true">
          404
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-navy-800 md:text-3xl">
          Nie znaleźliśmy tej strony
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted md:text-base">
          Wygląda na to, że ta droga prowadzi w nieistniejące miejsce. Wróć na
          stronę główną i wybierz kierunek od nowa.
        </p>
        <div className="mt-8">
          <Button href="/">Wróć na stronę główną</Button>
        </div>
      </Container>
    </section>
  );
}
