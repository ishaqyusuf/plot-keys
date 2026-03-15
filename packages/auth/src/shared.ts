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
export const authSessionCookieName = `${authCookiePrefix}_session`;

export type SessionBridgeInput = z.infer<typeof sessionBridgeInputSchema>;
