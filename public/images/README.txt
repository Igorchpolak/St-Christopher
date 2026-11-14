Placeholdery obrazów – St. Christopher Pilgrimages and Travel
==============================================================

Wszystkie obrazy w tym katalogu to LOKALNE pliki SVG wygenerowane przez:

    npm run generate:placeholders

Skrypt scripts/generate-placeholders.ts tworzy:
  - public/images/trips/<slug>.svg   (4:3)  – karty wyjazdów (src/data/trips.ts)
  - public/images/blog/<slug>.svg    (16:10) – karty blogowe (src/data/posts.ts)
  - public/images/hero-poster.svg    (16:9) – poster hero (src/data/site.ts -> hero.posterSrc)
  - public/images/contact-bg.svg     (4:5)  – zdjęcie w sekcji kontaktowej

Jak podmienić placeholdery prawdziwymi zdjęciami?
-------------------------------------------------
Opcja A (najprostsza): zachowaj nazwy plików.
  1. Wrzuć prawdziwe zdjęcia do public/images/trips/, public/images/blog/ itd.,
     zachowując nazwy z src/data/*.ts, ale z innym rozszerzeniem (np. .jpg).
  2. Zmień ścieżki w danych, np. w src/data/trips.ts:
       image: "/images/trips/wlochy-rzym-i-watykan.jpg"
     (SVG i raster mogą współistnieć; next/image obsługuje oba – dla SVG
     włączona jest opcja dangerouslyAllowSVG w next.config.ts z sandbox CSP).

Opcja B: zmień ścieżki w danych.
  1. Wrzuć zdjęcia do dowolnego podkatalogu public/images/ (np. uploads/).
  2. Zaktualizuj pola `image`/`imageAlt` w src/data/trips.ts i src/data/posts.ts.
     Komponenty czytają dane WYŁĄCZNIE przez src/lib/api.ts, więc zmiana
     tylko w plikach danych wystarczy.

Wymagania do zdjęć:
  - Karty wyjazdów: proporcje 4:3 (min. 800x600 px).
  - Karty blogowe: proporcje 16:10 (min. 800x500 px).
  - Poster hero: 16:9 (min. 1600x900 px), ciemny kadr (tekst na nim jest jasny).
  - Sekcja kontaktowa: 4:5 (min. 800x1000 px), zdjęcie krzyża na ścieżce.

Walidacja: npm run validate:data sprawdza, czy wszystkie ścieżki z danych
istnieją w public/ – uruchamiaj ją po każdej zmianie nazw plików.
