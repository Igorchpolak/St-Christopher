import Footer from "@/components/layout/Footer";
import HashScroll from "@/components/layout/HashScroll";
import Header from "@/components/layout/Header";

/**
 * Layout stron publicznych (nawigacja, treść, stopka).
 * Oddzielony od layoutu systemowego, aby /admin (Keystatic)
 * renderował się bez nagłówka i stopki serwisu.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Przejdź do treści
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <HashScroll />
    </>
  );
}
