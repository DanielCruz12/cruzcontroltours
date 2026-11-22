import { WhatsAppIcon } from "./icons";

const WHATSAPP_URL = "https://wa.me/50360503161";

/** Botón flotante de WhatsApp, abajo a la izquierda. */
export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-4 left-4 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-neutral-900/20 transition-all duration-300 hover:bg-[#1eb856] motion-safe:animate-[cookie-in_300ms_ease-out] sm:bottom-6 sm:left-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
