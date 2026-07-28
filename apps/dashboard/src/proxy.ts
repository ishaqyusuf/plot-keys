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
 *   dashboard.{slug}.plotkeys.com      -> tenant slug = {slug}
 *   dashboard.{slug}.app-plotkeys.localhost -> tenant slug = {slug}
 *   dashboard.{tenantDomain.com}       -> tenant hostname lookup via DB
 *   localhost / 127.x.x.x              -> no tenant slug injected
 */

import {
  authRoutes,
  authSessionCookieName,
  getScopedAuthSessionCookieName,
  platformSessionScope,
} from "@plotkeys/auth/shared";
import {
  extractDashboardHostname,
  extractDashboardTenantSlug,
  isTenantDashboardHost,
  resolveDashboardSessionScope,
  resolveTenantSiteHostContext,
} from "@plotkeys/utils";
import {
  buildTenantHref,
  getTenantUrlHeaderNames,
  resolveTenantUrlContext,
} from "@plotkeys/utils/tenant-url";
import { type NextRequest, NextResponse } from "next/server";
import { getDashboardTenantState } from "./lib/dashboard-tenant-api";
import { getDashboardTenantUrlConfig } from "./lib/tenant-url-config";

/** Routes that do NOT require an authenticated session. */
const PUBLIC_PREFIXES = [
  authRoutes.onboarding,
  authRoutes.signIn,
  authRoutes.signUp,
  authRoutes.verifyEmail,
  "/template-sandbox",
  "/api/",
  "/_next/",
  "/favicon",
];

const PUBLIC_ASSET_PATTERN =
  /^\/(?:apple-icon(?:-[\w-]+)?|icon(?:-[\w-]+)?|logo(?:-[\w-]+)?|favicon(?:-[\w-]+)?)\.(?:ico|png|svg)$/;

const PLATFORM_ONLY_PREFIXES = [authRoutes.signUp];

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_ASSET_PATTERN.test(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    /^\/join\/[^/]+$/.test(pathname)
  );
}

function isOnboardingPath(pathname: string): boolean {
  return pathname === authRoutes.onboarding;
}

function hasSessionCookie(request: NextRequest): boolean {
  const sessionScope = resolveDashboardSessionScope(getRequestHost(request));
  const cookieName = getScopedAuthSessionCookieName(
    sessionScope ?? platformSessionScope,
  );

  return (
    !!request.cookies.get(cookieName)?.value ||
    (sessionScope !== null &&
      !!request.cookies.get(authSessionCookieName)?.value)
  );
}

function getRequestHost(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? ""
  );
}

async function isTenantAlreadyOnboarded(input: {
  tenantHostname: string | null;
  tenantSlug: string | null;
}) {
  const state = await getDashboardTenantState(input);
  return state?.onboarded ?? false;
}

export async function proxy(request: NextRequest) {
  const tenantUrlConfig = getDashboardTenantUrlConfig();
  const headerNames = getTenantUrlHeaderNames(tenantUrlConfig);
  const { pathname } = request.nextUrl;
  const host = getRequestHost(request);
  const tenantUrlContext = resolveTenantUrlContext(
    {
      host,
      pathname,
      protocol:
        request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol,
    },
    tenantUrlConfig,
  );
  const productPath = tenantUrlContext.productPath;
  const tenantHostContext = resolveTenantSiteHostContext(host);
  const tenantHostname =
    tenantUrlContext.customDomainLookupHost ??
    tenantHostContext.tenantHostname ??
    extractDashboardHostname(host);
  const tenantSlug =
    tenantUrlContext.tenantSlug ??
    tenantHostContext.tenantSubdomain ??
    extractDashboardTenantSlug(host);
  const isTenantMode = isTenantDashboardHost(host) || Boolean(tenantSlug);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.delete("x-tenant-hostname");
  requestHeaders.delete("x-tenant-subdomain");
  requestHeaders.delete(headerNames.domain);
  requestHeaders.delete(headerNames.pathname);
  requestHeaders.delete(headerNames.urlStyle);
  requestHeaders.delete(headerNames.externalBasePath);
  requestHeaders.delete(headerNames.externalPath);

  if (tenantHostname) {
    requestHeaders.set("x-tenant-hostname", tenantHostname);
  }
  if (tenantSlug) {
    requestHeaders.set("x-tenant-subdomain", tenantSlug);
    requestHeaders.set(headerNames.domain, tenantSlug);
  }
  requestHeaders.set("x-pathname", productPath);
  requestHeaders.set(headerNames.pathname, productPath);
  requestHeaders.set(headerNames.urlStyle, tenantUrlContext.style);
  requestHeaders.set(
    headerNames.externalBasePath,
    tenantUrlContext.externalBasePath,
  );
  requestHeaders.set(headerNames.externalPath, tenantUrlContext.externalPath);

  if (
    isTenantMode &&
    PLATFORM_ONLY_PREFIXES.some((prefix) => productPath.startsWith(prefix))
  ) {
    const signInUrl = new URL(
      buildTenantHref(tenantUrlContext, authRoutes.signIn, tenantUrlConfig),
      request.url,
    );
    return NextResponse.redirect(signInUrl);
  }

  if (
    isTenantMode &&
    isOnboardingPath(productPath) &&
    !hasSessionCookie(request)
  ) {
    const tenantAlreadyOnboarded = await isTenantAlreadyOnboarded({
      tenantHostname,
      tenantSlug,
    });

    if (tenantAlreadyOnboarded) {
      const signInUrl = new URL(
        buildTenantHref(tenantUrlContext, authRoutes.signIn, tenantUrlConfig),
        request.url,
      );
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Gate non-public routes behind the session cookie check.
  // Full session validation happens inside server components.
  if (!isPublicPath(productPath) && !hasSessionCookie(request)) {
    const signInUrl = new URL(
      buildTenantHref(tenantUrlContext, authRoutes.signIn, tenantUrlConfig),
      request.url,
    );
    signInUrl.searchParams.set(
      "redirect",
      `${productPath}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(signInUrl);
  }

  if (tenantUrlContext.style === "path" && productPath !== pathname) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = productPath;
    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
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
