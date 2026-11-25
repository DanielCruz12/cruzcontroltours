/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";
import { useReveal } from "@/lib/useReveal";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

const TABS = [
  "All",
  "Camisas",
  "Gorras",
  "Bolsones",
  "Carteras",
  "Tazas",
  "Café",
] as const;

type Tab = (typeof TABS)[number];
type Category = Exclude<Tab, "All">;

type Project = {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
};

// Respaldo si alguna foto remota falla (imagen ya probada en el repo).
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1701815843414-50779f1c3b78?q=80&w=1200&auto=format&fit=crop";

const pximg = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

// NOTA: productos de ejemplo para maquetar el marketplace. Los títulos y
// descripciones son temporales: reemplazar por el catálogo real antes de
// producción. Fotos: Pexels (verificadas HTTP 200, libres para uso).
const PROJECTS: Project[] = [
  {
    id: "camisa-ruta-flores",
    category: "Camisas",
    title: "Camisa Ruta de las Flores",
    subtitle: "Camisas · Algodón",
    image: pximg(11671964),
    imageAlt: "Camisa blanca colgada en un perchero",
  },
  {
    id: "camisa-volcan",
    category: "Camisas",
    title: "Camisa Volcán Ilamatepec",
    subtitle: "Camisas · Algodón",
    image: pximg(8532616),
    imageAlt: "Camisa negra colgada en la pared",
  },
  {
    id: "camisa-tunco",
    category: "Camisas",
    title: "Camisa El Tunco Surf",
    subtitle: "Camisas · Manga corta",
    image: pximg(10877346),
    imageAlt: "Fila de camisas de colores en percheros",
  },
  {
    id: "gorra-coatepeque",
    category: "Gorras",
    title: "Gorra Lago Coatepeque",
    subtitle: "Gorras · Bordada",
    image: pximg(18417334),
    imageAlt: "Gorra azul en estudio",
  },
  {
    id: "gorra-cct",
    category: "Gorras",
    title: "Gorra Cruz Control Tours",
    subtitle: "Gorras · Clásica",
    image: pximg(1878821),
    imageAlt: "Gorra oscura con diseño bordado",
  },
  {
    id: "gorra-volcanes",
    category: "Gorras",
    title: "Gorra Parque Los Volcanes",
    subtitle: "Gorras · Trucker",
    image: pximg(18843020),
    imageAlt: "Gorra rosada con taza y libreta en una banca",
  },
  {
    id: "bolson-playa",
    category: "Bolsones",
    title: "Bolsón playero El Cuco",
    subtitle: "Bolsones · Lona",
    image: pximg(9869067),
    imageAlt: "Bolsón de lona color natural",
  },
  {
    id: "bolson-viajero",
    category: "Bolsones",
    title: "Bolsón viajero CCT",
    subtitle: "Bolsones · Reforzado",
    image: pximg(35685430),
    imageAlt: "Bolsón de lona y cuero sobre piso de madera",
  },
  {
    id: "cartera-cuero",
    category: "Carteras",
    title: "Cartera de cuero artesanal",
    subtitle: "Carteras · Cuero",
    image: pximg(4452390),
    imageAlt: "Cartera de cuero marrón sobre madera rústica",
  },
  {
    id: "cartera-tejida",
    category: "Carteras",
    title: "Cartera tejida Nahuizalco",
    subtitle: "Carteras · Artesanal",
    image: pximg(6444094),
    imageAlt: "Carteras de cuero en estudio",
  },
  {
    id: "taza-volcan",
    category: "Tazas",
    title: "Taza Volcán de Santa Ana",
    subtitle: "Tazas · Cerámica",
    image: pximg(4065909),
    imageAlt: "Mano sosteniendo una taza de cerámica blanca",
  },
  {
    id: "taza-flores",
    category: "Tazas",
    title: "Taza Ruta de las Flores",
    subtitle: "Tazas · Cerámica",
    image: pximg(10279426),
    imageAlt: "Taza de cerámica sobre superficie de mármol",
  },
  {
    id: "cafe-apaneca",
    category: "Café",
    title: "Café de altura Apaneca",
    subtitle: "Café · Tueste medio",
    image: pximg(28495600),
    imageAlt: "Bolsa de café rodeada de granos tostados",
  },
  {
    id: "cafe-finca",
    category: "Café",
    title: "Café finca Santa Leticia",
    subtitle: "Café · Tueste oscuro",
    image: pximg(8234659),
    imageAlt: "Empaque negro de café con granos",
  },
];

const STAGGER_MS = 100;
const REVEAL_MS = 600;
const CARD_GAP_PX = 12;

