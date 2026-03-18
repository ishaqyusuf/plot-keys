/**
 * Tenant-site middleware.
 *
 * Responsibilities:
 * 1. Resolve the tenant from the incoming request host.
 * 2. Inject `x-tenant-subdomain` (company slug) and `x-tenant-hostname`
 *    (full hostname, including custom domains) so server components can
 *    resolve the tenant without depending on query params.
 *
 * Host patterns handled:
 *   {slug}.plotkeys.com   → subdomain = {slug}, hostname = {slug}.plotkeys.com
 *   custom-domain.com     → subdomain = null,   hostname = custom-domain.com
 *   localhost             → no injection (dev fallback via query params)
 *
 * The page component continues to accept ?subdomain= / ?hostname= query
 * params as a dev-mode fallback so local previews still work without DNS.
 */

import { type NextRequest, NextResponse } from "next/server";

const PLOTKEYS_DOMAIN = "plotkeys.com";

/** Known first-party management subdomains that are NOT tenant sites. */
const PLATFORM_SUBDOMAINS = new Set(["www", "dashboard", "api", "mail"]);

function resolveHostContext(host: string): {
  tenantSubdomain: string | null;
  tenantHostname: string | null;
} {
  const hostname = host.toLowerCase().replace(/:\d+$/, "");

  if (!hostname || hostname === "localhost") {
    return { tenantHostname: null, tenantSubdomain: null };
  }

  if (hostname.endsWith(`.${PLOTKEYS_DOMAIN}`)) {
    const subdomain = hostname.slice(0, -(PLOTKEYS_DOMAIN.length + 1));

    // Ignore multi-part or platform-owned subdomains (e.g. dashboard.acme.plotkeys.com)
    if (subdomain.includes(".") || PLATFORM_SUBDOMAINS.has(subdomain)) {
      return { tenantHostname: null, tenantSubdomain: null };
    }

    return { tenantHostname: hostname, tenantSubdomain: subdomain };
  }

  // Custom domain — store the full hostname; subdomain unknown until DB lookup
  return { tenantHostname: hostname, tenantSubdomain: null };
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { tenantHostname, tenantSubdomain } = resolveHostContext(host);

  const requestHeaders = new Headers(request.headers);

  if (tenantSubdomain) {
    requestHeaders.set("x-tenant-subdomain", tenantSubdomain);
  }
  if (tenantHostname) {
    requestHeaders.set("x-tenant-hostname", tenantHostname);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
