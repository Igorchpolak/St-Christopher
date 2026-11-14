"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  /** Ścieżka do pliku mp4 w public/video, np. /video/hero.mp4. */
  src: string;
  /** Opcjonalny plik webm (lepsza kompresja w Chrome/Firefox). */
  webmSrc: string | null;
  /** Poster widoczny pod spodem, dopóki wideo się nie załaduje. */
  poster: string;
}

/**
 * Wideo w tle hero (Client Component).
 * Poster pozostaje pod spodem jako fallback; po rozpoczęciu odtwarzania
 * wideo dostaje płynny fade-in nad posterem. Odtwarzanie jest wyłączone przy
 * prefers-reduced-motion oraz przy navigator.connection.saveData === true
 * (wtedy wideo jest ukrywane w DOM i widoczny jest wyłącznie poster).
 */
export default function HeroVideo({ src, webmSrc, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // reduced motion / oszczędzanie danych → tylko poster (ukryj wideo w DOM)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (reducedMotion || connection?.saveData) {
      video.pause();
      video.style.display = "none";
      return;
    }

    const onPlaying = () => setVisible(true);
    video.addEventListener("playing", onPlaying);
    // atrybut autoPlay + jawnie play() (niektóre przeglądarki wymagają ponowienia);
    // nieudany autoplay → wideo pozostaje przezroczyste, widać poster
    void video.play().catch(() => undefined);

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      tabIndex={-1}
      aria-hidden="true"
    >
      {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
      <source src={src} type="video/mp4" />
    </video>
  );
}
