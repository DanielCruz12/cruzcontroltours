"use client";

import { useState } from "react";
import { CheckIcon, StarIcon } from "./icons";
import {
  submitReview,
  type PublicForm,
} from "@/lib/api/review-forms";
import { toErrorMessage } from "@/lib/api/client";

type Values = Record<string, { rating: number | null; text: string }>;

function emptyValues(form: PublicForm): Values {
  return Object.fromEntries(
    form.questions.map((question) => [question.id, { rating: null, text: "" }]),
  );
}

export default function ReviewSubmitForm({
  token,
  form,
}: {
  token: string;
  form: PublicForm;
}) {
  const [authorName, setAuthorName] = useState("");
  const [values, setValues] = useState<Values>(() => emptyValues(form));
  const [hovered, setHovered] = useState<Record<string, number | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const setRating = (questionId: string, rating: number) => {
    setValues((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], rating },
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const setText = (questionId: string, text: string) => {
    setValues((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], text },
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const next: Record<string, string> = {};
    for (const question of form.questions) {
      if (!question.required) continue;
      const value = values[question.id];
      if (question.type === "stars" && !value?.rating) {
        next[question.id] = "Elige de 1 a 5 estrellas.";
      }
      if (question.type === "text" && !value?.text.trim()) {
        next[question.id] = "Esta respuesta es obligatoria.";
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    setSubmitError(null);
    try {
      await submitReview(token, {
        authorName: authorName.trim() || null,
        answers: form.questions.map((question) => ({
          questionId: question.id,
          ratingValue:
            question.type === "stars"
              ? (values[question.id]?.rating ?? null)
              : null,
          textValue:
            question.type === "text"
              ? values[question.id]?.text.trim() || null
              : null,
        })),
      });
      setSent(true);
    } catch (error) {
      setSubmitError(toErrorMessage(error));
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div role="status" className="py-6 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-neutral-900 text-white">
          <CheckIcon className="size-6" />
        </span>
        <p className="mt-4 text-xl font-bold text-neutral-900">
          ¡Gracias por tu reseña!
        </p>
        <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-neutral-500">
          Tu opinión nos ayuda a mejorar cada experiencia. ¡Te esperamos en
          el próximo tour!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">
      {form.questions.map((question) => {
        const value = values[question.id] ?? { rating: null, text: "" };
        const shown = hovered[question.id] ?? value.rating ?? 0;
        return (
          <fieldset key={question.id}>
            <legend className="text-base font-bold text-neutral-900">
              {question.label}{" "}
              {question.required && (
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              )}
            </legend>

            {question.type === "stars" ? (
              <div
                className="mt-3 flex gap-1.5"
                onMouseLeave={() =>
                  setHovered((prev) => ({ ...prev, [question.id]: null }))
                }
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(question.id, star)}
                    onMouseEnter={() =>
                      setHovered((prev) => ({ ...prev, [question.id]: star }))
                    }
                    onFocus={() =>
                      setHovered((prev) => ({ ...prev, [question.id]: star }))
                    }
                    onBlur={() =>
                      setHovered((prev) => ({ ...prev, [question.id]: null }))
                    }
                    aria-label={`Calificar ${star} de 5`}
                    aria-pressed={value.rating === star}
                    className="rounded-lg p-1 transition-transform hover:scale-110"
                  >
                    <StarIcon
                      className={`size-8 ${
                        star <= shown
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <label className="mt-3 block">
                <span className="sr-only">{question.label}</span>
                <textarea
                  value={value.text}
                  onChange={(event) =>
                    setText(question.id, event.target.value)
                  }
                  rows={3}
                  maxLength={2000}
                  aria-required={question.required}
                  placeholder="Escribe tu respuesta…"
                  className={`mt-1 w-full resize-y rounded-[20px] border border-neutral-200 bg-white px-4 py-3 text-[15px] leading-relaxed text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500 ${
                    errors[question.id] ? "border-red-500" : ""
                  }`}
                />
              </label>
            )}

            {errors[question.id] && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {errors[question.id]}
              </p>
            )}
          </fieldset>
        );
      })}

      <div>
        <label
          htmlFor="review-author"
          className="text-base font-bold text-neutral-900"
        >
          Tu nombre{" "}
          <span className="text-sm font-normal text-neutral-400">
            (opcional)
          </span>
        </label>
        <input
          id="review-author"
          type="text"
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          maxLength={120}
          placeholder="¿Cómo te llamas?"
          autoComplete="name"
          className="mt-3 w-full rounded-[20px] border border-neutral-200 bg-white px-4 py-3 text-[15px] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
        />
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="btn-negro w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Enviando…" : "Enviar reseña"}
      </button>
    </form>
  );
}
