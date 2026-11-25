/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
import gsap from "gsap";
import { CheckIcon } from "./icons";

const AUTOPLAY_MS = 8_000;

// NOTA: contenido temporal para maquetar. Reemplazar con los miembros
// reales del equipo (nombre, cargo, años, especialidades, tareas y foto
// propia) antes de producción.
type Member = {
  id: string;
  name: string;
  role: string;
  years: number | null;
  chips: string[];
  /** Tareas que hace esta persona en la empresa (columna derecha). */
  duties: { title: string; desc: string }[];
  photo: string | null;
};

const img = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;

const MEMBERS: Member[] = [
  {
    id: "carlos-cruz",
    name: "Carlos Cruz",
    role: "Fundador y gerente general",
    years: 12,
    chips: ["Estrategia", "Operaciones", "Alianzas"],
    duties: [
      {
        title: "Operación diaria",
        desc: "Dirige los tours, traslados y mudanzas de cada día.",
      },
      {
        title: "Nuevas rutas",
        desc: "Diseña experiencias por todo El Salvador.",
      },
      {
        title: "Alianzas clave",
        desc: "Gestiona hoteles, agencias y proveedores.",
      },
      {
        title: "Calidad y seguridad",
        desc: "Supervisa la flota y el servicio.",
      },
    ],
    photo: img("photo-1560250097-0b93528c311a"),
  },
  {
    id: "maria-torres",
    name: "María Torres",
    role: "Coordinadora de tours",
    years: 8,
    chips: ["Itinerarios", "Reservas", "Grupos"],
    duties: [
      {
        title: "Itinerarios a medida",
        desc: "Arma el plan ideal para cada grupo o familia.",
      },
      {
        title: "Reservas al día",
        desc: "Confirma horarios y puntos de encuentro.",
      },
      {
        title: "Coordinación total",
        desc: "Une guías, transporte y alimentación.",
      },
      {
        title: "Eventos y grupos",
        desc: "Atiende solicitudes especiales y corporativos.",
      },
    ],
    photo: img("photo-1573496359142-b8d87734a5a2"),
  },
  {
    id: "jorge-mendez",
    name: "Jorge Méndez",
    role: "Guía principal de aventura",
    years: 10,
    chips: ["Volcanes", "Senderismo", "Surf"],
    duties: [
      {
        title: "Tours de aventura",
        desc: "Lidera volcanes, senderismo y surf.",
      },
      {
        title: "Seguridad primero",
        desc: "Cuida al grupo en cada recorrido.",
      },
      {
        title: "Historia viva",
        desc: "Cuenta la cultura de cada lugar.",
      },
      {
        title: "Ritmo a tu medida",
        desc: "Adapta el tour a cada grupo.",
      },
    ],
    photo: img("photo-1507003211169-0a1dd7228f2d"),
  },
  {
    id: "sofia-ramos",
    name: "Sofía Ramos",
    role: "Atención al viajero",
    years: 6,
    chips: ["WhatsApp", "Cotizaciones", "Post-viaje"],
    duties: [
      {
        title: "Cotizaciones rápidas",
        desc: "Responde por WhatsApp, correo y redes.",
      },
      {
        title: "Acompañamiento total",
        desc: "Contigo antes, durante y después.",
      },
      {
        title: "Cambios e imprevistos",
        desc: "Gestiona fechas y reembolsos.",
      },
      {
        title: "Mejora continua",
        desc: "Escucha opiniones para mejorar.",
      },
    ],
    photo: img("photo-1438761681033-6461ffad8d80"),
  },
  {
    id: "diego-hernandez",
    name: "Diego Hernández",
    role: "Guía local — Ruta de las Flores",
    years: 7,
    chips: ["Café", "Pueblos", "Cascadas"],
    duties: [
      {
        title: "Ruta de las Flores",
        desc: "Guía cada pueblo de la ruta.",
      },
      {
        title: "Catas de café",
        desc: "Con productores locales.",
      },
      {
        title: "Rincones secretos",
        desc: "Murales, cascadas y miradores.",
      },
      {
        title: "Recomendaciones",
        desc: "Dónde comer y qué comprar.",
      },
    ],
    photo: img("photo-1500648767791-00dcc994a43e"),
  },
  {
    id: "carmen-aguilar",
    name: "Carmen Aguilar",
    role: "Logística y transporte",
    years: 9,
    chips: ["Flota", "Mudanzas", "Traslados"],
    duties: [
      {
        title: "Rutas y horarios",
        desc: "Planifica recogidas y tiempos.",
      },
      {
        title: "Mudanzas y empresas",
        desc: "Coordina cada traslado.",
      },
      {
        title: "Flota impecable",
        desc: "Vehículos al día y en óptimas condiciones.",
      },
      {
        title: "Conductores",
        desc: "Supervisa llegadas puntuales.",
      },
    ],
    photo: img("photo-1544005313-94ddf0286df2"),
  },
];

type Step = { title: string; desc: string };

