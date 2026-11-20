/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  HeartIcon,
  ImageIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
} from "./icons";

// ── Escenas de video del hero ────────────────────────────────────────
// Los archivos van en /public/videos/ (actualmente: 1.mp4, 2.mp4 y 3.mp4).
// Por escena puedes configurar:
//  · src:        ruta del video (obligatoria).
//  · mobileSrc:  versión ligera para pantallas pequeñas o conexiones
//                lentas (opcional). Colócala junto al original, p. ej.
//                /videos/1-mobile.mp4. Si no existe, se usa `src`.
//  · position:   punto focal del recorte (object-position).
type HeroScene = {
  src: string;
  mobileSrc?: string;
  position: string;
};

const SCENES: HeroScene[] = [
  { src: "/videos/1.mp4", position: "50% 50%" },
  { src: "/videos/2.mp4", position: "50% 50%" },
  { src: "/videos/3.mp4", position: "50% 50%" },
];

// Imagen de respaldo: se muestra sin JavaScript, con prefers-reduced-motion
// o si un video falla o tarda demasiado en cargar.
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1701815843414-50779f1c3b78?q=80&w=1920&auto=format&fit=crop";

// Tiempos (milisegundos)
const SCENE_MS = 10_000; // duración visual de cada escena
const CROSSFADE_MS = 1_200; // fundido cruzado entre escenas
const PREP_MS = 2_000; // cuánto antes se precarga el siguiente video
const READY_TIMEOUT_MS = 5_000; // máximo de espera antes de usar el respaldo

type ConnectionLike = { saveData?: boolean; effectiveType?: string };

const PLACEHOLDER_EXAMPLES = [
  "Tour de 3 días por la Ruta de las Flores…",
  "Fin de semana de surf en El Tunco…",
  "Aventura al volcán de Santa Ana…",
];

const CHIPS = [
  { icon: SearchIcon, text: "Encuentra los mejores tours" },
  { icon: SparklesIcon, text: "Escapada de fin de semana" },
  { icon: HeartIcon, text: "El plan ideal para ti" },
];

const TOOL_ICONS = [SparklesIcon, ImageIcon, SearchIcon, SendIcon];

const EXPERT_AVATARS = [
  { id: 1, initial: "C", classes: "bg-neutral-900 text-white" },
  { id: 2, initial: "C", classes: "bg-neutral-500 text-white" },
  { id: 3, initial: "T", classes: "bg-stone-300 text-neutral-800" },
];

function ToolCircles() {
  return (
    <span className="inline-flex items-center align-middle" aria-hidden="true">
      {TOOL_ICONS.map((Icon, index) => (
        <span
          key={index}
          className={`grid size-9 place-items-center rounded-full bg-white text-neutral-800 shadow-md ring-2 ring-white sm:size-12 ${
            index > 0 ? "-ml-2" : ""
          }`}
        >
          <Icon className="size-4 sm:size-5" />
        </span>
      ))}
    </span>
  );
}

