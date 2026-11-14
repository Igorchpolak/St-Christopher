import { ChevronDown, UserRound } from "lucide-react";

/**
 * Przełącznik języka – wyłącznie UI (bez działania).
 * TODO: i18n – podpiąć realną zmianę języka, gdy powstanie wersja EN strony.
 */
export default function LanguagePill({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={false}
      aria-label="Zmień język (obecnie polski) – funkcja w przygotowaniu"
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 transition-colors hover:border-gold-500 hover:text-gold-600 ${className}`}
    >
      <UserRound className="size-3.5" aria-hidden="true" />
      <span>PL</span>
      <ChevronDown className="size-3.5 text-muted" aria-hidden="true" />
    </button>
  );
}
