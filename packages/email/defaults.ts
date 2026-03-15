export function defaultWelcomeSubject(companyName: string) {
  return `Welcome to PlotKeys, ${companyName}`;
}

export function defaultWelcomeHeading(companyName: string) {
  return `Your ${companyName} workspace is ready`;
}

export function defaultWelcomeBody(companyName: string, siteHostname: string) {
  return `PlotKeys created the first setup path for ${companyName}. Continue onboarding, review your first website draft, and prepare ${siteHostname} for launch.`;
}

export const DEFAULT_WELCOME_BUTTON_TEXT = "Continue onboarding";
