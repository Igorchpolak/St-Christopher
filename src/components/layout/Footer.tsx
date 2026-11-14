import Container from "@/components/ui/Container";
import CopyrightYear from "./CopyrightYear";
import Logo from "@/components/ui/Logo";
import { getSiteConfig } from "@/lib/api";
import type { SiteConfig } from "@/types";

type SocialIconName = SiteConfig["social"][number]["icon"];

/**
 * Ikony marek jako inline SVG (lucide-react nie eksportuje ikon marek).
 * Kształty wzorowane na oficjalnych uproszczonych logotypach.
 */
function SocialIcon({ name, className }: { name: SocialIconName; className?: string }) {
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12"
        />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77A26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81M9.75 15.02V8.98L15.5 12z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <rect
        width="18"
        height="18"
        x="3"
        y="3"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" />
    </svg>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="mt-[7px] size-1.5 shrink-0 rounded-full bg-gold-500"
        aria-hidden="true"
      />
      <a
        href={href}
        className="text-sm leading-snug text-white/80 transition-colors hover:text-gold-500"
      >
        {label}
      </a>
    </li>
  );
}

/**
 * Stopka (Server Component). Dane pochodzą z getSiteConfig().
 * Siatka: 1 kolumna (mobile) → 2 (md) → 5 (lg): kolumna marki + 4 kolumny linków.
 */
export default async function Footer() {
  const site = await getSiteConfig();

  return (
    <footer className="bg-navy-800 text-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Kolumna marki */}
          <div className="flex flex-col gap-5">
            <Logo variant="light" />
            <p className="max-w-[26ch] text-sm leading-relaxed text-white/80">
              {site.tagline.join(" ")}
            </p>
            <ul className="flex items-center gap-3" aria-label="Media społecznościowe">
              {site.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-label={item.label}
                    className="inline-flex size-9 items-center justify-center rounded-full bg-gold-500 text-navy-900 transition-colors hover:bg-gold-600 hover:text-white"
                  >
                    <SocialIcon name={item.icon} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolumny linków (w tym Kontakt z tel:/mailto:) */}
          {site.footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
              <h2 className="font-heading text-base font-semibold text-white">
                {column.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <FooterLink key={link.label} label={link.label} href={link.href} />
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs text-white/70">
          <p>
            © <CopyrightYear /> {site.name}. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </Container>
    </footer>
  );
}
