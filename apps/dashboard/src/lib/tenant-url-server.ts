import {
  buildTenantHref,
  getTenantUrlHeaderNames,
  resolveTenantUrlContext,
  type TenantUrlConfig,
  type TenantUrlContext,
  toInternalTenantPath,
} from "@plotkeys/utils/tenant-url";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardTenantUrlConfig } from "./tenant-url-config";

export function resolveTenantUrlContextFromHeaders({
  config,
  domain,
  headers,
}: {
  config: TenantUrlConfig;
  domain?: string | null;
  headers: Headers;
}): TenantUrlContext {
  const headerNames = getTenantUrlHeaderNames(config);
  const productPath = headers.get(headerNames.pathname) || "/";
  const resolved = resolveTenantUrlContext(
    {
      host: headers.get("host"),
      pathname: productPath,
      protocol: headers.get("x-forwarded-proto"),
    },
    config,
  );
  const style = headers.get(headerNames.urlStyle) || resolved.style;
  const tenantSlug =
    domain || headers.get(headerNames.domain) || resolved.tenantSlug;
  const externalBasePath =
    headers.get(headerNames.externalBasePath) ||
    (style === "path" && tenantSlug
      ? `/${tenantSlug}`
      : resolved.externalBasePath);
  const externalPath =
    headers.get(headerNames.externalPath) ||
    (externalBasePath && productPath !== "/"
      ? `${externalBasePath}${productPath}`
      : externalBasePath || productPath);

  return {
    ...resolved,
    externalBasePath,
    externalPath,
    internalPath: tenantSlug
      ? toInternalTenantPath({ tenantSlug }, productPath, config)
      : resolved.internalPath,
    isPathStyleHost: style === "path",
    productPath,
    style: style as TenantUrlContext["style"],
    tenantSlug,
  };
}

export async function getCurrentTenantUrlContext() {
  const requestHeaders = await headers();
  const config = getDashboardTenantUrlConfig();

  return {
    config,
    context: resolveTenantUrlContextFromHeaders({
      config,
      headers: requestHeaders,
    }),
  };
}

export async function tenantRedirect(href: string): Promise<never> {
  if (process.env.NODE_ENV === "production") {
    redirect(href);
  }

  const { config, context } = await getCurrentTenantUrlContext();
  redirect(buildTenantHref(context, href, config));
}