// Cada tarea de la persona es un paso del timeline.
function buildSteps(member: Member): Step[] {
  return member.duties.map((duty) => ({
    title: duty.title,
    desc: duty.desc,
  }));
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

/**
 * Foto del miembro que cubre a sus iniciales. Si no hay foto o falla la
 * carga, devuelve null y quedan visibles las iniciales de atrás.
 * Usar con `key={member.id}` para reiniciar el estado al cambiar de persona.
 */
function MemberPhoto({
  member,
  className,
}: {
  member: Member;
  className: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!member.photo || failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={member.photo}
      alt={`Foto de ${member.name}`}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function TeamTimelineSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Se lee en el estado inicial (no en un efecto) para que con
  // movimiento reducido nunca se llegue a ocultar el panel.
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const transitioning = useRef(false);

  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const cardTextRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLOListElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const member = MEMBERS[activeIndex];
  const steps = buildSteps(member);

  // Reacciona si la preferencia cambia con la página abierta.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Anillo de la miniatura activa (se desliza con transform).
  const moveRing = (index: number, instant = false) => {
    const button = thumbRefs.current[index];
    const ring = ringRef.current;
    if (!button || !ring) return;
    if (instant || reduced) {
      gsap.set(ring, { x: button.offsetLeft });
    } else {
      gsap.to(ring, {
        x: button.offsetLeft,
        duration: 0.3,
        ease: "power2.out",
      });
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
    if (reduced) return;
    moveRing(activeIndex);
    gsap.fromTo(
      [photoRef.current, cardTextRef.current],
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.1, ease: "power1.out" },
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
          opacity: 1,
          duration: 0.25,
          stagger: 0.04,
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
          duration: 0.2,
          stagger: 0.04,
          ease: "power2.out",
        },
        0,
      );
    }
    if (pops?.length) {
      tl.fromTo(
        pops,
        { scale: 0.6 },
        { scale: 1, duration: 0.2, stagger: 0.04, ease: "back.out(2)" },
        0,
      );
    }
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, reduced]);

  // Autoplay cada 8s (pausado con hover/foco o movimiento reducido).
  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setTimeout(() => {
      select((activeIndex + 1) % MEMBERS.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, paused, reduced]);

  const focusThumb = (index: number) => {
    thumbRefs.current[index]?.focus();
  };

  const select = (index: number) => {
    const next = ((index % MEMBERS.length) + MEMBERS.length) % MEMBERS.length;
    if (next === activeIndex || transitioning.current) return;
    if (reduced) {
      setActiveIndex(next);
      return;
    }
    // Mitad del crossfade: funde la foto/texto actual; al completar se
    // cambia la persona y el efecto de arriba hace el fade-in + timeline.
    transitioning.current = true;
    gsap.to([photoRef.current, cardTextRef.current], {
      opacity: 0,
      y: 8,
      duration: 0.1,
      ease: "power1.in",
      overwrite: true,
      onComplete: () => {
        transitioning.current = false;
        setActiveIndex(next);
      },
    });
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setPaused(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="equipo-selector-titulo"
      className="py-14 sm:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={handleBlur}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl text-start sm:mb-10">
          <p className="pill-negro">Our team</p>
          <h2
            id="equipo-selector-titulo"
            className="mt-4 text-4xl font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-[56px]"
          >
            The people behind your trip.
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-500">
            Local guides and travel experts who turn every tour into an
            unforgettable experience.
          </p>
        </div>
        <div className="rounded-[24px] p-3 sm:rounded-[32px] sm:p-4">
          <div aria-live="polite" className="grid gap-3 sm:gap-4 lg:grid-cols-2">
            {/* Columna izquierda: foto + tarjeta + miniaturas */}
            <div>
              <div className="relative">
                <div
                  ref={photoRef}
                  className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#e3edef]"
                >
                  <div className="grid h-full w-full place-items-center">
                    <span
                      aria-hidden="true"
                      className="text-7xl font-light text-neutral-400"
                    >
                      {initialsOf(member.name)}
                    </span>
                  </div>
                  <MemberPhoto
                    key={member.id}
                    member={member}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                {/* Tarjeta flotante glass */}
                <div className="absolute inset-x-3 bottom-3 rounded-[20px] bg-white/70 p-4 shadow-sm backdrop-blur-[16px] sm:inset-x-4 sm:bottom-4 sm:rounded-[24px] sm:p-5">
                  <div ref={cardTextRef}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                        {member.name}
                      </h3>
                      <p className="flex shrink-0 items-center gap-1.5 rounded-full bg-white py-1.5 pl-1.5 pr-2.5 text-xs font-medium text-neutral-900 shadow-sm sm:pr-3 sm:text-[13px]">
                        <span className="grid size-5 place-items-center rounded-full bg-neutral-900 text-white">
                          <CheckIcon className="size-3" />
                        </span>
                        Verificado
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500 sm:text-[15px]">
                      {member.role} ·{" "}
                      {member.years === null
                        ? "trayectoria por confirmar"
                        : `${member.years} años`}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {member.chips.map((chip) => (
                        <li
                          key={chip}
                          className="rounded-full bg-[#E9E9EB] px-3 py-1 text-xs text-neutral-600 sm:text-[13px]"
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
                    className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-200 text-sm font-bold text-neutral-500 motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.08] sm:size-12"
                  >
                    {initialsOf(item.name)}
                    <MemberPhoto
                      key={item.id}
                      member={item}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Columna derecha: timeline con las tareas de la persona */}
            <div className="rounded-[24px] bg-white p-5 sm:p-8">
              <p className="text-sm font-semibold text-neutral-900 sm:text-base">
                Desempeño y cargo dentro de la empresa
              </p>
              <div className="mt-4 border-t border-neutral-100" />

              <ol ref={timelineRef} className="mt-5 sm:mt-6">
                {steps.map((step, index) => {
                  const isLast = index === steps.length - 1;
                  return (
                    <li
                      key={step.title}
                      data-step
                      className={`relative flex gap-3 sm:gap-4 ${isLast ? "" : "pb-6 sm:pb-8"}`}
                    >
                      {/* Riel: círculo + conector */}
                      <span className="relative flex w-8 shrink-0 justify-center">
                        <span
                          data-pop
                          className="grid size-8 place-items-center rounded-full bg-neutral-900 text-white"
                        >
                          <CheckIcon className="size-4" />
                        </span>
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
                        <span className="block text-base font-semibold leading-snug text-neutral-900 sm:text-[18px]">
                          {step.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-neutral-500 sm:text-[15px]">
                          {step.desc}
                        </span>
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
