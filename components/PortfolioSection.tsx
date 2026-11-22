/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";
import { useReveal } from "@/lib/useReveal";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  UsersIcon,
} from "./icons";

const TABS = [
  "All",
  "Landing page",
  "Apps",
  "Emails",
  "Presentations",
  "Videos",
  "Social media",
  "Branding",
] as const;

type Tab = (typeof TABS)[number];
type Category = Exclude<Tab, "All">;

type Project = {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  badge: "Expert-led" | "AI + expert";
  image: string;
  imageAlt: string;
};

// Respaldo si alguna foto remota falla (imagen ya probada en el repo).
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1701815843414-50779f1c3b78?q=80&w=1200&auto=format&fit=crop";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

const PROJECTS: Project[] = [
  {
    id: "finflow",
    category: "Landing page",
    title: "FinFlow launch site",
    subtitle: "Landing page · Fintech",
    badge: "AI + expert",
    image: img("photo-1498050108023-c5249f4df085"),
    imageAlt: "Sitio de lanzamiento en una laptop",
  },
  {
    id: "northwind",
    category: "Landing page",
    title: "Northwind beta page",
    subtitle: "Landing page · Startup",
    badge: "Expert-led",
    image: img("photo-1522542550221-31fd19575a2d"),
    imageAlt: "Bocetos del diseño de una página",
  },
  {
    id: "pulse",
    category: "Apps",
    title: "Pulse fitness app",
    subtitle: "Mobile app · Health",
    badge: "Expert-led",
    image: img("photo-1551650975-87deedd944c3"),
    imageAlt: "App móvil en un teléfono",
  },
  {
    id: "roam",
    category: "Apps",
    title: "Roam travel planner",
    subtitle: "Mobile app · Travel",
    badge: "AI + expert",
    image: img("photo-1512941937669-90a1b58e7e9c"),
    imageAlt: "Persona usando una app de viajes",
  },
  {
    id: "onboarding-emails",
    category: "Emails",
    title: "Onboarding email series",
    subtitle: "Email · SaaS",
    badge: "AI + expert",
    image: img("photo-1596526131083-e8c633c948d5"),
    imageAlt: "Serie de correos de bienvenida",
  },
  {
    id: "newsletter",
    category: "Emails",
    title: "Weekly newsletter",
    subtitle: "Email · Media",
    badge: "Expert-led",
    image: img("photo-1497032628192-86f99bcd76bc"),
    imageAlt: "Redacción del newsletter semanal",
  },
  {
    id: "pitch-deck",
    category: "Presentations",
    title: "Investor pitch deck",
    subtitle: "Presentation · Startup",
    badge: "Expert-led",
    image: img("photo-1542744094-291d1f67b221"),
    imageAlt: "Presentación ante inversionistas",
  },
  {
    id: "keynote",
    category: "Presentations",
    title: "Keynote opener",
    subtitle: "Presentation · Conference",
    badge: "AI + expert",
    image: img("photo-1475721027785-f74eccf877e2"),
    imageAlt: "Apertura de conferencia en escenario",
  },
  {
    id: "launch-film",
    category: "Videos",
    title: "Product launch film",
    subtitle: "Video · Launch",
    badge: "Expert-led",
    image: img("photo-1485846234645-a62644f84728"),
    imageAlt: "Rodaje del video de lanzamiento",
  },
  {
    id: "documentary",
    category: "Videos",
    title: "Brand documentary",
    subtitle: "Video · Story",
    badge: "AI + expert",
    image: img("photo-1574717024653-61fd2cf4d44d"),
    imageAlt: "Edición del documental de marca",
  },
  {
    id: "campaign-kit",
    category: "Social media",
    title: "Launch campaign kit",
    subtitle: "Social · Campaign",
    badge: "AI + expert",
    image: img("photo-1611926653459-09294b3142bf"),
    imageAlt: "Piezas de la campaña de lanzamiento",
  },
  {
    id: "channel-identity",
    category: "Social media",
    title: "Channel identity",
    subtitle: "Social · Video",
    badge: "Expert-led",
    image: img("photo-1611162616305-c69b3fa7fbe0"),
    imageAlt: "Identidad del canal de video",
  },
  {
    id: "coffee-brand",
    category: "Branding",
    title: "Coffee brand identity",
    subtitle: "Branding · Retail",
    badge: "Expert-led",
    image: img("photo-1586717791821-3f44a563fa4c"),
    imageAlt: "Identidad de marca de café",
  },
  {
    id: "studio-rebrand",
    category: "Branding",
    title: "Studio rebrand",
    subtitle: "Branding · Agency",
    badge: "AI + expert",
    image: img("photo-1558655146-9f40138edfeb"),
    imageAlt: "Rediseño de identidad del estudio",
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
      sizes="(max-width: 640px) 85vw, 430px"
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
          <h2
            id="portafolio-titulo"
            className="text-[44px] font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-[64px]"
          >
            Add the range
            <br />
            your team is missing.
          </h2>
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

        {/* Contenedor */}
        <div className="mt-12 rounded-[32px] bg-[#F3F3F3] p-5 sm:mt-14">
          {/* Barra superior: tabs + dato */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="tablist"
              aria-label="Filtrar proyectos por tipo"
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
                  className={`group w-[85%] shrink-0 snap-start rounded-[24px] bg-white p-2 motion-safe:transition-all motion-safe:duration-[600ms] motion-safe:ease-out motion-safe:animate-[portfolio-in_300ms_ease-out] sm:w-[430px] xl:w-[calc((100%-(var(--cols)-1)*0.75rem)/var(--cols))] ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "motion-safe:translate-y-6 motion-safe:opacity-0"
                  }`}
                  style={{
                    transitionDelay:
                      visible && !settled ? `${index * STAGGER_MS}ms` : "0ms",
                  }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-neutral-100">
                    <PortfolioImage
                      src={project.image}
                      alt={project.imageAlt}
                    />
                    <p className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/85 py-1.5 pl-2.5 pr-3 text-[13px] font-medium text-neutral-900 shadow-sm backdrop-blur">
                      {project.badge === "Expert-led" ? (
                        <UsersIcon className="size-3.5" />
                      ) : (
                        <SparklesIcon className="size-3.5" />
                      )}
                      {project.badge}
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
