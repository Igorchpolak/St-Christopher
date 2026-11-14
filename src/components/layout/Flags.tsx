/**
 * Minimalistyczne flagi (inline SVG, bez emoji) używane przy numerach telefonu.
 * Flagi są dekoracyjne – otaczający tekst opisuje kraj, więc są aria-hidden.
 */

interface FlagProps {
  className?: string;
}

export function USFlag({ className = "h-4 w-6" }: FlagProps) {
  return (
    <svg
      viewBox="0 0 20 14"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="20" height="14" rx="1.5" fill="#FFFFFF" />
      {[1, 3, 5, 7, 9, 11, 13].map((y) => (
        <rect key={y} y={y} width="20" height="1" fill="#B22234" />
      ))}
      <rect width="9" height="7" fill="#3C3B6E" />
      <rect width="20" height="14" rx="1.5" fill="none" stroke="#E7E2D9" strokeWidth="0.5" />
    </svg>
  );
}

export function PLFlag({ className = "h-4 w-6" }: FlagProps) {
  return (
    <svg
      viewBox="0 0 20 14"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="20" height="7" fill="#FFFFFF" />
      <rect y="7" width="20" height="7" fill="#DC143C" />
      <rect width="20" height="14" rx="1.5" fill="none" stroke="#E7E2D9" strokeWidth="0.5" />
    </svg>
  );
}

export function Flag({
  countryCode,
  className,
}: {
  countryCode: "US" | "PL";
  className?: string;
}) {
  return countryCode === "US" ? <USFlag className={className} /> : <PLFlag className={className} />;
}
