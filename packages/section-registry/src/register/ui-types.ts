import type { JSX } from "react";

import type { ThemeConfig } from "../sections/home-page";

/**
 * Maps section type strings (e.g. "hero_banner") to family-specific React
 * components. Used by resolveFamilySectionComponents() to overlay generic
 * section components with family-branded designs.
 *
 * Only the section types a family overrides need entries — the generic
 * sectionComponents map is always the fallback.
 */
export type SectionComponentOverrides = Record<
  string,
  (props: { config: unknown; theme: ThemeConfig }) => JSX.Element
>;
