"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon, SparklesIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger);

const AUTOPLAY_MS = 8_000;

// TODO: reemplazar con los miembros reales del equipo (nombre, cargo,
// años, especialidades y foto). Estos 6 son placeholders.
type Member = {
  id: string;
  name: string;
  role: string;
  years: number | null;
  chips: string[];
  photo: string | null;
};

const MEMBERS: Member[] = [
  {
    id: "miembro-1",
    name: "Miembro 1",
    role: "Cargo pendiente",
    years: null,
    chips: ["Especialidad 1", "Especialidad 2", "Especialidad 3"],
    photo: null,
  },
  {
    id: "miembro-2",
    name: "Miembro 2",
    role: "Cargo pendiente",
    years: null,
    chips: ["Especialidad 1", "Especialidad 2", "Especialidad 3"],
    photo: null,
  },
  {
    id: "miembro-3",
    name: "Miembro 3",
    role: "Cargo pendiente",
    years: null,
    chips: ["Especialidad 1", "Especialidad 2", "Especialidad 3"],
    photo: null,
  },
  {
    id: "miembro-4",
    name: "Miembro 4",
    role: "Cargo pendiente",
    years: null,
    chips: ["Especialidad 1", "Especialidad 2", "Especialidad 3"],
    photo: null,
  },
  {
    id: "miembro-5",
    name: "Miembro 5",
    role: "Cargo pendiente",
    years: null,
    chips: ["Especialidad 1", "Especialidad 2", "Especialidad 3"],
    photo: null,
  },
  {
    id: "miembro-6",
    name: "Miembro 6",
    role: "Cargo pendiente",
    years: null,
    chips: ["Especialidad 1", "Especialidad 2", "Especialidad 3"],
    photo: null,
  },
];

type Step = { title: string; when: string; desc: string };

// Índice del paso actual (0: completados antes, resto por hacer).
// Placeholder: estado de demostración de la UI.
const CURRENT_STEP_INDEX = 2;

