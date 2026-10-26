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

/** Botón circular semitransparente con flecha (tamaño discreto). */
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
      className="grid size-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-sky-light/40 sm:size-10"
    >
      <ArrowIcon className="size-4" />
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
      <div className="mx-auto flex min-h-[90vh] max-w-4xl flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        {/* Los miembros se apilan en la misma celda del grid: el más largo
            define la altura (sin saltos) y el cambio es solo de opacidad.
            Con justify-end el avatar/nombre/cargo quedan anclados abajo,
            pegados a las flechas sin importar el largo del mensaje. */}
        <div className="relative mt-6 grid w-full sm:mt-8" aria-live="polite">
          {team.map((member, index) => {
            const isActive = index === active;
            return (
              <figure
                key={member.id}
                inert={!isActive}
                aria-hidden={!isActive}
                className={`col-start-1 row-start-1 flex flex-col items-center justify-end text-center transition-opacity ease-in-out ${isActive ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                style={{ transitionDuration: `${FADE_MS}ms` }}
              >
                <blockquote className="max-w-2xl">
                  <p className="text-3xl font-semibold text-white">
                    <span
                      aria-hidden="true"
                      className="relative -top-0.5 mr-1 font-script text-2xl leading-none text-sky-light/80 sm:mr-2 sm:-top-1 sm:text-3xl"
                    >

                    </span>
                    &quot;{member.motto}&quot;
                    <span
                      aria-hidden="true"
                      className="relative top-1 ml-1 font-script text-2xl leading-none text-sky-light/80 sm:ml-2 sm:top-2 sm:text-3xl"
                    >

                    </span>
                  </p>
                </blockquote>
                <figcaption className="mt-5 pt-10 pb-5 flex flex-col items-center gap-2.5 sm:mt-6">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt=""
                      width={80}
                      height={80}
                      className="size-16 rounded-full object-cover ring-1 ring-sky-light/60 sm:size-20"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-16 place-items-center rounded-full bg-white/15 text-xl font-bold text-white ring-1 ring-sky-light/60 sm:size-20 sm:text-2xl"
                    >
                      {initialsOf(member.name)}
                    </span>
                  )}
                  <div>
                    <p className="text-2xl font-bold text-white sm:text-base">
                      {member.name}
                    </p>
                    <p className="mt-0.5 text-md text-white/90">
                      {member.role}
                    </p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* Controles: flechas a los lados con los indicadores centrados
            entre ellas, justo debajo de la información del miembro (mismo
            layout en todos los tamaños). */}
        <div className="mt-5 flex items-center gap-3 sm:mt-6 sm:gap-5">
          <ArrowButton
            side="prev"
            label="Miembro anterior"
            onClick={() => goTo(active - 1)}
          />
          <div className="flex items-center gap-2.5">
            {team.map((member, index) => (
              <button
                key={member.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir al miembro ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${index === active
                  ? "w-7 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
              />
            ))}
          </div>
          <ArrowButton
            side="next"
            label="Miembro siguiente"
            onClick={() => goTo(active + 1)}
          />
        </div>
      </div>
    </section>
  );
}
