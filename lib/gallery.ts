// Galería "Momentos inolvidables" — Cruz Control Tours.
//
// ⚠️ FOTOS TEMPORALES (Unsplash): misma convención que lib/tours.ts.
// Reemplazar por fotografía propia y real de los tours antes de producción.
// Cada foto es configurable: título, destino, alt, proporción (aspect),
// ancho de tarjeta y punto focal (position). El movimiento por scroll usa
// `travel` por fila; la dirección se alterna automáticamente por índice.
// Cada fila debe tener fotos suficientes para desbordar el viewport: el
// recorrido se limita a la mitad del desbordamiento real del contenido,
// así nunca se ven espacios en blanco en los extremos.

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
  /** Proporción de la foto: define las dimensiones del lightbox. */
  aspect: "aspect-[4/3]" | "aspect-square" | "aspect-[3/4]" | "aspect-[16/10]";
  /** Ancho de la tarjeta en móvil y md+ (clase literal de Tailwind). */
  width: "w-[100px] md:w-[190px]" | "w-[115px] md:w-[220px]" | "w-[130px] md:w-[250px]" | "w-[150px] md:w-[290px]";
  /** Punto focal del recorte (object-position). */
  position?: string;
};

export type GalleryRow = {
  /** Altura fija de la fila en móvil y md+ (clase literal de Tailwind). */
  height: "h-[150px] md:h-[220px]" | "h-[165px] md:h-[250px]" | "h-[155px] md:h-[230px]";
  /** Recorrido máximo del desplazamiento vinculado al scroll (px). */
  travel: number;
  photos: GalleryPhoto[];
};

