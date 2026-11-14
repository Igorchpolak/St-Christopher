import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import { getSiteConfig } from "@/lib/api";
import type { PhoneNumber } from "@/types";
import { Flag } from "./Flags";
import LanguagePill from "./LanguagePill";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";
import StickyHeader from "./StickyHeader";

function PhoneBlock({ phone }: { phone: PhoneNumber }) {
  return (
    <div className="flex items-center gap-2.5">
      <Flag countryCode={phone.countryCode} className="h-4 w-6 shrink-0" />
      <span className="flex flex-col leading-tight">
        <a
          href={`tel:${phone.number.replace(/\s+/g, "")}`}
          className="text-sm font-semibold text-navy-800 transition-colors hover:text-gold-600"
        >
          {phone.number}
        </a>
        <span className="text-xs text-muted">({phone.label})</span>
      </span>
    </div>
  );
}

/**
 * Nagłówek strony (Server Component). Dane pochodzą z getSiteConfig().
 * Desktop (lg+): dwa rzędy – logo/telefony/język oraz nawigacja.
 * Poniżej lg: logo + hamburger z pełnoekranowym menu (MobileMenu).
 */
export default async function Header() {
  const site = await getSiteConfig();

  return (
    <StickyHeader>
      {/* Rząd górny – tylko desktop */}
      <Container className="hidden lg:block">
        <div className="flex items-center justify-between gap-8 py-4">
          <Link
            href="/"
            aria-label="St. Christopher Pilgrimages and Travel – strona główna"
          >
            <Logo />
          </Link>

          <div className="flex items-center gap-10">
            {site.phones.map((phone) => (
              <PhoneBlock key={phone.id} phone={phone} />
            ))}
          </div>

          <LanguagePill />
        </div>
      </Container>

      {/* Rząd nawigacji – tylko desktop */}
      <Container className="hidden lg:block">
        <nav aria-label="Nawigacja główna">
          <ul className="flex items-center justify-between">
            {site.nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      {/* Pasek mobilny / tablet */}
      <Container className="flex items-center justify-between py-3 lg:hidden">
        <Link
          href="/"
          aria-label="St. Christopher Pilgrimages and Travel – strona główna"
        >
          <Logo />
        </Link>
        <MobileMenu nav={site.nav} phones={site.phones} />
      </Container>
    </StickyHeader>
  );
}
