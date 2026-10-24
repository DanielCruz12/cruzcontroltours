// Galería "Momentos inolvidables" — Cruz Control Tours.
//
// ⚠️ FOTOS TEMPORALES (Unsplash): misma convención que lib/tours.ts.
// Reemplazar por fotografía propia y real de los tours antes de producción.
// Cada foto es configurable: título, destino, alt, recorte (aspect),
// ancho de tarjeta y punto focal (position). El movimiento por scroll usa
// `travel` por fila; la dirección se alterna automáticamente por índice.

const img = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;

export type GalleryPhoto = {
  id: string;
  imageId: string;
  /** Nombre del destino, tour o actividad. */
  title: string;
  /** Ubicación corta que se muestra siempre en la tarjeta. */
  location: string;
  alt: string;
  /** Proporción de la tarjeta en móvil (clase literal de Tailwind). */
  aspect: "aspect-[4/3]" | "aspect-square" | "aspect-[3/4]" | "aspect-[16/10]";
  /** Ancho de la tarjeta en md+ (clase literal de Tailwind). */
  width: "md:w-[260px]" | "md:w-[300px]" | "md:w-[360px]" | "md:w-[420px]";
  /** Punto focal del recorte (object-position). */
  position?: string;
  /** true si la tarjeta ocupa las 2 columnas del grid móvil. */
  wide?: boolean;
};

export type GalleryRow = {
  /** Altura fija de la fila en md+ (clase literal de Tailwind). */
  height: "md:h-[300px]" | "md:h-[380px]" | "md:h-[320px]" | "md:h-[400px]";
  /** Recorrido máximo del desplazamiento vinculado al scroll (px). */
  travel: number;
  photos: GalleryPhoto[];
};

