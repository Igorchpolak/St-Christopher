"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
 */
export default function NavLink({ href, label, className = "", onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const basePath = href.split("#")[0] || "/";
  const isActive = !href.includes("#") && pathname === basePath;

  return (
    <Link
      href={href}
      onClick={onNavigate}
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
