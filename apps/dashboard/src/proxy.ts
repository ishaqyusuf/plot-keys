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
 *   dashboard.{slug}.app.plotkeys.localhost:1355 -> tenant slug = {slug}
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
  createPrismaClient,
  findCompanyBySlug,
  resolveTenantByHostname,
} from "@plotkeys/db";
import {
  extractDashboardHostname,
  extractDashboardTenantSlug,
  isTenantDashboardHost,
  resolveDashboardSessionScope,
} from "@plotkeys/utils";
import { type NextRequest, NextResponse } from "next/server";

/** Routes that do NOT require an authenticated session. */
const PUBLIC_PREFIXES = [
  authRoutes.signIn,
  authRoutes.signUp,
  authRoutes.verifyEmail,
  "/api/",
  "/_next/",
  "/favicon",
];

const PLATFORM_ONLY_PREFIXES = [authRoutes.signUp];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isOnboardingPath(pathname: string): boolean {
  return pathname === authRoutes.onboarding;
}

function hasSessionCookie(request: NextRequest): boolean {
  const sessionScope = resolveDashboardSessionScope(
    request.headers.get("host"),
  );
  const cookieName = getScopedAuthSessionCookieName(
    sessionScope ?? platformSessionScope,
  );

  return (
    !!request.cookies.get(cookieName)?.value ||
    (sessionScope !== null &&
      !!request.cookies.get(authSessionCookieName)?.value)
  );
}

async function isTenantAlreadyOnboarded(input: {
  tenantHostname: string | null;
  tenantSlug: string | null;
}) {
  const prisma = createPrismaClient().db;

  if (!prisma) {
    return false;
  }

  if (input.tenantSlug) {
    const company = await findCompanyBySlug(prisma, input.tenantSlug);
    return Boolean(company);
  }

  if (input.tenantHostname) {
    const resolvedTenant = await resolveTenantByHostname(
      prisma,
      input.tenantHostname,
    );
    return Boolean(resolvedTenant);
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const tenantHostname = extractDashboardHostname(host);
  const tenantSlug = extractDashboardTenantSlug(host);
  const isTenantMode = isTenantDashboardHost(host);
  const requestHeaders = new Headers(request.headers);

  if (tenantHostname) {
    requestHeaders.set("x-tenant-hostname", tenantHostname);
  }
  if (tenantSlug) {
    requestHeaders.set("x-tenant-subdomain", tenantSlug);
  }
  requestHeaders.set("x-pathname", pathname);

  if (
    isTenantMode &&
    PLATFORM_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    const signInUrl = new URL(authRoutes.signIn, request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (!isTenantMode && pathname.startsWith(authRoutes.signIn)) {
    const signUpUrl = new URL(authRoutes.signUp, request.url);
    return NextResponse.redirect(signUpUrl);
  }

  if (
    isTenantMode &&
    isOnboardingPath(pathname) &&
    !hasSessionCookie(request)
  ) {
    const tenantAlreadyOnboarded = await isTenantAlreadyOnboarded({
      tenantHostname,
      tenantSlug,
    });

    if (tenantAlreadyOnboarded) {
      const signInUrl = new URL(authRoutes.signIn, request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

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