// Filas pares ← y filas impares →; `travel` distinto por fila da profundidad.
export const galleryRows: GalleryRow[] = [
  {
    height: "h-[150px] md:h-[220px]",
    travel: 140,
    photos: [
      {
        id: "coatepeque-panoramica",
        imageId: "photo-1652067871244-4a3b3665813a",
        title: "Lago de Coatepeque",
        location: "Santa Ana",
        alt: "Vista panorámica del Lago de Coatepeque rodeado de montañas",
        aspect: "aspect-[4/3]",
        width: "w-[150px] md:w-[290px]",
        position: "50% 55%",
      },
      {
        id: "surf-el-tunco",
        imageId: "photo-1519421840190-84d0cab37fb1",
        title: "Surf en El Tunco",
        location: "La Libertad",
        alt: "Surfista en una ola en la playa El Tunco",
        aspect: "aspect-square",
        width: "w-[115px] md:w-[220px]",
        position: "50% 40%",
      },
      {
        id: "crater-santa-ana",
        imageId: "photo-1743386252123-0944ff2c8d29",
        title: "Cráter del volcán de Santa Ana",
        location: "Parque Nacional Los Volcanes",
        alt: "Laguna turquesa en el cráter del volcán de Santa Ana",
        aspect: "aspect-[4/3]",
        width: "w-[130px] md:w-[250px]",
        position: "50% 45%",
      },
      {
        id: "senderos-bosque",
        imageId: "photo-1551632811-561732d1e306",
        title: "Senderos entre montañas",
        location: "Cerro Verde",
        alt: "Caminantes recorriendo un sendero entre bosque de montaña",
        aspect: "aspect-[3/4]",
        width: "w-[100px] md:w-[190px]",
        position: "50% 40%",
      },
      {
        id: "playas-pacifico",
        imageId: "photo-1507525428034-b723cf961d3e",
        title: "Playas del Pacífico",
        location: "La Libertad",
        alt: "Playa de arena con palmeras en la costa del Pacífico",
        aspect: "aspect-[16/10]",
        width: "w-[130px] md:w-[250px]",
        position: "50% 60%",
      },
      {
        id: "suchitoto-colonial",
        imageId: "photo-1633190545483-5edb598f3ebe",
        title: "Pueblo colonial de Suchitoto",
        location: "Cuscatlán",
        alt: "Iglesia colonial del pueblo de Suchitoto",
        aspect: "aspect-square",
        width: "w-[100px] md:w-[190px]",
        position: "50% 55%",
      },
      {
        id: "orillas-del-lago",
        imageId: "photo-1470770841072-f978cf4d019e",
        title: "Orillas del lago",
        location: "Lago de Coatepeque",
        alt: "Cabaña de madera junto al lago rodeado de montañas",
        aspect: "aspect-[16/10]",
        width: "w-[150px] md:w-[290px]",
        position: "50% 60%",
      },
      {
        id: "cascada-montana",
        imageId: "photo-1433086966358-54859d0ed716",
        title: "Cascada en la montaña",
        location: "Apaneca",
        alt: "Cascada grande entre vegetación de montaña",
        aspect: "aspect-[3/4]",
        width: "w-[100px] md:w-[190px]",
        position: "50% 50%",
      },
      {
        id: "senderos-niebla",
        imageId: "photo-1470071459604-3b5ec3a7fe05",
        title: "Senderos con niebla",
        location: "Cerro Verde",
        alt: "Valle de montaña cubierto de niebla",
        aspect: "aspect-[4/3]",
        width: "w-[130px] md:w-[250px]",
        position: "50% 60%",
      },
      {
        id: "atardecer-costa",
        imageId: "photo-1473186578172-c141e6798cf4",
        title: "Atardecer en la costa",
        location: "Playa El Zonte",
        alt: "Hamaca frente al mar al atardecer",
        aspect: "aspect-square",
        width: "w-[115px] md:w-[220px]",
        position: "50% 60%",
      },
    ],
  },
  {
    height: "h-[165px] md:h-[250px]",
    travel: 160,
    photos: [
      {
        id: "viajeros-en-accion",
        imageId: "photo-1529156069898-49953e39b3ac",
        title: "Viajeros en acción",
        location: "Playa El Zonte",
        alt: "Grupo de viajeros saltando de alegría en la playa",
        aspect: "aspect-[16/10]",
        width: "w-[150px] md:w-[290px]",
        position: "50% 40%",
      },
      {
        id: "amanecer-volcan",
        imageId: "photo-1504280390367-361c6d9f38f4",
        title: "Amanecer en el volcán",
        location: "Volcán de Santa Ana",
        alt: "Campamento al amanecer junto a las montañas",
        aspect: "aspect-[3/4]",
        width: "w-[100px] md:w-[190px]",
        position: "50% 60%",
      },
      {
        id: "cascadas-juayua",
        imageId: "photo-1675185457011-472a2ee071e2",
        title: "Cascadas de Juayúa",
        location: "Ruta de las Flores",
        alt: "Cascada entre bosque tropical cerca de Juayúa",
        aspect: "aspect-square",
        width: "w-[115px] md:w-[220px]",
        position: "50% 60%",
      },
      {
        id: "guias-aventura",
        imageId: "photo-1541417904950-b855846fe074",
        title: "Guías que viven la aventura",
        location: "Cerro Verde",
        alt: "Guía con cámara observando el paisaje de montaña",
        aspect: "aspect-[4/3]",
        width: "w-[130px] md:w-[250px]",
        position: "50% 45%",
      },
      {
        id: "coatepeque-kayak",
        imageId: "photo-1501785888041-af3ef285b470",
        title: "Remando en Coatepeque",
        location: "Santa Ana",
        alt: "Persona remando en un lago rodeado de montañas",
        aspect: "aspect-[16/10]",
        width: "w-[115px] md:w-[220px]",
        position: "50% 55%",
      },
      {
        id: "olas-el-tunco",
        imageId: "photo-1502680390469-be75c86b636f",
        title: "Olas para todos los niveles",
        location: "El Tunco",
        alt: "Surfista cabalgando una ola",
        aspect: "aspect-[4/3]",
        width: "w-[130px] md:w-[250px]",
        position: "50% 45%",
      },
      {
        id: "mirador-entre-volcanes",
        imageId: "photo-1469474968028-56623f02e42e",
        title: "Mirador entre volcanes",
        location: "Cerro Verde",
        alt: "Rayo de sol entre montañas verdes cerca de Cerro Verde",
        aspect: "aspect-[4/3]",
        width: "w-[130px] md:w-[250px]",
        position: "50% 60%",
      },
      {
        id: "cafe-de-altura",
        imageId: "photo-1447933601403-0c6688de566e",
        title: "Café de altura",
        location: "Juayúa",
        alt: "Granos de café tostados de la Ruta de las Flores",
        aspect: "aspect-square",
        width: "w-[115px] md:w-[220px]",
        position: "50% 50%",
      },
      {
        id: "suchitlan-canotaje",
        imageId: "photo-1476514525535-07fb3b4ae5f1",
        title: "Remando en Suchitlán",
        location: "Cuscatlán",
        alt: "Canoa navegando en el Lago de Suchitlán",
        aspect: "aspect-[16/10]",
        width: "w-[150px] md:w-[290px]",
        position: "50% 55%",
      },
      {
        id: "bosque-nuboso",
        imageId: "photo-1441974231531-c6227db76b6e",
        title: "Bosque nuboso",
        location: "Parque El Imposible",
        alt: "Árboles altos en un bosque nuboso tropical",
        aspect: "aspect-[3/4]",
        width: "w-[100px] md:w-[190px]",
        position: "50% 50%",
      },
      {
        id: "cafe-finca",
        imageId: "photo-1445116572660-236099ec97a0",
        title: "Café de la finca",
        location: "Apaneca",
        alt: "Taza de café recién preparado en una finca",
        aspect: "aspect-square",
        width: "w-[115px] md:w-[220px]",
        position: "50% 50%",
      },
      {
        id: "caminata-grupo",
        imageId: "photo-1519999482648-25049ddd37b1",
        title: "Caminata en grupo",
        location: "Volcán de Izalco",
        alt: "Grupo de caminantes subiendo una montaña",
        aspect: "aspect-[4/3]",
        width: "w-[130px] md:w-[250px]",
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
