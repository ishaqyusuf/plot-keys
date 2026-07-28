import { buildSandboxUrl, sandboxRootDomain } from "./app-urls";
import { normalizeRuntimeHost } from "./runtime-url";

export type TemplateSandboxUrlOptions = {
  currentOrigin?: string | null;
  pathname?: string;
  protocol?: "http" | "https";
  sandboxOrigin?: string | null;
  /** @deprecated Use sandboxOrigin. Retained while legacy callers migrate. */
  tenantSiteOrigin?: string | null;
};

function normalizePathname(pathname?: string) {
  if (!pathname || pathname === "/") return "";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function buildTemplateSandboxPath(shareId: string, pathname?: string) {
  const normalizedShareId = shareId.trim();
  if (!normalizedShareId) return "";
  return `/preview/${encodeURIComponent(normalizedShareId)}${normalizePathname(pathname)}`;
}

export function buildTemplateSandboxUrl(
  shareId: string,
  options: TemplateSandboxUrlOptions = {},
) {
  const path = buildTemplateSandboxPath(shareId, options.pathname);
  if (!path) return "";

  const explicitOrigin =
    options.sandboxOrigin !== undefined
      ? options.sandboxOrigin
      : options.tenantSiteOrigin !== undefined
        ? options.tenantSiteOrigin
        : options.currentOrigin
          ? null
          : (process.env.NEXT_PUBLIC_SANDBOX_URL ??
            process.env.SANDBOX_PUBLIC_URL ??
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

  return buildSandboxUrl({
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
    sandboxOrigin:
      process.env.NEXT_PUBLIC_SANDBOX_URL ??
      process.env.SANDBOX_PUBLIC_URL ??
      `https://${sandboxRootDomain}`,
  });
}

export function buildLegacyTemplateSandboxPreviewRedirectUrl(
  shareId: string,
  options: {
    currentOrigin?: string | null;
    mode?: "draft" | "live";
    pathname?: string;
  } = {},
) {
  const target = buildTemplateSandboxUrl(shareId, {
    currentOrigin: options.currentOrigin,
    pathname: options.pathname,
  });
  if (!target) return "";

  const url = new URL(target);
  url.searchParams.set("mode", options.mode ?? "draft");
  return url.toString();
}

export function buildLegacyTemplateSandboxProfileRedirectUrl(
  profileId: string,
  options: {
    currentOrigin?: string | null;
    page?: string | null;
    path?: string | null;
  } = {},
) {
  const normalizedProfileId = profileId.trim();
  if (!normalizedProfileId) return "";

  const url = new URL(
    buildSandboxUrl({
      currentUrl: options.currentOrigin,
      path: `/profiles/${encodeURIComponent(normalizedProfileId)}`,
    }),
  );
  if (options.page) url.searchParams.set("page", options.page);
  if (options.path) url.searchParams.set("path", options.path);
  return url.toString();
}
