import { PhoneIcon } from "./icons";

const WHATSAPP_URL = "https://wa.me/50360503161";

/** Franja de llamado a la acción con video de fondo, justo arriba del footer. */
export default function CtaSection() {
  return (
    <section
      aria-labelledby="cta-titulo"
      className="relative overflow-hidden bg-brand"
    >
      {/* Video de fondo en bucle (muted + playsInline). Con movimiento
          reducido se oculta y queda la franja negra lisa. */}
      <video
        src="/videos/1.mp4"
        aria-hidden="true"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      />

      {/* Overlay negro degradado para mantener la legibilidad del texto */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-center">
        <div>
          <h2
            id="cta-titulo"
            className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl"
          >
            ¿Listo para viajar?
          </h2>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/90 sm:text-base">
            Escríbenos y armamos tu itinerario según tu fecha, presupuesto y
            estilo de viaje.
          </p>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-brand shadow-lg transition-colors hover:bg-charcoal hover:text-white sm:px-6 sm:py-3 sm:text-sm"
        >
          <PhoneIcon className="size-4" />
          Escríbenos por WhatsApp
        </a>
      </div>
    </section>
  );
}
