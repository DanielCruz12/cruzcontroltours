"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchFaqs } from "@/lib/store/faqsSlice";
import { PlusIcon } from "./icons";

export default function FaqSection() {
  const dispatch = useAppDispatch();
  const { items, listStatus, listError } = useAppSelector(
    (state) => state.faqs,
  );
  const [openId, setOpenId] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const idPrefix = useId();

  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchFaqs());
  }, [dispatch, listStatus]);

  const faqs = items.filter((faq) => faq.active);

  // La primera pregunta sale desplegada; al interactuar, manda el usuario.
  useEffect(() => {
    if (!hasInteracted && openId === null && faqs.length > 0) {
      setOpenId(faqs[0].id);
    }
  }, [hasInteracted, openId, faqs]);

  if (listStatus === "succeeded" && faqs.length === 0) return null;

  const focusButton = (index: number) => {
    const count = faqs.length;
    if (count === 0) return;
    const next = (index + count) % count;
    buttonRefs.current[next]?.focus();
  };

  return (
    <section
      aria-labelledby={`${idPrefix}-titulo`}
      className="bg-white py-20 font-hanken text-neutral-900 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* Columna izquierda (sticky) */}
        <div className="self-start lg:sticky lg:top-28">
          <p className="pill-negro">
            FAQ
          </p>
          <h2
            id={`${idPrefix}-titulo`}
            className="titulo-display mt-6 text-neutral-900"
          >
            Questions,
            <br />
            answered.
          </h2>

          <div className="mt-10 rounded-[24px] bg-[#F3F3F3] p-7">
            <p className="text-xl font-medium text-neutral-900">
              Still have a question?
            </p>
            <p className="mt-2 text-base leading-relaxed text-neutral-500">
              Can&apos;t find the answer you&apos;re looking for? Our team
              will get back to you shortly.
            </p>
            <a
              href="/contacto"
              className="btn-negro mt-6"
            >
              Book a demo
            </a>
          </div>
        </div>

        {/* Columna derecha (acordeón) */}
        <div>
          {listStatus === "loading" || listStatus === "idle" ? (
            <div aria-busy="true">
              <p className="sr-only">Cargando preguntas…</p>
              <div aria-hidden="true">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="flex animate-pulse items-center justify-between gap-6 border-b border-neutral-200 py-9"
                  >
                    <div className="h-6 w-3/4 rounded-full bg-neutral-100" />
                    <div className="size-10 shrink-0 rounded-full bg-neutral-100" />
                  </div>
                ))}
              </div>
            </div>
          ) : listStatus === "failed" ? (
            <div className="rounded-[24px] bg-[#F3F3F3] p-7">
              <p className="text-xl font-medium text-neutral-900">
                No pudimos cargar las preguntas
              </p>
              <p className="mt-2 text-base leading-relaxed text-neutral-500">
                {listError ?? "Ocurrió un error inesperado. Inténtalo de nuevo."}
              </p>
              <button
                type="button"
                onClick={() => dispatch(fetchFaqs())}
                className="btn-negro mt-6"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div>
              {faqs.map((faq, index) => {
                const isOpen = openId === faq.id;
                const buttonId = `${idPrefix}-boton-${faq.id}`;
                const panelId = `${idPrefix}-panel-${faq.id}`;
                return (
                  <div key={faq.id} className="border-b border-neutral-200">
                    <h3>
                      <button
                        ref={(node) => {
                          buttonRefs.current[index] = node;
                        }}
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => {
                          setHasInteracted(true);
                          setOpenId(isOpen ? null : faq.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            focusButton(index + 1);
                          } else if (event.key === "ArrowUp") {
                            event.preventDefault();
                            focusButton(index - 1);
                          } else if (event.key === "Home") {
                            event.preventDefault();
                            focusButton(0);
                          } else if (event.key === "End") {
                            event.preventDefault();
                            focusButton(faqs.length - 1);
                          }
                        }}
                        className="flex w-full items-center justify-between gap-6 py-9 text-left"
                      >
                        <span className="text-[22px] font-normal leading-snug text-neutral-900">
                          {faq.question}
                        </span>
                        <span
                          aria-hidden="true"
                          className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-600 transition-colors duration-[250ms] hover:bg-neutral-200"
                        >
                          <PlusIcon
                            className={`size-5 transition-transform duration-[250ms] ease-out ${isOpen ? "rotate-45" : ""}`}
                          />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid transition-[grid-template-rows,opacity] duration-[250ms] ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-9 pr-2 text-[17px] leading-relaxed text-neutral-500 sm:pr-16">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
