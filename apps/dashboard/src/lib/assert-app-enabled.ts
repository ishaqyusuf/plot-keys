import { getCompanyAppsContext } from "./company-apps";
import { tenantRedirect } from "./tenant-url-server";

/**
 * Redirects to `/app-store?locked=<id>` if the given app is not in the
 * current company's resolved enabled set (plan-available AND toggled on).
 * Call from a per-app `layout.tsx` to guard every route under it.
 */
export async function assertAppEnabledById(appId: string): Promise<void> {
  const { enabledApps } = await getCompanyAppsContext();
  if (!enabledApps.some((app) => app.id === appId)) {
    await tenantRedirect(`/app-store?locked=${encodeURIComponent(appId)}`);
  }
}
