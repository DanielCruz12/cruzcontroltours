"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useReveal } from "@/lib/useReveal";
import { CheckIcon } from "./icons";

const CTA_PHOTO =
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2400&auto=format&fit=crop";

// Si no hay imagen, el degradado verde-cielo queda como fondo.
const MEADOW_FALLBACK =
  "linear-gradient(to bottom, #DFF0FA 0%, #BFE3C8 55%, #7CBF6A 100%)";

const AVATARS = [
  { initial: "C", classes: "bg-neutral-900 text-white" },
  { initial: "V", classes: "bg-neutral-500 text-white" },
  { initial: "A", classes: "bg-stone-300 text-neutral-800" },
];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function CtaSection() {
  const [imgOk, setImgOk] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { ref, visible, settled } = useReveal<HTMLDivElement>(900);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
    }
  }, []);

  // Parallax sutil de la foto (pausado con movimiento reducido).
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        setParallaxY(Math.max(-30, Math.min(60, rect.top * 0.08)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      setSent(false);
      return;
    }
    setError(null);
    setSent(true);
  };

  const reveal = (distance: string) =>
    `motion-safe:transition-all motion-safe:duration-[600ms] motion-safe:ease-out ${
      visible
        ? "motion-safe:translate-y-0 motion-safe:opacity-100"
        : `${distance} motion-safe:opacity-0`
    }`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="cta-final-titulo"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-white"
    >
      {/* Foto en la mitad inferior, difuminada hacia el blanco */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[52%]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 45%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: MEADOW_FALLBACK }}
        />
        {imgOk && (
          <div
            className="absolute inset-0"
            style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
          >
            <img
              src={CTA_PHOTO}
              alt=""
              loading="lazy"
              onError={() => setImgOk(false)}
              className="absolute inset-x-0 top-[-50px] h-[calc(100%+100px)] w-full object-cover motion-safe:transition-transform motion-safe:duration-[1200ms] motion-safe:ease-out"
              style={{ transform: visible ? "scale(1)" : "scale(1.06)" }}
            />
          </div>
        )}
      </div>

      {/* Contenido centrado */}
      <div
        ref={ref}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pb-[30svh] pt-28 text-center sm:px-6 sm:pt-36"
      >
        <h2
          id="cta-final-titulo"
          className="max-w-5xl text-[36px] font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-[64px]"
        >
          <span className="block overflow-hidden">
            <span
              className={`block ${reveal("motion-safe:translate-y-full")}`}
            >
              One subscription and your
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className={`block ${reveal("motion-safe:translate-y-full")}`}
              style={{
                transitionDelay: visible && !settled ? "120ms" : "0ms",
              }}
            >
              hiring problems{" "}
              <span
                className="inline-flex items-center align-middle"
                aria-hidden="true"
              >
                {AVATARS.map((avatar, index) => (
                  <span
                    key={avatar.initial}
                    className={`grid size-8 place-items-center rounded-full text-xs font-bold shadow-md ring-2 ring-white sm:size-10 sm:text-sm ${avatar.classes} ${
                      index > 0 ? "-ml-2" : ""
                    }`}
                  >
                    {avatar.initial}
                  </span>
                ))}
              </span>{" "}
              solved
            </span>
          </span>
        </h2>

        {/* Formulario tipo píldora */}
        <div
          className={`mx-auto mt-10 w-full max-w-[520px] ${reveal("motion-safe:translate-y-6")}`}
          style={{
            transitionDelay: visible && !settled ? "300ms" : "0ms",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white p-1.5 pl-5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)] transition-colors focus-within:border-neutral-500">
              <label htmlFor="cta-email" className="sr-only">
                Email address
              </label>
              <input
                id="cta-email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "cta-email-error" : undefined}
                className="w-full flex-1 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-[14px] bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] transition-colors hover:bg-neutral-700"
              >
                Get matched
              </button>
            </div>
          </form>
          {error ? (
            <p
              id="cta-email-error"
              role="alert"
              className="mt-3 text-sm text-red-600"
            >
              {error}
            </p>
          ) : sent ? (
            <p
              role="status"
              className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-700"
            >
              <span className="grid size-5 place-items-center rounded-full bg-neutral-900 text-white">
                <CheckIcon className="size-3" />
              </span>
              You&apos;re in! Check your inbox to get matched.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
