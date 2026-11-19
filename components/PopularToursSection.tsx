"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchTours } from "@/lib/store/toursSlice";
import { POPULAR_TOUR_COUNT, toCardTour } from "@/lib/tour-adapters";
import { ArrowRightIcon } from "./icons";
import TourCard from "./TourCard";
import ToursSkeleton from "./ToursSkeleton";

/** Sección "Tours más populares" (del backend). */
export default function PopularToursSection() {
  const dispatch = useAppDispatch();
  const { items, listStatus, listError } = useAppSelector(
    (state) => state.tours,
  );

  const activeTours = items.filter((tour) => tour.active);
  const popular = activeTours
    .slice(0, POPULAR_TOUR_COUNT)
    .map((tour) => toCardTour(tour, true));

  const retry = () => dispatch(fetchTours());

  return (
    <section id="tours" className="scroll-mt-24 bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div className="max-w-2xl text-start">
            <p className="pill-negro">
              Top en El Salvador
            </p>
            <h2 className="titulo-display mt-4 text-charcoal">
              Tours más populares
            </h2>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-ink-soft sm:text-base">
              Vive las experiencias que todos quieren. Descubre nuestros
              tours mejor valorados.
            </p>
          </div>
          <Link
            href="/tours"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-900/30 px-4 py-2 text-xs font-bold text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
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
              className="btn-negro mt-6"
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
          <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-5">
            {popular.map((tour) => (
              <li
                key={tour.id}
                className="w-[60vw] max-w-[210px] shrink-0 snap-start md:w-auto md:max-w-none"
              >
                <TourCard tour={tour} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
