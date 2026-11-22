import type { ApiTour } from "@/lib/api/tours";
import type { Tour } from "@/lib/tours";

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
