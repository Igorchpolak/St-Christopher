import { makeRouteHandler } from "@keystatic/next/route-handler";
import keystaticConfig from "../../../../../keystatic.config";

/**
 * API Keystatic: /api/keystatic — ścieżka jest na stałe oczekiwana przez
 * UI Keystatic (login GitHub, update itd.), nie zmieniaj jej.
 * Tryb local: zapis do src/content/ na dysku;
 * tryb github: commity do repo przez Keystatic Cloud.
 */
const { GET, POST } = makeRouteHandler({
  config: keystaticConfig,
});

export { GET, POST };
