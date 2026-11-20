"use client";

import { useState } from "react";
import Image from "next/image";
import { useReveal } from "@/lib/useReveal";
import {
  HeartIcon,
  HomeIcon,
  ImageIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "./icons";

const GREEN = "#14532D";

// ── Fotos del mosaico ────────────────────────────────────────────────
// Para reemplazar una foto, cambia su `src` (o pon `null` para dejar el
// placeholder de color). `fallbackClass` es el fondo si la foto falla.
type MosaicPhoto = {
  key: string;
  src: string | null;
  alt: string;
  fallbackClass: string;
};

const PHOTOS: Record<string, MosaicPhoto> = {
  dog1: {
    key: "dog1",
    src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop",
    alt: "Perro rescatado sonriendo a la cámara",
    fallbackClass: "bg-[#E7EFE3]",
  },
  cat1: {
    key: "cat1",
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
    alt: "Gato rescatado mirando a la cámara",
    fallbackClass: "bg-[#EFE9DC]",
  },
  dog2: {
    key: "dog2",
    src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop",
    alt: "Cachorro rescatado en adopción",
    fallbackClass: "bg-[#E2EBDD]",
  },
  cat2: {
    key: "cat2",
    src: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&auto=format&fit=crop",
    alt: "Gata rescatada con la mirada tierna",
    fallbackClass: "bg-[#EDE7D8]",
  },
  ministry: {
    key: "ministry",
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
    alt: "Voluntarios del ministerio preparando ayuda",
    fallbackClass: "bg-[#DCE8D5]",
  },
};

const ACTIONS = [
  {
    icon: HeartIcon,
    title: "Dona",
    phrase: "Ayúdanos a salvar vidas",
    bg: "bg-white",
  },
  {
    icon: ShieldCheckIcon,
    title: "Acoge",
    phrase: "Brinda un lugar seguro",
    bg: "bg-[#FAF5EC]",
  },
  {
    icon: HomeIcon,
    title: "Adopta",
    phrase: "Dale un hogar para siempre",
    bg: "bg-white",
  },
  {
    icon: UsersIcon,
    title: "Sé voluntario",
    phrase: "Sé parte del cambio",
    bg: "bg-[#FAF5EC]",
  },
];

const STAGGER_MS = 80;
const REVEAL_MS = 600;
const CELL_COUNT = 10;

function MosaicImage({ photo }: { photo: MosaicPhoto }) {
  const [failed, setFailed] = useState(false);
  if (!photo.src || failed) {
    return (
      <div
        role="img"
        aria-label={photo.alt}
        className={`grid h-full w-full place-items-center ${photo.fallbackClass}`}
      >
        <ImageIcon className="size-10 text-neutral-400" />
      </div>
    );
  }
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
      loading="lazy"
      onError={() => setFailed(true)}
      className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
    />
  );
}

type Action = (typeof ACTIONS)[number];

function ActionCard({
  action,
  className,
  style,
}: {
  action: Action;
  className: string;
  style: React.CSSProperties;
}) {
  const Icon = action.icon;
  return (
    <div className={className} style={style}>
      <div className="flex h-full flex-col justify-between p-6">
        <Icon className="size-6" />
        <div>
          <h3 className="text-lg font-bold text-neutral-900">{action.title}</h3>
          <p className="mt-1 text-sm text-neutral-500">{action.phrase}</p>
        </div>
      </div>
    </div>
  );
}

