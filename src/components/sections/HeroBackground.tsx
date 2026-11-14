import Image from "next/image";
import type { HeroConfig } from "@/types";
import HeroVideo from "./HeroVideo";

/**
 * Tło hero: poster (next/image, priority) + opcjonalne wideo + overlay.
 * Kolejność warstw (od spodu): poster → wideo → przyciemnienie → gradient od lewej.
 */
export default function HeroBackground({ hero }: { hero: HeroConfig }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Poster – fallback pod wideo (lub jedyne tło, gdy videoSrc === null). */}
      <Image
        src={hero.posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* MIEJSCE NA FILMIK – plik wrzucamy do public/video i ustawiamy
          site.hero.videoSrc w src/data/site.ts (szczegóły: public/video/README.txt). */}
      {hero.videoSrc ? (
        <HeroVideo src={hero.videoSrc} webmSrc={hero.videoSrcWebm} poster={hero.posterSrc} />
      ) : null}

      {/* Lekkie przyciemnienie całości – czytelność tekstu nad dowolnym filmem. */}
      <div className="absolute inset-0 bg-navy-900/40" />
      {/* Gradient od lewej (navy-900/85 → transparent). */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/85 via-navy-900/45 to-transparent" />
    </div>
  );
}
