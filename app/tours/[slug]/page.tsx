import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TourCard from "@/components/TourCard";
import { ClockIcon, MapPinIcon } from "@/components/icons";
import { getTour } from "@/lib/api/tours";
import { toCardTour } from "@/lib/tour-adapters";
import { getAllTours, getTourBySlug, type Tour } from "@/lib/tours";

const WHATSAPP_NUMBER = "50360503161";

export function generateStaticParams() {
  return getAllTours().map((tour) => ({ slug: tour.slug }));
}

type ResolvedTour = { tour: Tour; description: string | null };

// Primero el catálogo estático; si no está, se intenta con el backend
// (sus slugs tienen la forma `nombre-del-tour-<id>`).
async function resolveTour(slug: string): Promise<ResolvedTour | null> {
  const local = getTourBySlug(slug);
  if (local) return { tour: local, description: null };

  const match = slug.match(
    /-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
  );
  if (!match) return null;
  try {
    const apiTour = await getTour(match[1]);
    if (!apiTour.active) return null;
    const tour = toCardTour(apiTour);
    if (tour.slug !== slug) return null;
    return { tour, description: apiTour.description };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveTour(slug);
  if (!resolved) return { title: "Tour no encontrado — Cruz Control Tours" };
  const { tour } = resolved;
  return {
    title: `${tour.name} — Cruz Control Tours`,
    description: `${tour.name} en ${tour.location}: ${tour.duration} por $${tour.price} por persona. Reserva con guías locales.`,
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolved = await resolveTour(slug);
  if (!resolved) notFound();
  const { tour, description } = resolved;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el tour: ${tour.name}`,
  )}`;

  const related = getAllTours().filter((item) => item.id !== tour.id);
  const sameCategory = related.filter(
    (item) => item.category === tour.category,
  );
  const others = related.filter((item) => item.category !== tour.category);
  const suggestions = [...sameCategory, ...others].slice(0, 5);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero con foto */}
        <section className="relative flex min-h-[52svh] items-end overflow-hidden bg-charcoal">
          {tour.image ? (
            <Image
              src={tour.image}
              alt={tour.imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-br from-sky-deep via-sky to-sky-pale"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-charcoal/85 via-charcoal/35 to-charcoal/20"
          />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 pt-28 sm:px-6">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              ← Todos los tours
            </Link>
            <p className="mt-6 inline-flex rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-neutral-900">
              {tour.category}
            </p>
            <h1 className="titulo-display mt-4 max-w-4xl text-white">
              {tour.name}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/85 sm:text-base">
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="size-4" />
                {tour.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="size-4" />
                {tour.duration}
              </span>
            </p>
          </div>
        </section>

        {/* Descripción + reserva */}
        <section className="bg-surface py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px]">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                Sobre esta experiencia
              </h2>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-neutral-600 sm:text-lg">
                {description?.trim() ||
                  `${tour.name} es una experiencia de ${tour.duration} en ${tour.location}, acompañada por guías locales que conocen cada rincón. Nosotros nos encargamos de la logística para que tú solo te preocupes por disfrutar.`}
              </p>
              <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
                El precio es de ${tour.price} por persona. Escríbenos para
                confirmar disponibilidad y armar tu fecha ideal.
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Duración", value: tour.duration },
                  { label: "Ubicación", value: tour.location },
                  { label: "Categoría", value: tour.category },
                ].map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200"
                  >
                    <dt className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-base font-bold text-neutral-900">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Tarjeta de reserva */}
            <aside className="h-fit rounded-[24px] bg-white p-7 shadow-xl shadow-neutral-900/10 ring-1 ring-neutral-200 lg:sticky lg:top-24">
              <p className="text-sm text-neutral-500">Desde</p>
              <p className="mt-1 text-4xl font-extrabold text-neutral-900">
                ${tour.price}
                <span className="text-base font-medium text-neutral-500">
                  {" "}
                  / persona
                </span>
              </p>
              <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
                <p className="flex items-center gap-2">
                  <ClockIcon className="size-4 text-neutral-400" />
                  {tour.duration}
                </p>
                <p className="flex items-center gap-2">
                  <MapPinIcon className="size-4 text-neutral-400" />
                  {tour.location}
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-negro mt-6 w-full"
              >
                Reservar por WhatsApp
              </a>
              <Link
                href="/contacto"
                className="mt-3 block text-center text-sm font-semibold text-neutral-900 hover:underline"
              >
                O escríbenos por el formulario
              </Link>
            </aside>
          </div>
        </section>

        {/* Tours relacionados */}
        {suggestions.length > 0 && (
          <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="pill-negro">Sigue explorando</p>
                  <h2 className="titulo-display mt-4 text-neutral-900">
                    También te puede gustar
                  </h2>
                </div>
                <Link
                  href="/tours"
                  className="group inline-flex items-center gap-2 rounded-full border border-neutral-900/30 px-4 py-2 text-xs font-bold text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  Ver todos los tours
                </Link>
              </div>
              <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-5 [&::-webkit-scrollbar]:hidden">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    className="w-[60vw] max-w-[210px] shrink-0 snap-start md:w-auto md:max-w-none"
                  >
                    <TourCard tour={item} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
