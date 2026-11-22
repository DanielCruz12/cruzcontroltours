"use client";

import Link from "next/link";
import { useAppSelector } from "@/lib/store/hooks";
import { toCardTour } from "@/lib/tour-adapters";
import { SITE_CONFIG } from "@/lib/site-config";
import { ArrowRightIcon } from "./icons";
import TourCard from "./TourCard";
import ToursSkeleton from "./ToursSkeleton";

/**
 * "Otras opciones": los tours activos que sobran de "populares".
 * Se oculta si la carga falla (el error con reintento vive en Populares)
 * o si no hay tours de sobra.
 */
export default function OtherToursSection() {
  const { items, listStatus } = useAppSelector((state) => state.tours);

  const other = items
    .filter((tour) => tour.active)
    .slice(SITE_CONFIG.popularToursCount)
    .map((tour) => toCardTour(tour));

  if (
    listStatus === "failed" ||
    (listStatus === "succeeded" && other.length === 0)
  ) {
    return null;
  }

  return (
    <section id="opciones" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="pill-negro">
              Otras opciones
            </p>
            <h2 className="titulo-display mt-4 text-charcoal">
              Encuentra tu próxima aventura
            </h2>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-ink-soft sm:text-base">
              Si buscas algo diferente, también tenemos estas opciones con{" "}
              <span className="font-bold text-primary">
                precios más accesibles
              </span>{" "}
              para cualquier ocasión.
            </p>
          </div>
          <Link
            href="/tours"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-900/30 px-4 py-2 text-xs font-bold text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Ver más tours
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {listStatus === "loading" || listStatus === "idle" ? (
          <ToursSkeleton count={4} />
        ) : (
          <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-5">
            {other.map((tour) => (
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
