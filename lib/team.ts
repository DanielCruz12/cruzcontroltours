// Equipo de Cruz Control Tours.
//
// ⚠️ CONTENIDO ILUSTRATIVO TEMPORAL: los nombres, cargos y frases de este
// archivo son ejemplos de diseño y NO deben publicarse como información
// real. Reemplazarlos por el equipo real (con fotos propias) antes de
// producción.
//
// Para i18n (el selector EN del Header está pendiente), mover los textos
// a un diccionario de traducciones; la estructura de datos ya los separa
// del componente.

export type TeamMember = {
  id: string;
  /** Frase personal que se muestra en grande. */
  motto: string;
  /** Nombre de la persona. */
  name: string;
  /** Cargo dentro de Cruz Control Tours. */
  role: string;
  /** Foto del miembro (opcional). Si no se define, se muestran las
      iniciales del nombre en un círculo. */
  image?: string;
};

export const team: TeamMember[] = [
  {
    id: "ejemplo-1",
    motto:
      "Conocemos cada sendero, cada mirador y cada historia detrás de los volcanes.",
    name: "Carlos Méndez",
    role: "Guía principal de aventura",
  },
  {
    id: "ejemplo-2",
    motto: "Armamos cada itinerario como si viajara nuestra propia familia.",
    name: "Andrea Torres",
    role: "Coordinadora de tours",
  },
  {
    id: "ejemplo-3",
    motto:
      "El café, las flores y la gente: la Ruta se disfruta mejor con alguien de aquí.",
    name: "Jorge Hernández",
    role: "Guía local — Ruta de las Flores",
  },
  {
    id: "ejemplo-4",
    motto: "Estamos contigo desde el primer mensaje hasta el regreso a casa.",
    name: "Sofía Ramos",
    role: "Atención al viajero",
  },
];
