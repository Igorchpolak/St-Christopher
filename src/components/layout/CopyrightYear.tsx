"use client";

import { useSyncExternalStore } from "react";

/**
 * Rok w stopce. `new Date()` nie może być wywoływane podczas prerenderingu
 * (Next.js 16 blokuje niestabilne wartości), więc rok czytamy wyłącznie
 * po stronie klienta (getSnapshot); na serwerze zwracamy null.
 */
const subscribe = () => () => {};
const getYearSnapshot = () => new Date().getFullYear();
const getYearServerSnapshot = () => null;

export default function CopyrightYear() {
  const year = useSyncExternalStore(subscribe, getYearSnapshot, getYearServerSnapshot);

  return <span suppressHydrationWarning>{year ?? ""}</span>;
}
