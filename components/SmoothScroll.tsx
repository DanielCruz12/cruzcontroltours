"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { initGlobalAnimations } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Infraestructura de scroll y animación. No renderiza nada.
 * - Lenis (lerp 0.08) sincronizado con ScrollTrigger vía gsap.ticker.
 * - Re-registra las animaciones globales en cada cambio de ruta.
 * - Con prefers-reduced-motion no activa ni Lenis ni animaciones.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  // Lenis vive mientras viva el layout (una sola instancia).
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.06 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Las animaciones se re-registran por ruta (limpian las anteriores).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = initGlobalAnimations();
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [pathname]);

  return null;
}
