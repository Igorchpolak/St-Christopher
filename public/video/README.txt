MIEJSCE NA FILMIK – TŁO HERO I FILM W MODALU
============================================

Jak włączyć film w tle sekcji hero:
1. Wrzuć plik do tego katalogu: public/video/hero.mp4
   (opcjonalnie dodatkowo wersję webm: public/video/hero.webm).
2. Ustaw w src/data/site.ts, w obiekcie hero:
   - videoSrc: "/video/hero.mp4"        -> null = tylko poster (bez wideo)
   - videoSrcWebm: "/video/hero.webm"   -> lub null
   - posterSrc: "/images/hero-poster.svg" (fallback/poster pod wideo)
3. Film w modalu "ZOBACZ FILM": przycisk został usunięty (decyzja klienta –
   film leci w tle hero). Pole hero.filmUrl jest nadal w typach/danych, ale
   na razie nie jest używane przez żaden komponent.

Stan obecny: w katalogu znajduje się plik guadalupe-santuario.mp4 – jest
podłączony jako tło hero (site.hero.videoSrc) i tymczasowo jako film
w modalu (site.hero.filmUrl).

Zalecenia techniczne dla filmu w tle:
- kodek H.264 (mp4) + opcjonalnie VP9/AV1 (webm),
- rozdzielczość 1920x1080 (16:9), bitrate ~4-6 Mb/s,
- rozmiar <= 8 MB, czas 10-20 s, pętla ustawiona tak, by koniec płynnie
  przechodził w początek (atrybut loop),
- BEZ ścieżki dźwiękowej (wideo jest wyciszone w kodzie; plik też nie powinien mieć audio),
- klatka kluczowa co 1-2 s (łatwiejsze przewijanie/pętla),
- docelowo zamiast plików SVG poster w formacie webp/jpg 1920 px, <= 300 KB,
  w public/images (aktualny hero-poster.svg to placeholder).

Zachowanie w kodzie (src/components/sections/HeroVideo.tsx):
- dopóki wideo się nie załaduje, widoczny jest poster, po starcie odtwarzania
  wideo dostaje płynny fade-in (700 ms) nad posterem,
- wideo NIE odtwarza się przy prefers-reduced-motion: reduce
  ani przy navigator.connection.saveData === true (wtedy tylko poster),
- wideo jest dekoracyjne: aria-hidden, bez fokusu, wyciszone, w pętli.
