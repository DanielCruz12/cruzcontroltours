"use client";

import Link from "next/link";
import { useState } from "react";
import type { Tour } from "@/lib/tours";
import { ArrowRightIcon } from "./icons";
import TourCard from "./TourCard";
import TourSearch, { type SearchFilters } from "./TourSearch";

export default function ToursSections({
  popular,
  other,
  destinations,
}: {
  popular: Tour[];
  other: Tour[];
  destinations: string[];
}) {
  const [filters, setFilters] = useState<SearchFilters | null>(null);

  const filtered = filters?.destination
    ? popular.filter((tour) => tour.destination === filters.destination)
    : popular;

  const clearFilters = () => setFilters(null);

  return (
    <>
      {/* Buscador superpuesto entre el hero y el contenido */}
      <TourSearch destinations={destinations} onSearch={setFilters} />

      {/* ── Tours más populares ─────────────────────────────────────── */}
      <section id="tours" className="scroll-mt-24 bg-surface py-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
                Top en El Salvador
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
                Tours más populares
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
                Vive las experiencias que todos quieren. Descubre nuestros
                tours mejor valorados.
              </p>
            </div>
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              Ver todos los tours
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Resultado de la búsqueda */}
          {filters && filtered.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-charcoal/5">
              <p className="text-sm font-semibold text-ink">
                <span className="font-extrabold text-primary">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "tour encontrado" : "tours encontrados"}{" "}
                en <span className="text-charcoal">{filters.destination}</span>
                <span className="text-ink-soft">
                  {" · "}
                  {filters.people}{" "}
                  {filters.people === "1" ? "persona" : "personas"}
                </span>
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-bold text-primary hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {filtered.length > 0 ? (
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-4">
              {filtered.map((tour) => (
                <li
                  key={tour.id}
                  className="w-[70vw] max-w-[260px] shrink-0 snap-start md:w-auto md:max-w-none"
                >
                  <TourCard tour={tour} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-charcoal/15 bg-white px-6 py-14 text-center">
              <p className="text-lg font-extrabold text-charcoal">
                No encontramos tours en “{filters?.destination}”
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                Prueba con otro destino o explora todos los tours disponibles
                en El Salvador.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
              >
                Ver todos los destinos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Otras opciones más accesibles ───────────────────────────── */}
      <section id="opciones" className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
                Otras opciones
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
                Encuentra tu próxima aventura
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
                Si buscas algo diferente, también tenemos estas opciones con{" "}
                <span className="font-bold text-primary">
                  precios más accesibles
                </span>{" "}
                para cualquier ocasión.
              </p>
            </div>
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              Ver más tours
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-4">
            {other.map((tour) => (
              <li
                key={tour.id}
                className="w-[70vw] max-w-[260px] shrink-0 snap-start md:w-auto md:max-w-none"
              >
                <TourCard tour={tour} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
