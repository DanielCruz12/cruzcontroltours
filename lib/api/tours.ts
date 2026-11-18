// Endpoints de tours (tabla `tours`): el front solo lista (GET /tours).
// El CRUD completo vive en el panel (panel-cruzcontroltours).
//
// Nota: `price` es numeric(10,2) en Postgres, así que llega como string.
// El tipo se llama ApiTour para no chocar con el `Tour` del catálogo
// estático de `@/lib/tours`.

import { apiFetch } from "./client";

export type ApiTour = {
  id: number;
  title: string;
  description: string | null;
  price: string;
  durationDays: number;
  active: boolean;
  createdAt: string;
};

export function listTours(): Promise<ApiTour[]> {
  return apiFetch<ApiTour[]>("/tours");
}
