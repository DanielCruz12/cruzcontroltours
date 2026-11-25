"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FocusEvent } from "react";
import { testimonials } from "@/lib/team";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

const AUTOPLAY_MS = 6_000;
const FADE_MS = 500;

/** Iniciales (máx. 2 palabras) para el avatar cuando no hay foto. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

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
      className="grid size-12 place-items-center rounded-xl bg-white text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100"
    >
      <ArrowIcon className="size-5" />
    </button>
  );
}

export default function TeamSection() {
  const [active, setActive] = useState(0);
  // true mientras el cursor o el foco están dentro de la sección.
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const goTo = (index: number) => {
    setActive(((index % count) + count) % count);
  };

  // Cambio automático cada 6s. Se reinicia con cada cambio (incluida la
  // navegación manual) y se pausa con hover/foco o prefers-reduced-motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, count]);

  // Solo se reanuda cuando el foco sale de la sección por completo.
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setPaused(false);
    }
  };

  const current = String(active + 1).padStart(2, "0");
  const total = String(count).padStart(2, "0");

  return (
    <section
      aria-labelledby="testimonios-titulo"
      className="bg-white py-20 sm:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={handleBlur}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center rounded-[32px] bg-[#F3F3F3] px-6 py-12 text-center sm:p-16">
          <p className="pill-negro">What our clients say</p>
          <h2 id="testimonios-titulo" className="sr-only">
            What our clients say
          </h2>

          {/* Miembros apilados: el más largo define la altura (sin saltos)
              y el cambio es reveal + fundido. */}
          <div
            className="relative mt-8 grid w-full sm:mt-10"
            aria-live="polite"
          >
            {testimonials.map((member, index) => {
              const isActive = index === active;
              return (
                <figure
                  key={member.id}
                  inert={!isActive}
                  aria-hidden={!isActive}
                  className={`col-start-1 row-start-1 flex flex-col items-center transition-opacity ease-in-out ${
                    isActive ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                  style={{ transitionDuration: `${FADE_MS}ms` }}
                >
                  <div
                    key={active}
                    className="flex flex-col items-center motion-safe:animate-[testimonial-in_500ms_ease-out]"
                  >
                    <blockquote className="mt-2 max-w-3xl">
                      <p className="text-[28px] font-light leading-[1.1] tracking-[-0.02em] text-neutral-900 sm:text-[48px]">
                        {member.motto}
                      </p>
                    </blockquote>
                    <figcaption className="mt-8 flex flex-col items-center gap-2">
                      <p className="mt-1 text-base font-bold text-neutral-900">
                        {member.name}
                      </p>
                      <p className="text-sm text-neutral-500">{member.role}</p>
                    </figcaption>
                  </div>
                </figure>
              );
            })}
          </div>

          {/* Controles: flechas + contador */}
          <div className="mt-10 flex items-center gap-5">
            <ArrowButton
              side="prev"
              label="Testimonio anterior"
              onClick={() => goTo(active - 1)}
            />
            <p className="text-sm font-medium tabular-nums text-neutral-500">
              {current} / {total}
            </p>
            <ArrowButton
              side="next"
              label="Testimonio siguiente"
              onClick={() => goTo(active + 1)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
