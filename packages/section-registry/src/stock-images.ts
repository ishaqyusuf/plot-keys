/**
 * Stock image catalog.
 *
 * Provides a curated set of high-quality real-estate stock images tenants can
 * license for use in their website sections. Each image has:
 *   - A unique `id` for referencing in `TemplateConfig.namedImages`
 *   - A `previewUrl` (watermarked or low-res) shown in the picker
 *   - A `fullUrl` (high-res, unlocked after purchase) served in live sites
 *   - Licensing metadata (source, attribution, price tier)
 *
 * Licensing flow:
 *   1. Tenant browses the stock image picker in the builder sidebar.
 *   2. Preview shows a watermarked version at `previewUrl`.
 *   3. Tenant adds the image to their site → triggers a purchase (if not
 *      already licensed) → creates a `BillingLineItem` of kind `stock_image`.
 *   4. After purchase, `fullUrl` replaces `previewUrl` in the site render.
 *
 * Current catalog: placeholder entries for development. Replace `previewUrl`
 * and `fullUrl` with real CDN URLs before production use.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StockImageCategory =
  | "aerial"
  | "commercial"
  | "exterior"
  | "hero"
  | "interior"
  | "lifestyle"
  | "neighborhood";

export type StockImageLicenseTier =
  | "free"      // Always free (included with all plans)
  | "standard"; // Requires a per-image purchase (₦2,500 per image)

export type StockImage = {
  attribution?: string;
  category: StockImageCategory;
  /** Dimensions hint for layout (width × height in pixels). */
  dimensions: { height: number; width: number };
  /** Full-resolution URL served after purchase or for free images. */
  fullUrl: string;
  id: string;
  licenseTier: StockImageLicenseTier;
  /** Short description for alt text and accessibility. */
  label: string;
  /** Watermarked or low-res preview URL shown in the picker. */
  previewUrl: string;
  /** Which section slots this image is suitable for. */
  suitableFor: string[];
};

// ---------------------------------------------------------------------------
// Catalog entries (placeholder)
// ---------------------------------------------------------------------------
// TODO: Replace previewUrl/fullUrl with actual CDN URLs before launch.
// Suggested sources: Unsplash (free tier), Shutterstock (paid license).

const BASE_PLACEHOLDER = "https://images.unsplash.com";

export const stockImageCatalog: StockImage[] = [
  // --- Free images ---
  {
    category: "exterior",
    dimensions: { height: 1080, width: 1920 },
    fullUrl: `${BASE_PLACEHOLDER}/photo-1582268611958-ebfd161ef9cf?w=1920&q=90`,
    id: "free-exterior-1",
    label: "Bright suburban home exterior",
    licenseTier: "free",
    previewUrl: `${BASE_PLACEHOLDER}/photo-1582268611958-ebfd161ef9cf?w=800&q=60`,
    suitableFor: ["hero", "story"],
  },
  {
    category: "interior",
    dimensions: { height: 1080, width: 1920 },
    fullUrl: `${BASE_PLACEHOLDER}/photo-1586023492125-27b2c045efd7?w=1920&q=90`,
    id: "free-interior-1",
    label: "Modern open-plan living room",
    licenseTier: "free",
    previewUrl: `${BASE_PLACEHOLDER}/photo-1586023492125-27b2c045efd7?w=800&q=60`,
    suitableFor: ["hero", "featured-listings"],
  },
  {
    category: "neighborhood",
    dimensions: { height: 1080, width: 1920 },
    fullUrl: `${BASE_PLACEHOLDER}/photo-1568605114967-8130f3a36994?w=1920&q=90`,
    id: "free-neighborhood-1",
    label: "Tree-lined residential street",
    licenseTier: "free",
    previewUrl: `${BASE_PLACEHOLDER}/photo-1568605114967-8130f3a36994?w=800&q=60`,
    suitableFor: ["market-stats", "story"],
  },

  // --- Standard licensed images ---
  {
    category: "hero",
    dimensions: { height: 1200, width: 1920 },
    fullUrl: `${BASE_PLACEHOLDER}/photo-1600596542815-ffad4c1539a9?w=1920&q=90`,
    id: "std-hero-1",
    label: "Luxury villa with pool at dusk",
    licenseTier: "standard",
    previewUrl: `${BASE_PLACEHOLDER}/photo-1600596542815-ffad4c1539a9?w=800&q=50&blur=4`,
    suitableFor: ["hero"],
  },
  {
    category: "aerial",
    dimensions: { height: 1080, width: 1920 },
    fullUrl: `${BASE_PLACEHOLDER}/photo-1600607687939-ce8a6c25118c?w=1920&q=90`,
    id: "std-aerial-1",
    label: "Aerial view of gated estate",
    licenseTier: "standard",
    previewUrl: `${BASE_PLACEHOLDER}/photo-1600607687939-ce8a6c25118c?w=800&q=50&blur=4`,
    suitableFor: ["hero", "market-stats"],
  },
  {
    category: "commercial",
    dimensions: { height: 1080, width: 1920 },
    fullUrl: `${BASE_PLACEHOLDER}/photo-1497366216548-37526070297c?w=1920&q=90`,
    id: "std-commercial-1",
    label: "Modern commercial office lobby",
    licenseTier: "standard",
    previewUrl: `${BASE_PLACEHOLDER}/photo-1497366216548-37526070297c?w=800&q=50&blur=4`,
    suitableFor: ["hero", "featured-listings"],
  },
  {
    category: "lifestyle",
    dimensions: { height: 1080, width: 1920 },
    fullUrl: `${BASE_PLACEHOLDER}/photo-1555041469-a586c61ea9bc?w=1920&q=90`,
    id: "std-lifestyle-1",
    label: "Family relaxing in new home",
    licenseTier: "standard",
    previewUrl: `${BASE_PLACEHOLDER}/photo-1555041469-a586c61ea9bc?w=800&q=50&blur=4`,
    suitableFor: ["story", "testimonials"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getFreeStockImages(): StockImage[] {
  return stockImageCatalog.filter((img) => img.licenseTier === "free");
}

export function getStockImageById(id: string): StockImage | undefined {
  return stockImageCatalog.find((img) => img.id === id);
}

export function getStockImagesByCategory(
  category: StockImageCategory,
): StockImage[] {
  return stockImageCatalog.filter((img) => img.category === category);
}

export function getStockImagesForSlot(slotId: string): StockImage[] {
  return stockImageCatalog.filter((img) => img.suitableFor.includes(slotId));
}
