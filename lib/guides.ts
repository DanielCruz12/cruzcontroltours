// Guías de viaje — Cruz Control Tours.
//
// ⚠️ CONTENIDO ILUSTRATIVO TEMPORAL (misma convención que lib/tours.ts):
// títulos, categorías y extractos de ejemplo; las tarjetas enlazan a /tours
// hasta que existan páginas reales de blog/guías. Fotos Unsplash verificadas
// (HTTP 200). Reemplazar por publicaciones reales antes de producción.

const img = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;

export type TravelGuide = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt: string;
};

export const guides: TravelGuide[] = [
  {
    id: "ruta-flores-un-dia",
    title: "Ruta de las Flores: qué ver en un día",
    category: "Itinerarios",
    excerpt:
      "Juayúa, Ataco y Apaneca: cafetales, murales y gastronomía en una sola jornada.",
    image: img("photo-1447752875215-b2761acb3c5d"),
    imageAlt: "Bosque iluminado por el sol en la Ruta de las Flores",
  }
];
