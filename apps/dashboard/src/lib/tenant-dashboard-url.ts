import { authRoutes } from "@plotkeys/auth/shared";
import {
  buildLocalSitefrontHostname,
  buildTenantDashboardUrl,
} from "@plotkeys/utils";
import { headers } from "next/headers";

async function getCurrentOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  return host ? `${protocol}://${host}` : null;
}

export async function getTenantDashboardUrlForSubdomain(
  subdomain: string,
  pathname: string,
) {
  const currentOrigin = await getCurrentOrigin();
  const isLocalPlotkeysHost = currentOrigin?.includes("plotkeys.localhost");

  return buildTenantDashboardUrl(subdomain, {
    currentOrigin,
    pathname,
    tenantHostname: isLocalPlotkeysHost
      ? buildLocalSitefrontHostname(subdomain)
      : undefined,
  });
}

export async function getTenantSignInUrlForSubdomain(
  subdomain: string,
  redirectPath?: string,
) {
  const signInUrl = new URL(
    await getTenantDashboardUrlForSubdomain(subdomain, authRoutes.signIn),
  );

  if (redirectPath) {
    signInUrl.searchParams.set("redirect", redirectPath);
  }

  return signInUrl.toString();
}
