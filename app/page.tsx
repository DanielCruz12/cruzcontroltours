import CtaSection from "@/components/CtaSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import GuidesSection from "@/components/GuidesSection";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OtherToursSection from "@/components/OtherToursSection";
import PopularToursSection from "@/components/PopularToursSection";
import TeamSection from "@/components/TeamSection";
import ToursLoader from "@/components/ToursLoader";

export default function Home() {
  return (
    <>
      <Header />
      <main id="inicio" className="flex-1">
        <Hero />
        {/* Carga los tours del backend una vez; las secciones leen del store */}
        <ToursLoader />
        <PopularToursSection />
        <TeamSection />
        {/* "Otras opciones" debajo del equipo, separada de los populares */}
        <OtherToursSection />
        <GallerySection />
        <GuidesSection />
        <FaqSection />
      </main>
      <CtaSection />
      <Footer />
    </>
  );
}
