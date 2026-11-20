import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Privacidad y cookies — Cruz Control Tours",
  description:
    "Cómo tratamos tus datos personales y qué cookies usamos en el sitio de Cruz Control Tours.",
};

const SECTIONS = [
  {
    title: "Responsable del tratamiento",
    body: [
      "Cruz Control Tours, con domicilio en 114 B calle los pocitos colonia dolores, 06015, San Salvador, El Salvador, es responsable de los datos personales que nos compartes a través de este sitio.",
    ],
  },
  {
    title: "Datos que recogemos",
    body: [
      "Solo recogemos los datos que nos das directamente en el formulario de contacto: nombre, teléfono, correo electrónico y el mensaje que escribas.",
      "No te pedimos crear una cuenta ni recogemos datos de pago en este sitio.",
    ],
  },
  {
    title: "Para qué usamos tus datos",
    body: [
      "Usamos tus datos únicamente para responder tu mensaje, armar tu itinerario y coordinar los servicios que nos solicites. No vendemos ni compartimos tus datos con terceros con fines publicitarios.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "Este sitio usa solo cookies técnicas y necesarias para funcionar (por ejemplo, recordar si aceptaste este aviso y mantener tu sesión en el panel de administración).",
      "No usamos cookies de publicidad ni de seguimiento de terceros. Puedes cambiar de opinión en cualquier momento borrando los datos del sitio en tu navegador, con lo que volverás a ver el aviso de cookies.",
    ],
  },
  {
    title: "Tus derechos",
    body: [
      "Puedes pedirnos en cualquier momento que veamos, corrijamos o eliminemos tus datos personales. Escríbenos a cruzcontroltours@gmail.com o al +503 6050 3161 y atenderemos tu solicitud.",
    ],
  },
];

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Encabezado de la página (con espacio para el navbar flotante) */}
        <section className="bg-charcoal pb-12 pt-24 sm:pb-16 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="pill-blanco">Legal</p>
            <h1 className="titulo-display mt-4 text-white">
              Privacidad y cookies
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-base">
              En lenguaje claro: qué datos recogemos, para qué los usamos y
              qué cookies utiliza este sitio.
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
              Última actualización: noviembre de 2026.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
