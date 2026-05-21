export type PublicSiteMode = "landing" | "early-access";

const truthyValues = new Set(["1", "true", "yes", "on", "early-access"]);
const falsyValues = new Set(["0", "false", "no", "off", "landing"]);

export function getPublicSiteMode(): PublicSiteMode {
  const earlyAccess = process.env.EARLY_ACCESS?.trim().toLowerCase();

  if (earlyAccess && truthyValues.has(earlyAccess)) {
    return "early-access";
  }

  if (earlyAccess && falsyValues.has(earlyAccess)) {
    return "landing";
  }

  const configuredMode = process.env.PLOTKEYS_PUBLIC_SITE_MODE;

  if (configuredMode === "landing" || configuredMode === "early-access") {
    return configuredMode;
  }

  return process.env.NODE_ENV === "production" ? "early-access" : "landing";
}

export function canPreviewPublicSiteModes() {
  return process.env.NODE_ENV !== "production";
}
