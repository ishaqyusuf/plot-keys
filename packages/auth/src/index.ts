export const authRoutes = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  signOut: "/sign-out",
};

export const authCookiePrefix = "plotkeys";

export function createAuthConfig() {
  return {
    appName: "PlotKeys",
    basePath: "/api/auth",
    cookiePrefix: authCookiePrefix,
  };
}