// Filas pares ← y filas impares →; `travel` distinto por fila da profundidad.
export const galleryRows: GalleryRow[] = [
  {
    height: "md:h-[300px]",
    travel: 240,
    photos: [
      {
        id: "coatepeque-panoramica",
        imageId: "photo-1652067871244-4a3b3665813a",
        title: "Lago de Coatepeque",
        location: "Santa Ana",
        alt: "Vista panorámica del Lago de Coatepeque rodeado de montañas",
        aspect: "aspect-[4/3]",
        width: "md:w-[420px]",
        position: "50% 55%",
        wide: true,
      },
      {
        id: "surf-el-tunco",
        imageId: "photo-1519421840190-84d0cab37fb1",
        title: "Surf en El Tunco",
        location: "La Libertad",
        alt: "Surfista en una ola en la playa El Tunco",
        aspect: "aspect-square",
        width: "md:w-[300px]",
        position: "50% 40%",
      },
      {
        id: "crater-santa-ana",
        imageId: "photo-1743386252123-0944ff2c8d29",
        title: "Cráter del volcán de Santa Ana",
        location: "Parque Nacional Los Volcanes",
        alt: "Laguna turquesa en el cráter del volcán de Santa Ana",
        aspect: "aspect-[4/3]",
        width: "md:w-[360px]",
        position: "50% 45%",
      },
      {
        id: "senderos-bosque",
        imageId: "photo-1551632811-561732d1e306",
        title: "Senderos entre montañas",
        location: "Cerro Verde",
        alt: "Caminantes recorriendo un sendero entre bosque de montaña",
        aspect: "aspect-[3/4]",
        width: "md:w-[260px]",
        position: "50% 40%",
      },
      {
        id: "playas-pacifico",
        imageId: "photo-1507525428034-b723cf961d3e",
        title: "Playas del Pacífico",
        location: "La Libertad",
        alt: "Playa de arena con palmeras en la costa del Pacífico",
        aspect: "aspect-[16/10]",
        width: "md:w-[360px]",
        position: "50% 60%",
      },
      {
        id: "suchitoto-colonial",
        imageId: "photo-1633190545483-5edb598f3ebe",
        title: "Pueblo colonial de Suchitoto",
        location: "Cuscatlán",
        alt: "Iglesia colonial del pueblo de Suchitoto",
        aspect: "aspect-square",
        width: "md:w-[260px]",
        position: "50% 55%",
      },
    ],
  },
  {
    height: "md:h-[380px]",
    travel: 320,
    photos: [
      {
        id: "viajeros-en-accion",
        imageId: "photo-1529156069898-49953e39b3ac",
        title: "Viajeros en acción",
        location: "Playa El Zonte",
        alt: "Grupo de viajeros saltando de alegría en la playa",
        aspect: "aspect-[16/10]",
        width: "md:w-[420px]",
        position: "50% 40%",
        wide: true,
      },
      {
        id: "amanecer-volcan",
        imageId: "photo-1504280390367-361c6d9f38f4",
        title: "Amanecer en el volcán",
        location: "Volcán de Santa Ana",
        alt: "Campamento al amanecer junto a las montañas",
        aspect: "aspect-[3/4]",
        width: "md:w-[260px]",
        position: "50% 60%",
      },
      {
        id: "cascadas-juayua",
        imageId: "photo-1675185457011-472a2ee071e2",
        title: "Cascadas de Juayúa",
        location: "Ruta de las Flores",
        alt: "Cascada entre bosque tropical cerca de Juayúa",
        aspect: "aspect-square",
        width: "md:w-[300px]",
        position: "50% 60%",
      },
      {
        id: "guias-aventura",
        imageId: "photo-1541417904950-b855846fe074",
        title: "Guías que viven la aventura",
        location: "Cerro Verde",
        alt: "Guía con cámara observando el paisaje de montaña",
        aspect: "aspect-[4/3]",
        width: "md:w-[360px]",
        position: "50% 45%",
      },
      {
        id: "coatepeque-kayak",
        imageId: "photo-1501785888041-af3ef285b470",
        title: "Remando en Coatepeque",
        location: "Santa Ana",
        alt: "Persona remando en un lago rodeado de montañas",
        aspect: "aspect-[16/10]",
        width: "md:w-[300px]",
        position: "50% 55%",
      },
      {
        id: "olas-el-tunco",
        imageId: "photo-1502680390469-be75c86b636f",
        title: "Olas para todos los niveles",
        location: "El Tunco",
        alt: "Surfista cabalgando una ola",
        aspect: "aspect-[4/3]",
        width: "md:w-[360px]",
        position: "50% 45%",
      },
    ],
  },
  {
    height: "md:h-[320px]",
    travel: 200,
    photos: [
      {
        id: "ruta-de-las-flores",
        imageId: "photo-1624337887888-f5ea6a1e573e",
        title: "Ruta de las Flores",
        location: "Sonsonate",
        alt: "Montañas verdes de la Ruta de las Flores",
        aspect: "aspect-[16/10]",
        width: "md:w-[420px]",
        position: "50% 60%",
        wide: true,
      },
      {
        id: "laguna-crater",
        imageId: "photo-1701815843414-50779f1c3b78",
        title: "Laguna del cráter",
        location: "Volcán de Santa Ana",
        alt: "Laguna turquesa en el cráter del volcán de Santa Ana",
        aspect: "aspect-square",
        width: "md:w-[300px]",
        position: "50% 65%",
      },
      {
        id: "caminatas-grupales",
        imageId: "photo-1539635278303-d4002c07eae3",
        title: "Caminatas con grupo",
        location: "Parque Nacional Los Volcanes",
        alt: "Grupo de senderistas caminando por una vereda",
        aspect: "aspect-[4/3]",
        width: "md:w-[360px]",
        position: "50% 45%",
      },
      {
        id: "cascadas-escondidas",
        imageId: "photo-1432405972618-c60b0225b8f9",
        title: "Cascadas escondidas",
        location: "Juayúa",
        alt: "Cascada escondida entre vegetación tropical",
        aspect: "aspect-[3/4]",
        width: "md:w-[260px]",
        position: "50% 55%",
      },
      {
        id: "san-salvador-volcan",
        imageId: "photo-1690384451505-2aef8ae1b0ef",
        title: "San Salvador y su volcán",
        location: "San Salvador",
        alt: "Ciudad de San Salvador frente al volcán",
        aspect: "aspect-[4/3]",
        width: "md:w-[360px]",
        position: "50% 60%",
      },
      {
        id: "atardecer-lago",
        imageId: "photo-1439066615861-d1af74d74000",
        title: "Atardecer en el lago",
        location: "Lago de Coatepeque",
        alt: "Atardecer reflejado en un lago de montaña",
        aspect: "aspect-[16/10]",
        width: "md:w-[300px]",
        position: "50% 60%",
      },
    ],
  },

];

/** Índice plano para el lightbox (cada tarjeta abre su propia instancia). */
export const galleryPhotos = galleryRows.flatMap((row) => row.photos);

/** Índice de la primera foto de cada fila dentro de `galleryPhotos`. */
export const galleryOffsets: number[] = (() => {
  const offsets: number[] = [];
  let total = 0;
  for (const row of galleryRows) {
    offsets.push(total);
    total += row.photos.length;
  }
  return offsets;
})();

export function photoSrc(photo: GalleryPhoto, width: number) {
  return img(photo.imageId, width);
}

/** Dimensiones nominales para el lightbox (según la proporción). */
export function photoDimensions(photo: GalleryPhoto) {
  switch (photo.aspect) {
    case "aspect-[3/4]":
      return { width: 1200, height: 1600 };
    case "aspect-square":
      return { width: 1400, height: 1400 };
    case "aspect-[16/10]":
      return { width: 1600, height: 1000 };
    default:
      return { width: 1600, height: 1200 };
  }
}
