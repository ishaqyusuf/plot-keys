import type { IconName } from "@plotkeys/ui/icons";

export function isSearchKey(key: string) {
  return key === "q" || key.endsWith(".q");
}

export function getSearchKey(filters: Record<string, unknown>) {
  return Object.keys(filters).find((key) => isSearchKey(key));
}

export const searchIcons: Record<string, IconName> = {
  department: "Briefcase",
  featured: "Star",
  filter: "CheckCircle",
  period: "Calendar",
  publishState: "Globe",
  role: "UserSettings",
  status: "CheckCircle",
  type: "Building",
  view: "Calendar",
};
