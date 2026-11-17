import { Suspense } from "react";
import { connection } from "next/server";
import KeystaticApp from "../keystatic-app";

/**
 * Panel Keystatic pod /admin (optional catch-all obsługuje też /admin samą).
 *
 * Strona jest celowo dynamiczna: `connection()` wewnątrz <Suspense> wyłącza
 * prerender treści (cacheComponents), co pozwala też na runtime metadane
 * trasy z dynamicznym segmentem. Panel jest aplikacją kliencką ("use client"
 * w keystatic-app.tsx) — na serwerze renderuje null, pełne UI po hydratacji.
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
  return <KeystaticApp />;
}
