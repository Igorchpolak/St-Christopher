"use client";

import { makePage } from "@keystatic/next/ui/app";
import keystaticConfig from "../../../keystatic.config";

/**
 * UI panelu Keystatic — MUSI być komponentem klienckim ("use client"):
 * na serwerze Keystatic zwraca null, a pełny panel renderuje się po
 * hydratacji w przeglądarce.
 */
export default makePage(keystaticConfig);
