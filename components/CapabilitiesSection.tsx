"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SITE_CONFIG, gridColsClass } from "@/lib/site-config";
import { useReveal } from "@/lib/useReveal";

type Capability = {
  number: string;
  title: string;
  description: string;
  chips: string[];
  image: string;
  imageAlt: string;
};

// NOTA: contenido temporal para maquetar. Las fotos son de Unsplash y
// deben reemplazarse por fotografía propia antes de producción.
const CAPABILITIES: Capability[] = [
  {
    number: "01",
    title: "Mudanzas",
    description:
      "Mudamos tu hogar u oficina con cuidado: embalaje, carga, traslado y descarga en todo El Salvador.",
    chips: ["Hogar", "Oficina", "Embalaje"],
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Cajas de cartón listas para una mudanza",
  },
  {
    number: "02",
    title: "Alquiler de vehículos",
    description:
      "Sedanes, SUVs y vans en excelente estado, con o sin conductor, por día o por semana.",
    chips: ["Sedán", "SUV", "Van"],
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Vehículo en carretera al atardecer",
  },
  {
    number: "03",
    title: "Transporte privado",
    description:
      "Traslados cómodos y puntuales al aeropuerto, playas, eventos y cualquier destino del país.",
    chips: ["Aeropuerto", "Eventos", "Puerta a puerta"],
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Conductor manejando en carretera",
  },
  {
    number: "04",
    title: "Traslados empresariales",
    description:
      "Movemos a tu equipo todos los días: rutas fijas de personal, ejecutivos y transporte para eventos.",
    chips: ["Personal", "Ejecutivos", "Rutas fijas"],
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Bus de transporte en carretera",
  },
];

// Respaldo si alguna foto remota falla (imagen ya probada en el repo).
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1701815843414-50779f1c3b78?q=80&w=1200&auto=format&fit=crop";

function CapabilityImage({ src, alt }: { src: string; alt: string }) {
  const [current, setCurrent] = useState(src);
  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      loading="lazy"
      onError={() => {
        if (current !== FALLBACK_IMAGE) setCurrent(FALLBACK_IMAGE);
      }}
      className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
    />
  );
}

export default function CapabilitiesSection() {
  const [visibleCount, setVisibleCount] = useState(
    SITE_CONFIG.capabilitiesPageSize,
  );
  const { ref: gridRef, visible, settled } = useReveal<HTMLDivElement>(900);
  const items = CAPABILITIES.slice(0, visibleCount);
  const hasMore = visibleCount < CAPABILITIES.length;

  return (
    <section
      aria-labelledby="capacidades-titulo"
      className="bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Encabezado en dos columnas */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="pill-negro">Otros servicios</p>
            <h2
              id="capacidades-titulo"
              className="mt-6 text-[44px] font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-[56px]"
            >
              Más que tours.
              <br />
              Todo tu transporte resuelto.
            </h2>
          </div>
          <div>
            <p className="max-w-[420px] text-base leading-relaxed text-neutral-500">
              Mudanzas, vehículos de alquiler y traslados privados o
              empresariales — con la misma puntualidad y cuidado de siempre.
            </p>
            <Link href="/contacto" className="btn-negro mt-6">
              Cotizar un servicio
            </Link>
          </div>
        </div>

        {/* Tarjetas */}
        <div
          ref={gridRef}
          className={`mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-[32px] bg-[#F5F5F5] p-3 [scrollbar-width:none] sm:mt-14 sm:grid sm:grid-cols-2 sm:overflow-visible ${gridColsClass(SITE_CONFIG.capabilitiesPageSize)} lg:gap-4 [&::-webkit-scrollbar]:hidden`}
        >
          {items.map((capability, index) => (
            <article
              key={capability.number}
              className={`group relative flex h-full w-[72vw] max-w-[270px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal/5 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out hover:shadow-lg hover:shadow-charcoal/10 sm:w-auto sm:max-w-none ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "motion-safe:translate-y-6 motion-safe:opacity-0"
              }`}
              style={{
                transitionDelay:
                  visible && !settled ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                <CapabilityImage
                  src={capability.image}
                  alt={capability.imageAlt}
                />
                {/* Degradado inferior para legibilidad */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-charcoal/85 via-charcoal/35 to-transparent" />

                {/* Número y título sobre la imagen */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-xs font-medium text-white/80">
                    {capability.number}
                  </p>
                  {/* Altura fija de dos líneas para que todas las cards midan igual */}
                  <h3 className="mt-1 line-clamp-2 min-h-[2.75em] text-sm font-bold leading-snug sm:text-lg">
                    {capability.title}
                  </h3>
                </div>
              </div>

              <div className="px-4 py-3.5">
                <p className="line-clamp-2 text-[13px] leading-relaxed text-neutral-500">
                  {capability.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {CAPABILITIES.length > SITE_CONFIG.capabilitiesPageSize && (
          <div className="mt-8 flex justify-center">
            {hasMore ? (
              <button
                type="button"
                onClick={() =>
                  setVisibleCount(
                    (count) => count + SITE_CONFIG.capabilitiesPageSize,
                  )
                }
                className="btn-negro"
              >
                Ver más
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setVisibleCount(SITE_CONFIG.capabilitiesPageSize)
                }
                className="btn-negro"
              >
                Ver menos
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