function PortfolioImage({ src, alt }: { src: string; alt: string }) {
  const [current, setCurrent] = useState(src);
  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 320px, 400px"
      loading="lazy"
      onError={() => {
        if (current !== FALLBACK_IMAGE) setCurrent(FALLBACK_IMAGE);
      }}
      className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
    />
  );
}

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [progress, setProgress] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();
  const { ref, visible, settled } = useReveal<HTMLDivElement>(
    STAGGER_MS * (PROJECTS.length - 1) + REVEAL_MS,
  );

  const activeIndex = TABS.indexOf(activeTab);
  const projects =
    activeTab === "All"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeTab);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
    }
  }, []);

  // Píldora deslizante del tab activo.
  useEffect(() => {
    const update = () => {
      const button = tabRefs.current[activeIndex];
      if (button) {
        setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeIndex]);

  const updateScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 1);
    setCanLeft(track.scrollLeft > 4);
    setCanRight(track.scrollLeft < max - 4);
  };

  // Al filtrar, el carrusel vuelve al inicio.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    updateScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    updateScroll();
    window.addEventListener("resize", updateScroll);
    return () => window.removeEventListener("resize", updateScroll);
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 430) + CARD_GAP_PX;
    track.scrollBy({
      left: direction * amount,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const focusTab = (index: number) => {
    const next = (index + TABS.length) % TABS.length;
    setActiveTab(TABS[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      aria-labelledby="portafolio-titulo"
      className="bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Encabezado en dos columnas */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="pill-negro">Our marketplace</p>
            <h2
              id="portafolio-titulo"
              className="mt-6 text-[44px] font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-[64px]"
            >
              Add the range
              <br />
              your team is missing.
            </h2>
          </div>
          <div>
            <p className="max-w-[420px] text-base leading-relaxed text-neutral-500">
              One subscription, every creative skill. Senior designers and AI
              workflows that ship production-ready work every week.
            </p>
            <Link href="/contacto" className="btn-negro mt-6">
              Start a project
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>

        {/* Contenido (sin fondo: la sección ya es blanca) */}
        <div className="mt-12 sm:mt-14">
          {/* Barra superior: tabs + dato */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="tablist"
              aria-label="Filtrar productos por categoría"
              className="relative flex w-fit max-w-full gap-1 overflow-x-auto rounded-[16px] bg-[#EAEAEA] p-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <span
                aria-hidden="true"
                className="absolute bottom-[6px] top-[6px] rounded-[12px] bg-white shadow-sm motion-safe:transition-all motion-safe:duration-300"
                style={{ left: indicator.left, width: indicator.width }}
              />
              {TABS.map((tab, index) => {
                const selected = tab === activeTab;
                return (
                  <button
                    key={tab}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`${idPrefix}-tab-${index}`}
                    aria-selected={selected}
                    aria-controls={`${idPrefix}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveTab(tab)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        focusTab(index + 1);
                      } else if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        focusTab(index - 1);
                      } else if (event.key === "Home") {
                        event.preventDefault();
                        focusTab(0);
                      } else if (event.key === "End") {
                        event.preventDefault();
                        focusTab(TABS.length - 1);
                      }
                    }}
                    className={`relative z-10 shrink-0 rounded-[12px] px-4 py-2 text-sm transition-colors ${
                      selected
                        ? "font-medium text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carrusel */}
          <div ref={ref}>
            <div
              ref={trackRef}
              role="tabpanel"
              id={`${idPrefix}-panel`}
              aria-labelledby={`${idPrefix}-tab-${activeIndex}`}
              tabIndex={0}
              onScroll={updateScroll}
              style={{ "--cols": SITE_CONFIG.portfolioVisible } as React.CSSProperties}
              className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {projects.map((project, index) => (
                <article
                  key={`${activeTab}-${project.id}`}
                  data-card
                  className={`group w-[85%] shrink-0 snap-start rounded-[24px] border border-[#EDEDED] bg-white p-2 motion-safe:transition-all motion-safe:duration-[600ms] motion-safe:ease-out motion-safe:animate-[portfolio-in_300ms_ease-out] sm:w-[320px] lg:w-[calc((100%-(var(--cols)-1)*0.75rem)/var(--cols))] ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "motion-safe:translate-y-6 motion-safe:opacity-0"
                  }`}
                  style={{
                    transitionDelay:
                      visible && !settled ? `${index * STAGGER_MS}ms` : "0ms",
                  }}
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] bg-neutral-100">
                    <PortfolioImage
                      src={project.image}
                      alt={project.imageAlt}
                    />
                    <p className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1.5 text-[13px] font-medium text-neutral-900 shadow-sm backdrop-blur">
                      {project.category}
                    </p>
                  </div>
                  <div className="px-3 pb-2 pt-4">
                    <h3 className="text-[18px] font-normal leading-snug text-neutral-900">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {project.subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Controles inferiores */}
          <div className="mt-6 flex items-center gap-4">
            <div
              className="h-[2px] flex-1 rounded-full bg-neutral-300"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-neutral-900 motion-safe:transition-[width] motion-safe:duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canLeft}
                aria-label="Tarjeta anterior"
                className="grid size-11 place-items-center rounded-xl bg-white text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 disabled:opacity-40"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canRight}
                aria-label="Tarjeta siguiente"
                className="grid size-11 place-items-center rounded-xl bg-white text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 disabled:opacity-40"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
