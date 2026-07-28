import {
  authSessionCookieName,
  getScopedAuthSessionCookieName,
  platformSessionScope,
} from "@plotkeys/auth/shared";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

const sandboxSessionCookieName =
  getScopedAuthSessionCookieName(platformSessionScope);

export function setSandboxSessionCookie(
  cookieStore: ResponseCookies,
  sessionToken: string,
) {
  cookieStore.set(sandboxSessionCookieName, sessionToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSandboxSessionCookie(cookieStore: ResponseCookies) {
  cookieStore.delete(sandboxSessionCookieName);
  cookieStore.delete(authSessionCookieName);
}
