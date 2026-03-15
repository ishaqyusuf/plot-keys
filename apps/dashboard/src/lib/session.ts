import {
  type AppSession,
  authRoutes,
  authSessionCookieName,
  getAppSessionFromSessionToken,
} from "@plotkeys/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentAppSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(authSessionCookieName)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    return await getAppSessionFromSessionToken(sessionToken);
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
