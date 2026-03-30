import { z } from "zod";

export const authRoutes = {
  dashboardHome: "/",
  onboarding: "/onboarding",
  signIn: "/sign-in",
  signOut: "/sign-out",
  signUp: "/sign-up",
  signUpSuccess: "/verify-email",
  verifyEmail: "/verify-email",
};

export const sessionBridgeInputSchema = z.object({
  sessionToken: z.string().trim().min(1, "Session token is required."),
});

export const authCookiePrefix = "plotkeys";
export const authSessionCookieName = `${authCookiePrefix}.session_token`;
export const platformSessionScope = "app";

export function getScopedAuthSessionCookieName(scope?: string | null) {
  const normalizedScope = (scope ?? platformSessionScope)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${authSessionCookieName}.${normalizedScope || platformSessionScope}`;
}

export type SessionBridgeInput = z.infer<typeof sessionBridgeInputSchema>;
