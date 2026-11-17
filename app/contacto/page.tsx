import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contacto — Cruz Control Tours",
  description:
    "Escríbenos y armamos tu itinerario por El Salvador y Centroamérica: fecha, presupuesto y estilo de viaje.",
};

const WHATSAPP_URL = "https://wa.me/50360503161";
const MAPS_URL =
  "https://maps.google.com/?q=114+B+calle+los+pocitos+colonia+dolores,+06015,+San+Salvador,+El+Salvador";

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Encabezado de la página (con espacio para el navbar flotante) */}
        <section className="bg-charcoal pb-12 pt-24 sm:pb-16 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-white/80">
              Cruz Control Tours
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Hablemos de tu próximo viaje
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-base">
              Déjanos tus datos y te contactamos para armar tu itinerario según
              tu fecha, presupuesto y estilo de viaje.
            </p>
          </div>
        </section>

        {/* Formulario + datos directos */}
        <section className="bg-surface py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
            <ContactForm />

            <aside
              aria-label="Otras formas de contacto"
              className="h-fit rounded-2xl bg-sky-deep p-6 text-white sm:p-7"
            >
              <h2 className="text-lg font-extrabold">Contacto directo</h2>
              <p className="mt-1 text-sm leading-relaxed text-white/85">
                ¿Prefieres escribirnos ya? También nos encuentras aquí.
              </p>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-2.5">
                  <MapPinIcon className="mt-0.5 size-4 shrink-0 text-sky-light" />
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:underline"
                  >
                    114 B calle los pocitos colonia dolores, 06015, San
                    Salvador, El Salvador.
                  </a>
                </li>
                <li className="flex gap-2.5">
                  <PhoneIcon className="mt-0.5 size-4 shrink-0 text-sky-light" />
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold transition-colors hover:underline"
                  >
                    +503 6050 3161
                  </a>
                </li>
                <li className="flex gap-2.5">
                  <MailIcon className="mt-0.5 size-4 shrink-0 text-sky-light" />
                  <a
                    href="mailto:cruzcontroltours@gmail.com"
                    className="transition-colors hover:underline"
                  >
                    cruzcontroltours@gmail.com
                  </a>
                </li>
              </ul>
              <p className="mt-5 border-t border-white/20 pt-4 text-xs leading-relaxed text-white/80">
                Horario: Lun–Sáb | 8:00 AM – 6:00 PM
                <br />
                Atención: Tours privados y grupales
              </p>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
