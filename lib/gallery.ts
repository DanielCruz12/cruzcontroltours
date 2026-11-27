// Galería con fotografía propia de Cruz Control Tours (public/memories y
// public/gallery). Cada foto es configurable: título, destino, alt,
// proporción (aspect), ancho de tarjeta y punto focal (position). El
// movimiento por scroll usa `travel` por fila; la dirección se alterna
// automáticamente por índice. Cada fila debe tener fotos suficientes para
// desbordar el viewport: el recorrido se limita a la mitad del
// desbordamiento real del contenido, así nunca se ven espacios en blanco
// en los extremos.

export type GalleryPhoto = {
  id: string;
  /** Ruta local en public (p. ej. "/memories/1.jpeg"). */
  src: string;
  /** Nombre del destino, tour o actividad. */
  title: string;
  /** Ubicación corta que se muestra siempre en la tarjeta. */
  location: string;
  alt: string;
  /** Proporción de la foto: define las dimensiones del lightbox. */
  aspect: "aspect-[4/3]" | "aspect-square" | "aspect-[3/4]" | "aspect-[16/10]";
  /** Ancho de la tarjeta en móvil y md+ (clase literal de Tailwind). */
  width:
    | "w-[100px] md:w-[190px]"
    | "w-[115px] md:w-[220px]"
    | "w-[130px] md:w-[250px]"
    | "w-[150px] md:w-[290px]"
    | "w-[160px] md:w-[360px]"
    | "w-[180px] md:w-[430px]";
  /** Punto focal del recorte (object-position). */
  position?: string;
};

export type GalleryRow = {
  /** Altura fija de la fila en móvil y md+ (clase literal de Tailwind). */
  height:
    | "h-[150px] md:h-[220px]"
    | "h-[165px] md:h-[250px]"
    | "h-[155px] md:h-[230px]"
    | "h-[180px] md:h-[280px]";
  /** Recorrido máximo del desplazamiento vinculado al scroll (px). */
  travel: number;
  photos: GalleryPhoto[];
};

// Sección "Momentos inolvidables" del inicio (public/memories).
// Filas pares ← y filas impares →; `travel` distinto por fila da profundidad.
export const galleryRows: GalleryRow[] = [
  {
    height: "h-[165px] md:h-[250px]",
    travel: 260,
    photos: [
      {
        id: "mem-atardecer-cima",
        src: "/memories/1.jpeg",
        title: "Atardecer desde la cima",
        location: "El Salvador",
        alt: "Viajera sentada en una roca contemplando el atardecer sobre el lago y las montañas",
        aspect: "aspect-[3/4]",
        width: "w-[150px] md:w-[290px]",
        position: "50% 60%",
      },
      {
        id: "mem-volcan-nubes",
        src: "/memories/10.jpeg",
        title: "Volcán entre nubes",
        location: "El Salvador",
        alt: "Silueta de un volcán sobre un mar de nubes doradas al atardecer",
        aspect: "aspect-[4/3]",
        width: "w-[180px] md:w-[430px]",
        position: "50% 50%",
      },
      {
        id: "mem-mirador-lago",
        src: "/memories/2.jpeg",
        title: "Mirador sobre el lago",
        location: "El Salvador",
        alt: "Viajero con capucha mirando un lago de islotes entre montañas",
        aspect: "aspect-square",
        width: "w-[130px] md:w-[250px]",
        position: "50% 45%",
      },
      {
        id: "mem-mar-nubes",
        src: "/memories/18.jpeg",
        title: "Mar de nubes",
        location: "El Salvador",
        alt: "Atardecer sobre un mar de nubes visto desde la montaña",
        aspect: "aspect-[4/3]",
        width: "w-[180px] md:w-[430px]",
        position: "50% 50%",
      },
      {
        id: "mem-tortuga-marina",
        src: "/memories/16.jpeg",
        title: "Tortuga marina",
        location: "Océano Pacífico",
        alt: "Tortuga marina nadando en mar abierto",
        aspect: "aspect-[16/10]",
        width: "w-[150px] md:w-[290px]",
        position: "60% 50%",
      },
      {
        id: "mem-terraza-lago",
        src: "/memories/13.jpeg",
        title: "Terraza frente al lago",
        location: "El Salvador",
        alt: "Terraza con palmera y vista al lago rodeado de montañas",
        aspect: "aspect-[3/4]",
        width: "w-[160px] md:w-[360px]",
        position: "50% 45%",
      },
    ],
  },
  {
    height: "h-[180px] md:h-[280px]",
    travel: 300,
    photos: [
      {
        id: "mem-kayak-atardecer",
        src: "/memories/15.jpeg",
        title: "Kayak al atardecer",
        location: "El Salvador",
        alt: "Viajera en kayak con los brazos en alto frente a la puesta de sol",
        aspect: "aspect-[3/4]",
        width: "w-[160px] md:w-[360px]",
        position: "50% 55%",
      },
      {
        id: "mem-arte-color",
        src: "/memories/23.jpeg",
        title: "Arte y color",
        location: "El Salvador",
        alt: "Pinturas coloridas de volcanes y cascadas en un mercado",
        aspect: "aspect-[4/3]",
        width: "w-[150px] md:w-[290px]",
        position: "50% 65%",
      },
      {
        id: "mem-filo-montana",
        src: "/memories/22.jpeg",
        title: "Filo de montaña",
        location: "El Salvador",
        alt: "Cresta de montaña dorada con lago y volcán al fondo",
        aspect: "aspect-square",
        width: "w-[130px] md:w-[250px]",
        position: "50% 60%",
      },
      {
        id: "mem-atardecer-playa",
        src: "/memories/24.jpeg",
        title: "Atardecer en la playa",
        location: "El Salvador",
        alt: "Puesta de sol sobre el mar en una playa de arena oscura",
        aspect: "aspect-[4/3]",
        width: "w-[180px] md:w-[430px]",
        position: "60% 55%",
      },
      {
        id: "mem-crater-laguna",
        src: "/memories/25.jpeg",
        title: "Cráter con laguna verde",
        location: "El Salvador",
        alt: "Cráter volcánico con laguna verde y fumarolas",
        aspect: "aspect-[4/3]",
        width: "w-[160px] md:w-[360px]",
        position: "50% 60%",
      },
      {
        id: "mem-sabores-locales",
        src: "/memories/17.jpeg",
        title: "Sabores locales",
        location: "El Salvador",
        alt: "Muro de restaurante con fotografías y recortes de prensa",
        aspect: "aspect-[3/4]",
        width: "w-[150px] md:w-[290px]",
        position: "50% 45%",
      },
    ],
  },
];

