"use client";

import { geoNaturalEarth1, geoPath } from "d3-geo";
import { MapPin, Minus, Plus } from "lucide-react";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import topologyJson from "world-atlas/countries-110m.json";
import type { Continent, ContinentId } from "@/types";

/**
 * Interaktywna mapa świata (bez bibliotek mapowych):
 * topojson-client + world-atlas do geometrii, d3-geo do projekcji.
 * Pinezki to elementy HTML nad <svg> – pozycje liczone w % z transformacji
 * zoom/pan, dzięki czemu mają stały rozmiar i pozostają wyrównane z mapą.
 */

const VIEW_W = 1000;
const VIEW_H = 520;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

interface WorldMapProps {
  continents: Continent[];
  selectedId: ContinentId;
  onSelect: (id: ContinentId) => void;
}

interface ViewState {
  k: number;
  x: number;
  y: number;
}

/** Ogranicza pan do granic mapy – przy k=1 pozycja zawsze (0, 0). */
function clampPan(k: number, x: number, y: number): ViewState {
  return {
    k,
    x: Math.min(0, Math.max(VIEW_W * (1 - k), x)),
    y: Math.min(0, Math.max(VIEW_H * (1 - k), y)),
  };
}

export default function WorldMap({ continents, selectedId, onSelect }: WorldMapProps) {
  const [view, setView] = useState<ViewState>({ k: MIN_ZOOM, x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  // Geometria krajów (bez Antarktydy) i pozycje pinezek – liczone raz.
  const { countryPaths, pins } = useMemo(() => {
    const topology = topologyJson as unknown as Topology;
    const projection = geoNaturalEarth1().fitSize([VIEW_W, VIEW_H], { type: "Sphere" });
    const path = geoPath(projection);

    const collection = feature(
      topology,
      topology.objects.countries as GeometryCollection,
    ) as unknown as FeatureCollection<Geometry>;

    const countryPaths = collection.features
      .filter((f) => (f.properties as { name?: string } | null)?.name !== "Antarctica")
      .map((f, index) => ({ key: index, d: path(f) ?? "" }))
      .filter((p) => p.d.length > 0);

    const pins = continents.map((continent) => {
      const projected = projection(continent.coordinates);
      const x = projected?.[0] ?? 0;
      const y = projected?.[1] ?? 0;
      return { id: continent.id, name: continent.name, x, y };
    });

    return { countryPaths, pins };
  }, [continents]);

  /** Zmienia zoom zachowując środek widoku, z clampem panningu. */
  const zoomBy = useCallback((direction: 1 | -1) => {
    setView((current) => {
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.k + direction * ZOOM_STEP));
      const x = VIEW_W / 2 - ((VIEW_W / 2 - current.x) * k) / current.k;
      const y = VIEW_H / 2 - ((VIEW_H / 2 - current.y) * k) / current.k;
      return clampPan(k, x, y);
    });
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (view.k <= MIN_ZOOM || dragRef.current) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: view.x,
      originY: view.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const scale = VIEW_W / rect.width;
    const x = drag.originX + (event.clientX - drag.startX) * scale;
    const y = drag.originY + (event.clientY - drag.startY) * scale;
    setView((current) => clampPan(current.k, x, y));
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const canZoomIn = view.k < MAX_ZOOM;
  const canZoomOut = view.k > MIN_ZOOM;
  const isZoomed = view.k > MIN_ZOOM;

  const containerClassName = [
    "relative select-none",
    isZoomed ? "cursor-grab active:cursor-grabbing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle: CSSProperties = {
    // Po przybliżeniu przeciąganie mapy palcem; w innym wypadku normalny scroll strony.
    touchAction: isZoomed ? "none" : "pan-y",
  };

  const mapTransform = `translate(${view.x} ${view.y}) scale(${view.k})`;

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Interaktywna mapa świata – wybierz kontynent"
      className={containerClassName}
      style={containerStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block h-auto w-full"
        aria-hidden="true"
        focusable="false"
      >
        <g transform={mapTransform}>
          {countryPaths.map((p) => (
            <path
              key={p.key}
              d={p.d}
              fill="#cfc9bb"
              fillOpacity={0.5}
              stroke="#faf7f2"
              strokeWidth={0.6}
            />
          ))}
        </g>
      </svg>

      {/* Pinezki – HTML nad mapą, stały rozmiar niezależnie od zoomu. */}
      {pins.map((pin) => {
        const left = ((pin.x * view.k + view.x) / VIEW_W) * 100;
        const top = ((pin.y * view.k + view.y) / VIEW_H) * 100;
        const selected = pin.id === selectedId;

        return (
          <button
            key={pin.id}
            type="button"
            onClick={() => onSelect(pin.id)}
            aria-pressed={selected}
            aria-label={pin.name}
            style={{ left: `${left}%`, top: `${top}%` }}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="flex items-center gap-1.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white shadow-md ring-2 ring-white transition-colors group-hover:bg-gold-600">
                <MapPin className="size-4" aria-hidden="true" />
              </span>
              <span
                className={`max-w-32 rounded-full px-2.5 py-1 text-center font-heading text-[11px] leading-tight shadow-md transition-colors sm:text-xs ${
                  selected
                    ? "bg-navy-800 text-white ring-2 ring-gold-500"
                    : "bg-white text-navy-800 group-hover:bg-cream"
                }`}
              >
                {pin.name}
              </span>
            </span>
          </button>
        );
      })}

      {/* Sterowanie zoomem – białe kwadratowe przyciski po prawej, w pionie wyśrodkowane. */}
      <div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2">
        <button
          type="button"
          onClick={() => zoomBy(1)}
          disabled={!canZoomIn}
          aria-label="Przybliż mapę"
          className="flex size-10 items-center justify-center rounded-md bg-white text-navy-800 shadow-md transition-colors hover:bg-cream disabled:cursor-default disabled:opacity-40"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => zoomBy(-1)}
          disabled={!canZoomOut}
          aria-label="Oddal mapę"
          className="flex size-10 items-center justify-center rounded-md bg-white text-navy-800 shadow-md transition-colors hover:bg-cream disabled:cursor-default disabled:opacity-40"
        >
          <Minus className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
