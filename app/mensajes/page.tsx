import type { Metadata } from "next";
import CustomerMessages from "@/components/CustomerMessages";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Mensajes recibidos — Cruz Control Tours",
  description: "Bandeja interna de mensajes del formulario de contacto.",
  robots: { index: false, follow: false },
};

export default function MensajesPage() {
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
              Mensajes recibidos
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-base">
              Bandeja interna con los mensajes del formulario de contacto.
            </p>
          </div>
        </section>

        {/* Bandeja */}
        <section className="bg-surface py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <CustomerMessages />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
