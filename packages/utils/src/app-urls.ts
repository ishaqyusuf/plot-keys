import {
  buildRuntimeAppUrl,
  normalizeRuntimeHost,
  stripPortFromRuntimeHost,
} from "./runtime-url";

export const siteRootDomain = "plotkeys.com";
export const dashboardRootDomain = "app.plotkeys.com";
export const apiRootDomain = "api.plotkeys.com";
export const sandboxRootDomain = "sandbox.plotkeys.com";
export const tenantSiteRootDomain = siteRootDomain;

export const sitePortlessRootDomain = "plotkeys.localhost";
export const dashboardPortlessRootDomain = "app-plotkeys.localhost";
export const apiPortlessRootDomain = "api-plotkeys.localhost";
export const sandboxPortlessRootDomain = "sandbox-plotkeys.localhost";
export const tenantSitePortlessRootDomain = "tenant-plotkeys.localhost";

export const sitePort = 3900;
export const dashboardPort = 3901;
export const apiPort = 3902;
export const tenantSitePort = 3903;
export const sandboxPort = 3909;

export type AppUrlKind =
  | "site"
  | "dashboard"
  | "api"
  | "tenant-site"
  | "sandbox";

function resolveAppPort(kind: AppUrlKind) {
  switch (kind) {
    case "site":
      return Number(
        process.env.SITE_PORT ?? process.env.WEBSITE_PORT ?? sitePort,
      );
    case "dashboard":
      return Number(process.env.DASHBOARD_PORT ?? dashboardPort);
    case "api":
      return Number(process.env.API_PORT ?? process.env.PORT ?? apiPort);
    case "tenant-site":
      return Number(process.env.TENANT_SITE_PORT ?? tenantSitePort);
    case "sandbox":
      return Number(process.env.SANDBOX_PORT ?? sandboxPort);
  }
}

function resolveAppPortlessRootDomain(kind: AppUrlKind) {
  switch (kind) {
    case "site":
      return process.env.SITE_PORTLESS_ROOT_DOMAIN ?? sitePortlessRootDomain;
    case "dashboard":
      return (
        process.env.DASHBOARD_PORTLESS_ROOT_DOMAIN ??
        dashboardPortlessRootDomain
      );
    case "api":
      return process.env.API_PORTLESS_ROOT_DOMAIN ?? apiPortlessRootDomain;
    case "tenant-site":
      return (
        process.env.TENANT_SITE_PORTLESS_ROOT_DOMAIN ??
        tenantSitePortlessRootDomain
      );
    case "sandbox":
      return (
        process.env.SANDBOX_PORTLESS_ROOT_DOMAIN ?? sandboxPortlessRootDomain
      );
  }
}

function resolveAppProductionRootDomain(kind: AppUrlKind) {
  switch (kind) {
    case "site":
      return process.env.SITE_ROOT_DOMAIN ?? siteRootDomain;
    case "dashboard":
      return process.env.DASHBOARD_ROOT_DOMAIN ?? dashboardRootDomain;
    case "api":
      return process.env.API_ROOT_DOMAIN ?? apiRootDomain;
    case "tenant-site":
      return process.env.TENANT_SITE_ROOT_DOMAIN ?? tenantSiteRootDomain;
    case "sandbox":
      return process.env.SANDBOX_ROOT_DOMAIN ?? sandboxRootDomain;
  }
}

function resolveAppPublicUrl(kind: AppUrlKind) {
  switch (kind) {
    case "site":
      return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_PUBLIC_URL;
    case "dashboard":
      return (
        process.env.NEXT_PUBLIC_DASHBOARD_URL ??
        process.env.NEXT_PUBLIC_DASHBOARD_APP_URL ??
        process.env.DASHBOARD_PUBLIC_URL ??
        process.env.DASHBOARD_APP_URL ??
        process.env.NEXT_PUBLIC_APP_URL
      );
    case "api":
      return process.env.NEXT_PUBLIC_API_URL ?? process.env.API_PUBLIC_URL;
    case "tenant-site":
      return (
        process.env.NEXT_PUBLIC_TENANT_SITE_URL ??
        process.env.TENANT_SITE_PUBLIC_URL ??
        process.env.TENANT_SITE_URL
      );
    case "sandbox":
      return (
        process.env.NEXT_PUBLIC_SANDBOX_URL ?? process.env.SANDBOX_PUBLIC_URL
      );
  }
}

