/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CartIcon,
  CheckIcon,
  ChevronDownIcon,
  FlagSV,
  FlagUS,
  MenuIcon,
  XIcon,
} from "./icons";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#tours", label: "Destinos" },
  { href: "/tours", label: "Tours" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Activa el cristal oscuro cuando la página ya no está arriba del todo
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del fondo mientras el sidebar está abierto.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
      }
    };
    const onMouseDown = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  const isActive = (href: string) => href === pathname;
  // Transparente solo al inicio del home (sobre el video); en el resto,
  // cristal oscuro para que el texto blanco siempre se lea.
  const solid = scrolled || pathname !== "/";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${solid
            ? "border-white/10 bg-charcoal/50 shadow-lg shadow-charcoal/30 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent"
          }`}
      >
        {/* Degradado sobre el video para que el texto blanco se lea;
            se desvanece cuando entra el cristal oscuro al hacer scroll. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/10 to-transparent transition-opacity duration-300 ${solid ? "opacity-0" : "opacity-100"}`}
        />
        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Cruz Control Tours — Inicio"
            onClick={() => setMenuOpen(false)}
          >
            <img
              className="size-9 rounded-full object-cover ring-1 ring-white/40"
              src="/logocruztours.png"
              alt="Cruz Control Tours"
            />
          </Link>

          {/* Navegación desktop */}
          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`relative text-[13px] font-semibold transition-colors ${isActive(link.href)
                      ? "text-white after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-white"
                      : "text-white/70 hover:text-white"
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Selector de idioma */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Cambiar idioma"
                className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[13px] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:px-2.5"
              >
                <FlagSV className="w-5 rounded-[3px] shadow-sm ring-1 ring-charcoal/10" />
                <span className="hidden sm:inline">ES</span>
                <ChevronDownIcon
                  className={`size-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`}
                />
              </button>
              {langOpen && (
                <ul
                  role="listbox"
                  aria-label="Idioma"
                  className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-charcoal/90 p-1.5 shadow-xl shadow-charcoal/30 backdrop-blur-xl"
                >
                  <li
                    role="option"
                    aria-selected="true"
                    className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-ink"
                  >
                    <FlagSV className="w-5 rounded-[3px]" />
                    Español
                    <CheckIcon className="ml-auto size-4 text-neutral-900" />
                  </li>
                  <li
                    role="option"
                    aria-selected="false"
                    aria-disabled="true"
                    title="Disponible próximamente"
                    className="mt-1 flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/50"
                  >
                    <FlagUS className="w-5 rounded-[3px] opacity-60" />
                    English
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wide">
                      Pronto
                    </span>
                  </li>
                </ul>
              )}
            </div>

            {/* Carrito (temporal: solo el icono, sin funcionalidad todavía) */}
            <button
              type="button"
              aria-label="Carrito de compras"
              className="grid size-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CartIcon className="size-5" />
            </button>

            {/* Menú móvil */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar móvil con glassmorphism. Vive FUERA del <header>: el
          backdrop-filter del header crea un containing block y los
          elementos `fixed` de adentro no cubrirían toda la pantalla.
          Siempre está montado para animar la entrada y la salida. */}
      <div className="lg:hidden" inert={!menuOpen}>
        {/* Velo oscuro que se funde detrás del panel */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        />

        {/* Panel lateral: se desliza desde la derecha */}
        <aside
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col border-l border-white/40 bg-white/70 shadow-2xl shadow-charcoal/25 backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Cabecera del panel: logo y cierre */}
          <div className="flex items-center justify-between border-b border-white/40 px-5 py-4">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              aria-label="Cruz Control Tours — Inicio"
              className="flex shrink-0 items-center"
            >
              <img
                className="h-9 w-auto drop-shadow-sm"
                src="/logocruztours.png"
                alt="Cruz Control Tours"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
              className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
            >
              <XIcon className="size-5" />
            </button>
          </div>

          {/* Enlaces */}
          <nav aria-label="Navegación móvil" className="flex-1 overflow-y-auto px-3 py-4">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${isActive(link.href)
                      ? "bg-neutral-900 text-white"
                      : "text-ink hover:bg-neutral-100"
                      }`}
                  >
                    {link.label}
                    <ChevronDownIcon className="size-4 -rotate-90 text-ink-faint" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pie del panel */}
          <p className="flex items-center gap-2 border-t border-white/40 px-5 py-4 text-xs font-semibold text-ink-faint">
            <FlagSV className="w-4 rounded-[2px] ring-1 ring-charcoal/10" />
            Español · El Salvador
          </p>
        </aside>
      </div>
    </>
  );
}
