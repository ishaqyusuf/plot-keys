export type PublicSiteMode = "landing" | "early-access";

export function getPublicSiteMode(): PublicSiteMode {
  const configuredMode = process.env.PLOTKEYS_PUBLIC_SITE_MODE;

  if (configuredMode === "landing" || configuredMode === "early-access") {
    return configuredMode;
  }

  return process.env.NODE_ENV === "production" ? "early-access" : "landing";
}

export function canPreviewPublicSiteModes() {
  return process.env.NODE_ENV !== "production";
}
