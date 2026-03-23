/**
 * Bana (Developer) template family — all plan variants.
 * Property developers and construction-led brands with project portfolios.
 */

import type { TemplateFamilyMeta, TemplatePlanVariant } from "../types";
import { banaStarterPages } from "./starter/pages";
import { banaPlusPages } from "./plus/pages";
import { banaProPages } from "./pro/pages";
import { banaStarterTheme } from "./starter/theme";
import { banaPlusTheme } from "./plus/theme";
import { banaProTheme } from "./pro/theme";
import { banaStarterDefaultContent } from "./starter/content";
import { banaPlusDefaultContent } from "./plus/content";
import { banaProDefaultContent } from "./pro/content";

export const banaFamilyMeta: TemplateFamilyMeta = {
  arabicMeaning: "Builder",
  arabicName: "Bana",
  businessType: "developer",
  description:
    "Property developers and construction-led brands with project portfolios.",
  key: "developer",
  label: "Developer",
};

export const banaStarter: TemplatePlanVariant = {
  key: "bana-starter",
  name: "Bana Starter",
  tier: "starter",
  family: "developer",
  pages: banaStarterPages,
  defaultContent: banaStarterDefaultContent,
  ...banaStarterTheme,
};

export const banaPlus: TemplatePlanVariant = {
  key: "bana-plus",
  name: "Bana Plus",
  tier: "plus",
  family: "developer",
  pages: banaPlusPages,
  defaultContent: banaPlusDefaultContent,
  ...banaPlusTheme,
};

export const banaPro: TemplatePlanVariant = {
  key: "bana-pro",
  name: "Bana Pro",
  tier: "pro",
  family: "developer",
  pages: banaProPages,
  defaultContent: banaProDefaultContent,
  ...banaProTheme,
};

export const banaVariants: TemplatePlanVariant[] = [banaStarter, banaPlus, banaPro];
