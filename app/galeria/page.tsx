import type { Metadata } from "next";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Galería — Cruz Control Tours",
  description:
    "Fotos reales de nuestros tours por El Salvador: grupos, volcanes, lagos, playas y momentos inolvidables con Cruz Control Tours.",
};

export default function GaleriaPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Encabezado de la página (con espacio para el navbar flotante) */}
        <section className="bg-charcoal pb-12 pt-24 sm:pb-16 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="pill-blanco">Cruz Control Tours</p>
            <h1 className="titulo-display mt-4 text-white">
              Galería de nuestros tours
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-base">
              Momentos reales de quienes ya viajaron con nosotros: cimas,
              cráteres, lagos y sonrisas por todo El Salvador.
            </p>
          </div>
        </section>

        {/* Mosaico de fotos */}
        <section className="bg-surface py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <GalleryGrid />
          </div>
        </section>
      </main>
      <CtaSection />
      <Footer />
    </>
  );
}
