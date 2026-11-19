import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animaciones globales por atributos data-* (solo transform y opacity).
 * No hacen nada con prefers-reduced-motion: los elementos quedan visibles.
 *
 * - [data-reveal]: fade-up al entrar en pantalla, escalonado 90ms.
 * - [data-lines] con hijos [data-line]: reveal por línea (600ms).
 *   Convención por línea:
 *     <span className="block overflow-hidden">
 *       <span data-line className="block">Texto…</span>
 *     </span>
 * - [data-parallax]: parallax sutil (yPercent -15, scrub). La imagen debe
 *   medir ~120% del alto de su marco con overflow-hidden, p. ej.
 *   className="absolute inset-x-0 top-[-10%] h-[120%] object-cover".
 *   El trigger es el ancestro [data-parallax-wrap] más cercano (o el propio
 *   elemento si no hay).
 */
export function initGlobalAnimations() {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Fade-up escalonado. El estado inicial se fija por JS para que el
      // contenido siga visible sin JS o con movimiento reducido.
      gsap.set("[data-reveal]", { y: 24, opacity: 0 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (targets) =>
          gsap.to(targets, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.09,
            overwrite: true,
          }),
      });

      // Reveal por línea dentro de cada bloque [data-lines].
      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((block) => {
        const lines = block.querySelectorAll("[data-line]");
        if (lines.length === 0) return;
        gsap.set(lines, { yPercent: 110, opacity: 0 });
        gsap.to(lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: block, start: "top 85%", once: true },
        });
      });

      // Parallax sutil en imágenes de fondo.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-parallax-wrap]") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });
  });

  return ctx;
}
