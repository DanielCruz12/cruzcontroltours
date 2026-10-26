import { ChevronDownIcon } from "./icons";

// ⚠️ CONTENIDO ILUSTRATIVO TEMPORAL: preguntas y respuestas de ejemplo para
// el diseño; reemplazar por las dudas reales de los clientes (y verificar
// datos de reserva/pago) antes de producción.

const FAQS = [
  {
    q: "¿Cómo reservo un tour?",
    a: "Escríbenos por WhatsApp al +503 6050 3161 o usa el buscador de la página: eliges tour, fecha y número de personas, y confirmamos tu reserva en minutos.",
  },
  {
    q: "¿Qué incluye el precio?",
    a: "Transporte desde el punto de encuentro, guía y entradas a los sitios, según el tour. Los alimentos no están incluidos salvo que el tour lo indique.",
  },
  {
    q: "¿Hacen tours privados o personalizados?",
    a: "Sí. Organizamos salidas privadas para familias y grupos con itinerario a tu medida: cuéntanos tus fechas y tus ideas.",
  },
  {
    q: "¿Qué pasa si llueve el día del tour?",
    a: "Reprogramamos sin costo o te reembolsamos. Te avisamos con anticipación si el clima impide realizar la actividad.",
  },
  {
    q: "¿Recogen en mi hotel?",
    a: "Incluimos recogida en hoteles del área de San Salvador o acordamos un punto de encuentro; para otras zonas, consulta por WhatsApp.",
  },
  {
    q: "¿Cómo realizo el pago?",
    a: "Reservas con depósito o transferencia y puedes pagar el resto el día del tour. Coordinamos los detalles contigo.",
  },
];

/**
 * Sección "Preguntas frecuentes" estilo framer.university: eyebrow + título
 * + enlace de contacto y acordeones nativos (`details`/`summary`, sin JS).
 */
export default function FaqSection() {
  return (
    <section
      aria-labelledby="faq-titulo"
      className="bg-white py-14 sm:py-16"
    >
      <div className="text-start max-w-3xl px-4 sm:px-6">
        <div className="text-start max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-sky-deep sm:text-sm">
            Preguntas frecuentes
          </p>
          <h2
            id="faq-titulo"
            className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Todo lo que necesitas saber
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft sm:text-base">
            ¿No encuentras tu respuesta?{" "}
            <a
              href="https://wa.me/50360503161"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary transition-colors hover:text-sky"
            >
              Escríbenos por WhatsApp
            </a>
            .
          </p>
        </div>

        <div className="mt-10 space-y-3 sm:mt-12">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-ink/10 bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-ink [&::-webkit-details-marker]:hidden sm:text-base">
                {faq.q}
                <ChevronDownIcon className="size-4 shrink-0 text-sky-deep transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-ink-soft sm:text-sm">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
