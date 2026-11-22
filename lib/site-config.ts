type SiteConfig = {
  blogPageSize: number;
  capabilitiesPageSize: number;
  guidesPageSize: number;
  popularToursCount: number;
  portfolioVisible: number;
};

export const SITE_CONFIG: SiteConfig = {
  blogPageSize: 4,
  capabilitiesPageSize: 4,
  guidesPageSize: 4,
  popularToursCount: 4,
  portfolioVisible: 4,
};

/** Static grid-cols class for a count (1-6), so Tailwind always generates it. */
export function gridColsClass(count: number): string {
  const n = Math.min(Math.max(Math.round(count) || 3, 1), 6);
  return [
    "lg:grid-cols-1",
    "lg:grid-cols-2",
    "lg:grid-cols-3",
    "lg:grid-cols-4",
    "lg:grid-cols-5",
    "lg:grid-cols-6",
  ][n - 1];
}
