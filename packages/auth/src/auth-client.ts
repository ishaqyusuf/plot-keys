/**
 * Better Auth browser client.
 *
 * Import this in client-side code to call Better Auth endpoints directly
 * (e.g. authClient.signIn.email(), authClient.signOut()).
 *
 * The baseURL must point to the API app's Better Auth handler which is mounted
 * at /api/auth (see apps/api/src/app.ts).  In production this is the same
 * origin as the dashboard; in development it uses the API_URL env var.
 */
import { createAuthClient } from "better-auth/client";

function resolveBaseUrl() {
  // Browser env: use current origin so cookies are set on the right domain.
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // SSR / build env: fall back to env var or localhost.
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
}

export const authClient = createAuthClient({
  baseURL: `${resolveBaseUrl()}/api/auth`,
});

export type AuthClient = typeof authClient;
