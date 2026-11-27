"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { photoDimensions, photoSrc } from "@/lib/gallery";
import type { GalleryPhoto } from "@/lib/gallery";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "./icons";

/** Lightbox accesible: foco atrapado, Escape/flechas, bloqueo de scroll. */
export default function LightboxDialog({
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
            src={photoSrc(photo)}
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
            className="absolute left-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors hover:bg-white/25 sm:-left-4"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Foto siguiente"
            className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors hover:bg-white/25 sm:-right-4"
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
