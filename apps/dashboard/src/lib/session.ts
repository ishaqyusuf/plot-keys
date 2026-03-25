import {
  type AppSession,
  authRoutes,
  authSessionCookieName,
  getAppSessionFromBetterAuth,
  getScopedAuthSessionCookieName,
  platformSessionScope,
} from "@plotkeys/auth";
import { createPrismaClient, resolveTenantByHostname } from "@plotkeys/db";
import { resolveDashboardSessionScope } from "@plotkeys/utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

function resolveSessionCookieScope(host?: string | null) {
  return resolveDashboardSessionScope(host) ?? platformSessionScope;
}

async function getCurrentSessionCookieName() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  return getScopedAuthSessionCookieName(resolveSessionCookieScope(host));
}

async function isTenantHost() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  return resolveDashboardSessionScope(host) !== null;
}

async function buildRequestHeadersWithCookies(): Promise<Headers> {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const combined = new Headers(requestHeaders);

  // Ensure the Better Auth session cookie is forwarded
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (cookieHeader) {
    combined.set("cookie", cookieHeader);
  }

  return combined;
}

export async function getCurrentAppSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();
  const sessionCookieName = await getCurrentSessionCookieName();
  const scopedSessionToken = cookieStore.get(sessionCookieName)?.value;
  const sessionToken =
    scopedSessionToken ??
    ((await isTenantHost())
      ? cookieStore.get(authSessionCookieName)?.value
      : undefined);

  if (!sessionToken) {
    return null;
  }

  try {
    const requestHeaders = await buildRequestHeadersWithCookies();

    return await getAppSessionFromBetterAuth(requestHeaders);
  } catch {
    return null;
  }
}

export async function requireAuthenticatedSession() {
  const session = await getCurrentAppSession();

  if (!session) {
    redirect(authRoutes.signIn);
  }

  return session;
}

export async function requireOnboardedSession() {
  const session = await requireAuthenticatedSession();
  const tenantSlug = await getTenantSlugFromHost();

  if (!session.activeMembership) {
    if (tenantSlug) {
      redirect(
        `${authRoutes.signIn}?error=${encodeURIComponent("This account does not belong to the current tenant workspace.")}`,
      );
    }

    redirect(authRoutes.onboarding);
  }

  return session as AppSession & {
    activeMembership: NonNullable<AppSession["activeMembership"]>;
  };
}

/**
 * Returns the tenant slug injected by middleware from the request host.
 * Falls back to null when running on localhost without DNS.
 */
export async function getTenantSlugFromHost(): Promise<string | null> {
  const requestHeaders = await headers();
  const tenantSubdomain = requestHeaders.get("x-tenant-subdomain");

  if (tenantSubdomain) {
    return tenantSubdomain;
  }

  const tenantHostname = requestHeaders.get("x-tenant-hostname");
  const prisma = createPrismaClient().db;

  if (!tenantHostname || !prisma) {
    return null;
  }

  const resolvedTenant = await resolveTenantByHostname(prisma, tenantHostname);
  return resolvedTenant?.companySlug ?? null;
}
