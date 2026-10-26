"use client";

import { useState, type FormEvent } from "react";
import {
  CalendarIcon,
  ChevronDownIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
} from "./icons";

export type SearchFilters = {
  destination: string;
  date: string;
  people: string;
};

// Tarjeta blanca sólida: campos blancos con borde gris claro y foco azul
// profundo; se lee perfectamente sobre cualquier fotograma del video.
const fieldClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-xs font-semibold text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-sky-deep sm:text-sm";

export default function TourSearch({
  destinations,
  onSearch,
}: {
  destinations: string[];
  onSearch: (filters: SearchFilters) => void;
}) {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch({ destination, date, people });
    document
      .getElementById("tours")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="destinos"
      aria-label="Buscar tours"
      className="relative z-20 mx-auto -mt-32 w-full max-w-6xl px-4 sm:px-6 md:-mt-40"
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-4 shadow-xl shadow-charcoal/10 ring-1 ring-ink/5 sm:p-5"
      >
        {/* Título del panel */}
        <p className="text-sm font-extrabold text-ink sm:text-base">
          Encuentra tu tour
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.9fr_auto] lg:items-end">
          {/* Destino */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="buscar-destino"
              className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft"
            >
              <MapPinIcon className="size-3.5 text-sky" />
              Destino
            </label>
            <div className="relative">
              <select
                id="buscar-destino"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className={`${fieldClasses} cursor-pointer appearance-none pr-9`}
              >
                <option value="">Todos los destinos</option>
                {destinations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label
              htmlFor="buscar-fecha"
              className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft"
            >
              <CalendarIcon className="size-3.5 text-sky" />
              Fecha
            </label>
            <input
              id="buscar-fecha"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={`${fieldClasses} [color-scheme:light]`}
            />
          </div>

          {/* Personas */}
          <div>
            <label
              htmlFor="buscar-personas"
              className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft"
            >
              <UsersIcon className="size-3.5 text-sky" />
              Personas
            </label>
            <div className="relative">
              <select
                id="buscar-personas"
                value={people}
                onChange={(event) => setPeople(event.target.value)}
                className={`${fieldClasses} cursor-pointer appearance-none pr-9`}
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map(
                  (count) => (
                    <option key={count} value={String(count)}>
                      {count} {count === 1 ? "persona" : "personas"}
                    </option>
                  ),
                )}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-deep px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sky lg:w-auto lg:whitespace-nowrap"
          >
            <SearchIcon className="size-4" />
            Buscar tours
          </button>
        </div>
      </form>
    </section>
  );
}
