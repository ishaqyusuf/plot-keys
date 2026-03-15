import { authSessionCookieName } from "@plotkeys/auth";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

export function clearAuthSessionCookie(cookieStore: ResponseCookies) {
  cookieStore.delete(authSessionCookieName);
}

export function setAuthSessionCookie(
  cookieStore: ResponseCookies,
  sessionToken: string,
) {
  cookieStore.set(authSessionCookieName, sessionToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
