/**
 * Noor (Agency) template family — all plan variants.
 * Multi-agent real estate agency, listings-first, bold + clean visual style.
 */

import type { TemplateFamilyMeta, TemplatePlanVariant } from "../types";
import { noorStarterPages } from "./starter/pages";
import { noorPlusPages } from "./plus/pages";
import { noorProPages } from "./pro/pages";
import { noorStarterTheme } from "./starter/theme";
import { noorPlusTheme } from "./plus/theme";
import { noorProTheme } from "./pro/theme";
import { noorStarterDefaultContent } from "./starter/content";
import { noorPlusDefaultContent } from "./plus/content";
import { noorProDefaultContent } from "./pro/content";

export const noorFamilyMeta: TemplateFamilyMeta = {
  arabicMeaning: "Light",
  arabicName: "Noor",
  businessType: "agency",
  description: "Multi-agent real estate firms with full listing inventory.",
  key: "agency",
  label: "Agency",
};

export const noorStarter: TemplatePlanVariant = {
  key: "noor-starter",
  name: "Noor Starter",
  tier: "starter",
  family: "agency",
  pages: noorStarterPages,
  defaultContent: noorStarterDefaultContent,
  ...noorStarterTheme,
};

export const noorPlus: TemplatePlanVariant = {
  key: "noor-plus",
  name: "Noor Plus",
  tier: "plus",
  family: "agency",
  pages: noorPlusPages,
  defaultContent: noorPlusDefaultContent,
  ...noorPlusTheme,
};

export const noorPro: TemplatePlanVariant = {
  key: "noor-pro",
  name: "Noor Pro",
  tier: "pro",
  family: "agency",
  pages: noorProPages,
  defaultContent: noorProDefaultContent,
  ...noorProTheme,
};

export const noorVariants: TemplatePlanVariant[] = [noorStarter, noorPlus, noorPro];
