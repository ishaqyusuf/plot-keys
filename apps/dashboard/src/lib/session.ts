import {
  type AppSession,
  authCookiePrefix,
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
  const sessionToken = cookieStore.get(`${authCookiePrefix}.session_token`)?.value;

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
