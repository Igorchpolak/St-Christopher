"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  className?: string;
  /** Wywołanie po kliknięciu (np. zamknięcie menu mobilnego). */
  onNavigate?: () => void;
}

/**
 * Link nawigacji z aktywnym stanem (złote podkreślenie).
 * Linki z kotwicą (#) nigdy nie są aktywne jako ścieżka –
 * aktywny jest wyłącznie dokładny dopasowany href (np. "/" na stronie głównej).
 *
 * Linki kotwicowe na bieżącej stronie (np. "/#kontakt") przewijają płynnie
 * do sekcji zamiast przeładowywać stronę; z innej podstrony działają jak
 * zwykła nawigacja Next (po przejściu przeglądarka trafia w kotwicę).
 */
export default function NavLink({ href, label, className = "", onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const basePath = href.split("#")[0] || "/";
  const isActive = !href.includes("#") && pathname === basePath;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    const [path, hash] = href.split("#");
    if (!hash) return;

    const targetPath = path || "/";
    if (pathname !== targetPath) return; // inna strona – zwykła nawigacja Next

    const target = document.getElementById(hash);
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Po zamknięciu menu mobilnego (blokada scrolla body) przewijamy
    // w następnej klatce, gdy style body zostały już przywrócone.
    window.setTimeout(() => {
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", href);
    }, 0);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      className={`relative flex h-12 items-center text-sm font-medium transition-colors hover:text-gold-600 ${
        isActive
          ? "text-navy-800 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gold-500 after:content-['']"
          : "text-ink"
      } ${className}`}
    >
      {label}
    </Link>
  );
}
