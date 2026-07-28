import type {
  AppDefinition,
  GlobalNavSection,
} from "@plotkeys/app-store/registry";
import { type NavModule, validateLinks } from "@plotkeys/site-nav";
import { createDashboardNavRegistry } from "./registry";

export function getVisibleDashboardNav(input: {
  enabledApps: readonly AppDefinition[];
  globalTop: GlobalNavSection;
  platformGroup: GlobalNavSection;
}): NavModule[] {
  return validateLinks({
    linkModules: createDashboardNavRegistry(input),
  }).filter((module) =>
    module.sections.some((section) => section.links.some((item) => item.show)),
  );
}
