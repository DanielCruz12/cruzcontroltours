"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PauseIcon, PlayIcon, VolumeIcon, VolumeOffIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger);

// Video propio (bg.mp4, 11.9 MB). Para usar un stock de internet basta
// con sustituir esta URL por la del MP4 (H.264) y agregar su WebM como
// segundo <source> si se genera (aquí no hay ffmpeg disponible).
const VIDEO_SRC = "/videos/bg.mp4";
// Poster mientras carga (foto ya probada en el repo).
const POSTER_SRC =
  "https://images.unsplash.com/photo-1701815843414-50779f1c3b78?q=80&w=1600&auto=format&fit=crop";

/** Marco inicial (debe coincidir con el style inline del marco). */
const FRAME_START = { width: "60vw", height: "60svh", radius: 24 };

/**
 * Sección de video que se expande con el scroll (ScrollTrigger + Lenis
 * global): sección de 250vh con sticky de 100svh centrado (grid); el marco
 * crece de 60vw×60svh (radio 24px) a 100vw×100svh (radio 0) en el primer
 * 80% del recorrido, y el título + CTA se funden en el último 20%.
 * Con prefers-reduced-motion no hay expansión: video estático con
 * botón de play.
 */
export default function ScrollVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Se lee en el estado inicial (no en un efecto) para no disparar
  // renders en cascada; solo los cambios se escuchan en el efecto.
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  // El navegador solo permite quitar el mute tras interacción del usuario.
  const interactedRef = useRef(false);
  // En modo reducido el play solo lo inicia el botón de play.
  const userPlayingRef = useRef(false);

  // Reacciona si la preferencia cambia con la página abierta.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) =>
      setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // El atributo muted de React solo aplica al inicio: sincronizar la propiedad.
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const mark = () => {
      interactedRef.current = true;
    };
    window.addEventListener("pointerdown", mark, { once: true });
    window.addEventListener("keydown", mark, { once: true });
    return () => {
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
    };
  }, []);

  // Expansión con scrub: el marco anima width/height/border-radius
  // (sin aspect-ratio) y el overlay funde su opacidad al final.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const frame = frameRef.current;
    const overlay = overlayRef.current;
    const video = videoRef.current;
    if (!section || !frame || !overlay || !video) return;

    const ctx = gsap.context(() => {
      // Origen centrado: el marco crece simétricamente hacia los bordes.
      gsap.set(frame, { transformOrigin: "50% 50%" });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          // La animación vive exactamente lo que dura el sticky.
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            // Al llegar al 100%, si el usuario ya interactuó con la página,
            // se quita el mute automáticamente.
            if (
              self.progress >= 0.999 &&
              interactedRef.current &&
              video.muted
            ) {
              setMuted(false);
            }
          },
        },
      });
      // El marco llega al 100% en el 80% del recorrido: cuando el sticky
      // se libera y entra la siguiente sección ya está en fullscreen.
      tl.fromTo(
        frame,
        {
          width: FRAME_START.width,
          height: FRAME_START.height,
          borderRadius: FRAME_START.radius,
        },
        {
          width: "100vw",
          height: "100svh",
          borderRadius: 0,
          duration: 0.8,
        },
        0,
      );
      // Título + CTA centrados: fundido a 0 en el último 20%.
      tl.fromTo(
        overlay,
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 0.2 },
        0.8,
      );
    }, section);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [reduced]);

  // Reproducir al entrar en pantalla, pausar al salir.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (!visible) {
          video.pause();
          setPlaying(false);
          return;
        }
        // En modo reducido solo se reanuda si el usuario le dio play.
        if (reduced && !userPlayingRef.current) return;
        video
          .play()
          .then(() => setPlaying(true))
          .catch(() => {});
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduced]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPlayingRef.current = true;
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      userPlayingRef.current = false;
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="video-titulo"
      className={`relative m-0 bg-white p-0 ${reduced ? "py-20 sm:py-28" : "video-zoom-reset h-[250vh]"}`}
    >
      <div
        className={
          reduced
            ? "relative mx-auto flex max-w-5xl justify-center px-4 sm:px-6"
            : "sticky top-0 m-0 grid h-[100svh] w-full place-items-center overflow-hidden p-0"
        }
      >
        {/* Marco del video: 60vw×60svh con radio 24px (sin aspect-ratio).
            El único overflow hidden del bloque vive aquí y en el sticky. */}
        <div
          ref={frameRef}
          style={
            reduced
              ? undefined
              : {
                  width: FRAME_START.width,
                  height: FRAME_START.height,
                  borderRadius: FRAME_START.radius,
                }
          }
          className={
            reduced
              ? "relative z-0 aspect-video w-full overflow-hidden rounded-[24px] bg-neutral-100 ring-1 ring-black/10"
              : "relative z-0 overflow-hidden bg-neutral-100 ring-1 ring-black/10"
          }
        >
          <video
            ref={videoRef}
            className="block h-full w-full object-cover"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Video de paisajes de El Salvador"
          >
            {/* Sin <track>: el clip no tiene voz ni diálogos. */}
          </video>
          {/* Overlay fijo para legibilidad del título. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,.25)" }}
          />
        </div>

        {/* Título + CTA centrados sobre el video (funden al final).
            El contenedor no captura clics; solo el botón es clicable. */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6"
        >
          <div className="flex flex-col items-center text-center">
            <h2
              id="video-titulo"
              className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl"
            >
              El Salvador te espera
            </h2>
            <Link
              href="/tours"
              className="pointer-events-auto mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explorar tours
            </Link>
          </div>
        </div>

        {/* Botón de sonido */}
        <button
          type="button"
          onClick={() => setMuted((current) => !current)}
          aria-label={muted ? "Activar sonido del video" : "Silenciar video"}
          aria-pressed={!muted}
          className="absolute bottom-6 right-6 z-20 grid size-12 place-items-center rounded-full bg-white/80 text-neutral-900 shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-8 sm:right-8"
        >
          {muted ? (
            <VolumeOffIcon className="size-5" />
          ) : (
            <VolumeIcon className="size-5" />
          )}
        </button>

        {/* Movimiento reducido: video estático con botón de play */}
        {reduced && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pausar video" : "Reproducir video"}
            aria-pressed={playing}
            className="absolute left-1/2 top-1/2 z-20 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-xl transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {playing ? (
              <PauseIcon className="size-8" />
            ) : (
              <PlayIcon className="ml-1 size-8" />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
