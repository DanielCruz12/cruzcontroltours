import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "./icons";

const QUICK_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#destinos", label: "Destinos" },
  { href: "/tours", label: "Tours" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

const POPULAR_DESTINATIONS = [
  "Ruta de las Flores",
  "Lago de Coatepeque",
  "El Tunco",
  "Volcán de Santa Ana",
];

export default function Footer() {
  return (
    <footer id="contacto" className="bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Marca */}
          <div id="nosotros">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Cruz Control Tours — Inicio">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                <MapPinIcon className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-base font-extrabold tracking-tight text-white">
                  Cruz Control
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.32em] text-white/80">
                  Tours · El Salvador
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Tours y experiencias por los paisajes más increíbles de El
              Salvador, con guías locales expertos y la tranquilidad de viajar
              con una empresa salvadoreña.
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

          {/* Enlaces rápidos */}
          <nav aria-label="Enlaces rápidos">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Enlaces rápidos
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Destinos populares */}
          <nav aria-label="Destinos populares">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Destinos
            </h3>
            <ul className="mt-4 space-y-2.5">
              {POPULAR_DESTINATIONS.map((destination) => (
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
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a
                  href="mailto:info@cruzcontroltours.com"
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <MailIcon className="size-4 shrink-0 text-white/80" />
                  info@cruzcontroltours.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="size-4 shrink-0 text-white/80" />
                +503 0000 0000
              </li>
              <li className="flex items-center gap-2.5">
                <MapPinIcon className="size-4 shrink-0 text-white/80" />
                El Salvador, Centroamérica
              </li>
            </ul>
          </div>
        </div>

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
