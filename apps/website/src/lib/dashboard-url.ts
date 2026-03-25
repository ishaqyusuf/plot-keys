import { buildPlatformAppUrl } from "@plotkeys/utils";

export function getDashboardUrl(currentOrigin?: string | null) {
  const configuredUrl =
    process.env.DASHBOARD_APP_URL ?? process.env.NEXT_PUBLIC_DASHBOARD_APP_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  return buildPlatformAppUrl({ currentOrigin });
}
