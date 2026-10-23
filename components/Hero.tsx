"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ShieldCheckIcon, SparklesIcon, UsersIcon } from "./icons";

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

const BENEFITS = [
  { icon: UsersIcon, label: "Guías locales expertos" },
  { icon: ShieldCheckIcon, label: "Viaje seguro" },
  { icon: SparklesIcon, label: "Experiencias auténticas" },
];

export default function Hero() {
  // `visible` es la escena en la capa delantera; `fading` indica que un
  // fundido cruzado está en curso; `failed` marca escenas con video caído.
  const [visible, setVisible] = useState(0);
  const [fading, setFading] = useState(false);
  const [failed, setFailed] = useState<boolean[]>(() => SCENES.map(() => false));
  const [reducedMotion, setReducedMotion] = useState(false);
  // El primer video entra con un fade-in suave sobre la imagen de respaldo.
  const [started, setStarted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);

  // ── Motor de secuencia (se arma una sola vez al montar) ─────────────
  // Usa dos capas <video> superpuestas: la delantera muestra la escena
  // actual y la trasera trae la siguiente. Al terminar cada escena, la
  // capa trasera se funde a opacidad 1 mientras la delantera baja a 0
  // (crossfade auténtico, sin huecos ni carrusel). Los videos nunca se
  // recrean: solo se les cambia el src cuando están ocultos.
  useEffect(() => {
    const frontVideo = videoRefs.current[0];
    const backVideo = videoRefs.current[1];
    if (!frontVideo || !backVideo) return;

    // Accesibilidad: con movimiento reducido se deja la imagen estática.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      return;
    }

    const connection = (navigator as Navigator & { connection?: ConnectionLike })
      .connection;
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
    let isFading = false;
    let waiting = false; // true mientras se espera que la escena siguiente cargue
    const failedScenes = SCENES.map(() => false);
    const timers: {
      prep?: number;
      scene?: number;
      ready?: number;
      fade?: number;
    } = {};

    const clearTimer = (key: keyof typeof timers) => {
      if (timers[key] !== undefined) {
        window.clearTimeout(timers[key]);
        delete timers[key];
      }
    };
    const clearTimers = () => {
      clearTimer("prep");
      clearTimer("scene");
      clearTimer("ready");
      clearTimer("fade");
    };

    const markFailed = (index: number, value: boolean) => {
      failedScenes[index] = value;
      setFailed([...failedScenes]);
    };

    // La capa que acaba de quedar oculta ahora carga (solo metadatos) la
    // escena que seguirá después: el cambio de src nunca es visible.
    const prepareBackLayer = () => {
      const hiddenLayer = (current + 1) % 2;
      const upcoming = (current + 1) % SCENES.length;
      const video = videoRefs.current[hiddenLayer];
      if (!video) return;
      video.pause();
      video.src = sceneSrc(upcoming);
      video.preload = "metadata";
      video.load();
    };

    const scheduleNextScene = () => {
      clearTimer("prep");
      clearTimer("scene");
      // Precarga controlada: el siguiente video empieza a descargarse un
      // poco antes de necesitarse, nunca todos a la vez.
      timers.prep = window.setTimeout(() => {
        if (isFading) return;
        const video = videoRefs.current[(current + 1) % 2];
        if (video) {
          video.preload = "auto";
          video.load();
        }
      }, SCENE_MS - PREP_MS);
      timers.scene = window.setTimeout(advance, SCENE_MS);
    };

    const startFade = () => {
      if (isFading) return;
      waiting = false;
      clearTimer("ready");
      const next = (current + 1) % SCENES.length;
      if (!failedScenes[next]) {
        videoRefs.current[(current + 1) % 2]?.play().catch(() => {
          markFailed(next, true);
        });
      }
      isFading = true;
      setFading(true);
      timers.fade = window.setTimeout(() => {
        current = (current + 1) % SCENES.length;
        setVisible(current);
        isFading = false;
        setFading(false);
        prepareBackLayer();
        scheduleNextScene();
      }, CROSSFADE_MS);
    };

    // Al terminar el tiempo de la escena: fundir a la siguiente si ya está
    // lista, o esperar a que cargue (con límite y respaldo de imagen).
    function advance() {
      if (isFading) return;
      const next = (current + 1) % SCENES.length;
      markFailed(next, false); // nueva oportunidad para escenas caídas
      const video = videoRefs.current[(current + 1) % 2];
      if (!video) {
        startFade();
        return;
      }
      if (video.readyState >= 3) {
        startFade();
        return;
      }
      video.preload = "auto";
      video.load();
      waiting = true;
      clearTimer("ready");
      timers.ready = window.setTimeout(() => {
        // Tardó demasiado: imagen de respaldo y el ciclo continúa.
        markFailed(next, true);
        startFade();
      }, READY_TIMEOUT_MS);
    }

    // El video trasero terminó de precargarse: ya puede empezar el fundido.
    const handleCanPlay = (event: Event) => {
      if (!waiting) return;
      if (event.target !== videoRefs.current[(current + 1) % 2]) return;
      startFade();
    };

    const handleError = (event: Event) => {
      const layer = event.target === videoRefs.current[0] ? 0 : 1;
      const sceneIdx =
        layer === current % 2 ? current : (current + 1) % SCENES.length;
      markFailed(sceneIdx, true);
      if (waiting) startFade();
    };

    // Cuando un video empieza a reproducirse de verdad, ya se puede fundir
    // desde la imagen de respaldo (cubre el tiempo de carga inicial).
    const handlePlaying = () => setStarted(true);

    frontVideo.addEventListener("canplay", handleCanPlay);
    frontVideo.addEventListener("error", handleError);
    frontVideo.addEventListener("playing", handlePlaying);
    backVideo.addEventListener("canplay", handleCanPlay);
    backVideo.addEventListener("error", handleError);
    backVideo.addEventListener("playing", handlePlaying);

    // Arranque: la primera escena se reproduce y la segunda queda en
    // metadatos (no se descargan todos los videos a la vez).
    frontVideo.src = sceneSrc(0);
    frontVideo.preload = "auto";
    frontVideo.load();
    frontVideo.play().catch(() => {
      markFailed(0, true);
    });
    backVideo.src = sceneSrc(1);
    backVideo.preload = "metadata";
    backVideo.load();

    scheduleNextScene();

    return () => {
      clearTimers();
      frontVideo.removeEventListener("canplay", handleCanPlay);
      frontVideo.removeEventListener("error", handleError);
      frontVideo.removeEventListener("playing", handlePlaying);
      backVideo.removeEventListener("canplay", handleCanPlay);
      backVideo.removeEventListener("error", handleError);
      backVideo.removeEventListener("playing", handlePlaying);
      frontVideo.pause();
      backVideo.pause();
    };
  }, []);

  // Capa 0 → escenas pares, capa 1 → escenas impares: cada escena siempre
  // entra por una capa distinta a la que sale.
  const front = visible % 2;
  const nextScene = (visible + 1) % SCENES.length;
  const layerScenes = [
    front === 0 ? visible : nextScene,
    front === 1 ? visible : nextScene,
  ];

  return (
    <section className="relative overflow-hidden bg-charcoal" aria-label="Presentación">
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

      {/* Overlay degradado para garantizar la legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-charcoal/60 to-charcoal/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/70" />

      {/* El padding inferior reserva espacio para el buscador superpuesto */}
      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 pb-48 pt-20 sm:px-6 sm:pb-52 lg:min-h-[640px] lg:pb-56 lg:pt-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Los mejores tours en{" "}
            <span className="font-extrabold">
              {" "}
              <br />
              El Salvador</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg lg:text-xl">
            Aventuras únicas y experiencias que se quedan para siempre.
          </p>
          <ul className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 sm:mt-10">
            {BENEFITS.map(({ icon: BenefitIcon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <span className="grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm ring-1 ring-white/20 sm:size-11">
                  <BenefitIcon className="size-4.5 sm:size-5" />
                </span>
                <span className="text-sm font-semibold text-white/90">{label}</span>
              </li>
            ))}
          </ul>

          {/* Frase manuscrita (móvil y tablets) */}
          <div className="mt-12 xl:hidden">
            <p className="font-script text-3xl text-white/90">El Salvador te espera</p>
            <svg
              viewBox="0 0 220 12"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="mt-1 h-3 w-48 text-white"
            >
              <path
                d="M3 9c40-6 140-8 214-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Frase manuscrita (desktop) */}
      <div className="pointer-events-none absolute right-10 top-1/2 z-10 hidden -translate-y-1/2 rotate-[-6deg] xl:block">
        <p className="font-script text-4xl text-white drop-shadow-lg">
          El Salvador te espera
        </p>
        <svg
          viewBox="0 0 220 12"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="mt-1 h-3 w-56 text-white"
        >
          <path
            d="M3 9c40-6 140-8 214-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
