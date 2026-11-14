"use client";

import { useEffect } from "react";

import Container from "@/components/ui/Container";

/**
 * Strona błędu (Client Component) – wymaga interakcji (reset).
 * Renderowana wewnątrz layoutu głównego (Header/Footer są widoczne).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tutaj można podpiąć raportowanie błędów (np. Sentry).
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center bg-cream">
      <Container className="flex flex-col items-center py-16 text-center">
        <p className="font-heading text-6xl font-semibold text-gold-500 md:text-7xl" aria-hidden="true">
          ⚠
        </p>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-navy-800 md:text-3xl">
          Coś poszło nie tak
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted md:text-base">
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie – jeśli problem nie
          ustępuje, skontaktuj się z nami: office@st-christopher.com
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center rounded bg-gold-500 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gold-600"
        >
          Spróbuj ponownie
        </button>
      </Container>
    </div>
  );
}
