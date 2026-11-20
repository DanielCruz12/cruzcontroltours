import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Términos y condiciones — Cruz Control Tours",
  description:
    "Condiciones de uso de los servicios de tours, transporte y reservas de Cruz Control Tours.",
};

const SECTIONS = [
  {
    title: "Aceptación",
    body: [
      "Al reservar o contratar cualquiera de nuestros servicios aceptas estos términos y condiciones. Si no estás de acuerdo con alguno de ellos, por favor no uses nuestros servicios.",
    ],
  },
  {
    title: "Nuestros servicios",
    body: [
      "Ofrecemos tours guiados, tours privados, servicios de transporte, mudanzas y traslados empresariales en El Salvador y Centroamérica. Los itinerarios, duraciones y puntos de encuentro se confirman al momento de la reserva.",
    ],
  },
  {
    title: "Reservas y pagos",
    body: [
      "Toda reserva queda sujeta a disponibilidad y se confirma cuando recibes nuestra confirmación por teléfono, correo o WhatsApp.",
      "Los precios publicados pueden variar sin previo aviso, pero siempre se respeta el precio acordado al confirmar tu reserva.",
    ],
  },
  {
    title: "Cambios y cancelaciones",
    body: [
      "Si necesitas cambiar o cancelar tu reserva, avísanos lo antes posible por teléfono o WhatsApp al +503 6050 3161.",
      "Según la anticipación del aviso y los costos ya comprometidos con proveedores, podrán aplicarse cargos. Cada caso se revisa de forma individual y justa.",
      "Si por causas de fuerza mayor (clima extremo, cierres viales, emergencias) debemos cancelar o modificar un servicio, te ofreceremos reprogramarlo o la devolución correspondiente.",
    ],
  },
  {
    title: "Responsabilidades del viajero",
    body: [
      "Te pedimos llegar puntual al punto de encuentro, seguir las indicaciones de los guías y cuidar los espacios naturales y culturales que visitamos.",
      "Cada viajero es responsable de sus documentos personales, medicamentos y objetos de valor durante el recorrido.",
    ],
  },
  {
    title: "Limitación de responsabilidad",
    body: [
      "Hacemos todo lo posible para que tu experiencia sea segura y agradable. Sin embargo, las actividades al aire libre conllevan riesgos propios (senderismo, surf, traslados), que el viajero asume al participar.",
    ],
  },
];

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Encabezado de la página (con espacio para el navbar flotante) */}
        <section className="bg-charcoal pb-12 pt-24 sm:pb-16 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="pill-blanco">Legal</p>
            <h1 className="titulo-display mt-4 text-white">
              Términos y condiciones
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-base">
              Las reglas claras de nuestros tours, transporte y reservas.
            </p>
          </div>
        </section>

        {/* Contenido */}
        <section className="bg-surface py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            {SECTIONS.map((section) => (
              <div key={section.title} className="mb-10 last:mb-0">
                <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                  {section.title}
                </h2>
                {section.body.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mt-3 text-[15px] leading-relaxed text-neutral-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
            <p className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-400">
              Última actualización: noviembre de 2026.{" "}
              <Link
                href="/privacidad"
                className="font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
              >
                Ver política de privacidad
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
