// Endpoints de tours (tabla `tours`).
// Backend: GET/POST /tours, GET/PUT/DELETE /tours/:id
//
// Nota: `price` es numeric(10,2) en Postgres, así que llega como string.

import { apiFetch } from "./client";

export type Tour = {
  id: number;
  title: string;
  description: string | null;
  price: string;
  durationDays: number;
  active: boolean;
  createdAt: string;
};

export type NewTourInput = {
  title: string;
  description?: string;
  price: number | string;
  durationDays?: number;
  active?: boolean;
};

export function listTours(): Promise<Tour[]> {
  return apiFetch<Tour[]>("/tours");
}

export function getTour(id: number): Promise<Tour> {
  return apiFetch<Tour>(`/tours/${id}`);
}

export function createTour(input: NewTourInput): Promise<Tour> {
  return apiFetch<Tour>("/tours", { method: "POST", body: input });
}

export function updateTour(
  id: number,
  input: NewTourInput,
): Promise<Tour> {
  return apiFetch<Tour>(`/tours/${id}`, { method: "PUT", body: input });
}

export async function deleteTour(id: number): Promise<void> {
  await apiFetch<void>(`/tours/${id}`, { method: "DELETE" });
}
