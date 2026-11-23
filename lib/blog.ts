// Catálogo de artículos del blog de Cruz Control Tours.
//
// Nota: estos datos iniciales son estáticos y deben sustituirse por la
// API/backend cuando exista el módulo de blog. Las imágenes son temporales
// (Unsplash) y deben reemplazarse por fotografía propia.

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  /** Fecha de publicación en formato ISO (YYYY-MM-DD). */
  publishedAt: string;
  image: string;
  imageAlt: string;
  sections: BlogSection[];
  /** Slug del tour sugerido al final del artículo (ver `@/lib/tours`). */
  relatedTourSlug?: string;
};

const img = (id: string, width = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;

export const posts: BlogPost[] = [
  {
    id: "guia-volcan-santa-ana",
    slug: "guia-volcan-santa-ana",
    category: "Volcanes",
    title: "Guía para subir el volcán de Santa Ana: la laguna del cráter",
    excerpt:
      "Todo lo que debes saber antes de conquistar el Ilamatepec: nivel de esfuerzo, qué llevar y cuál es el mejor momento para ver su famosa laguna turquesa.",
    author: "Equipo Cruz Control Tours",
    publishedAt: "2026-11-10",
    image: img("photo-1743386252123-0944ff2c8d29"),
    imageAlt: "Laguna turquesa en el cráter del volcán de Santa Ana",
    relatedTourSlug: "volcan-santa-ana",
    sections: [
      {
        heading: "Una caminata que vale cada paso",
        paragraphs: [
          "El volcán de Santa Ana, también conocido como Ilamatepec, es el coloso más alto de El Salvador y una de las caminatas más gratificantes del país. El sendero asciende entre cafetales y bosque nebuloso hasta un mirador frente al cráter, donde aparece la laguna de color turquesa que lo hizo famoso.",
          "El recorrido completo toma alrededor de cuatro horas entre subida y bajada, con un nivel de esfuerzo moderado. No necesitas ser un montañista experimentado, pero sí llevar un ritmo constante y calzado con buen agarre: el último tramo es rocoso y sin sombra.",
        ],
      },
      {
        heading: "Cuándo ir y qué llevar",
        paragraphs: [
          "La mejor época para subir es la estación seca, de noviembre a abril, cuando el cielo despejado deja ver la laguna en todo su esplendor. Recomendamos iniciar temprano en la mañana, ya que después del mediodía las nubes suelen cubrir el cráter.",
          "En tu mochila no pueden faltar al menos dos litros de agua, protector solar, gorra, una chaqueta ligera para el viento de la cima y algo de comer para recargar energías. Todo lo demás —transporte, entradas y guía local— lo coordinamos nosotros.",
        ],
      },
      {
        heading: "Con guías que conocen la montaña",
        paragraphs: [
          "Subir con guías locales marca la diferencia: conocen los atajos seguros, los mejores puntos para fotos y las historias del volcán que no aparecen en ninguna guía. Además, el ascenso se realiza en grupos organizados por seguridad, así que ir con un equipo que ya tiene todo coordinado te ahorra filas y contratiempos.",
          "Si esta es tu primera cumbre en El Salvador, el Ilamatepec es el punto de partida perfecto. Y si ya lo conquistaste, pregúntanos por el volcán de Izalco y el Cerro Verde para completar la trilogía del Parque Nacional Los Volcanes.",
        ],
      },
    ],
  },
  {
    id: "ruta-flores-fin-de-semana",
    slug: "ruta-flores-fin-de-semana",
    category: "Guías",
    title: "Ruta de las Flores en un fin de semana: el itinerario ideal",
    excerpt:
      "Juayúa, Apaneca, Ataco y Nahuizalco en dos días: qué ver en cada pueblo, dónde comer y cómo moverte sin perder tiempo entre traslados.",
    author: "Equipo Cruz Control Tours",
    publishedAt: "2026-10-24",
    image: img("photo-1624337887888-f5ea6a1e573e"),
    imageAlt: "Montañas verdes de la Ruta de las Flores, El Salvador",
    relatedTourSlug: "ruta-de-las-flores",
    sections: [
      {
        heading: "Cuatro pueblos, un solo viaje",
        paragraphs: [
          "La Ruta de las Flores es el circuito de pueblos más querido de El Salvador: una carretera de montaña que enlaza Juayúa, Apaneca, Concepción de Ataco y Nahuizalco, cada uno con su propio carácter. En un fin de semana bien planificado puedes disfrutar los cuatro sin andar corriendo.",
          "Nuestra recomendación es empezar por Juayúa el sábado por la mañana, con su famoso festival gastronómico de fin de semana, seguir hacia Apaneca por la tarde para el canopy o el laberinto de cipreses, y cerrar el día en Ataco con sus murales y su café de altura.",
        ],
      },
      {
        heading: "El domingo: cascadas y artesanías",
        paragraphs: [
          "Reserva el domingo para las Chorros de la Calera, las cascadas a las afueras de Juayúa donde puedes nadar en pozas de agua fresca rodeadas de bosque. Es el plan perfecto para recargar energías antes de volver a la ciudad.",
          "De regreso, haz una parada en Nahuizalco, cuna de artesanos pipiles. Su mercado nocturno de velas y sus talleres de mimbre y madera son el mejor lugar para llevarte un recuerdo hecho a mano y apoyar a las familias locales.",
        ],
      },
      {
        heading: "Muévete sin preocupaciones",
        paragraphs: [
          "La logística es lo único que puede complicar este itinerario: las distancias entre pueblos son cortas pero las carreteras de montaña exigen manejar con calma, y el estacionamiento en temporada alta se llena rápido.",
          "Con nuestro tour a la Ruta de las Flores viajas en transporte cómodo con un guía que conoce los horarios, los restaurantes y los miradores que no salen en los mapas. Tú solo preocúpate por disfrutar y tomar fotos.",
        ],
      },
    ],
  },
  {
    id: "surf-el-tunco-principiantes",
    slug: "surf-el-tunco-principiantes",
    category: "Playas",
    title: "Surf en El Tunco para principiantes: tu primera ola",
    excerpt:
      "Por qué El Tunco es el mejor lugar para aprender a surfear en El Salvador: qué esperar de tu primera clase, cuánto cuesta y qué llevar a la playa.",
    author: "Equipo Cruz Control Tours",
    publishedAt: "2026-10-08",
    image: img("photo-1519421840190-84d0cab37fb1"),
    imageAlt: "Surfista en una ola en la playa El Tunco",
    relatedTourSlug: "surf-el-tunco",
    sections: [
      {
        heading: "La ola más amable para empezar",
        paragraphs: [
          "El Tunco es famoso en todo el mundo surfista por su ola derecha, constante casi todo el año. Pero lo que pocos saben es que también es un lugar ideal para principiantes: junto a la punta rocosa hay zonas de espuma suave donde aprender a pararse en la tabla con total seguridad.",
          "Una primera clase típica dura unas dos horas: empieza en la arena con técnica básica y seguridad, y luego entras al agua con un instructor a tu lado. La mayoría de las personas logra ponerse de pie en su primera sesión.",
        ],
      },
      {
        heading: "Qué llevar y cuándo ir",
        paragraphs: [
          "El oleaje en El Salvador es cálido todo el año, así que no necesitas traje de neopreno: con traje de baño, rashguard y mucho bloqueador es suficiente. Lleva agua, una toalla y ropa seca para después; la tabla y el instructor están incluidos en nuestras experiencias.",
          "Las mañanas suelen tener el mar más ordenado y menos viento, por eso programamos las clases temprano. Además, te queda la tarde libre para disfrutar del malecón, su gastronomía y uno de los atardeceres más famosos del Pacífico.",
        ],
      },
      {
        heading: "Más que surf: el ambiente del Tunco",
        paragraphs: [
          "El Tunco no es solo una ola: es un pueblo vibrante con restaurantes frente al mar, música en vivo los fines de semana y una comunidad de viajeros de todo el mundo. Aprender a surfear aquí es también sumergirte en la cultura playera salvadoreña.",
          "Ya sea tu primera vez sobre una tabla o quieras pulir tu técnica, nuestros instructores locales adaptan cada sesión a tu nivel. Escríbenos y armamos tu día de surf completo, con traslados incluidos.",
        ],
      },
    ],
  },
  {
    id: "suchitoto-historia-viva",
    slug: "suchitoto-historia-viva",
    category: "Cultura",
    title: "Suchitoto: historia viva a orillas del lago",
    excerpt:
      "Calles empedradas, casas coloniales y el lago Suchitlán al fondo: por qué este pueblo es la escapada cultural favorita cerca de San Salvador.",
    author: "Equipo Cruz Control Tours",
    publishedAt: "2026-09-19",
    image: img("photo-1633190545483-5edb598f3ebe"),
    imageAlt: "Iglesia colonial de Suchitoto",
    relatedTourSlug: "suchitoto-pueblo-colonial",
    sections: [
      {
        heading: "El pueblo que el tiempo cuidó",
        paragraphs: [
          "Suchitoto, cuyo nombre náhuatl significa 'lugar de flores y pájaros', conserva uno de los centros coloniales mejor preservados de El Salvador. Sus calles empedradas, balcones de madera y la imponente iglesia de Santa Lucía te transportan varios siglos atrás a solo una hora de San Salvador.",
          "El pueblo también es un centro cultural vivo: galerías de arte, talleres de añil —el tinte natural que tiñó la historia económica del país— y festivales durante todo el año lo convierten en mucho más que una postal bonita.",
        ],
      },
      {
        heading: "Qué no te puedes perder",
        paragraphs: [
          "Empieza en la iglesia de Santa Lucía y la plaza central, camina hasta el mirador del lago Suchitlán y visita la Casa Museo de Alejandro Cotto, que guarda piezas de la época de oro del cine salvadoreño. Si tienes tiempo, un paseo en lancha por el lago al atardecer es inolvidable.",
          "Para comer, los restaurantes alrededor de la plaza sirven desde pupusas y yuca frita hasta cocina de autor con ingredientes locales. Pregunta por el menú del día: suele ser la mejor relación de sabor y precio.",
        ],
      },
      {
        heading: "Ideal para tu primera escapada",
        paragraphs: [
          "Suchitoto es perfecto si tienes medio día libre y quieres salir de la ciudad sin alejarte demasiado. Es un destino tranquilo, caminable y seguro, ideal para familias, parejas y viajeros que buscan cultura sin multitudes.",
          "Nuestro tour incluye transporte desde San Salvador, recorrido guiado por el centro histórico y tiempo libre para explorar a tu ritmo. Reserva con anticipación los fines de semana, que es cuando el pueblo cobra más vida.",
        ],
      },
    ],
  },
  {
    id: "que-llevar-tour-volcan",
    slug: "que-llevar-tour-volcan",
    category: "Consejos",
    title: "Qué llevar a un tour de volcanes: la lista definitiva",
    excerpt:
      "Calzado, capas, agua y los pequeños extras que marcan la diferencia entre sufrir la caminata y disfrutarla. La lista que nuestros guías revisan antes de cada salida.",
    author: "Equipo Cruz Control Tours",
    publishedAt: "2026-09-02",
    image: img("photo-1652067871244-4a3b3665813a"),
    imageAlt: "Vista del Lago de Coatepeque rodeado de montañas",
    relatedTourSlug: "cerro-verde-coatepeque",
    sections: [
      {
        heading: "Lo esencial: pies, agua y protección",
        paragraphs: [
          "El error más común en los tours de volcanes es subestimar el terreno. Unos tenis deportivos con buena suela son el mínimo; si tienes botas de senderismo ligeras, mejor. Evita las sandalias y los zapatos de suela lisa: los senderos volcánicos son rocosos y resbaladizos.",
          "Lleva al menos dos litros de agua por persona y algo de comer —fruta, barras de cereal o sándwiches—. El protector solar y una gorra son obligatorios: a más de 2,000 metros de altura el sol quema más de lo que parece, incluso con nubes.",
        ],
      },
      {
        heading: "Vístete por capas",
        paragraphs: [
          "En la base del volcán puede hacer calor tropical y en la cima correr un viento frío que baja la sensación térmica varios grados. La solución es vestirse por capas: una camiseta que seque rápido, una camisa ligera de manga larga y una chaqueta cortaviento que quepa en la mochila.",
          "En época de lluvias (mayo a octubre) suma un impermeable ligero o poncho. Nuestros tours operan con lluvia ligera y los paisajes con neblina tienen su propio encanto, pero llegar empapado a la cima no es parte del plan.",
        ],
      },
      {
        heading: "Los extras que sí importan",
        paragraphs: [
          "Una mochila pequeña y cómoda, tu teléfono con carga completa para fotos, una bolsa sellable para proteger tus cosas del polvo o la lluvia, y calzado de repuesto para el regreso: tus pies te lo agradecerán después de la caminata.",
          "¿Algo más? Las ganas de madrugar. Salir temprano es el secreto de los mejores tours de volcanes: menos gente en el sendero, mejor luz para fotos y más probabilidades de ver el cráter despejado.",
        ],
      },
    ],
  },
  {
    id: "atardeceres-el-zonte",
    slug: "atardeceres-el-zonte",
    category: "Playas",
    title: "Atardeceres en El Zonte: dónde ver el mejor del país",
    excerpt:
      "La playa favorita para despedir el día: los mejores puntos para ver el atardecer, a qué hora llegar y cómo combinarlo con pupusas frente al mar.",
    author: "Equipo Cruz Control Tours",
    publishedAt: "2026-08-15",
    image: img("photo-1626663082623-daed65c06061"),
    imageAlt: "Atardecer sobre las rocas de la playa El Zonte",
    relatedTourSlug: "atardecer-el-zonte",
    sections: [
      {
        heading: "La hora dorada del Pacífico",
        paragraphs: [
          "Hay pocos espectáculos naturales tan perfectos como un atardecer sobre el Pacífico salvadoreño, y El Zonte ofrece uno de los mejores escenarios del país: formaciones rocosas que enmarcan el sol, olas rompiendo al fondo y una brisa que invita a quedarse.",
          "El sol se pone alrededor de las 6 de la tarde durante casi todo el año, pero te recomendamos llegar al menos una hora antes. Así alcanzas a caminar por la playa, elegir tu lugar y ver cómo la luz va cambiando del dorado al naranja y al rosa.",
        ],
      },
      {
        heading: "Los mejores puntos",
        paragraphs: [
          "El extremo sur de la playa, cerca de las rocas, es el favorito de los fotógrafos: las pozas que se forman con la marea baja reflejan el cielo y duplican el espectáculo. Si prefieres comodidad, los restaurantes del malecón tienen terrazas frente al mar donde puedes verlo con una bebida fría en la mano.",
          "Un consejo de locales: quédate unos veinte minutos después de que el sol toque el horizonte. El 'segundo atardecer', cuando el cielo se enciende de rosa y morado, suele ser incluso más bonito que la puesta misma.",
        ],
      },
      {
        heading: "Combínalo con una tarde de playa",
        paragraphs: [
          "El atardecer es el cierre perfecto para una tarde en El Zonte: nada en el mar, prueba las pupusas de los comedores locales y recorre las tiendas de artesanías del pueblo antes de buscar tu lugar frente al océano.",
          "Nuestro tour de atardecer en El Zonte incluye transporte de ida y vuelta, así que puedes relajarte y disfrutar sin preocuparte por manejar de noche. Reserva tu lugar y vive la hora dorada como se debe.",
        ],
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Fecha ISO (YYYY-MM-DD) → "10 de noviembre de 2026". */
export function formatPostDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Tiempo de lectura estimado (~200 palabras por minuto, mínimo 1). */
export function readingMinutes(post: BlogPost): number {
  const words = [post.excerpt, ...post.sections.flatMap((s) => s.paragraphs)]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Tiempo de lectura estimado desde texto plano o HTML. */
export function readingMinutesFromText(text: string): number {
  const words = text
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Fecha ISO del backend → "10 de noviembre de 2026". */
export function formatApiPostDate(isoDateTime: string): string {
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDateTime));
}

/** "Guía para subir el volcán" → "guia-para-subir-el-volcan". */
export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "articulo";
}

/**
 * Slug público de un artículo del backend, con el mismo patrón que los
 * tours del backend: `titulo-del-articulo-<uuid>`.
 */
export function apiPostSlug(post: { title: string; id: string }): string {
  return `${slugify(post.title)}-${post.id}`;
}

/** Extrae el UUID final de un slug `...-<uuid>` (o null si no lo tiene). */
export function extractApiPostId(slug: string): string | null {
  const match = slug.match(
    /-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
  );
  return match ? match[1] : null;
}

// Etiquetas que nunca se muestran (mismo criterio que el panel, que sanea
// con DOMParser en `@/lib/sanitize-html`; aquí no hay DOM porque la página
// del detalle se renderiza en el servidor).
const BLOCKED_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "select",
  "textarea",
  "link",
  "meta",
];

/**
 * Sanea el HTML del editor del panel antes de mostrarlo: quita etiquetas
 * peligrosas con su contenido, manejadores `on*`, URLs `javascript:` y
 * fuerza `target="_blank"` en los enlaces.
 */
export function sanitizePostHtml(html: string): string {
  let out = html;
  for (const tag of BLOCKED_TAGS) {
    out = out.replace(
      new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}\\s*>`, "gi"),
      "",
    );
    out = out.replace(new RegExp(`<${tag}(\\s[^>]*)?\\/?>`, "gi"), "");
  }
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  out = out.replace(/\s(href|src)\s*=\s*javascript:[^\s>]*/gi, "");
  out = out.replace(
    /\s(href|src)\s*=\s*("[^"]*"|'[^']*')/gi,
    (match, attr: string, quoted: string) => {
      const value = quoted.slice(1, -1).trim();
      return /^\s*javascript:/i.test(value)
        ? ""
        : ` ${attr}="${value.replace(/"/g, "&quot;")}"`;
    },
  );
  out = out.replace(/<a\b([^>]*)>/gi, (_match, attrs: string) => {
    const cleaned = attrs.replace(
      /\s(target|rel)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
      "",
    );
    return `<a${cleaned} target="_blank" rel="noopener noreferrer">`;
  });
  return out;
}
