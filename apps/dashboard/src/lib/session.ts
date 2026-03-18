import {
  type AppSession,
  authSessionCookieName,
  authRoutes,
  getAppSessionFromBetterAuth,
} from "@plotkeys/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
  const sessionToken = cookieStore.get(authSessionCookieName)?.value;

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

  if (!session.activeMembership) {
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
  return requestHeaders.get("x-tenant-subdomain");
}
