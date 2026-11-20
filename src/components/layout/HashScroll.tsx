"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Przewijanie do kotwicy po nawigacji (np. „Kontakt” z podstrony →
 * strona główna → sekcja #kontakt). Działa też przy wejściu z adresem
 * z kotwicą (np. /#kontakt z linku zewnętrznego).
 *
 * Na bieżącej stronie linki kotwicowe obsługuje NavLink (płynne przewijanie),
 * a tuż po przejściu między podstronami potrzebny jest dodatkowy skok,
 * bo element docelowy pojawia się dopiero po wyrenderowaniu nowej trasy.
 */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    const timer = window.setTimeout(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
