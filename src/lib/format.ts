/**
 * Formatowanie danych UI (polska odmiana, zakresy z en-dash "–").
 * Funkcje czyste – bez zależności od komponentów.
 */

const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"] as const;

/** Parsuje "YYYY-MM-DD" bez wpływu strefy czasowej. */
function parseIsoDate(iso: string): { year: number; month: number; day: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    throw new Error(`Nieprawidłowa data ISO: "${iso}"`);
  }
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

/** formatPrice(2990) -> "2990 PLN" (bez separatorów tysięcy, jak w projekcie). */
export function formatPrice(price: number): string {
  return `${price} PLN`;
}

/** formatDate("2025-05-10") -> "10.05.2025". */
export function formatDate(iso: string): string {
  const { year, month, day } = parseIsoDate(iso);
  return `${day}.${MONTHS[month - 1]}.${year}`;
}

/**
 * formatDateRange("2027-04-09", "2027-04-16") -> "9–16.04.2027".
 * Różne miesiące: formatDateRange("2027-06-28", "2027-07-03") -> "28.06–3.07.2027".
 */
export function formatDateRange(startIso: string, endIso: string): string {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);

  if (start.year !== end.year) {
    throw new Error("formatDateRange obsługuje tylko zakresy w obrębie jednego roku");
  }

  const startMonth = MONTHS[start.month - 1];
  const endMonth = MONTHS[end.month - 1];

  if (start.month === end.month) {
    return `${start.day}–${end.day}.${startMonth}.${start.year}`;
  }
  return `${start.day}.${startMonth}–${end.day}.${endMonth}.${end.year}`;
}

/** formatDays(8) -> "8 dni"; formatDays(1) -> "1 dzień". */
export function formatDays(days: number): string {
  if (!Number.isInteger(days) || days <= 0) {
    throw new Error(`formatDays oczekuje dodatniej liczby całkowitej, otrzymano: ${days}`);
  }
  return days === 1 ? "1 dzień" : `${days} dni`;
}
