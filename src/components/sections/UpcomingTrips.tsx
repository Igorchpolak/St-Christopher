import TripCard from "@/components/cards/TripCard";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getUpcomingTrips } from "@/lib/api";

/** Sekcja "Najbliższe wyjazdy" – karuzela wyróżnionych wyjazdów (featured). */
export default async function UpcomingTrips() {
  const trips = await getUpcomingTrips(3);

  return (
    <section
      id="najblizsze-wyjazdy"
      aria-labelledby="najblizsze-wyjazdy-title"
      className="scroll-mt-36 bg-white py-12 md:py-16"
    >
      <Container>
        <SectionHeading
          id="najblizsze-wyjazdy-title"
          title="Najbliższe wyjazdy"
          linkHref="/#pielgrzymki"
          linkLabel="Zobacz wszystkie"
        />
        <div className="mt-8 md:mt-10">
          {trips.length > 0 ? (
            <Carousel ariaLabel="Najbliższe wyjazdy" itemsPerView={{ base: 1, sm: 2, lg: 3 }}>
              {trips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} priority={index === 0} />
              ))}
            </Carousel>
          ) : (
            <p className="text-center text-sm text-muted">
              Brak zaplanowanych wyjazdów – zajrzyj wkrótce.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
