// Testimonios de clientes de Cruz Control Tours.
//
// ⚠️ CONTENIDO ILUSTRATIVO TEMPORAL: los nombres y frases de este archivo
// son ejemplos de diseño y NO deben publicarse como información real.
// Reemplazarlos por testimonios reales (con foto si el cliente autoriza)
// antes de producción.
//
// Para i18n (el selector EN del Header está pendiente), mover los textos
// a un diccionario de traducciones; la estructura de datos ya los separa
// del componente.

export type Testimonial = {
  id: string;
  /** Frase del cliente que se muestra en grande. */
  motto: string;
  /** Nombre del cliente. */
  name: string;
  /** Qué servicio usó (tour, transporte, etc.). */
  role: string;
  /** Foto del cliente (opcional). Si no se define, se muestran las
      iniciales del nombre en un círculo. */
  image?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "testimonio-1",
    motto:
      "El tour al volcán superó todo lo que esperábamos. Puntuales, atentos y con una energía increíble.",
    name: "Gabriela Fuentes",
    role: "Viajó al Volcán de Santa Ana",
  },
  {
    id: "testimonio-2",
    motto:
      "Nos armaron un itinerario perfecto para toda la familia, hasta los niños la pasaron increíble.",
    name: "Roberto Castillo",
    role: "Viajó a la Ruta de las Flores",
  },
  {
    id: "testimonio-3",
    motto:
      "El traslado al aeropuerto fue puntual y comodísimo. Desde ese día los recomiendo con todo el mundo.",
    name: "Elena Payés",
    role: "Usó transporte privado",
  },
  {
    id: "testimonio-4",
    motto:
      "Contratamos los traslados para todo nuestro equipo y ni un solo retraso en meses.",
    name: "Miguel Ángel Rivas",
    role: "Cliente empresarial",
  },
];
