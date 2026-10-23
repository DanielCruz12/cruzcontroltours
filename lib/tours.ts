// Catálogo de tours de Cruz Control Tours.
//
// Nota: estos datos iniciales corresponden a los tours del negocio y deben
// sustituirse por la API/backend cuando esté disponible. Las imágenes son
// temporales (Unsplash) y deben reemplazarse por fotografía propia.

export type TourCategory =
  | "Aventura"
  | "Naturaleza"
  | "Playa"
  | "Cultura"
  | "Volcanes";

export type Tour = {
  id: string;
  slug: string;
  name: string;
  /** Región usada por el buscador (campo "Destino"). */
  destination: string;
  /** Ubicación exacta que se muestra en la tarjeta. */
  location: string;
  duration: string;
  /** Precio por persona en USD. */
  price: number;
  category: TourCategory;
  image: string;
  imageAlt: string;
  /** true si aparece en la sección "Tours más populares". */
  popular?: boolean;
};

const img = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;

export const tours: Tour[] = [
  // ── Tours más populares ────────────────────────────────────────────
  {
    id: "ruta-de-las-flores",
    slug: "ruta-de-las-flores",
    name: "Ruta de las Flores",
    destination: "Ruta de las Flores",
    location: "Juayúa, Sonsonate",
    duration: "10 horas",
    price: 45,
    category: "Naturaleza",
    image: img("photo-1624337887888-f5ea6a1e573e"),
    imageAlt: "Montañas verdes de la Ruta de las Flores, El Salvador",
    popular: true,
  },
  {
    id: "cerro-verde-coatepeque",
    slug: "cerro-verde-coatepeque",
    name: "Cerro Verde y Lago de Coatepeque",
    destination: "Lago de Coatepeque",
    location: "Cerro Verde, Santa Ana",
    duration: "8 horas",
    price: 40,
    category: "Volcanes",
    image: img("photo-1652067871244-4a3b3665813a"),
    imageAlt: "Vista del Lago de Coatepeque rodeado de montañas",
    popular: true,
  },
  {
    id: "surf-el-tunco",
    slug: "surf-el-tunco",
    name: "Surf en El Tunco",
    destination: "El Tunco",
    location: "El Tunco, La Libertad",
    duration: "5 horas",
    price: 50,
    category: "Playa",
    image: img("photo-1519421840190-84d0cab37fb1"),
    imageAlt: "Surfista en una ola en la playa El Tunco",
    popular: true,
  },
  {
    id: "cascadas-juayua",
    slug: "cascadas-juayua",
    name: "Cascadas de Juayúa",
    destination: "Ruta de las Flores",
    location: "Juayúa, Sonsonate",
    duration: "8 horas",
    price: 35,
    category: "Aventura",
    image: img("photo-1675185457011-472a2ee071e2"),
    imageAlt: "Cascada entre bosque tropical cerca de Juayúa",
    popular: true,
  },
  // ── Otras opciones más accesibles ─────────────────────────────────
  {
    id: "suchitoto-pueblo-colonial",
    slug: "suchitoto-pueblo-colonial",
    name: "Suchitoto Pueblo Colonial",
    destination: "Suchitoto",
    location: "Suchitoto, Cuscatlán",
    duration: "5 horas",
    price: 28,
    category: "Cultura",
    image: img("photo-1633190545483-5edb598f3ebe"),
    imageAlt: "Iglesia colonial de Suchitoto",
  },
  {
    id: "volcan-santa-ana",
    slug: "volcan-santa-ana",
    name: "Volcán de Santa Ana",
    destination: "Volcán de Santa Ana",
    location: "Parque Nacional Los Volcanes",
    duration: "9 horas",
    price: 30,
    category: "Volcanes",
    image: img("photo-1743386252123-0944ff2c8d29"),
    imageAlt: "Laguna turquesa en el cráter del volcán de Santa Ana",
  },
  {
    id: "tour-ciudad-san-salvador",
    slug: "tour-ciudad-san-salvador",
    name: "Tour por la Ciudad de San Salvador",
    destination: "San Salvador",
    location: "San Salvador",
    duration: "4 horas",
    price: 25,
    category: "Cultura",
    image: img("photo-1690384451505-2aef8ae1b0ef"),
    imageAlt: "Ciudad de San Salvador frente al volcán",
  },
  {
    id: "atardecer-el-zonte",
    slug: "atardecer-el-zonte",
    name: "Atardecer en Playa El Zonte",
    destination: "El Zonte",
    location: "El Zonte, La Libertad",
    duration: "5 horas",
    price: 26,
    category: "Playa",
    image: img("photo-1626663082623-daed65c06061"),
    imageAlt: "Atardecer sobre las rocas de la playa El Zonte",
  },
];

export function getAllTours(): Tour[] {
  return tours;
}

export function getPopularTours(): Tour[] {
  return tours.filter((tour) => tour.popular);
}

export function getOtherTours(): Tour[] {
  return tours.filter((tour) => !tour.popular);
}

export function getDestinations(): string[] {
  return [...new Set(tours.map((tour) => tour.destination))];
}
