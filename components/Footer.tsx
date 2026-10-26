/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "./icons";

const DESTINATIONS = [
  "El Salvador",
  "Nicaragua",
  "Honduras",
  "Guatemala",
];

const WHATSAPP_URL = "https://wa.me/50360503161";
const MAPS_URL =
  "https://maps.google.com/?q=114+B+calle+los+pocitos+colonia+dolores,+06015,+San+Salvador,+El+Salvador";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Móvil: logo a la izquierda y destinos a la derecha en dos filas,
            sin espacios vacíos. Desktop: tres columnas (marca / destinos /
            contacto). */}
        <div className="grid grid-cols-[auto_1fr] gap-x-6 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-x-10">
          {/* Logo (sin panel blanco: el logo es claro y contrasta con el
              fondo oscuro del footer) */}
          <Link
            href="/"
            className="inline-flex self-start lg:col-start-1 lg:row-start-1"
            aria-label="Cruz Control Tours — Inicio"
          >
            <img
              src="/logocruztours.png"
              alt="Cruz Control Tours"
              className="h-14 w-auto drop-shadow-sm sm:h-20 lg:h-24"
            />
          </Link>

          {/* Destinos: junto al logo en móvil (2 columnas × 2 filas) */}
          <nav
            aria-label="Destinos"
            className="lg:col-start-2 lg:row-start-1"
          >
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky">
              Destinos
            </h3>
            <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1.5 lg:mt-3 lg:grid-cols-1 lg:gap-y-2.5">
              {DESTINATIONS.map((destination) => (
                <li key={destination}>
                  <Link
                    href="/#destinos"
                    className="text-xs text-white/70 transition-colors hover:text-white lg:text-sm"
                  >
                    {destination}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Marca: descripción, horario y redes */}
          <div
            id="nosotros"
            className="col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-2"
          >
            <p className="max-w-md text-xs leading-relaxed text-white/60 sm:text-sm pt-4">
              Organizamos experiencias en Centroamérica con atención
              personalizada, guías locales y rutas cuidadosamente
              planificadas. Viaja con confianza, comodidad y el respaldo de
              un equipo que te acompaña en todo momento.
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-white/70">
              Horario: Lun–Sáb | 8:00 AM – 6:00 PM
            </p>
            <p className="mt-1 flex items-center gap-2 text-xs text-white/70">
              Atención: Tours privados y grupales
            </p>
            {/*   <div className="mt-4 flex items-center gap-2">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Cruz Control Tours"
                className="grid size-8 place-items-center rounded-full bg-white/10 text-sky transition-colors hover:bg-sky-light/25"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Cruz Control Tours"
                className="grid size-8 place-items-center rounded-full bg-white/10 text-sky transition-colors hover:bg-sky-light/25"
              >
                <FacebookIcon className="size-4" />
              </a>
            </div> */}
          </div>

          {/* Contacto */}
          <div className="col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2">
            {/*   <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky">
              Contacto
            </h3> */}
            <ul className="mt-2 pt-4 space-y-3 text-xs text-white/70 lg:mt-3 lg:space-y-4 lg:text-sm">
              <li className="flex gap-2.5">
                <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-sky lg:size-4" />
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  114 B calle los pocitos colonia dolores, 06015, San
                  Salvador, El Salvador.
                </a>
              </li>
              <li className="flex gap-2.5">
                <PhoneIcon className="mt-0.5 size-3.5 shrink-0 text-sky lg:size-4" />
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  +503 6050 3161
                </a>
              </li>
              <li className="flex gap-2.5">
                <MailIcon className="mt-0.5 size-3.5 shrink-0 text-sky lg:size-4" />
                <a
                  href="mailto:cruzcontroltours@gmail.com"
                  className="transition-colors hover:text-white"
                >
                  cruzcontroltours@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* La llamada a la acción vive en CtaSection, arriba del footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-5 text-[11px] text-white/50 lg:text-xs">
          <p>
            © {new Date().getFullYear()} Cruz Control Tours. Todos los derechos
            reservados.
          </p>
          <p>Hecho con orgullo en El Salvador 🇸🇻</p>
        </div>
      </div>
    </footer>
  );
}
