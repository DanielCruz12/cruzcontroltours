/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  FlagSV,
  FlagUS,
  MenuIcon,
  SearchIcon,
  XIcon,
} from "./icons";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#destinos", label: "Destinos" },
  { href: "/tours", label: "Tours" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

function focusSearchBar() {
  document
    .getElementById("destinos")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    document.getElementById("buscar-destino")?.focus({ preventScroll: true });
  }, 350);
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Intensifica el cristal del header cuando la página ya no está arriba del todo
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-300 ${scrolled
          ? "border-white/60 bg-white/75 shadow-lg shadow-charcoal/5"
          : "border-white/25 bg-white/45"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Cruz Control Tours — Inicio"
          onClick={() => setMenuOpen(false)}
        >
          <img
            className="h-10 w-auto drop-shadow-sm sm:h-12 lg:h-14"
            src="/logocruztours.png"
            alt="Cruz Control Tours"
          />
        </Link>

        {/* Navegación desktop */}
        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`text-sm font-semibold transition-colors ${isActive(link.href)
                    ? "text-primary"
                    : "text-ink-soft hover:text-primary"
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
              className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-surface hover:text-ink sm:px-3"
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
                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/50 bg-white/90 p-1.5 shadow-xl shadow-charcoal/10"
              >
                <li
                  role="option"
                  aria-selected="true"
                  className="flex items-center gap-2.5 rounded-lg bg-surface px-3 py-2.5 text-sm font-semibold text-ink"
                >
                  <FlagSV className="w-5 rounded-[3px]" />
                  Español
                  <CheckIcon className="ml-auto size-4 text-primary" />
                </li>
                <li
                  role="option"
                  aria-selected="false"
                  aria-disabled="true"
                  title="Disponible próximamente"
                  className="mt-1 flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-faint"
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

          {/* Búsqueda */}
          <button
            type="button"
            onClick={focusSearchBar}
            aria-label="Buscar tours"
            className="grid size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-primary"
          >
            <SearchIcon className="size-5" />
          </button>

          {/* Menú móvil */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface lg:hidden"
          >
            {menuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div
          id="menu-movil"
          className="border-t border-white/50 bg-white/85 px-4 pb-6 pt-2 shadow-lg lg:hidden"
        >
          <nav aria-label="Navegación móvil">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="border-b border-surface last:border-0">
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`flex items-center justify-between py-3.5 text-base font-semibold ${isActive(link.href) ? "text-primary" : "text-ink"
                      }`}
                  >
                    {link.label}
                    <ChevronDownIcon className="size-4 -rotate-90 text-ink-faint" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-faint">
            <FlagSV className="w-4 rounded-[2px] ring-1 ring-charcoal/10" />
            Español · El Salvador
          </p>
        </div>
      )}
    </header>
  );
}
