import ContinentExplorer from "@/components/sections/ContinentExplorer";
import { getAllTrips, getContinents } from "@/lib/api";

/**
 * Tymczasowa strona deweloperska dla kroku 6 (mapa + filtrowanie).
 * Zostanie usunięta w kroku 9, gdy sekcja trafi na stronę główną.
 */
export default async function ContinentExplorerDevPage() {
  const [continents, trips] = await Promise.all([getContinents(), getAllTrips()]);

  return (
    <main>
      <ContinentExplorer continents={continents} trips={trips} />
    </main>
  );
}
