"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchTours } from "@/lib/store/toursSlice";
import { POPULAR_TOUR_COUNT, toCardTour } from "@/lib/tour-adapters";
import { ArrowRightIcon } from "./icons";
import TourCard from "./TourCard";
import TourSearch, { type SearchFilters } from "./TourSearch";
import ToursSkeleton from "./ToursSkeleton";

/** Buscador superpuesto al hero + sección "Tours más populares" (del backend). */
export default function PopularToursSection() {
  const dispatch = useAppDispatch();
  const { items, listStatus, listError } = useAppSelector(
    (state) => state.tours,
  );
  const [filters, setFilters] = useState<SearchFilters | null>(null);

  const activeTours = items.filter((tour) => tour.active);
  const popular = activeTours
    .slice(0, POPULAR_TOUR_COUNT)
    .map((tour) => toCardTour(tour, true));
  const destinations = [...new Set(popular.map((tour) => tour.destination))];

  const filtered = filters?.destination
    ? popular.filter((tour) => tour.destination === filters.destination)
    : popular;

  const clearFilters = () => setFilters(null);
  const retry = () => dispatch(fetchTours());

  return (
    <>
      {/* Buscador superpuesto entre el hero y el contenido */}
      <TourSearch destinations={destinations} onSearch={setFilters} />

      {/* ── Tours más populares ─────────────────────────────────────── */}
      {/* El padding superior en móvil despeja el buscador superpuesto;
          el resto de secciones comparte el mismo padding vertical. */}
      <section id="tours" className="scroll-mt-24 bg-surface pt-36 pb-12 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div className="max-w-2xl text-start">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
                Top en El Salvador
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
                Tours más populares
              </h2>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-ink-soft sm:text-base">
                Vive las experiencias que todos quieren. Descubre nuestros
                tours mejor valorados.
              </p>
            </div>
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-xs font-bold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Ver todos los tours
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {listStatus === "loading" || listStatus === "idle" ? (
            <ToursSkeleton />
          ) : listStatus === "failed" ? (
            <div className="rounded-2xl border border-dashed border-charcoal/15 bg-white px-6 py-14 text-center">
              <p className="text-base font-extrabold text-charcoal sm:text-lg">
                No pudimos cargar los tours
              </p>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink-soft sm:text-sm">
                {listError ?? "Ocurrió un error inesperado. Inténtalo de nuevo."}
              </p>
              <button
                type="button"
                onClick={retry}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-sky sm:text-sm"
              >
                Reintentar
              </button>
            </div>
          ) : popular.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-charcoal/15 bg-white px-6 py-14 text-center">
              <p className="text-base font-extrabold text-charcoal sm:text-lg">
                Aún no hay tours publicados
              </p>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink-soft sm:text-sm">
                Estamos preparando nuevas experiencias. Vuelve pronto.
              </p>
            </div>
          ) : (
            <>
              {/* Resultado de la búsqueda */}
              {filters && filtered.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-charcoal/5">
                  <p className="text-xs font-semibold text-ink sm:text-sm">
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
                    className="text-xs font-bold text-primary hover:underline sm:text-sm"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}

              {filtered.length > 0 ? (
                <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-5">
                  {filtered.map((tour) => (
                    <li
                      key={tour.id}
                      className="w-[60vw] max-w-[210px] shrink-0 snap-start md:w-auto md:max-w-none"
                    >
                      <TourCard tour={tour} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-dashed border-charcoal/15 bg-white px-6 py-14 text-center">
                  <p className="text-base font-extrabold text-charcoal sm:text-lg">
                    No encontramos tours en “{filters?.destination}”
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink-soft sm:text-sm">
                    Prueba con otro destino o explora todos los tours disponibles
                    en El Salvador.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-sky sm:text-sm"
                  >
                    Ver todos los destinos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
