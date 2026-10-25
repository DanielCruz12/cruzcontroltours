"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FocusEvent } from "react";
import { team } from "@/lib/team";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

// Tiempos (milisegundos)
const AUTOPLAY_MS = 6_000; // cambio automático entre miembros
const FADE_MS = 500; // duración del fundido cruzado

/** Iniciales (máx. 2 palabras) para el avatar cuando no hay foto del miembro. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Botón circular semitransparente con flecha (común a todos los tamaños). */
function ArrowButton({
  label,
  onClick,
  side,
}: {
  label: string;
  onClick: () => void;
  side: "prev" | "next";
}) {
  const ArrowIcon = side === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full bg-white/15 text-white ring-1 ring-sky-light/60 backdrop-blur-sm transition-colors hover:bg-sky-light/30"
    >
      <ArrowIcon className="size-5" />
    </button>
  );
}

/** Franja "Nuestro equipo" con fundidos cruzados (sin carrusel lateral). */
export default function TeamSection() {
  const [active, setActive] = useState(0);
  // true mientras el cursor o el foco están dentro de la sección.
  const [paused, setPaused] = useState(false);
  const count = team.length;

  /** Salto circular: permite "anterior" desde el primero sin salirse. */
  const goTo = (index: number) => {
    setActive(((index % count) + count) % count);
  };

  // ── Cambio automático ──────────────────────────────────────────────
  // Cada AUTOPLAY_MS avanza un miembro. El temporizador se reinicia con
  // cada cambio de `active` (incluida la navegación manual) y no se
  // programa mientras está `paused` ni con prefers-reduced-motion (en ese
  // caso el usuario navega manualmente y el cambio es instantáneo: el CSS
  // global ya anula la duración de las transiciones).
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, count]);

  // Solo se reanuda el autoplay cuando el foco sale de la sección por
  // completo (no al moverse entre los controles internos).
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setPaused(false);
    }
  };

  return (
    <section
      aria-labelledby="equipo-titulo"
      className="relative isolate bg-sky-deep"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={handleBlur}
    >
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <p
          id="equipo-titulo"
          className="text-center text-xs font-extrabold uppercase tracking-[0.3em] text-white/80 sm:text-sm"
        >
          Nuestro equipo
        </p>

        {/* Los miembros se apilan en la misma celda del grid: el más largo
            define la altura (sin saltos) y el cambio es solo de opacidad,
            siempre en la misma posición. */}
        <div className="relative mt-8 grid w-full sm:mt-10" aria-live="polite">
          {team.map((member, index) => {
            const isActive = index === active;
            return (
              <figure
                key={member.id}
                inert={!isActive}
                aria-hidden={!isActive}
                className={`col-start-1 row-start-1 flex flex-col items-center text-center transition-opacity ease-in-out ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                style={{ transitionDuration: `${FADE_MS}ms` }}
              >
                <blockquote className="max-w-3xl">
                  <p className="text-2xl font-semibold leading-snug text-white sm:text-3xl lg:text-4xl">
                    <span
                      aria-hidden="true"
                      className="relative -top-0.5 mr-1 font-script text-3xl leading-none text-sky-light/80 sm:mr-2 sm:-top-1 sm:text-5xl"
                    >
                      “
                    </span>
                    {member.motto}
                    <span
                      aria-hidden="true"
                      className="relative top-1 ml-1 font-script text-3xl leading-none text-sky-light/80 sm:ml-2 sm:top-2 sm:text-5xl"
                    >
                      ”
                    </span>
                  </p>
                </blockquote>
                <figcaption className="mt-8 flex flex-col items-center gap-3 sm:mt-10">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt=""
                      width={56}
                      height={56}
                      className="size-12 rounded-full object-cover ring-1 ring-sky-light/60 sm:size-14"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-12 place-items-center rounded-full bg-white/15 text-base font-bold text-white ring-1 ring-sky-light/60 sm:size-14 sm:text-lg"
                    >
                      {initialsOf(member.name)}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white sm:text-base">
                      {member.name}
                    </p>
                    <p className="mt-1 text-xs text-white/90 sm:text-sm">
                      {member.role}
                    </p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* Controles inferiores: flechas (móvil y tablet) + indicadores.
            En pantallas grandes las flechas van en los extremos. */}
        <div className="mt-8 flex items-center gap-4 sm:mt-10 sm:gap-6">
          <span className="lg:hidden">
            <ArrowButton
              side="prev"
              label="Miembro anterior"
              onClick={() => goTo(active - 1)}
            />
          </span>
          <div className="flex items-center gap-2.5">
            {team.map((member, index) => (
              <button
                key={member.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir al miembro ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === active
                    ? "w-7 bg-white"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <span className="lg:hidden">
            <ArrowButton
              side="next"
              label="Miembro siguiente"
              onClick={() => goTo(active + 1)}
            />
          </span>
        </div>
      </div>

      {/* Flechas de escritorio, cerca de los extremos de la sección.
          Con el zoom global (0.8) sobra espacio: no se pisan con el texto. */}
      <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 lg:block">
        <ArrowButton
          side="prev"
          label="Miembro anterior"
          onClick={() => goTo(active - 1)}
        />
      </div>
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block">
        <ArrowButton
          side="next"
          label="Miembro siguiente"
          onClick={() => goTo(active + 1)}
        />
      </div>
    </section>
  );
}
