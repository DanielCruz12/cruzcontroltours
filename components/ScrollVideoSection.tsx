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

/** Ancho inicial del marco (debe coincidir con las clases w-[80vw]/md:w-[50vw]). */
const FRAME_WIDTH = { mobile: 0.8, desktop: 0.5 };
/** Baja el video en desktop (debe coincidir con md:pt-[24vh]; en móvil va centrado). */
const OFFSET_TOP_VH = 24;

/**
 * Escala para que el marco (16:9) cubra el viewport al llegar al 100%.
 * Se calcula desde el CSS (no del DOM) para que siga siendo válida con
 * invalidateOnRefresh en cualquier progreso. El ×1.03 extra garantiza
 * borde a borde sin líneas de 1px por redondeo.
 */
function coverScale(): number {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const frameWidth = (vw < 768 ? FRAME_WIDTH.mobile : FRAME_WIDTH.desktop) * vw;
  const frameHeight = (frameWidth * 9) / 16;
  // El centro vertical del marco baja por el padding-top del contenedor
  // (solo desktop; en móvil va centrado).
  const offsetVh = vw < 768 ? 0 : OFFSET_TOP_VH;
  const centerY = ((100 + offsetVh) / 200) * vh;
  const scaleH = vw / frameWidth;
  const scaleV = Math.max(centerY, vh - centerY) / (frameHeight / 2);
  return Math.max(scaleH, scaleV) * 1.03;
}

/**
 * Sección de video que se expande con el scroll (ScrollTrigger + Lenis
 * global): 250vh con pin, el marco crece de 50% a fullscreen y el radio
 * baja de 24px a 0. Con prefers-reduced-motion no hay expansión: video
 * estático con botón de play.
 */
export default function ScrollVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
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

  // Expansión con scrub (solo transform + border-radius + opacidades).
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const frame = frameRef.current;
    const title = titleRef.current;
    const end = endRef.current;
    const video = videoRef.current;
    if (!section || !frame || !title || !end || !video) return;

    const ctx = gsap.context(() => {
      // Estado inicial del contenido final (oculto hasta el ~70% del pin).
      gsap.set(end, { autoAlpha: 0, y: 40, scale: 0.95 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          // Empieza un poco antes del pin para que el crecimiento se note temprano.
          start: "top 80%",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
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
      // El marco crece rápido al inicio (power1.out) y termina antes de la
      // mitad; luego el fullscreen se sostiene un momento antes de soltar.
      tl.to(
        frame,
        {
          scale: () => coverScale(),
          borderRadius: 0,
          duration: 0.55,
          ease: "power1.out",
        },
        0,
      );
      tl.to(title, { opacity: 0, y: -80, scale: 1.4, duration: 0.25 }, 0);
      tl.to(end, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3 }, 0.6);
      tl.to({}, { duration: 0.15 }, 0.9);
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
      className={`relative bg-black ${reduced ? "py-20 sm:py-28" : "h-[250vh]"}`}
    >
      <div
        className={
          reduced
            ? "relative mx-auto flex max-w-5xl justify-center px-4 sm:px-6"
            : "sticky top-0 flex h-screen items-center justify-center overflow-hidden md:pt-[24vh]"
        }
      >
        {/* Marco del video: 80% móvil / 50% desktop, radio 24px */}
        <div
          ref={frameRef}
          className="relative z-0 aspect-video w-[80vw] overflow-hidden rounded-[24px] bg-black ring-1 ring-white/10 md:w-[50vw]"
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
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
        </div>

        {/* Título sobre el video (se desvanece y sube al crecer) */}
        <div
          ref={titleRef}
          className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 ${reduced ? "" : "md:pt-[24vh]"}`}
        >
          <h2
            id="video-titulo"
            className="text-center text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl"
          >
            El Salvador te espera
          </h2>
        </div>

        {/* Contenido final: entra con fade-up al llegar al 100% */}
        {!reduced && (
          <div
            ref={endRef}
            className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-24 text-center sm:pb-16"
          >
            <p className="text-2xl font-bold text-white drop-shadow-md sm:text-4xl">
              ¿Listo para vivirlo?
            </p>
            <Link
              href="/tours"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explorar tours
            </Link>
          </div>
        )}

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

      {/* Movimiento reducido: CTA estático bajo el video */}
      {reduced && (
        <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center px-4 text-center sm:px-6">
          <p className="text-2xl font-bold text-white sm:text-4xl">
            ¿Listo para vivirlo?
          </p>
          <Link
            href="/tours"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explorar tours
          </Link>
        </div>
      )}
    </section>
  );
}
