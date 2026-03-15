export function defaultVerificationSubject(companyName: string) {
  return `Verify your PlotKeys account for ${companyName}`;
}

export function defaultVerificationHeading(companyName: string) {
  return `Verify ${companyName} to continue`;
}

export function defaultVerificationBody(companyName: string) {
  return `Confirm your email address to unlock the PlotKeys workspace for ${companyName} and continue onboarding.`;
}

export const DEFAULT_VERIFICATION_BUTTON_TEXT = "Verify email address";

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
