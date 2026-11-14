import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import ContactForm from "@/components/sections/ContactForm";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getSiteConfig } from "@/lib/api";

/**
 * Sekcja "Skontaktuj się z nami" – zdjęcie zanikające w prawo, dane kontaktowe
 * z kółkowymi ikonami (lewa kolumna) i formularz (prawa kolumna).
 */
export default async function ContactSection() {
  const { phones, email, address } = await getSiteConfig();

  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="relative scroll-mt-36 bg-cream">
      {/* Tło-zdjęcie po lewej z gradientem zanikającym w prawo do koloru sekcji (desktop). */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[30%] lg:block">
        <Image
          src="/images/contact-bg.svg"
          alt=""
          fill
          sizes="30vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/80 to-cream" />
      </div>

      <Container className="relative py-12 md:py-16">
        {/* Wersja mobilna zdjęcia – banner nad treścią, zanikający w dół. */}
        <div
          aria-hidden="true"
          className="relative -mx-4 mb-10 h-44 overflow-hidden sm:mx-0 sm:h-60 lg:hidden"
        >
          <Image
            src="/images/contact-bg.svg"
            alt=""
            fill
            sizes="(min-width: 640px) 100vw, calc(100vw - 0px)"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cream" />
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <ul className="space-y-6 lg:pl-40">
            {phones.map((phone) => (
              <li key={phone.id} className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md">
                  <Phone className="size-5 text-navy-800" aria-hidden="true" />
                </span>
                <div>
                  <a
                    href={`tel:${phone.number.replace(/[^+\d]/g, "")}`}
                    className="font-semibold text-navy-800 hover:text-gold-600"
                  >
                    {phone.number}
                  </a>
                  <p className="text-sm text-muted">({phone.label})</p>
                </div>
              </li>
            ))}

            <li className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md">
                <Mail className="size-5 text-navy-800" aria-hidden="true" />
              </span>
              <a
                href={`mailto:${email}`}
                className="font-semibold text-navy-800 hover:text-gold-600"
              >
                {email}
              </a>
            </li>

            <li className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md">
                <MapPin className="size-5 text-navy-800" aria-hidden="true" />
              </span>
              <p className="text-sm text-ink">
                {address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </li>
          </ul>

          <div>
            <SectionHeading
              id="kontakt-title"
              title="Skontaktuj się z nami"
              className="lg:text-left"
            />
            <ContactForm className="mt-6 md:mt-8" />
          </div>
        </div>
      </Container>
    </section>
  );
}
