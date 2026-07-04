import type { JSX } from "react";

import type { ThemeConfig } from "../sections/home-page";

/**
 * Maps section type strings (e.g. "hero_banner") to template-specific React
 * components. Used by resolveRegisterSectionComponents() to overlay generic
 * section components with template-owned designs.
 *
 * Only the section types a template overrides need entries — the generic
 * sectionComponents map is always the fallback.
 */
export type SectionComponentOverrides = Record<
  string,
  (props: { config: unknown; theme: ThemeConfig }) => JSX.Element
>;
