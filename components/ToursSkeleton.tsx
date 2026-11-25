/** Esqueleto de carga con la misma retícula que las secciones de tours. */
export default function ToursSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-busy="true">
      <p className="sr-only">Cargando tours…</p>
      <ul
        aria-hidden="true"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 lg:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: count }, (_, index) => (
          <li
            key={index}
            className="w-[72vw] max-w-[270px] shrink-0 snap-start md:w-auto md:max-w-none"
          >
            <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal/5">
              {/* Foto + ubicación y título sobre la imagen */}
              <div className="relative aspect-[4/5] bg-sky-pale">
                <div className="absolute inset-x-4 bottom-4 space-y-2">
                  <div className="h-3 w-1/2 rounded-full bg-white/60" />
                  <div className="h-4 rounded-full bg-white/60" />
                  <div className="h-4 w-2/3 rounded-full bg-white/60" />
                </div>
              </div>
              {/* Duración + precio */}
              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="h-3 w-1/3 rounded-full bg-ink/10" />
                <div className="h-4 w-1/4 rounded-full bg-ink/10" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
