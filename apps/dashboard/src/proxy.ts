/**
 * Dashboard proxy (Next.js 16 convention, replaces middleware).
 *
 * Responsibilities:
 * 1. Extract the tenant subdomain from the request host and inject it as
 *    `x-tenant-subdomain` so server components and API routes can read it
 *    without relying on query params.
 * 2. Protect authenticated routes by redirecting unauthenticated requests
 *    to sign-in without running the full Better Auth session check
 *    (session verification happens inside server components / tRPC context).
 *
 * Host patterns handled:
 *   dashboard.{slug}.plotkeys.com  → tenant slug = {slug}
 *   {slug}.plotkeys.com            → tenant slug = {slug} (legacy / alias)
 *   localhost / 127.x.x.x          → no tenant slug injected
 */

import { authRoutes, authSessionCookieName } from "@plotkeys/auth/shared";
import { type NextRequest, NextResponse } from "next/server";

const PLOTKEYS_DOMAIN = "plotkeys.com";
const DASHBOARD_SUBDOMAIN = "dashboard";

/** Routes that do NOT require an authenticated session. */
const PUBLIC_PREFIXES = [
  authRoutes.signIn,
  authRoutes.signUp,
  authRoutes.verifyEmail,
  "/api/",
  "/_next/",
  "/favicon",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function extractTenantSlug(host: string): string | null {
  const hostname = host.toLowerCase().replace(/:\d+$/, "");

  if (!hostname || hostname === "localhost") {
    return null;
  }

  if (hostname.endsWith(`.${PLOTKEYS_DOMAIN}`)) {
    const withoutRoot = hostname.slice(0, -(PLOTKEYS_DOMAIN.length + 1));
    const parts = withoutRoot.split(".");

    // dashboard.{slug}.plotkeys.com → parts = ["dashboard", "{slug}"]
    if (parts.length === 2 && parts[0] === DASHBOARD_SUBDOMAIN) {
      return parts[1] ?? null;
    }

    // {slug}.plotkeys.com (dashboard deployed at root subdomain)
    if (parts.length === 1 && parts[0] !== DASHBOARD_SUBDOMAIN) {
      return parts[0] ?? null;
    }
  }

  return null;
}

function hasSessionCookie(request: NextRequest): boolean {
  return !!request.cookies.get(authSessionCookieName)?.value;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const tenantSlug = extractTenantSlug(host);

  // Build forwarded request with tenant context header
  const requestHeaders = new Headers(request.headers);
  if (tenantSlug) {
    requestHeaders.set("x-tenant-subdomain", tenantSlug);
  }
  requestHeaders.set("x-pathname", pathname);

  // Gate non-public routes behind the session cookie check.
  // Full session validation happens inside server components.
  if (!isPublicPath(pathname) && !hasSessionCookie(request)) {
    const signInUrl = new URL(authRoutes.signIn, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
