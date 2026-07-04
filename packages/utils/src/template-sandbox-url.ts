import { buildTenantSiteRootUrl } from "./app-urls";
import { normalizeRuntimeHost } from "./runtime-url";
import { plotkeysRootDomain } from "./tenant-domains";

export type TemplateSandboxUrlOptions = {
  currentOrigin?: string | null;
  pathname?: string;
  protocol?: "http" | "https";
  tenantSiteOrigin?: string | null;
};

function normalizePathname(pathname?: string) {
  if (!pathname || pathname === "/") return "";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function buildTemplateSandboxPath(
  shareId: string,
  pathname?: string,
) {
  const normalizedShareId = shareId.trim();
  if (!normalizedShareId) return "";
  return `/sandbox/${encodeURIComponent(normalizedShareId)}${normalizePathname(pathname)}`;
}

export function buildTemplateSandboxUrl(
  shareId: string,
  options: TemplateSandboxUrlOptions = {},
) {
  const path = buildTemplateSandboxPath(shareId, options.pathname);
  if (!path) return "";

  const explicitOrigin =
    options.tenantSiteOrigin !== undefined
      ? options.tenantSiteOrigin
      : options.currentOrigin
        ? null
        : (process.env.NEXT_PUBLIC_TENANT_SITE_URL ??
          process.env.TENANT_SITE_URL ??
          null);

  if (explicitOrigin) {
    try {
      const url = new URL(explicitOrigin);
      url.pathname = path;
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/$/, "");
    } catch {
      const host = normalizeRuntimeHost(explicitOrigin);
      if (host) {
        return `${options.protocol ?? "https"}://${host}${path}`;
      }
    }
  }

  return buildTenantSiteRootUrl({
    currentUrl: options.currentOrigin,
    path,
  });
}

export function buildTemplateSandboxProductionUrl(
  shareId: string,
  pathname?: string,
) {
  return buildTemplateSandboxUrl(shareId, {
    pathname,
    protocol: "https",
    tenantSiteOrigin:
      process.env.NEXT_PUBLIC_TENANT_SITE_URL ??
      process.env.TENANT_SITE_URL ??
      `https://${plotkeysRootDomain}`,
  });
}
