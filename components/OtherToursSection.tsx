import Link from "next/link";
import type { Tour } from "@/lib/tours";
import { ArrowRightIcon } from "./icons";
import TourCard from "./TourCard";

/** "Otras opciones" más accesibles, debajo de la sección del equipo. */
export default function OtherToursSection({ other }: { other: Tour[] }) {
  return (
    <section id="opciones" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
              Otras opciones
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
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
            className="group inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-xs font-bold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
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
  );
}
