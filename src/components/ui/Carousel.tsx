"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/**
 * Generyczna karuzela oparta wyłącznie o CSS scroll-snap (bez bibliotek).
 * Szerokości elementów liczone są w CSS ze zmiennych --items-* (bez JS),
 * a JS odpowiada tylko za przyciski, klawiaturę i wykrywanie przepełnienia.
 */

export interface CarouselItemsPerView {
  /** Liczba widocznych elementów na małych ekranach (< sm). */
  base: number;
  /** Liczba widocznych elementów od breakpointu sm. */
  sm: number;
  /** Liczba widocznych elementów od breakpointu lg. */
  lg: number;
  /** Opcjonalna liczba widocznych elementów od breakpointu xl. */
  xl?: number;
}

interface CarouselProps {
  /** Dostępna nazwa karuzeli (aria-label regionu). */
  ariaLabel: string;
  itemsPerView: CarouselItemsPerView;
  /** Odstęp między elementami jako długość CSS, np. "1.5rem". */
  gap?: string;
  /** Zmiana wartości przewija karuzelę do początku (np. zmiana kontynentu). */
  resetKey?: string | number;
  className?: string;
  children: ReactNode;
}

/** Tolerancja w px przy porównywaniu pozycji przewinięcia (zaokrąglenia przeglądarki). */
const SCROLL_EPSILON = 1;

/** Arrows przesunięte poza kartę – ale zawsze w granicach paddingu kontenera (bez poziomego scrolla). */
const arrowButtonClasses =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full " +
  "bg-white text-navy-800 shadow-md transition-colors hover:bg-cream " +
  "disabled:cursor-default disabled:opacity-40";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Carousel({
  ariaLabel,
  itemsPerView,
  gap = "1.5rem",
  resetKey,
  className,
  children,
}: CarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(true);

  /** Przelicza stan przycisków na podstawie pozycji przewinięcia listy. */
  const update = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const maxScrollLeft = list.scrollWidth - list.clientWidth;
    setCanScrollLeft(list.scrollLeft > SCROLL_EPSILON);
    setCanScrollRight(list.scrollLeft < maxScrollLeft - SCROLL_EPSILON);
    setHasOverflow(maxScrollLeft > SCROLL_EPSILON);
  }, []);

  // Po każdym renderze (np. zmiana liczby elementów) – setState z tą samą
  // wartością nie powoduje ponownego renderu, więc nie powstaje pętla.
  useEffect(() => {
    update();
  });

  // Zmiany rozmiaru listy (breakpointy, okno przeglądarki).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [update]);

  // resetKey: przewinięcie do początku (behavior respektuje prefers-reduced-motion).
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollLeft === 0) return;
    list.scrollTo({ left: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [resetKey]);

  /** Przewija o jedną "stronę" (szerokość widocznej części) w danym kierunku. */
  const scrollByPage = useCallback((direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({
      left: direction * list.clientWidth,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByPage(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByPage(1);
    }
  };

  const listStyle = {
    "--carousel-gap": gap,
    "--items-base": String(itemsPerView.base),
    "--items-sm": String(itemsPerView.sm),
    "--items-lg": String(itemsPerView.lg),
    ...(itemsPerView.xl !== undefined ? { "--items-xl": String(itemsPerView.xl) } : null),
  } as CSSProperties;

  const itemClassName =
    "flex flex-none snap-start " +
    "w-[calc((100%_-_var(--carousel-gap)*(var(--items-base)_-_1))/var(--items-base))] " +
    "sm:w-[calc((100%_-_var(--carousel-gap)*(var(--items-sm)_-_1))/var(--items-sm))] " +
    "lg:w-[calc((100%_-_var(--carousel-gap)*(var(--items-lg)_-_1))/var(--items-lg))]" +
    (itemsPerView.xl !== undefined
      ? " xl:w-[calc((100%_-_var(--carousel-gap)*(var(--items-xl)_-_1))/var(--items-xl))]"
      : "");

  return (
    <div
      role="region"
      aria-roledescription="karuzela"
      aria-label={ariaLabel}
      className={className ? `relative ${className}` : "relative"}
    >
      {hasOverflow && (
        <>
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollLeft}
            aria-label="Poprzednie"
            className={`${arrowButtonClasses} left-1 sm:-left-4 lg:-left-6`}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollRight}
            aria-label="Następne"
            className={`${arrowButtonClasses} right-1 sm:-right-4 lg:-right-6`}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </>
      )}

      <ul
        ref={listRef}
        tabIndex={0}
        onScroll={update}
        onKeyDown={handleKeyDown}
        style={listStyle}
        className="flex -my-3 list-none gap-[var(--carousel-gap)] snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.toArray(children).map((child, index) => (
          <li key={index} className={itemClassName}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}