/** Página /galeria (public/gallery): fotos de grupos y tours reales. */
export const galeriaPhotos: GalleryPhoto[] = [
  {
    id: "gal-cima-grupo",
    src: "/gallery/3.jpeg",
    title: "Cima conquistada",
    location: "El Salvador",
    alt: "Grupo de viajeros con la bandera de Cruz Control Tours en la cima de una montaña",
    aspect: "aspect-[16/10]",
    width: "w-[150px] md:w-[290px]",
    position: "50% 40%",
  },
  {
    id: "gal-ruta-arqueologica",
    src: "/gallery/4.jpeg",
    title: "Ruta arqueológica",
    location: "El Salvador",
    alt: "Viajeras con la bandera del tour frente a ruinas arqueológicas",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 45%",
  },
  {
    id: "gal-rincon-surfero",
    src: "/gallery/12.jpeg",
    title: "Rincón surfero",
    location: "El Zonte",
    alt: "Señal cubierta de calcomanías de surf y cafés locales",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 40%",
  },
  {
    id: "gal-tour-temporada",
    src: "/gallery/5.jpeg",
    title: "Tour de temporada",
    location: "En ruta",
    alt: "Grupo con maquillaje de catrina celebrando dentro del transporte",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 45%",
  },
  {
    id: "gal-listos-rodar",
    src: "/gallery/6.jpeg",
    title: "Listos para rodar",
    location: "El Salvador",
    alt: "Grupo con la bandera del tour junto a la camioneta de noche",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 45%",
  },
  {
    id: "gal-dia-lago",
    src: "/gallery/14.jpeg",
    title: "Día de lago",
    location: "El Salvador",
    alt: "Grupo de viajeras con la bandera del tour junto al lago",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 55%",
  },
  {
    id: "gal-aventura-volcanica",
    src: "/gallery/7.jpeg",
    title: "Aventura volcánica",
    location: "El Salvador",
    alt: "Grupo con la bandera del tour en terreno volcánico",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 50%",
  },
  {
    id: "gal-kayak-nocturno",
    src: "/gallery/8.jpeg",
    title: "Kayak nocturno",
    location: "El Salvador",
    alt: "Grupo con chalecos y remos antes de remar de noche",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 50%",
  },
  {
    id: "gal-chapuzon-grupo",
    src: "/gallery/20.jpeg",
    title: "Chapuzón en grupo",
    location: "El Salvador",
    alt: "Grupo de viajeros disfrutando en una poza natural",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 45%",
  },
  {
    id: "gal-mirador-alas",
    src: "/gallery/9.jpeg",
    title: "Mirador de las alas",
    location: "El Salvador",
    alt: "Grupo con la bandera del tour en el mirador de las alas de mariposa",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 40%",
  },
  {
    id: "gal-en-el-crater",
    src: "/gallery/11.jpeg",
    title: "En el cráter",
    location: "El Salvador",
    alt: "Cuatro viajeros con la bandera del tour al borde del cráter",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 55%",
  },
  {
    id: "gal-grupo-cascada",
    src: "/gallery/19.jpeg",
    title: "Grupo en la cascada",
    location: "El Salvador",
    alt: "Grupo grande de viajeros con bandera frente a una cascada",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 45%",
  },
  {
    id: "gal-nuestro-equipo",
    src: "/gallery/21.jpeg",
    title: "Nuestro equipo",
    location: "Evento de turismo",
    alt: "Equipo de Cruz Control Tours en un evento de turismo",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 45%",
  },
  {
    id: "gal-navidad-montana",
    src: "/gallery/26.jpeg",
    title: "Navidad en la montaña",
    location: "El Salvador",
    alt: "Tres viajeros con gorros navideños en un mirador de montaña",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 60%",
  },
  {
    id: "gal-lanchas-atardecer",
    src: "/gallery/27.jpeg",
    title: "Lanchas al atardecer",
    location: "El Salvador",
    alt: "Dos lanchas en la playa durante el atardecer",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 45%",
  },
  {
    id: "gal-tour-lancha",
    src: "/gallery/28.jpeg",
    title: "Tour en lancha",
    location: "El Salvador",
    alt: "Grupo con chalecos salvavidas posando en la playa junto a las lanchas",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 55%",
  },
  {
    id: "gal-fiesta-navidena",
    src: "/gallery/29.jpeg",
    title: "Fiesta navideña",
    location: "El Salvador",
    alt: "Grupo con disfraces navideños y la bandera del tour en un evento de noche",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 45%",
  },
  {
    id: "gal-nuestro-transporte",
    src: "/gallery/30.jpeg",
    title: "Nuestro transporte",
    location: "El Salvador",
    alt: "Camioneta blanca con el distintivo de Cruz Control Tours de noche",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 55%",
  },
  {
    id: "gal-visitando-ruinas",
    src: "/gallery/31.jpeg",
    title: "Visitando las ruinas",
    location: "El Salvador",
    alt: "Viajera con los brazos abiertos frente a una pirámide arqueológica",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 60%",
  },
  {
    id: "gal-aventura-cascada",
    src: "/gallery/32.jpeg",
    title: "Aventura en la cascada",
    location: "El Salvador",
    alt: "Grupo con cascos y la bandera del tour junto a una cascada",
    aspect: "aspect-square",
    width: "w-[115px] md:w-[220px]",
    position: "50% 60%",
  },
  {
    id: "gal-rapel-cascada",
    src: "/gallery/33.jpeg",
    title: "Rápel en la cascada",
    location: "El Salvador",
    alt: "Dos aventureros con cuerdas preparándose para descender por la cascada",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 55%",
  },
  {
    id: "gal-amigas-crater",
    src: "/gallery/34.jpeg",
    title: "Amigas en el cráter",
    location: "El Salvador",
    alt: "Dos viajeras posando al borde del cráter con laguna verde",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 60%",
  },
  {
    id: "gal-promoviendo-turismo",
    src: "/gallery/35.jpeg",
    title: "Promoviendo el turismo",
    location: "Evento de turismo",
    alt: "Equipo mostrando folletos turísticos en un evento",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 50%",
  },
  {
    id: "gal-descanso-crater",
    src: "/gallery/36.jpeg",
    title: "Descanso frente al cráter",
    location: "El Salvador",
    alt: "Viajero sentado contemplando el cráter con laguna verde",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 55%",
  },
  {
    id: "gal-navegando-lago",
    src: "/gallery/37.jpeg",
    title: "Navegando el lago",
    location: "El Salvador",
    alt: "Viajera sonriendo en una lancha con el lago y las montañas de fondo",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 45%",
  },
  {
    id: "gal-banderas-crater",
    src: "/gallery/38.jpeg",
    title: "Banderas en el cráter",
    location: "El Salvador",
    alt: "Viajeros con la bandera de El Salvador y la del tour frente al cráter",
    aspect: "aspect-[16/10]",
    width: "w-[150px] md:w-[290px]",
    position: "50% 60%",
  },
  {
    id: "gal-cima-nubes",
    src: "/gallery/39.jpeg",
    title: "Cima entre nubes",
    location: "El Salvador",
    alt: "Grupo con la bandera del tour en una cima volcánica entre la niebla",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 50%",
  },
  {
    id: "gal-volcan-ilamatepec",
    src: "/gallery/40.jpeg",
    title: "Volcán Ilamatepec",
    location: "Santa Ana",
    alt: "Grupo con banderas en la cima del volcán Ilamatepec",
    aspect: "aspect-square",
    width: "w-[115px] md:w-[220px]",
    position: "50% 60%",
  },
  {
    id: "gal-feria-jocote",
    src: "/gallery/41.jpeg",
    title: "Feria del Jocote",
    location: "El Salvador",
    alt: "Grupo del tour en la entrada de la Feria del Jocote",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 55%",
  },
  {
    id: "gal-taller-arte",
    src: "/gallery/42.jpeg",
    title: "Taller de arte",
    location: "El Salvador",
    alt: "Participantes pintando en un taller comunitario de arte",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 55%",
  },
  {
    id: "gal-noche-catrinas",
    src: "/gallery/43.jpeg",
    title: "Noche de catrinas",
    location: "El Salvador",
    alt: "Equipo junto a una catrina en una fiesta nocturna",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 45%",
  },
  {
    id: "gal-nuestra-camioneta",
    src: "/gallery/44.jpeg",
    title: "Nuestra camioneta",
    location: "El Salvador",
    alt: "Camioneta blanca de Cruz Control Tours estacionada de día",
    aspect: "aspect-[16/10]",
    width: "w-[150px] md:w-[290px]",
    position: "50% 45%",
  },
  {
    id: "gal-lista-salir",
    src: "/gallery/45.jpeg",
    title: "Lista para salir",
    location: "El Salvador",
    alt: "Guía con tableta junto a la camioneta antes de iniciar el tour",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 60%",
  },
  {
    id: "gal-grupo-feria",
    src: "/gallery/46.jpeg",
    title: "Grupo en la feria",
    location: "El Salvador",
    alt: "Grupo grande del tour posando en la Feria del Jocote",
    aspect: "aspect-[16/10]",
    width: "w-[150px] md:w-[290px]",
    position: "50% 45%",
  },
  {
    id: "gal-viaja-nosotros",
    src: "/gallery/47.jpeg",
    title: "Viaja con nosotros",
    location: "El Salvador",
    alt: "Grupo grande del tour en un cañón verde",
    aspect: "aspect-square",
    width: "w-[115px] md:w-[220px]",
    position: "50% 65%",
  },
  {
    id: "gal-world-tourism-day",
    src: "/gallery/48.jpeg",
    title: "World Tourism Day 2026",
    location: "Evento de turismo",
    alt: "Equipo en el photocall del World Tourism Day 2026 en El Salvador",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 55%",
  },
  {
    id: "gal-selfie-sendero",
    src: "/gallery/49.jpeg",
    title: "Selfie en el sendero",
    location: "El Salvador",
    alt: "Viajeros tomándose una selfie durante una caminata",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 55%",
  },
  {
    id: "gal-equipo-cct",
    src: "/gallery/50.jpeg",
    title: "Equipo Cruz Control",
    location: "El Salvador",
    alt: "Equipo con camisas azules y la bandera del tour frente a la camioneta",
    aspect: "aspect-[4/3]",
    width: "w-[130px] md:w-[250px]",
    position: "50% 50%",
  },
  {
    id: "gal-descenso-cascada",
    src: "/gallery/51.jpeg",
    title: "Descenso en cascada",
    location: "El Salvador",
    alt: "Aventurera descendiendo en rápel por una cascada",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 45%",
  },
  {
    id: "gal-atardecer-cima",
    src: "/gallery/52.jpeg",
    title: "Atardecer desde la cima",
    location: "El Salvador",
    alt: "Viajera sentada en una roca contemplando el atardecer sobre el lago y las montañas",
    aspect: "aspect-[3/4]",
    width: "w-[100px] md:w-[190px]",
    position: "50% 60%",
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

export function photoSrc(photo: GalleryPhoto) {
  return photo.src;
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
