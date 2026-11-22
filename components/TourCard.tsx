import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/lib/tours";
import { ClockIcon, ImageIcon, MapPinIcon } from "./icons";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal/5 transition-shadow hover:shadow-lg hover:shadow-charcoal/10">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sky-pale">
        {tour.image ? (
          <Image
            src={tour.image}
            alt={tour.imageAlt}
            fill
            sizes="(max-width: 767px) 360px, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <ImageIcon className="size-10 text-sky-deep/40" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-sky-deep/60">
                Foto próximamente
              </p>
            </div>
          </div>
        )}
        {/* Degradado inferior para legibilidad */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-charcoal/85 via-charcoal/35 to-transparent" />

        {/* Nombre y ubicación sobre la imagen */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="flex items-center gap-1 text-xs font-medium text-white/80">
            <MapPinIcon className="size-3.5 shrink-0" />
            <span className="truncate">{tour.location}</span>
          </p>
          {/* Altura fija de dos líneas para que todas las cards midan igual */}
          <h3 className="mt-1 line-clamp-2 min-h-[2.75em] text-sm font-bold leading-snug sm:text-lg">
            {tour.name}
          </h3>
        </div>
      </div>

      {/* Duración y precio */}
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <ClockIcon className="size-4 shrink-0 text-ink-faint" />
          <span className="truncate">{tour.duration}</span>
        </p>
        <p className="shrink-0 text-right leading-none">
          <span className="text-[11px] font-medium text-ink-faint">Desde {" "}</span>
          <span className="text-base font-extrabold text-sky-deep sm:text-lg">
            ${tour.price}
          </span>

        </p>
      </div>
      <Link
        href={`/tours/${tour.slug}`}
        aria-label={`Ver detalle de ${tour.name}`}
        className="absolute inset-0 rounded-2xl"
      />
    </article>
  );
}
