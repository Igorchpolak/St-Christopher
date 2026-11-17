import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Users,
  X,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { getAllTripSlugs, getTripBySlug } from "@/lib/api";
import { formatDays, formatPrice, formatTripTerm } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";

/**
 * Strona szczegółów wyjazdu /pielgrzymki/[slug] – dane z CMS Keystatic
 * (Reader API, "use cache" w api.ts), prerenderowana przy buildzie.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllTripSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) {
    return {};
  }
  const description =
    trip.summary ??
    `${trip.title} – pielgrzymka ${formatDays(trip.durationDays)}. ${
      trip.priceNote ? `Cena: ${trip.priceNote}.` : ""
    }`.trim();

  return {
    title: trip.title,
    description,
    alternates: {
      canonical: `/pielgrzymki/${trip.slug}`,
    },
    openGraph: {
      title: trip.title,
      description,
      url: `/pielgrzymki/${trip.slug}`,
      images: [{ url: absoluteUrl(trip.image), alt: trip.imageAlt }],
    },
  };
}

export default async function TripPage({ params }: PageProps) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) {
    notFound();
  }

  return (
    <div className="bg-white pb-16 pt-8 md:pt-12">
      <Container>
        <Link
          href="/#pielgrzymki"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-500 hover:text-gold-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Wszystkie pielgrzymki
        </Link>

        <article className="mt-6">
          {/* Nagłówek + meta */}
          <header className="grid items-start gap-8 lg:grid-cols-[3fr_2fr]">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                {trip.country}
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight text-navy-800 md:text-4xl">
                {trip.title}
              </h1>
              {trip.summary && (
                <p className="mt-4 max-w-2xl leading-relaxed text-navy-900/80">
                  {trip.summary}
                </p>
              )}
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-navy-900/80">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 shrink-0 text-gold-500" aria-hidden="true" />
                  <dt className="sr-only">Termin</dt>
                  <dd>
                    <strong className="font-semibold text-navy-800">
                      {formatTripTerm(trip.startDate, trip.endDate)}
                    </strong>
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-gold-500" aria-hidden="true" />
                  <dt className="sr-only">Czas trwania</dt>
                  <dd>{formatDays(trip.durationDays)}</dd>
                </div>
                {typeof trip.groupSize === "number" && (
                  <div className="flex items-center gap-2">
                    <Users className="size-4 shrink-0 text-gold-500" aria-hidden="true" />
                    <dt className="sr-only">Wielkość grupy</dt>
                    <dd>Grupa do {trip.groupSize} os.</dd>
                  </div>
                )}
              </dl>
            </div>

            <figure className="overflow-hidden rounded-lg shadow-lg shadow-navy-900/15">
              <Image
                src={trip.image}
                alt={trip.imageAlt}
                width={800}
                height={500}
                priority
                className="aspect-[16/10] w-full object-cover"
              />
            </figure>
          </header>

          {/* Cena */}
          <section className="mt-10 rounded-lg bg-cream p-6 md:p-8" aria-label="Cena wyjazdu">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              {typeof trip.priceFrom === "number" ? (
                <p className="text-gold-500">
                  <span className="text-sm">Cena od </span>
                  <span className="font-heading text-3xl font-bold">
                    {formatPrice(trip.priceFrom, trip.currency)}
                  </span>
                </p>
              ) : (
                <p className="font-heading text-2xl font-bold text-navy-800">
                  Cena na zapytanie
                </p>
              )}
              {trip.priceNote && (
                <p className="text-sm text-muted">{trip.priceNote}</p>
              )}
            </div>
            <Link
              href="/#kontakt"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-500 hover:text-gold-600"
            >
              Zapytaj o ten wyjazd
            </Link>
          </section>

          {/* Program dzień po dniu */}
          {trip.program.length > 0 && (
            <section className="mt-12" aria-labelledby="program-title">
              <h2
                id="program-title"
                className="font-heading text-2xl font-semibold text-navy-800 md:text-3xl"
              >
                Program pielgrzymki dzień po dniu
              </h2>
              <ol className="mt-6 space-y-6">
                {trip.program.map((day) => (
                  <li
                    key={day.day}
                    className="rounded-lg border border-navy-900/10 p-5 md:p-6"
                  >
                    <h3 className="font-heading text-lg font-semibold text-navy-800">
                      <span className="mr-2 text-gold-500">Dzień {day.day}</span>
                      {day.title}
                    </h3>
                    <p className="mt-2 whitespace-pre-line leading-relaxed text-navy-900/80">
                      {day.description}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Cena zawiera / nie zawiera */}
          {(trip.priceIncludes.length > 0 || trip.priceExcludes.length > 0) && (
            <section
              className="mt-12 grid gap-8 md:grid-cols-2"
              aria-label="Co zawiera cena"
            >
              {trip.priceIncludes.length > 0 && (
                <div className="rounded-lg border border-navy-900/10 p-5 md:p-6">
                  <h2 className="font-heading text-xl font-semibold text-navy-800">
                    Cena zawiera
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {trip.priceIncludes.map((item, index) => (
                      <li key={index} className="flex gap-2.5 text-sm leading-relaxed text-navy-900/80">
                        <Check className="mt-0.5 size-4 shrink-0 text-green-600" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {trip.priceExcludes.length > 0 && (
                <div className="rounded-lg border border-navy-900/10 p-5 md:p-6">
                  <h2 className="font-heading text-xl font-semibold text-navy-800">
                    Cena nie zawiera
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {trip.priceExcludes.map((item, index) => (
                      <li key={index} className="flex gap-2.5 text-sm leading-relaxed text-navy-900/80">
                        <X className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </article>
      </Container>
    </div>
  );
}