export function getAppUrlConfig(kind: AppUrlKind) {
  const production = isProductionMode();

  return {
    appPort: resolveAppPort(kind),
    appRootDomain: resolveAppPortlessRootDomain(kind),
    defaultProtocol: (production ? "https" : "http") as "http" | "https",
    isProduction: production,
    portlessRootDomain: resolveAppPortlessRootDomain(kind),
    productionRootDomain: resolveAppProductionRootDomain(kind),
    publicUrl: resolveAppPublicUrl(kind),
  };
}

export type BuildAppUrlOptions = {
  currentHost?: string | null;
  currentProtocol?: string | null;
  currentUrl?: string | null;
  path?: string;
};

function normalizePath(path?: string) {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function normalizeBaseUrl(value?: string | null) {
  if (!value) return null;

  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function appendPath(baseUrl: string, path?: string) {
  return `${baseUrl}${normalizePath(path)}`;
}

function isProductionMode() {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.PLOTKEYS_ENV_MODE === "production" ||
    process.env.PLOTKEYS_ENV_MODE === "prod"
  );
}

function normalizeProtocol(value?: string | null) {
  const protocol = value?.trim().replace(/:$/, "").toLowerCase();
  return protocol === "https" ? "https" : "http";
}

function getHostPort(host: string) {
  if (host.startsWith("[")) {
    return host.match(/]:(\d+)$/)?.[1] ?? "";
  }

  return host.match(/:(\d+)$/)?.[1] ?? "";
}

function hostMatches(host: string, root: string) {
  const normalizedHost = normalizeRuntimeHost(host);
  const normalizedRoot = normalizeRuntimeHost(root);

  if (!normalizedHost || !normalizedRoot) return false;

  const hostWithoutPort = stripPortFromRuntimeHost(normalizedHost);
  const rootWithoutPort = stripPortFromRuntimeHost(normalizedRoot);

  return (
    normalizedHost === normalizedRoot ||
    hostWithoutPort === rootWithoutPort ||
    hostWithoutPort.endsWith(`.${rootWithoutPort}`)
  );
}

function getCurrentParts(options: BuildAppUrlOptions) {
  const host = normalizeRuntimeHost(options.currentHost ?? options.currentUrl);
  let protocol = normalizeProtocol(options.currentProtocol);

  if (options.currentUrl) {
    try {
      protocol = normalizeProtocol(new URL(options.currentUrl).protocol);
    } catch {
      // Fall back to the explicit protocol/default above.
    }
  }

  return {
    host,
    hostWithoutPort: stripPortFromRuntimeHost(host),
    port: getHostPort(host),
    protocol,
  };
}

function getAllPortlessRootDomains() {
  return [
    resolveAppPortlessRootDomain("site"),
    resolveAppPortlessRootDomain("dashboard"),
    resolveAppPortlessRootDomain("api"),
    resolveAppPortlessRootDomain("tenant-site"),
    resolveAppPortlessRootDomain("sandbox"),
  ];
}

function getAllProductionRootDomains() {
  return [
    resolveAppProductionRootDomain("site"),
    resolveAppProductionRootDomain("dashboard"),
    resolveAppProductionRootDomain("api"),
    resolveAppProductionRootDomain("tenant-site"),
    resolveAppProductionRootDomain("sandbox"),
  ];
}

function buildSiblingAppUrl(kind: AppUrlKind, options: BuildAppUrlOptions) {
  const current = getCurrentParts(options);

  if (!current.host) return null;

  if (
    getAllPortlessRootDomains().some((root) => hostMatches(current.host, root))
  ) {
    const targetHost = resolveAppPortlessRootDomain(kind);
    const port = current.port ? `:${current.port}` : "";
    return `${current.protocol}://${targetHost}${port}${normalizePath(options.path)}`;
  }

  if (
    current.hostWithoutPort === "localhost" ||
    current.hostWithoutPort === "127.0.0.1" ||
    current.hostWithoutPort === "[::1]"
  ) {
    return `${current.protocol}://${current.hostWithoutPort}:${resolveAppPort(kind)}${normalizePath(options.path)}`;
  }

  if (
    getAllProductionRootDomains().some((root) =>
      hostMatches(current.host, root),
    )
  ) {
    return appendPath(
      `${current.protocol}://${resolveAppProductionRootDomain(kind)}`,
      options.path,
    );
  }

  return null;
}

