import type { Continent } from "@/types";

/**
 * Kontynenty wyświetlane na mapie świata.
 * `coordinates` to [lng, lat] – pinezki rozłożone tak, aby dobrze
 * czytały się na rzucie equirectangular (world-atlas / d3-geo).
 */
export const continents: Continent[] = [
  {
    id: "north-america",
    name: "Ameryka Północna",
    locative: "Ameryce Północnej",
    coordinates: [-100, 45],
  },
  {
    id: "south-america",
    name: "Ameryka Południowa",
    locative: "Ameryce Południowej",
    coordinates: [-60, -15],
  },
  {
    id: "europe",
    name: "Europa",
    locative: "Europie",
    coordinates: [15, 50],
  },
  {
    id: "africa",
    name: "Afryka",
    locative: "Afryce",
    coordinates: [20, 5],
  },
  {
    id: "asia",
    name: "Azja",
    locative: "Azji",
    coordinates: [90, 45],
  },
  {
    id: "oceania",
    name: "Australia i Oceania",
    locative: "Australii i Oceanii",
    coordinates: [135, -25],
  },
];