export default function LaborSocialSection() {
  const { ref, visible, settled } = useReveal<HTMLDivElement>(
    STAGGER_MS * (CELL_COUNT - 1) + REVEAL_MS,
  );

  const cellClass = (index: number, extra = "") =>
    `group relative aspect-[4/5] w-[70vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[24px] motion-safe:transition-all motion-safe:ease-out sm:aspect-[3/4] sm:w-auto sm:max-w-none ${
      settled ? "motion-safe:duration-200" : "motion-safe:duration-[600ms]"
    } ${
      visible
        ? "translate-y-0 opacity-100"
        : "motion-safe:translate-y-6 motion-safe:opacity-0"
    } ${extra}`;

  const cellDelay = (index: number) => ({
    transitionDelay: visible && !settled ? `${index * STAGGER_MS}ms` : "0ms",
  });

  return (
    <section
      aria-labelledby="labor-social-titulo"
      className="bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Encabezado centrado */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full bg-[#E9E9EB] px-4 py-1.5 text-sm text-neutral-600">
            Labor social
          </p>
          <h2
            id="labor-social-titulo"
            className="mt-6 text-[44px] font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-[56px]"
          >
            Tito&apos;s Hope{" "}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500">
            Brinda a perros y gatos callejeros en El Salvador un camino desde
            las calles hasta la seguridad ofreciendo atención veterinaria,
            servicios de esterilización, apoyo en su recuperación y la
            oportunidad de un hogar lleno de amor.
          </p>
        </div>

        {/* Mosaico 5 x 2 */}
        <div
          ref={ref}
          className="mt-12 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-4 [scrollbar-width:none] sm:mt-14 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden"
        >
          {/* Tarjeta verde con texto vertical */}
          <div
            className={cellClass(0, "flex items-center justify-center")}
            style={{ ...cellDelay(0), backgroundColor: GREEN }}
          >
            <p className="text-3xl font-extrabold tracking-tight text-white [writing-mode:horizontal-tb] sm:text-[26px] sm:leading-none sm:[writing-mode:vertical-rl]">
              Labor social
            </p>
          </div>

          {/* Foto: perro */}
          <div className={cellClass(1)} style={cellDelay(1)}>
            <MosaicImage photo={PHOTOS.dog1} />
          </div>

          {/* Dona */}
          <ActionCard
            action={ACTIONS[0]}
            className={cellClass(
              2,
              `${ACTIONS[0].bg} motion-safe:hover:-translate-y-0.5`,
            )}
            style={cellDelay(2)}
          />

          {/* Foto: gato */}
          <div className={cellClass(3)} style={cellDelay(3)}>
            <MosaicImage photo={PHOTOS.cat1} />
          </div>

          {/* Acoge */}
          <ActionCard
            action={ACTIONS[1]}
            className={cellClass(
              4,
              `${ACTIONS[1].bg} motion-safe:hover:-translate-y-0.5`,
            )}
            style={cellDelay(4)}
          />

          {/* Foto: perro 2 */}
          <div className={cellClass(5)} style={cellDelay(5)}>
            <MosaicImage photo={PHOTOS.dog2} />
          </div>

          {/* Adopta */}
          <ActionCard
            action={ACTIONS[2]}
            className={cellClass(
              6,
              `${ACTIONS[2].bg} motion-safe:hover:-translate-y-0.5`,
            )}
            style={cellDelay(6)}
          />

          {/* Foto: gato 2 */}
          <div className={cellClass(7)} style={cellDelay(7)}>
            <MosaicImage photo={PHOTOS.cat2} />
          </div>

          {/* Sé voluntario */}
          <ActionCard
            action={ACTIONS[3]}
            className={cellClass(
              8,
              `${ACTIONS[3].bg} motion-safe:hover:-translate-y-0.5`,
            )}
            style={cellDelay(8)}
          />

          {/* Ministerio: foto + texto */}
          <div
            className={cellClass(9, "flex flex-col bg-white")}
            style={cellDelay(9)}
          >
            <div className="relative h-[55%] overflow-hidden">
              <MosaicImage photo={PHOTOS.ministry} />
            </div>
            <div className="flex flex-1 items-center p-5">
              <p className="text-[15px] font-medium leading-snug text-neutral-900">
                Apoyamos a personas en situaciones vulnerables
              </p>
            </div>
          </div>
        </div>

        {/* Logo + botón */}
       
      </div>
    </section>
  );
}
