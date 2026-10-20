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

const fieldClasses =
  "w-full rounded-lg border border-charcoal/10 bg-surface px-3 py-2.5 text-sm font-semibold text-ink outline-none transition-colors focus:border-primary";

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
      className="relative z-20 mx-auto -mt-16 w-full max-w-6xl px-4 sm:px-6 md:-mt-20"
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-2xl border border-charcoal/5 bg-white p-4 shadow-xl shadow-charcoal/15 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.9fr_auto] lg:items-end lg:gap-0 lg:p-3"
      >
        {/* Destino */}
        <div className="sm:col-span-2 lg:col-span-1 lg:px-4">
          <label
            htmlFor="buscar-destino"
            className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-faint"
          >
            <MapPinIcon className="size-3.5 text-primary" />
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
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
          </div>
        </div>

        {/* Fecha */}
        <div className="lg:border-l lg:border-charcoal/10 lg:px-4">
          <label
            htmlFor="buscar-fecha"
            className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-faint"
          >
            <CalendarIcon className="size-3.5 text-primary" />
            Fecha
          </label>
          <input
            id="buscar-fecha"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={fieldClasses}
          />
        </div>

        {/* Personas */}
        <div className="lg:border-l lg:border-charcoal/10 lg:px-4">
          <label
            htmlFor="buscar-personas"
            className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-faint"
          >
            <UsersIcon className="size-3.5 text-primary" />
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
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
          </div>
        </div>

        {/* Botón */}
        <div className="lg:pl-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-dark px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-charcoal lg:w-auto lg:whitespace-nowrap"
          >
            <SearchIcon className="size-4" />
            Buscar tours
          </button>
        </div>
      </form>
    </section>
  );
}
