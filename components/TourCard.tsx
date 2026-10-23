"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Tour } from "@/lib/tours";
import { ClockIcon, HeartIcon, MapPinIcon } from "./icons";

const FAVORITES_KEY = "cct-favoritos";

function readFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export default function TourCard({ tour }: { tour: Tour }) {
  const [favorite, setFavorite] = useState(false);

  // Sincroniza el estado inicial con los favoritos guardados (solo cliente).
  useEffect(() => {
    setFavorite(readFavorites().includes(tour.id));
  }, [tour.id]);

  const toggleFavorite = () => {
    setFavorite((prev) => {
      const next = !prev;
      const ids = readFavorites().filter((id) => id !== tour.id);
      if (next) ids.push(tour.id);
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
      } catch {
        // Sin almacenamiento disponible: el estado en memoria sigue funcionando.
      }
      return next;
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal/5 transition-shadow hover:shadow-lg hover:shadow-charcoal/10">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
        <Image
          src={tour.image}
          alt={tour.imageAlt}
          fill
          sizes="(max-width: 767px) 360px, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Degradado inferior para legibilidad */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-transparent" />

        {/* Etiqueta de categoría */}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-charcoal shadow-sm">
          {tour.category}
        </span>

        {/* Favorito */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-pressed={favorite}
          aria-label={
            favorite
              ? `Quitar ${tour.name} de favoritos`
              : `Agregar ${tour.name} a favoritos`
          }
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/95 text-ink-soft shadow-sm transition-colors hover:text-primary aria-pressed:text-primary"
        >
          <HeartIcon
            className={`size-4.5 ${favorite ? "fill-primary text-primary" : ""}`}
          />
        </button>

        {/* Nombre y ubicación sobre la imagen */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="flex items-center gap-1 text-xs font-medium text-white/80">
            <MapPinIcon className="size-3.5 shrink-0" />
            <span className="truncate">{tour.location}</span>
          </p>
          {/* Altura fija de dos líneas para que todas las cards midan igual */}
          <h3 className="mt-1 line-clamp-2 min-h-[2.75em] text-base font-bold leading-snug sm:text-lg">
            {tour.name}
          </h3>
        </div>
      </div>

      {/* Duración y precio */}
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <ClockIcon className="size-4 shrink-0 text-ink-faint" />
          <span className="truncate">{tour.duration}</span>
        </p>
        <p className="shrink-0 text-right leading-none">
          <span className="text-[11px] font-medium text-ink-faint">Desde </span>
          <span className="text-lg font-extrabold text-primary-dark">
            ${tour.price}
          </span>
          <span className="mt-1 block text-[11px] font-medium text-ink-faint">
            por persona
          </span>
        </p>
      </div>
    </article>
  );
}
