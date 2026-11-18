"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchFaqs } from "@/lib/store/faqsSlice";
import { ChevronDownIcon } from "./icons";

export default function FaqSection() {
  const dispatch = useAppDispatch();
  const { items, listStatus, listError } = useAppSelector(
    (state) => state.faqs,
  );

  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchFaqs());
  }, [dispatch, listStatus]);

  const faqs = items.filter((faq) => faq.active);

  if (listStatus === "succeeded" && faqs.length === 0) return null;

  return (
    <section
      aria-labelledby="faq-titulo"
      className="bg-white py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl text-start">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-sky-deep sm:text-sm">
            Preguntas frecuentes
          </p>
          <h2
            id="faq-titulo"
            className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Todo lo que necesitas saber
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft sm:text-base">
            ¿No encuentras tu respuesta?{" "}
            <a
              href="https://wa.me/50360503161"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary transition-colors hover:text-sky"
            >
              Escríbenos por WhatsApp
            </a>
            .
          </p>
        </div>

        {listStatus === "loading" || listStatus === "idle" ? (
          <div className="mt-10 space-y-3 sm:mt-12" aria-busy="true">
            <p className="sr-only">Cargando preguntas…</p>
            <div aria-hidden="true" className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-2xl border border-ink/10 bg-ink/5"
                />
              ))}
            </div>
          </div>
        ) : listStatus === "failed" ? (
          <div className="mt-10 rounded-2xl border border-dashed border-charcoal/15 bg-white px-6 py-10 text-center sm:mt-12">
            <p className="text-sm font-extrabold text-charcoal sm:text-base">
              No pudimos cargar las preguntas
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink-soft sm:text-sm">
              {listError ?? "Ocurrió un error inesperado. Inténtalo de nuevo."}
            </p>
            <button
              type="button"
              onClick={() => dispatch(fetchFaqs())}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-sky sm:text-sm"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-3 sm:mt-12">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group rounded-2xl border border-ink/10 bg-white px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-ink [&::-webkit-details-marker]:hidden sm:text-base">
                  {faq.question}
                  <ChevronDownIcon className="size-4 shrink-0 text-sky-deep transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-ink-soft sm:text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
