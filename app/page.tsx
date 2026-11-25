import AlliesSection from "@/components/AlliesSection";
import BlogSection from "@/components/BlogSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import CtaSection from "@/components/CtaSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import LaborSocialSection from "@/components/LaborSocialSection";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OtherToursSection from "@/components/OtherToursSection";
import PopularToursSection from "@/components/PopularToursSection";
import PortfolioSection from "@/components/PortfolioSection";
import TeamSection from "@/components/TeamSection";
import TeamTimelineSection from "@/components/TeamTimelineSection";
import ScrollVideoSection from "@/components/ScrollVideoSection";
import ToursLoader from "@/components/ToursLoader";

export default function Home() {
  return (
    <>
      <Header />
      <main id="inicio" className="flex-1">
        <Hero />
        <AlliesSection />
        {/* Carga los tours del backend una vez; las secciones leen del store */}
        <ToursLoader />
        <PopularToursSection />
        <TeamTimelineSection />
        {/* "Otras opciones" debajo del equipo, separada de los populares */}
        <OtherToursSection />
        <GallerySection />
        {/* <GuidesSection /> */}
        <CapabilitiesSection />
        <TeamSection />

        <ScrollVideoSection />
        <BlogSection />
        <PortfolioSection />
        <LaborSocialSection />
        <FaqSection />
      </main>
      <CtaSection />
      <Footer />
    </>
  );
}
