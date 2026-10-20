import Image from "next/image";
import { ShieldCheckIcon, SparklesIcon, UsersIcon } from "./icons";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1701815843414-50779f1c3b78?q=80&w=1920&auto=format&fit=crop";

const BENEFITS = [
  { icon: UsersIcon, label: "Guías locales expertos" },
  { icon: ShieldCheckIcon, label: "Viaje seguro" },
  { icon: SparklesIcon, label: "Experiencias auténticas" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal" aria-label="Presentación">
      <Image
        src={HERO_IMAGE}
        alt="Laguna turquesa en el cráter del volcán de Santa Ana, El Salvador"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay degradado para garantizar la legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-charcoal/60 to-charcoal/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/70" />

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 pb-36 pt-20 sm:px-6 sm:pb-40 lg:min-h-[640px] lg:pb-44 lg:pt-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Los mejores tours en{" "}
            <span className="text-white">El Salvador</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg lg:text-xl">
            Aventuras únicas, paisajes increíbles y experiencias que se quedan
            para siempre.
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
