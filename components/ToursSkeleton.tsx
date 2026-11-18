/** Esqueleto de carga con la misma retícula que las secciones de tours. */
export default function ToursSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div aria-busy="true">
      <p className="sr-only">Cargando tours…</p>
      <ul
        aria-hidden="true"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-5"
      >
        {Array.from({ length: count }, (_, index) => (
          <li
            key={index}
            className="w-[60vw] max-w-[210px] shrink-0 snap-start md:w-auto md:max-w-none"
          >
            <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal/5">
              <div className="aspect-[4/5] bg-sky-pale" />
              <div className="space-y-2 px-4 py-3.5">
                <div className="h-3 rounded-full bg-ink/10" />
                <div className="h-3 w-2/3 rounded-full bg-ink/10" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