// TODO: reemplazar descripciones y fechas con el proceso real.
function buildSteps(member: Member): Step[] {
  const firstName = member.name.split(" ")[0];
  const trajectory =
    member.years === null
      ? "trayectoria por confirmar"
      : `${member.years} años`;
  return [
    {
      title: "Solicitud recibida",
      when: "Día 1 · Hora por confirmar",
      desc: "Descripción del paso pendiente.",
    },
    {
      title: `${firstName} se une`,
      when: `${member.role} · ${trajectory} · respuesta por confirmar`,
      desc: "Descripción del paso pendiente.",
    },
    {
      title: "Itinerario propuesto",
      when: "Día 3 · Hora por confirmar",
      desc: "Descripción del paso pendiente.",
    },
    {
      title: "Ajustes juntos",
      when: "Día 4 · Hora por confirmar",
      desc: "Descripción del paso pendiente.",
    },
    {
      title: "Reserva confirmada",
      when: "Día 5 · Hora por confirmar",
      desc: "Descripción del paso pendiente.",
    },
    {
      title: "Disfruta tu viaje",
      when: "Día 6 · Hora por confirmar",
      desc: "Descripción del paso pendiente.",
    },
  ];
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function TeamTimelineSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [entered, setEntered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const transitioning = useRef(false);

  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardTextRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLOListElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const member = MEMBERS[activeIndex];
  const steps = buildSteps(member);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
    }
  }, []);

  // Entrada al hacer scroll: panel, foto (clip-path) y tarjeta.
  useEffect(() => {
    if (reduced) {
      setEntered(true);
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => setEntered(true),
        },
      });
      tl.from(panelRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        .from(
          photoRef.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          cardRef.current,
          { y: 24, opacity: 0, duration: 0.5, ease: "power2.out" },
          "-=0.5",
        );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  // Anillo de la miniatura activa (se desliza con transform).
  const moveRing = (index: number, instant = false) => {
    const button = thumbRefs.current[index];
    const ring = ringRef.current;
    if (!button || !ring) return;
    if (instant || reduced) {
      gsap.set(ring, { x: button.offsetLeft });
    } else {
      gsap.to(ring, { x: button.offsetLeft, duration: 0.3, ease: "power2.out" });
    }
  };

  useEffect(() => {
    moveRing(activeIndex, true);
    const onResize = () => moveRing(activeIndex, true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Cambio de persona: crossfade de foto/texto + redibujo del timeline.
  useEffect(() => {
    if (reduced || !entered) return;
    moveRing(activeIndex);
    gsap.fromTo(
      [photoRef.current, cardTextRef.current],
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.15, ease: "power1.out" },
    );
    const steps_ = timelineRef.current?.querySelectorAll("[data-step]");
    const connectors = timelineRef.current?.querySelectorAll("[data-draw]");
    const pops = timelineRef.current?.querySelectorAll("[data-pop]");
    const tl = gsap.timeline();
    if (steps_?.length) {
      tl.fromTo(
        steps_,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: (index, el) =>
            (el as HTMLElement).dataset.state === "todo" ? 0.35 : 1,
          duration: 0.5,
          stagger: 0.09,
          ease: "power2.out",
        },
        0,
      );
    }
    if (connectors?.length) {
      tl.fromTo(
        connectors,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          duration: 0.4,
          stagger: 0.09,
          ease: "power2.out",
        },
        0,
      );
    }
    if (pops?.length) {
      tl.fromTo(
        pops,
        { scale: 0.6 },
        { scale: 1, duration: 0.3, stagger: 0.09, ease: "back.out(2)" },
        0,
      );
    }
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, entered, reduced]);

  // Autoplay cada 8s (pausado con hover/foco o movimiento reducido).
  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setTimeout(() => {
      select((activeIndex + 1) % MEMBERS.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, entered, paused, reduced]);

  const focusThumb = (index: number) => {
    thumbRefs.current[index]?.focus();
  };

  const select = (index: number) => {
    const next = ((index % MEMBERS.length) + MEMBERS.length) % MEMBERS.length;
    if (next === activeIndex || transitioning.current) return;
    if (reduced || !entered) {
      setActiveIndex(next);
      return;
    }
    // Mitad del crossfade: funde la foto/texto actual; al completar se
    // cambia la persona y el efecto de arriba hace el fade-in + timeline.
    transitioning.current = true;
    gsap.to([photoRef.current, cardTextRef.current], {
      opacity: 0,
      y: 8,
      duration: 0.15,
      ease: "power1.in",
      overwrite: true,
      onComplete: () => {
        transitioning.current = false;
        setActiveIndex(next);
      },
    });
  };

  const stepState = (index: number) =>
    index < CURRENT_STEP_INDEX
      ? "done"
      : index === CURRENT_STEP_INDEX
        ? "current"
        : "todo";

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setPaused(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="equipo-selector-titulo"
      className="bg-white py-20 sm:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={handleBlur}
    >
      <h2 id="equipo-selector-titulo" className="sr-only">
        Nuestro equipo
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={panelRef}
          className="rounded-[32px] bg-[#F3F3F3] p-4"
        >
          <div
            aria-live="polite"
            className="grid gap-4 lg:grid-cols-2"
          >
            {/* Columna izquierda: foto + tarjeta + miniaturas */}
            <div>
              <div className="relative">
                <div
                  ref={photoRef}
                  className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#E7EFE3] lg:aspect-[4/5]"
                >
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={`Foto de ${member.name}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      <span
                        aria-hidden="true"
                        className="text-7xl font-light text-neutral-400"
                      >
                        {initialsOf(member.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tarjeta flotante glass */}
                <div
                  ref={cardRef}
                  className="absolute inset-x-3 bottom-3 rounded-[24px] bg-white/70 p-5 shadow-sm backdrop-blur-[16px] sm:inset-x-4 sm:bottom-4"
                >
                  <div ref={cardTextRef}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-2xl font-bold text-neutral-900">
                        {member.name}
                      </h3>
                      <p className="flex shrink-0 items-center gap-1.5 rounded-full bg-white py-1.5 pl-1.5 pr-3 text-[13px] font-medium text-neutral-900 shadow-sm">
                        <span className="grid size-5 place-items-center rounded-full bg-neutral-900 text-white">
                          <CheckIcon className="size-3" />
                        </span>
                        Verificado
                      </p>
                    </div>
                    <p className="mt-1 text-[15px] text-neutral-500">
                      {member.role} ·{" "}
                      {member.years === null
                        ? "trayectoria por confirmar"
                        : `${member.years} años`}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {member.chips.map((chip) => (
                        <li
                          key={chip}
                          className="rounded-full bg-[#E9E9EB] px-3 py-1 text-[13px] text-neutral-600"
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Miniaturas */}
              <div
                role="group"
                aria-label="Elegir miembro del equipo"
                className="relative mt-4 flex gap-2 sm:gap-3"
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    const next = (activeIndex + 1) % MEMBERS.length;
                    select(next);
                    focusThumb(next);
                  } else if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    const next =
                      (activeIndex - 1 + MEMBERS.length) % MEMBERS.length;
                    select(next);
                    focusThumb(next);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    select(0);
                    focusThumb(0);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    select(MEMBERS.length - 1);
                    focusThumb(MEMBERS.length - 1);
                  }
                }}
              >
                <span
                  ref={ringRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 size-10 rounded-full ring-2 ring-neutral-900 ring-offset-2 ring-offset-[#F3F3F3] sm:size-12"
                />
                {MEMBERS.map((item, index) => (
                  <button
                    key={item.id}
                    ref={(node) => {
                      thumbRefs.current[index] = node;
                    }}
                    type="button"
                    onClick={() => select(index)}
                    aria-label={`Ver a ${item.name}`}
                    aria-pressed={index === activeIndex}
                    tabIndex={index === activeIndex ? 0 : -1}
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-200 text-sm font-bold text-neutral-500 motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.08] sm:size-12"
                  >
                    {initialsOf(item.name)}
                  </button>
                ))}
              </div>
            </div>

            {/* Columna derecha: tarjeta del viaje + timeline */}
            <div className="rounded-[24px] bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                  <SparklesIcon className="size-5" />
                  Tu viaje
                </p>
                <div className="flex" aria-hidden="true">
                  {MEMBERS.slice(0, 3).map((item, index) => (
                    <span
                      key={item.id}
                      className={`grid size-8 place-items-center rounded-full bg-neutral-200 text-[11px] font-bold text-neutral-500 ring-2 ring-white ${
                        index > 0 ? "-ml-2" : ""
                      }`}
                    >
                      {initialsOf(item.name)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 border-t border-neutral-100" />

              <ol ref={timelineRef} className="mt-6">
                {steps.map((step, index) => {
                  const state = stepState(index);
                  const isLast = index === steps.length - 1;
                  return (
                    <li
                      key={step.title}
                      data-step
                      data-state={state}
                      className={`relative flex gap-4 ${isLast ? "" : "pb-8"} ${
                        state === "todo" ? "opacity-35" : ""
                      }`}
                    >
                      {/* Riel: círculo + conector */}
                      <span className="relative flex w-8 shrink-0 justify-center">
                        {state === "done" ? (
                          <span
                            data-pop
                            className="grid size-8 place-items-center rounded-full bg-neutral-900 text-white"
                          >
                            <CheckIcon className="size-4" />
                          </span>
                        ) : state === "current" ? (
                          <span className="grid size-8 place-items-center rounded-full bg-white ring-2 ring-neutral-900">
                            <span className="size-2.5 rounded-full bg-neutral-900" />
                          </span>
                        ) : (
                          <span className="size-8 rounded-full bg-neutral-100" />
                        )}
                        {!isLast && (
                          <span
                            data-draw
                            aria-hidden="true"
                            className="absolute left-1/2 top-8 h-[calc(100%-2rem)] w-[2px] origin-top -translate-x-1/2 bg-neutral-200"
                          />
                        )}
                      </span>

                      {/* Contenido */}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[18px] font-semibold leading-snug text-neutral-900">
                          {step.title}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-neutral-400">
                          {step.when}
                        </span>
                        <span className="mt-1 block text-[15px] leading-relaxed text-neutral-500">
                          {step.desc}
                        </span>
                      </span>

                      {/* Avatar */}
                      <span
                        aria-hidden="true"
                        className="grid size-8 shrink-0 place-items-center self-start rounded-full bg-[#E9E9EB] text-[11px] font-bold text-neutral-600"
                      >
                        {initialsOf(member.name)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
