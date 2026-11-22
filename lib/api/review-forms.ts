// Formularios públicos de reseñas (link por token, sin login).

import { apiFetch } from "./client";

export type PublicQuestion = {
  id: number;
  label: string;
  type: string;
  required: boolean;
  position: number;
};

export type PublicForm = {
  title: string;
  tourTitle: string;
  questions: PublicQuestion[];
};

export type SubmitAnswer = {
  questionId: number;
  ratingValue?: number | null;
  textValue?: string | null;
};

export function getPublicForm(token: string): Promise<PublicForm> {
  return apiFetch<PublicForm>(
    `/review-forms/public/${encodeURIComponent(token)}`,
  );
}

export function submitReview(
  token: string,
  input: { authorName?: string | null; answers: SubmitAnswer[] },
): Promise<{ id: number }> {
  return apiFetch<{ id: number }>(
    `/review-forms/public/${encodeURIComponent(token)}/submit`,
    { method: "POST", body: input },
  );
}
