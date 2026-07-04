import { buildDashboardUrl } from "@plotkeys/utils/app-urls";

export function getDashboardUrl(currentOrigin?: string | null) {
  return buildDashboardUrl({ currentUrl: currentOrigin });
}
