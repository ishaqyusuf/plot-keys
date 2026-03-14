import type { JSX } from "react";

import {
  type HeroBannerConfig,
  HeroBannerSection,
  type ThemeConfig,
} from "./sections/hero-banner";

export type SectionDefinition<TConfig> = {
  component: (props: { config: TConfig; theme: ThemeConfig }) => JSX.Element;
  config: TConfig;
  id: string;
  type: string;
};

export const sampleTheme: ThemeConfig = {
  accentColor: "#0f766e",
  backgroundColor: "#f8fafc",
  fontFamily: "Satoshi, Avenir Next, sans-serif",
};

export const sampleHomePage: {
  page: "home";
  sections: Array<SectionDefinition<HeroBannerConfig>>;
} = {
  page: "home",
  sections: [
    {
      component: HeroBannerSection,
      config: {
        ctaText: "Browse Properties",
        subtitle:
          "Structured tenant websites for modern agencies and property developers.",
        title: "Find your next signature property with confidence.",
      },
      id: "hero-banner",
      type: "hero_banner",
    },
  ],
};

export type { HeroBannerConfig, ThemeConfig };
export { HeroBannerSection };
