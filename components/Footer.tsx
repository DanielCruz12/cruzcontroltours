/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
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
    <footer id="contacto" className="bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_1.2fr]">
          {/* Marca */}
          <div id="nosotros">
            {/* Logo grande (el mismo del header) sobre un panel claro para
                que resalte sobre el fondo oscuro del footer */}
            <Link
              href="/"
              className="inline-flex"
              aria-label="Cruz Control Tours — Inicio"
            >
              <img
                src="/logocruztours.png"
                alt="Cruz Control Tours"
                className="h-32 w-auto rounded-2xl bg-white p-3 shadow-lg sm:h-40"
              />
            </Link>
            <h3 className="mt-5 text-lg font-extrabold tracking-tight text-white">
              Cruz Tours
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              Organizamos experiencias en Centroamérica con atención
              personalizada, guías locales y rutas cuidadosamente
              planificadas. Viaja con confianza, comodidad y el respaldo de
              un equipo que te acompaña en todo momento.
            </p>
            <p className="mt-4 flex items-center gap-2.5 text-sm text-white/80">
              <ClockIcon className="size-4 shrink-0 text-white/80" />
              Horario: Lun–Sáb | 8:00 AM – 6:00 PM
            </p>
            <p className="mt-1.5 flex items-center gap-2.5 text-sm text-white/80">
              <UsersIcon className="size-4 shrink-0 text-white/80" />
              Atención: Tours privados y grupales
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Cruz Control Tours"
                className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Cruz Control Tours"
                className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
              >
                <FacebookIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Destinos */}
          <nav aria-label="Destinos">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Destinos
            </h3>
            <ul className="mt-4 space-y-2.5">
              {DESTINATIONS.map((destination) => (
                <li key={destination}>
                  <Link
                    href="/#destinos"
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {destination}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contacto
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-white/70">
              <li className="flex gap-2.5">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-white/80" />
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
                <PhoneIcon className="mt-0.5 size-4 shrink-0 text-white/80" />
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
                <MailIcon className="mt-0.5 size-4 shrink-0 text-white/80" />
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
        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/50">
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
