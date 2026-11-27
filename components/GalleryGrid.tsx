"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { galeriaPhotos, photoSrc } from "@/lib/gallery";
import LightboxDialog from "./LightboxDialog";
import { ExpandIcon } from "./icons";

/**
 * Mosaico de la página /galeria: columnas tipo masonry con las fotos de
 * public/gallery, hover con título y lightbox accesible compartido.
 */
export default function GalleryGrid() {
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
      index === null ? null : (index + galeriaPhotos.length - 1) % galeriaPhotos.length,
    );
  }, []);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((index) =>
      index === null ? null : (index + 1) % galeriaPhotos.length,
    );
  }, []);

  return (
    <>
      <p className="mb-6 text-sm font-semibold text-ink-soft">
        <span className="font-extrabold text-primary">
          {galeriaPhotos.length}
        </span>{" "}
        fotos de nuestros tours
      </p>
      <div className="columns-2 gap-4 md:columns-3 xl:columns-4 [&>*]:mb-4">
        {galeriaPhotos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={(event) => openAt(index, event.currentTarget)}
            aria-haspopup="dialog"
            aria-label={`Ampliar foto: ${photo.title}, ${photo.location}`}
            className={`group relative block w-full break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-ink/10 transition-shadow duration-300 hover:ring-neutral-400 ${photo.aspect}`}
          >
            <Image
              src={photoSrc(photo)}
              alt=""
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              style={{ objectPosition: photo.position }}
            />

            {/* Overlay oscuro que se revela con hover o foco */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
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

          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <LightboxDialog
          photo={galeriaPhotos[lightboxIndex]}
          index={lightboxIndex}
          total={galeriaPhotos.length}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </>
  );
}
