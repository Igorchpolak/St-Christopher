"use client";

import { Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface HeroFilmProps {
  /** Ścieżka do filmu otwartego w modalu, np. /video/film.mp4. */
  filmUrl: string;
}

/**
 * Okrągły przycisk "Zobacz film" w hero (Client Component) z modalem
 * opartym o natywny <dialog> (darmowy focus-trap i zamknięcie Escape).
 * Wideo montowane dopiero po otwarciu modala – nic nie ładuje się wcześniej.
 */
export default function HeroFilm({ filmUrl }: HeroFilmProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();

    // Escape / systemowe zamknięcie dialogu → synchronizacja stanu.
    dialog.addEventListener("close", close);
    return () => dialog.removeEventListener("close", close);
  }, [open, close]);

  // Klik w tło (poza treścią modala) zamyka okno.
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Zobacz film"
        className="group absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-14"
      >
        <span className="flex size-14 items-center justify-center rounded-full border border-white/60 bg-white/15 text-white shadow-md backdrop-blur-sm transition-colors group-hover:bg-white/30 md:size-16">
          <Play className="size-6 translate-x-0.5" aria-hidden="true" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white">
          Zobacz film
        </span>
      </button>

      {open ? (
        <dialog
          ref={dialogRef}
          onClick={handleBackdropClick}
          aria-label="Film promocyjny"
          className="fixed inset-0 z-[70] size-auto max-h-[90vh] max-w-[90vw] bg-navy-900 p-0 backdrop:bg-black/70"
        >
          <div className="relative">
            <video
              src={filmUrl}
              controls
              autoPlay
              playsInline
              className="block max-h-[85vh] w-[min(90vw,960px)] bg-black"
            >
              Twoja przeglądarka nie obsługuje odtwarzania wideo.
            </video>
            <button
              type="button"
              onClick={close}
              autoFocus
              aria-label="Zamknij film"
              className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white text-navy-800 shadow-md transition-colors hover:bg-cream"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