function buildAppUrl(kind: AppUrlKind, options: BuildAppUrlOptions = {}) {
  const current = getCurrentParts(options);
  const publicUrl = normalizeBaseUrl(resolveAppPublicUrl(kind));

  if (!current.host && !isProductionMode()) {
    return `http://localhost:${resolveAppPort(kind)}${normalizePath(options.path)}`;
  }

  if (
    publicUrl &&
    isProductionMode() &&
    (!current.host ||
      getAllProductionRootDomains().some((root) =>
        hostMatches(current.host, root),
      ))
  ) {
    return appendPath(publicUrl, options.path);
  }

  const siblingUrl = buildSiblingAppUrl(kind, options);

  if (siblingUrl) return siblingUrl;

  return buildRuntimeAppUrl({
    config: getAppUrlConfig(kind),
    currentHost: options.currentHost,
    currentProtocol: options.currentProtocol,
    currentUrl: options.currentUrl,
    path: options.path,
  });
}

export function buildSiteUrl(options: BuildAppUrlOptions = {}) {
  return buildAppUrl("site", options);
}

export function buildDashboardUrl(options: BuildAppUrlOptions = {}) {
  return buildAppUrl("dashboard", options);
}

export function buildApiUrl(options: BuildAppUrlOptions = {}) {
  return buildAppUrl("api", options);
}

export function buildTenantSiteRootUrl(options: BuildAppUrlOptions = {}) {
  return buildAppUrl("tenant-site", options);
}

export function buildSandboxUrl(options: BuildAppUrlOptions = {}) {
  return buildAppUrl("sandbox", options);
}

export function getDevAppUrls() {
  if (isProductionMode()) {
    return {
      api: normalizeRuntimeHost(process.env.NEXT_PUBLIC_API_URL) || "",
      dashboard:
        normalizeRuntimeHost(
          process.env.NEXT_PUBLIC_DASHBOARD_URL ??
            process.env.NEXT_PUBLIC_DASHBOARD_APP_URL,
        ) || "",
      site: normalizeRuntimeHost(process.env.NEXT_PUBLIC_SITE_URL) || "",
      sandbox: normalizeRuntimeHost(process.env.NEXT_PUBLIC_SANDBOX_URL) || "",
      tenantSite:
        normalizeRuntimeHost(process.env.NEXT_PUBLIC_TENANT_SITE_URL) || "",
    };
  }

  return {
    api: normalizeRuntimeHost(
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
        `http://localhost:${resolveAppPort("api")}`,
    ),
    dashboard: normalizeRuntimeHost(
      process.env.NEXT_PUBLIC_DASHBOARD_URL?.trim() ||
        process.env.NEXT_PUBLIC_DASHBOARD_APP_URL?.trim() ||
        `http://localhost:${resolveAppPort("dashboard")}`,
    ),
    site: normalizeRuntimeHost(
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        `http://localhost:${resolveAppPort("site")}`,
    ),
    sandbox: normalizeRuntimeHost(
      process.env.NEXT_PUBLIC_SANDBOX_URL?.trim() ||
        `http://localhost:${resolveAppPort("sandbox")}`,
    ),
    tenantSite: normalizeRuntimeHost(
      process.env.NEXT_PUBLIC_TENANT_SITE_URL?.trim() ||
        `http://localhost:${resolveAppPort("tenant-site")}`,
    ),
  };
}

export function getDevAppUrlStrings() {
  if (isProductionMode()) {
    return {
      api: buildApiUrl(),
      dashboard: buildDashboardUrl(),
      sandbox: buildSandboxUrl(),
      site: buildSiteUrl(),
      tenantSite: buildTenantSiteRootUrl(),
    };
  }

  return {
    api:
      normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL) ??
      `http://localhost:${resolveAppPort("api")}`,
    dashboard:
      normalizeBaseUrl(
        process.env.NEXT_PUBLIC_DASHBOARD_URL ??
          process.env.NEXT_PUBLIC_DASHBOARD_APP_URL ??
          process.env.DASHBOARD_PUBLIC_URL ??
          process.env.DASHBOARD_APP_URL ??
          process.env.NEXT_PUBLIC_APP_URL,
      ) ?? `http://localhost:${resolveAppPort("dashboard")}`,
    site:
      normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
      `http://localhost:${resolveAppPort("site")}`,
    sandbox:
      normalizeBaseUrl(
        process.env.NEXT_PUBLIC_SANDBOX_URL ?? process.env.SANDBOX_PUBLIC_URL,
      ) ?? `http://localhost:${resolveAppPort("sandbox")}`,
    tenantSite:
      normalizeBaseUrl(process.env.NEXT_PUBLIC_TENANT_SITE_URL) ??
      `http://localhost:${resolveAppPort("tenant-site")}`,
  };
}
