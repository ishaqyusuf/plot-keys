import type {
  AppDefinition,
  GlobalNavSection,
} from "@plotkeys/app-store/registry";
import {
  createNavLink,
  createNavModule,
  createNavSection,
  type NavModule,
} from "@plotkeys/site-nav";
import { iconFor } from "./icons";

function createSectionLinks(section: GlobalNavSection | { label: string; items: { href: string; icon: string; label: string }[] }) {
  return section.items.map((item, index) =>
    createNavLink(item.label, iconFor(item.icon), item.href, [], [])
      .level(index + 1)
      .title(item.label).data,
  );
}

export function createDashboardNavRegistry({
  activeApp,
  globalTop,
  platformGroup,
}: {
  activeApp: AppDefinition | null;
  globalTop: GlobalNavSection;
  platformGroup: GlobalNavSection;
}): NavModule[] {
  const modules: NavModule[] = [
    createNavModule("Workspace", iconFor(globalTop.items[0]?.icon ?? "Home"), "Core navigation", [
      createNavSection("top", globalTop.label, createSectionLinks(globalTop)),
    ]),
  ];

  if (activeApp) {
    modules.push(
      createNavModule(activeApp.label, iconFor(activeApp.icon), activeApp.description, [
        ...activeApp.navGroups.map((group) =>
          createNavSection(group.label.toLowerCase().replace(/\s+/g, "-"), group.label, createSectionLinks(group)),
        ),
      ]),
    );
  }

  modules.push(
    createNavModule(
      "Platform",
      iconFor(platformGroup.items[0]?.icon ?? "Settings"),
      "Settings and tools",
      [createNavSection("platform", platformGroup.label, createSectionLinks(platformGroup))],
    ),
  );

  return modules;
}
