import { Suspense } from "react";
import { connection } from "next/server";
import KeystaticApp from "../keystatic-app";

/**
 * Panel Keystatic pod /keystatic (optional catch-all obsługuje też /keystatic).
 *
 * Ścieżka MUSI być /keystatic: Keystatic ma ją zakodowaną na stałe
 * (RouterProvider wycina prefiks /^\/keystatic/ przy liczeniu parametrów
 * i basePath = "/keystatic"), więc montowanie panelu pod innym adresem
 * (np. /admin) daje w panelu „Not found".
 *
 * Panel jest aplikacją kliencką ("use client" w keystatic-app.tsx) —
 * na serwerze renderuje null, pełne UI po hydratacji w przeglądarce.
 * `connection()` wewnątrz <Suspense>: catch-all bez generateStaticParams
 * nie może być prerenderowany przy włączonym cacheComponents.
 *
 * W produkcji panel jest wyłączony (storage "local" na serwerless nie
 * zapisuje trwale — pliki lądują w ulotnym systemie plików funkcji).
 * Treść edytuje się lokalnie (npm run dev → /keystatic) i publikuje
 * przez commit + push do GitHub.
 */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminPanel />
    </Suspense>
  );
}

async function AdminPanel() {
  await connection();

  if (process.env.NODE_ENV === "production") {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "15vh auto 0", padding: "0 24px", color: "#1f2937" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Panel CMS – tylko lokalnie</h1>
        <p style={{ lineHeight: 1.6, marginTop: 12 }}>
          Treść strony edytuje się w panelu uruchomionym lokalnie:
        </p>
        <ol style={{ lineHeight: 1.8, marginTop: 8, paddingLeft: 20 }}>
          <li><code>npm run dev</code></li>
          <li>otwórz <code>http://localhost:3000/keystatic</code></li>
          <li>edytuj wyjazdy (zapisują się jako pliki w <code>src/content/trips/</code>)</li>
          <li>commit i push do GitHub → Netlify odbuduje stronę</li>
        </ol>
        <p style={{ marginTop: 16, fontSize: 14, color: "#6b7280" }}>
          Bezpośrednia edycja na serwerze wymaga trybu „github” Keystatic, który
          jest dotąd dotknięty bugiem <a href="https://github.com/Thinkmill/keystatic/issues/1549" style={{ color: "#2563eb" }}>Thinkmill/keystatic#1549</a>.
        </p>
      </div>
    );
  }

  return <KeystaticApp />;
}