function ExpertAvatars() {
  return (
    <span className="inline-flex items-center align-middle" aria-hidden="true">
      {EXPERT_AVATARS.map((avatar, index) => (
        <span
          key={avatar.id}
          className={`grid size-9 place-items-center rounded-full text-sm font-bold shadow-md ring-2 ring-white sm:size-12 sm:text-base ${avatar.classes} ${
            index > 0 ? "-ml-2" : ""
          }`}
        >
          {avatar.initial}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  // ── Estado del fondo de video ──────────────────────────────────────
  // `visible` es la escena en la capa delantera; `fading` indica que un
  // fundido cruzado está en curso; `failed` marca escenas con video caído.
  const [visible, setVisible] = useState(0);
  const [fading, setFading] = useState(false);
  const [failed, setFailed] = useState<boolean[]>(() =>
    SCENES.map(() => false),
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  // El primer video entra con un fade-in suave sobre la imagen de respaldo.
  const [started, setStarted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);

  // ── Estado del contenido ───────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [exampleVisible, setExampleVisible] = useState(true);

  // ── Motor de secuencia (se arma una sola vez al montar) ─────────────
  // Usa dos capas <video> superpuestas: la delantera muestra la escena
  // actual y la trasera trae la siguiente. Al terminar cada escena, la
  // capa trasera se funde a opacidad 1 mientras la delantera baja a 0
  // (crossfade auténtico, sin huecos ni carrusel). Los videos nunca se
  // recrean: solo se les cambia el src cuando están ocultos.
  useEffect(() => {
    const videos = videoRefs.current;
    if (!videos[0] || !videos[1]) return;

    // Accesibilidad: con movimiento reducido se deja la imagen estática.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      return;
    }

    const connection = (
      navigator as Navigator & { connection?: ConnectionLike }
    ).connection;
    // Conexiones muy limitadas: mejor la imagen estática que un video a medias.
    if (connection?.saveData || connection?.effectiveType === "slow-2g") return;

    // En pantallas pequeñas o conexiones lentas se prefiere mobileSrc.
    const lightMedia =
      window.innerWidth < 768 || connection?.effectiveType === "2g";

    const sceneSrc = (index: number) => {
      const scene = SCENES[index];
      return lightMedia && scene.mobileSrc ? scene.mobileSrc : scene.src;
    };

    let current = 0; // espejo de `visible` para los temporizadores
    const failedScenes = SCENES.map(() => false);
    const layerScene = [0, 1]; // qué escena tiene cargada cada capa
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const markFailed = (sceneIdx: number) => {
      if (failedScenes[sceneIdx]) return;
      failedScenes[sceneIdx] = true;
      setFailed([...failedScenes]);
    };

    const setVideoSrc = (layer: number, sceneIdx: number) => {
      const video = videoRefs.current[layer];
      if (!video) return;
      const src = sceneSrc(sceneIdx);
      if (video.getAttribute("src") !== src) {
        video.setAttribute("src", src);
        video.load();
      }
      layerScene[layer] = sceneIdx;
    };

    const playVideo = (layer: number) => {
      videoRefs.current[layer]?.play().catch(() => {
        markFailed(layerScene[layer]);
      });
    };

    const nextValid = (from: number) => {
      for (let step = 1; step <= SCENES.length; step++) {
        const candidate = (from + step) % SCENES.length;
        if (!failedScenes[candidate]) return candidate;
      }
      return -1;
    };

    const advance = () => {
      const upcoming = nextValid(current);
      // Todas fallidas: se queda la imagen de respaldo.
      if (upcoming === -1) return;
      const hiddenLayer = current % 2 === 0 ? 1 : 0;
      // Precarga la siguiente escena en la capa oculta…
      setVideoSrc(hiddenLayer, upcoming);
      later(() => {
        // …y funde hacia ella.
        current = upcoming;
        setFading(true);
        playVideo(hiddenLayer);
        later(() => {
          setVisible(current);
          setFading(false);
          schedule();
        }, CROSSFADE_MS);
      }, PREP_MS);
    };

    const schedule = () => {
      later(advance, SCENE_MS - PREP_MS);
    };

    const handlePlaying = () => setStarted(true);
    const handleError = (layer: number) => () => {
      markFailed(layerScene[layer]);
      // Si cayó la escena visible, avanza de inmediato a la siguiente válida.
      if (layerScene[layer] === current) {
        timers.forEach((timer) => window.clearTimeout(timer));
        timers.length = 0;
        setFading(false);
        advance();
      }
    };
    const errorHandlers = [handleError(0), handleError(1)];

    videos[0]?.addEventListener("playing", handlePlaying);
    videos[0]?.addEventListener("error", errorHandlers[0]);
    videos[1]?.addEventListener("playing", handlePlaying);
    videos[1]?.addEventListener("error", errorHandlers[1]);

    // Escena inicial en la capa 0.
    setVideoSrc(0, 0);
    playVideo(0);
    // Si tarda demasiado, se marca como fallida y sigue con la siguiente.
    later(() => {
      if (!failedScenes[0]) {
        const video = videoRefs.current[0];
        const stalled =
          !video || video.readyState < 3 || video.currentTime === 0;
        if (stalled) {
          markFailed(0);
          timers.forEach((timer) => window.clearTimeout(timer));
          timers.length = 0;
          advance();
          return;
        }
      }
      schedule();
    }, READY_TIMEOUT_MS);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      videos[0]?.removeEventListener("playing", handlePlaying);
      videos[0]?.removeEventListener("error", errorHandlers[0]);
      videos[1]?.removeEventListener("playing", handlePlaying);
      videos[1]?.removeEventListener("error", errorHandlers[1]);
      videos[0]?.pause();
      videos[1]?.pause();
    };
  }, []);

  // Entrada del contenido + rotación del placeholder (pausada con reduced-motion).
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => {
      setExampleVisible(false);
      window.setTimeout(() => {
        setExampleIndex((index) => (index + 1) % PLACEHOLDER_EXAMPLES.length);
        setExampleVisible(true);
      }, 200);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  // Capa 0 → escenas pares, capa 1 → escenas impares: cada escena siempre
  // entra por una capa distinta a la que sale.
  const front = visible % 2;
  const nextScene = (visible + 1) % SCENES.length;
  const layerScenes = [
    front === 0 ? visible : nextScene,
    front === 1 ? visible : nextScene,
  ];

  const reveal = (distance: string) =>
    `motion-safe:transition-all motion-safe:duration-[600ms] motion-safe:ease-out ${
      mounted
        ? "motion-safe:translate-y-0 motion-safe:opacity-100"
        : `${distance} motion-safe:opacity-0`
    }`;

  return (
    <section
      className="relative flex min-h-svh flex-col overflow-hidden bg-charcoal"
      aria-label="Presentación"
    >
      {/* Capa base: imagen de respaldo (sin JS, con movimiento reducido
          o cuando un video falla o tarda demasiado) */}
      <Image
        src={FALLBACK_IMAGE}
        alt="Laguna turquesa en el cráter del volcán de Santa Ana, El Salvador"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dos capas de video superpuestas para el crossfade. El primer video
          arranca oculto y se funde desde la imagen de respaldo en cuanto
          está listo, para que nunca se vea una espera en vacío. */}
      {layerScenes.map((sceneIdx, layer) => {
        const scene = SCENES[sceneIdx];
        const isFront = layer === front;
        const hide = reducedMotion || (failed[sceneIdx] && isFront);
        let opacity = 0;
        if (!hide) {
          if (isFront) opacity = started && !fading ? 1 : 0;
          else opacity = fading ? 1 : 0;
        }
        return (
          <video
            key={layer}
            ref={(element) => {
              videoRefs.current[layer] = element;
            }}
            aria-hidden="true"
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
            style={{
              opacity,
              objectPosition: scene.position,
              transitionDuration: `${CROSSFADE_MS}ms`,
            }}
          />
        );
      })}

      {/* Overlay oscuro para garantizar la legibilidad del texto */}
      <div className="absolute inset-0 bg-linear-to-r from-charcoal/50 via-charcoal/60 to-charcoal/30" />
      <div className="absolute inset-0 bg-linear-to-b` from-charcoal/40 via-transparent to-charcoal/70" />

      {/* Contenido centrado */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pb-20 pt-18 text-center sm:px-6 ">
        <h1 className="max-w-5xl text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-[72px]">
          <span className="block overflow-hidden">
            <span
              className={`block ${reveal("motion-safe:translate-y-full")}`}
              style={{ transitionDelay: "0ms" }}
            >
              Planea con <ToolCircles /> IA,
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className={`block ${reveal("motion-safe:translate-y-full")}`}
              style={{ transitionDelay: "120ms" }}
            >
              viaja con <ExpertAvatars />
            </span>
          </span>
        </h1>

        <p
          className={`mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-white/85 sm:text-xl ${reveal("motion-safe:translate-y-4")}`}
          style={{ transitionDelay: "250ms" }}
        >
          En Cruz control tours convertimos tu viaje en un itinerario perfecto
        </p>

        {/* Caja de prompt (glassmorphism) */}
        <div
          className={`mx-auto mt-10 w-full max-w-180 ${reveal("motion-safe:translate-y-6")}`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="rounded-[28px] border border-white/60 bg-white/35 p-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)] backdrop-blur-[20px] transition-all duration-300 focus-within:border-white/90 focus-within:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.35)]">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                aria-label="Describe tu viaje ideal"
                rows={1}
                className=" w-full resize-none rounded-[20px] bg-white/70 p-4 pb-14 text-[15px] leading-relaxed text-neutral-900 outline-none"
              />
              {prompt === "" && (
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-4 top-4 text-[15px] text-neutral-400 transition-opacity duration-200 ${
                    exampleVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {PLACEHOLDER_EXAMPLES[exampleIndex]}
                </span>
              )}
              <a
                href="#tours"
                className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl bg-neutral-900 py-2.5 pl-4 pr-3 text-sm font-medium text-white shadow transition-colors hover:bg-neutral-700"
              >
                Crear mi viaje
                <span aria-hidden="true" className="h-4 w-px bg-white/25" />
                <ChevronDownIcon className="size-4" />
              </a>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none md:flex-wrap md:justify-center [&::-webkit-scrollbar]:hidden">
              {CHIPS.map(({ icon: ChipIcon, text }) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => setPrompt(text)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm text-neutral-700 backdrop-blur transition-colors hover:bg-white/90"
                >
                  <ChipIcon className="size-4" />
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
