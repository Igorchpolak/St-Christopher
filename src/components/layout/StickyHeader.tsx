"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Lepki nagłówek: po przewinięciu dostaje subtelny cień.
 * Scroll listener jest pasywny i ograniczony do jednego klatki na frame (rAF).
 */
export default function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      {children}
    </header>
  );
}
