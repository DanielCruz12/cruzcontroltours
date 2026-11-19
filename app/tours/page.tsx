import type { Metadata } from "next";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TourCard from "@/components/TourCard";
import { getAllTours } from "@/lib/tours";

export const metadata: Metadata = {
  title: "Todos los tours en El Salvador — Cruz Control Tours",
  description:
    "Explora el catálogo completo de tours de Cruz Control Tours: volcanes, playas, pueblos coloniales y aventuras por todo El Salvador.",
};

export default function ToursPage() {
  const tours = getAllTours();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Encabezado de la página (con espacio para el navbar flotante) */}
        <section className="bg-charcoal pb-12 pt-24 sm:pb-16 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="pill-blanco">
              Cruz Control Tours
            </p>
            <h1 className="titulo-display mt-4 text-white">
              Explora todos los tours
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-base">
              Volcanes, playas, pueblos coloniales y aventuras para todos los
              gustos. Encuentra tu próxima experiencia en El Salvador.
            </p>
          </div>
        </section>

        {/* Catálogo */}
        <section className="bg-surface py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-6 text-sm font-semibold text-ink-soft">
              <span className="font-extrabold text-primary">{tours.length}</span>{" "}
              tours disponibles
            </p>
            <ul className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-6">
              {tours.map((tour) => (
                <li key={tour.id}>
                  <TourCard tour={tour} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <CtaSection />
      <Footer />
    </>
  );
}
