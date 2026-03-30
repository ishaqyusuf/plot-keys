import {
  authSessionCookieName,
  getScopedAuthSessionCookieName,
  platformSessionScope,
} from "@plotkeys/auth/shared";
import { resolveDashboardSessionScope } from "@plotkeys/utils";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

const pendingOnboardingCookieName = "plotkeys_pending_onboarding";

type PendingOnboardingPayload = {
  company: string;
  subdomain: string;
};

type CookieReader = {
  get(name: string):
    | {
        value: string;
      }
    | undefined;
};

function resolveSessionCookieScope(host?: string | null) {
  return resolveDashboardSessionScope(host) ?? platformSessionScope;
}

export function getScopedAuthSessionCookieNameForHost(host?: string | null) {
  return getScopedAuthSessionCookieName(resolveSessionCookieScope(host));
}

export function clearAuthSessionCookie(
  cookieStore: ResponseCookies,
  host?: string | null,
) {
  cookieStore.delete(getScopedAuthSessionCookieNameForHost(host));
  cookieStore.delete(authSessionCookieName);
}

export function setAuthSessionCookie(
  cookieStore: ResponseCookies,
  sessionToken: string,
  host?: string | null,
) {
  cookieStore.set(getScopedAuthSessionCookieNameForHost(host), sessionToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function setPendingOnboardingCookie(
  cookieStore: ResponseCookies,
  payload: PendingOnboardingPayload,
) {
  cookieStore.set(
    pendingOnboardingCookieName,
    JSON.stringify({
      company: payload.company.trim(),
      subdomain: payload.subdomain.trim().toLowerCase(),
    }),
    {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );
}

export function clearPendingOnboardingCookie(cookieStore: ResponseCookies) {
  cookieStore.delete(pendingOnboardingCookieName);
}

export function readPendingOnboardingCookie(cookieStore: CookieReader) {
  const rawValue = cookieStore.get(pendingOnboardingCookieName)?.value;

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<PendingOnboardingPayload>;

    if (
      typeof parsed.company !== "string" ||
      typeof parsed.subdomain !== "string" ||
      !parsed.company.trim() ||
      !parsed.subdomain.trim()
    ) {
      return null;
    }

    return {
      company: parsed.company.trim(),
      subdomain: parsed.subdomain.trim().toLowerCase(),
    };
  } catch {
    return null;
  }
}
