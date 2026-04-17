export type ListingOverviewSearchParams = {
  location?: string;
  page?: string;
  priceRange?: string;
  sort?: string;
};

type TenantListing = {
  id?: string;
  imageUrl?: string | null;
  location: string;
  price?: string | null;
  specs?: string | null;
  title: string;
};

export type ListingOverviewQuery = {
  location?: string;
  page: number;
  pageSize: number;
  priceRange?: "under-500k" | "500k-1m" | "1m-2m" | "2m-plus";
  sort: "default" | "price-asc" | "price-desc" | "title-asc";
};

export const listingOverviewPageKeys = new Set([
  "listings",
  "properties",
  "rentals",
  "portfolio",
  "projects",
]);

const priceCleanupPattern = /[, ]+/g;

function normalizePositiveInt(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePriceValue(price: string | null | undefined): number | null {
  if (!price) return null;

  const normalized = price
    .trim()
    .toLowerCase()
    .replace(priceCleanupPattern, "");
  const match = normalized.match(/(\d+(?:\.\d+)?)([kmb])?/);
  if (!match) return null;
  const [rawBase] = match.slice(1);
  if (!rawBase) return null;

  const base = Number.parseFloat(rawBase);
  if (!Number.isFinite(base)) return null;

  switch (match[2]) {
    case "b":
      return base * 1_000_000_000;
    case "m":
      return base * 1_000_000;
    case "k":
      return base * 1_000;
    default:
      return base;
  }
}

function matchesPriceRange(
  priceValue: number | null,
  priceRange: ListingOverviewQuery["priceRange"],
) {
  if (!priceRange || priceValue === null) return true;

  switch (priceRange) {
    case "under-500k":
      return priceValue < 500_000;
    case "500k-1m":
      return priceValue >= 500_000 && priceValue <= 1_000_000;
    case "1m-2m":
      return priceValue >= 1_000_000 && priceValue <= 2_000_000;
    case "2m-plus":
      return priceValue >= 2_000_000;
  }
}

/**
 * Returns whether the resolved template page key should use the shared
 * listing overview query contract before sections render.
 */
export function isListingOverviewPage(pageKey: string) {
  return listingOverviewPageKeys.has(pageKey);
}

export function parseListingOverviewQuery(
  searchParams: ListingOverviewSearchParams,
): ListingOverviewQuery {
  const rawSort = searchParams.sort ?? "default";
  const sort: ListingOverviewQuery["sort"] =
    rawSort === "price-asc" ||
    rawSort === "price-desc" ||
    rawSort === "title-asc"
      ? rawSort
      : "default";

  const rawPriceRange = searchParams.priceRange;
  const priceRange: ListingOverviewQuery["priceRange"] =
    rawPriceRange === "under-500k" ||
    rawPriceRange === "500k-1m" ||
    rawPriceRange === "1m-2m" ||
    rawPriceRange === "2m-plus"
      ? rawPriceRange
      : undefined;

  return {
    location: searchParams.location?.trim() || undefined,
    page: normalizePositiveInt(searchParams.page, 1),
    pageSize: 6,
    priceRange,
    sort,
  };
}

export function applyListingOverviewQuery<T extends TenantListing>(
  listings: T[],
  query: ListingOverviewQuery,
) {
  const filtered = listings
    .filter((listing) =>
      query.location
        ? listing.location.toLowerCase().includes(query.location.toLowerCase())
        : true,
    )
    .filter((listing) =>
      matchesPriceRange(parsePriceValue(listing.price), query.priceRange),
    );

  const sorted = filtered.map((listing) => ({
    listing,
    priceValue: parsePriceValue(listing.price),
  }));

  switch (query.sort) {
    case "price-asc":
      sorted.sort(
        (a, b) =>
          (a.priceValue ?? Number.POSITIVE_INFINITY) -
          (b.priceValue ?? Number.POSITIVE_INFINITY),
      );
      break;
    case "price-desc":
      sorted.sort(
        (a, b) =>
          (b.priceValue ?? Number.NEGATIVE_INFINITY) -
          (a.priceValue ?? Number.NEGATIVE_INFINITY),
      );
      break;
    case "title-asc":
      sorted.sort((a, b) => a.listing.title.localeCompare(b.listing.title));
      break;
    case "default":
      break;
  }

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / query.pageSize));
  const currentPage = Math.min(query.page, totalPages);
  const startIndex = (currentPage - 1) * query.pageSize;

  return {
    currentPage,
    items: sorted
      .slice(startIndex, startIndex + query.pageSize)
      .map(({ listing }) => listing),
    totalItems,
    totalPages,
  };
}
