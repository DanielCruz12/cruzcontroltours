// Adaptadores del backend al shape que pintan las cards (Tour).
//
// El backend aún no trae fotos, destino, ubicación ni categoría, así que el
// adapter rellena valores temporales: destino/ubicación genéricos, categoría
// por defecto e `image` vacía (TourCard muestra un placeholder en ese caso).

import type { ApiTour } from "@/lib/api/tours";
import type { Tour } from "@/lib/tours";

/** Cuántos tours van en "populares"; el resto va a "otras opciones". */
export const POPULAR_TOUR_COUNT = 5;

const GENERIC_DESTINATION = "El Salvador";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function toCardTour(apiTour: ApiTour, popular = false): Tour {
  const price = Number(apiTour.price);
  const slug = slugify(apiTour.title) || "tour";
  return {
    id: `api-${apiTour.id}`,
    slug: `${slug}-${apiTour.id}`,
    name: apiTour.title,
    destination: GENERIC_DESTINATION,
    location: GENERIC_DESTINATION,
    duration:
      apiTour.durationDays === 1 ? "1 día" : `${apiTour.durationDays} días`,
    price: Number.isFinite(price) ? price : 0,
    category: "Aventura",
    image: "",
    imageAlt: apiTour.title,
    popular,
  };
}
