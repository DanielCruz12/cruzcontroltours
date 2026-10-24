"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  galleryOffsets,
  galleryPhotos,
  galleryRows,
  photoDimensions,
  photoSrc,
} from "@/lib/gallery";
import type { GalleryPhoto } from "@/lib/gallery";
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon, XIcon } from "./icons";

// Nota: la clase `md:min-w-[calc(100%_+_300px)]` de las filas garantiza al
// menos 150 px de recorrido por lado en cualquier pantalla (incluido el
// zoom global), de modo que el desplazamiento nunca deja huecos.

/** Lightbox accesible: foco atrapado, Escape/flechas, bloqueo de scroll. */
function LightboxDialog({
  photo,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  photo: GalleryPhoto;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        onPrev();
        return;
      }
      if (event.key === "ArrowRight") {
        onNext();
        return;
      }
      if (event.key === "Tab") {
        const buttons =
          panelRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons || buttons.length === 0) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const dimensions = photoDimensions(photo);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onClick={onClose}
    >
      {/* Cerrar: fijo en la esquina de la pantalla, siempre visible */}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors hover:bg-white/25"
      >
        <XIcon className="size-5" />
      </button>

      <div
        ref={panelRef}
        className="flex w-full max-w-5xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex w-full items-center justify-center">
          <Image
            src={photoSrc(photo, 1600)}
            alt={photo.alt}
            width={dimensions.width}
            height={dimensions.height}
            priority
            className="h-auto w-auto max-h-[70vh] max-w-full rounded-xl object-contain"
          />
          <button
            type="button"
            onClick={onPrev}
            aria-label="Foto anterior"
            className="absolute left-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors hover:bg-sky-light/40 sm:-left-4"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Foto siguiente"
            className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors hover:bg-sky-light/40 sm:-right-4"
          >
            <ChevronRightIcon className="size-5" />
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-white sm:text-base">
          <span className="font-bold">{photo.title}</span>
          <span className="mx-2 text-sky">·</span>
          <span className="text-white/80">{photo.location}</span>
        </p>
        <p className="mt-1 text-xs font-semibold text-white/50">
          {index + 1} / {total}
        </p>
      </div>
    </div>
  );
}

/**
 * Galería editorial Masonry: filas de fotos con desplazamiento horizontal
 * vinculado al scroll (direcciones alternas e intensidades distintas por
 * fila), hover con acento azul y lightbox accesible.
 */
export default function GallerySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Recorrido real (px) permitido por fila: min(travel configurado,
  // mitad del desbordamiento medido) para no dejar huecos jamás.
  const shiftsRef = useRef<number[]>(galleryRows.map(() => 0));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const openAt = useCallback((index: number, opener: HTMLElement) => {
    openerRef.current = opener;
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    // Devuelve el foco a la tarjeta que abrió el diálogo (sin mover scroll).
    requestAnimationFrame(() => {
      openerRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const prevPhoto = useCallback(() => {
    setLightboxIndex((index) =>
      index === null ? null : (index + galleryPhotos.length - 1) % galleryPhotos.length,
    );
  }, []);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((index) =>
      index === null ? null : (index + 1) % galleryPhotos.length,
    );
  }, []);

  // ── Movimiento horizontal vinculado al scroll ───────────────────────
  // Sin estado de React: un listener pasivo de scroll agenda un solo rAF
  // que escribe `translate3d` directamente sobre cada fila. El progreso
  // (0 al entrar la sección, 1 al salir) es reversible y proporcional, y
  // las filas pares van ← y las impares →. Con prefers-reduced-motion o
  // en pantallas <768px las filas quedan estáticas.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const clearTransforms = () => {
      galleryRows.forEach((_, index) => {
        const element = rowRefs.current[index];
        if (element) element.style.transform = "";
      });
    };

    // Mitad del desbordamiento real de cada fila (la clase min-w garantiza
    // al menos MIN_TRAVEL_PX por lado en cualquier pantalla).
    const measure = () => {
      const width = section.clientWidth;
      galleryRows.forEach((row, index) => {
        const element = rowRefs.current[index];
        if (!element) return;
        const overflow = Math.max(0, element.scrollWidth - width) / 2;
        shiftsRef.current[index] = Math.min(row.travel, overflow);
      });
    };
    measure();

    let raf = 0;
    const update = () => {
      raf = 0;
      if (window.innerWidth < 768) {
        clearTransforms();
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewport) return; // fuera de pantalla
      const progress = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / (viewport + rect.height)),
      );
      const t = progress * 2 - 1; // -1 al entrar … +1 al salir
      galleryRows.forEach((row, index) => {
        const element = rowRefs.current[index];
        if (!element) return;
        const direction = index % 2 === 0 ? -1 : 1;
        element.style.transform = `translate3d(${
          t * direction * shiftsRef.current[index]
        }px,0,0)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      clearTransforms();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="galeria-titulo"
      className="relative overflow-x-clip bg-black py-16 sm:py-20 lg:py-24"
    >
      {/* Encabezado */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-sky sm:text-sm">
            Momentos inolvidables
          </p>
          <h2
            id="galeria-titulo"
            className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            El Salvador se vive, no solo se visita
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-white/70 sm:text-base">
            Descubre los paisajes, las personas y las aventuras que hacen
            especial cada recorrido con Cruz Control Tours.
          </p>
        </div>
      </div>

      {/* Filas de la galería: grid 2 columnas en móvil (estáticas) y filas
          flex en md+ que se desplazan con el scroll. */}
      <div className="mt-10 flex flex-col gap-4 sm:mt-14 sm:gap-5">
        {galleryRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            ref={(element) => {
              rowRefs.current[rowIndex] = element;
            }}
            className={`grid grid-cols-2 gap-3 px-4 will-change-transform sm:px-6 md:flex md:min-w-[calc(100%_+_300px)] md:justify-center md:gap-5 md:px-0 ${row.height}`}
          >
            {row.photos.map((photo, photoIndex) => {
              const flatIndex = galleryOffsets[rowIndex] + photoIndex;
              return (
                <button
                  key={`${photo.id}-${photoIndex}`}
                  type="button"
                  onClick={(event) => openAt(flatIndex, event.currentTarget)}
                  aria-haspopup="dialog"
                  aria-label={`Ampliar foto: ${photo.title}, ${photo.location}`}
                  className={`group relative shrink-0 overflow-hidden rounded-xl bg-charcoal ring-1 ring-white/10 transition-shadow duration-300 hover:ring-sky md:aspect-auto md:h-full ${photo.aspect} ${photo.width} ${
                    photo.wide ? "col-span-2" : ""
                  }`}
                >
                  {/* La escala del hover vive en un contenedor interno: el
                      translate de la fila y este transform nunca se pisan. */}
                  <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.04]">
                    <Image
                      src={photoSrc(photo, 900)}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 50vw, 420px"
                      className="object-cover"
                      style={{ objectPosition: photo.position }}
                    />
                  </div>

                  {/* Overlay oscuro que se revela con hover o foco */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />

                  {/* Título + icono de ampliar (hover/foco) */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <ExpandIcon className="size-6 text-sky" />
                    <p className="text-sm font-bold text-white sm:text-base">
                      {photo.title}
                    </p>
                  </div>

                  {/* Destino siempre visible (esencial en dispositivos
                      táctiles, donde no existe hover) */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4"
                  >
                    <p className="truncate text-xs font-semibold text-white">
                      {photo.location}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <LightboxDialog
          photo={galleryPhotos[lightboxIndex]}
          index={lightboxIndex}
          total={galleryPhotos.length}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </section>
  );
}
