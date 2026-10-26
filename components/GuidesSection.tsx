import Image from "next/image";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { ArrowRightIcon } from "./icons";

/**
 * Sección "Guías de viaje" estilo framer.university: eyebrow + título +
 * descripción + link, y tarjetas con imagen, categoría, título y extracto.
 * Las tarjetas enlazan a /tours hasta que existan páginas reales de guías.
 */
export default function GuidesSection() {
  return (
    <section
      aria-labelledby="guias-titulo"
      className="bg-white py-14 sm:py-16"
    >
      <div className="text-start max-w-7xl px-4 sm:px-6">
        <div className="text-start max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-sky-deep sm:text-sm">
            Guías de viaje
          </p>
          <h2
            id="guias-titulo"
            className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Consejos y rutas para tu próxima aventura
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft sm:text-base">
            Itinerarios, recomendaciones y datos útiles para que aproveches
            al máximo cada destino de El Salvador.
          </p>
          <Link
            href="/tours"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-sky sm:text-base"
          >
            Ver todos los tours
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href="/tours"
              className="group overflow-hidden rounded-2xl border border-ink/10 bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-sky-pale/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={guide.image}
                  alt={guide.imageAlt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-deep">
                  {guide.category}
                </p>
                <h3 className="mt-2 text-base font-bold text-ink sm:text-lg">
                  {guide.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">
                  {guide.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
