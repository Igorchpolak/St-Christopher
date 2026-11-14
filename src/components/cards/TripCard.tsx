import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";
import { formatDateRange, formatDays, formatPrice } from "@/lib/format";
import type { Trip } from "@/types";

interface TripCardProps {
  trip: Trip;
  /** Pierwsza widoczna karta (nad folded) ładowana z priorytetem (LCP). */
  priority?: boolean;
}

/** Karta wyjazdu – cały link do strony szczegółów /pielgrzymki/{slug}. */
export default function TripCard({ trip, priority = false }: TripCardProps) {
  return (
    <article>
      {/* TODO: strona szczegółów /pielgrzymki/[slug] powstanie w kolejnym kroku. */}
      <Link
        href={`/pielgrzymki/${trip.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg shadow-navy-900/15 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/20"
      >
        <Image
          src={trip.image}
          alt={trip.imageAlt}
          width={640}
          height={400}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, calc(100vw - 2rem)"
          priority={priority}
          className="aspect-[16/10] w-full object-cover"
        />
        <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
          <h3 className="line-clamp-2 font-heading text-lg font-semibold leading-snug text-navy-800">
            {trip.title}
          </h3>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
              {formatDays(trip.durationDays)} • {formatDateRange(trip.startDate, trip.endDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4 shrink-0" aria-hidden="true" />
              {trip.groupSize} os.
            </span>
          </p>
          <p className="mt-auto text-gold-500">
            <span className="text-sm">od </span>
            <span className="text-xl font-bold">{formatPrice(trip.priceFrom)}</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
