"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "./icons";

// Umbral a partir del cual aparece la flecha (px de scroll).
const SHOW_AFTER_PX = 480;

/** Flecha fija "volver arriba" con scroll suave (respeta reduced-motion). */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    // Con movimiento reducido se sube de golpe, no con animación.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={`fixed bottom-4 right-4 z-50 grid size-11 place-items-center rounded-full bg-primary text-white shadow-lg shadow-charcoal/30 transition-all duration-300 hover:bg-sky sm:bottom-6 sm:right-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUpIcon className="size-5" />
    </button>
  );
}
