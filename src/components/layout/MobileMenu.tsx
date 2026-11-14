"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { NavItem, PhoneNumber } from "@/types";
import { Flag } from "./Flags";
import LanguagePill from "./LanguagePill";
import Logo from "@/components/ui/Logo";
import NavLink from "./NavLink";

interface MobileMenuProps {
  nav: NavItem[];
  phones: PhoneNumber[];
}

function MobilePhone({ phone }: { phone: PhoneNumber }) {
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
 * Panel menu mobilnego (poniżej lg): nawigacja, telefony i przełącznik języka.
 * Dostępność: aria-expanded/controls, Esc zamyka, focus na pierwszym linku
 * po otwarciu, powrót focusu na przycisk po zamknięciu, minimalny focus trap,
 * blokada scrolla body, zamknięcie po kliknięciu linku.
 */
export default function MobileMenu({ nav, phones }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    // Focus na pierwszym linku panelu (logo) po otwarciu.
    panel?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();

    // Blokada scrolla body na czas otwarcia panelu.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      // Minimalny focus trap: Tab krąży po elementach panelu.
      if (event.key === "Tab" && panel) {
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        className="inline-flex size-10 items-center justify-center rounded text-navy-800 transition-colors hover:bg-navy-800/5"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu główne"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-white lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
            <Link
              href="/"
              onClick={close}
              aria-label="St. Christopher Pilgrimages and Travel – strona główna"
            >
              <Logo />
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Zamknij menu"
              className="inline-flex size-10 items-center justify-center rounded text-navy-800 transition-colors hover:bg-navy-800/5"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Nawigacja mobilna" className="px-4 py-4 sm:px-6">
            <ul className="flex flex-col divide-y divide-border">
              {nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} label={item.label} className="w-full" onNavigate={close} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-4 border-t border-border px-4 py-6 sm:px-6">
            <div className="flex flex-col gap-3">
              {phones.map((phone) => (
                <MobilePhone key={phone.id} phone={phone} />
              ))}
            </div>
            <LanguagePill />
          </div>
        </div>
      ) : null}
    </>
  );
}
