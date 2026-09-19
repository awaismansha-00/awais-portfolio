export const HOMEPAGE_PREVIEW_COUNT = 3;

// New entries belong to their listing page unless explicitly featured.
export function getFeaturedItems(items) {
  return items.filter((item) => item.featured === true).slice(0, HOMEPAGE_PREVIEW_COUNT);
}
