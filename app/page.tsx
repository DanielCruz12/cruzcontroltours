import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ToursSections from "@/components/ToursSections";
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
        <ToursSections
          popular={popular}
          other={other}
          destinations={destinations}
        />
      </main>
      <Footer />
    </>
  );
}
