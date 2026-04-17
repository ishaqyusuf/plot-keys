/**
 * Tenant-site proxy (Next.js 16 convention, replaces middleware).
 *
 * Responsibilities:
 * 1. Resolve the tenant from the incoming request host.
 * 2. Inject `x-tenant-subdomain` (company slug) and `x-tenant-hostname`
 *    (full hostname, including custom domains) so server components can
 *    resolve the tenant without depending on query params.
 *
 * Host patterns handled:
 *   {slug}.plotkeys.com                 → subdomain = {slug}, hostname = {slug}.plotkeys.com
 *   {slug}.tenant-plotkeys.localhost    → subdomain = {slug}, hostname = {slug}.tenant-plotkeys.localhost
 *   custom-domain.com                   → subdomain = null,   hostname = custom-domain.com
 *   localhost             → no injection (dev fallback via query params)
 *
 * The page component continues to accept ?subdomain= / ?hostname= query
 * params as a dev-mode fallback so local previews still work without DNS.
 */

import { resolveTenantSiteHostContext } from "@plotkeys/utils";
import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { tenantHostname, tenantSubdomain } =
    resolveTenantSiteHostContext(host);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-pathname", request.nextUrl.pathname);

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
