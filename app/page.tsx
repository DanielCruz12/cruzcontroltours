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
import { getDestinations, getOtherTours, getPopularTours } from "@/lib/tours";

export default function Home() {
  const popular = getPopularTours();
  const other = getOtherTours();
  const destinations = getDestinations();

  return (
    <>
      <Header />
      <main id="inicio" className="flex-1">
        <Hero />
        <PopularToursSection popular={popular} destinations={destinations} />
        <TeamSection />
        {/* "Otras opciones" debajo del equipo, separada de los populares */}
        <OtherToursSection other={other} />
        <GallerySection />
        <GuidesSection />
        <FaqSection />
      </main>
      <CtaSection />
      <Footer />
    </>
  );
}
