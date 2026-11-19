"use client";

import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/lib/useReveal";
import { CheckIcon } from "./icons";

type Capability = {
  number: string;
  title: string;
  description: string;
  chips: string[];
  image: string;
  imageAlt: string;
};

const CAPABILITIES: Capability[] = [
  {
    number: "01",
    title: "Web & product",
    description:
      "Websites and product interfaces designed to convert — from first wireframe to final launch.",
    chips: ["UI Design", "Development", "CMS"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Equipo revisando un producto digital en una laptop",
  },
  {
    number: "02",
    title: "Graphic design & marketing",
    description:
      "Campaigns, social and print visuals that keep your brand sharp on every channel.",
    chips: ["Campaigns", "Social", "Print"],
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Material gráfico y de papelería sobre un escritorio",
  },
  {
    number: "03",
    title: "Brand identity",
    description:
      "Logos, color systems and guidelines that give your business a memorable look.",
    chips: ["Logo", "Guidelines", "Naming"],
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Proceso de diseño de identidad de marca",
  },
];

export default function CapabilitiesSection() {
  const { ref: gridRef, visible, settled } = useReveal<HTMLDivElement>(900);

  return (
    <section
      aria-labelledby="capacidades-titulo"
      className="bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Encabezado en dos columnas */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-[#E9E9EB] px-4 py-1.5 text-sm text-neutral-600">
              People + AI at work
            </p>
            <h2
              id="capacidades-titulo"
              className="mt-6 text-[44px] font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-[56px]"
            >
              More ideas explored.
              <br />
              More work delivered.
            </h2>
          </div>
          <div>
            <p className="max-w-[420px] text-base leading-relaxed text-neutral-500">
              From first sketch to final delivery, small senior teams pair
              human craft with AI speed — so you see more directions, faster.
            </p>
            <Link href="/tours" className="btn-negro mt-6">
              Explore all capabilities
            </Link>
          </div>
        </div>

        {/* Tarjetas */}
        <div
          ref={gridRef}
          className="mt-12 grid gap-3 rounded-[32px] bg-[#F5F5F5] p-3 sm:mt-14 md:grid-cols-3"
        >
          {CAPABILITIES.map((capability, index) => (
            <article
              key={capability.number}
              className={`group rounded-[24px] bg-white p-3 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "motion-safe:translate-y-6 motion-safe:opacity-0"
              }`}
              style={{
                transitionDelay:
                  visible && !settled ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-neutral-100">
                <Image
                  src={capability.image}
                  alt={capability.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/85 py-1 pl-1 pr-2.5 shadow-sm backdrop-blur">
                  <span className="flex -space-x-2" aria-hidden="true">
                    <span className="grid size-7 place-items-center rounded-full bg-neutral-900 text-[11px] font-bold text-white ring-2 ring-white">
                      C
                    </span>
                    <span className="grid size-7 place-items-center rounded-full bg-neutral-300 text-[11px] font-bold text-neutral-700 ring-2 ring-white">
                      V
                    </span>
                  </span>
                  <span className="text-[13px] font-medium text-neutral-900">
                    Claude + Vlad
                  </span>
                  <span className="grid size-5 place-items-center rounded-full bg-neutral-900 text-white">
                    <CheckIcon className="size-3" />
                  </span>
                </div>
              </div>

              <div className="px-2 pb-2 pt-4">
                <p className="text-sm font-medium text-neutral-400">
                  {capability.number}
                </p>
                <h3 className="mt-2 text-[22px] font-normal leading-snug text-neutral-900">
                  {capability.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-neutral-500">
                  {capability.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {capability.chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-[8px] bg-neutral-100 px-2.5 py-1 text-[13px] text-neutral-600"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
