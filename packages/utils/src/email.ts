export type EmailRecipientResolution = {
  isOverridden: boolean;
  originalRecipients: string[];
  recipients: string[];
  routes: Array<{
    originalRecipient: string;
    recipient: string;
    qaRouted: boolean;
  }>;
};

/**
 * Validates a single email address using a non-backtracking approach
 * to prevent ReDoS vulnerabilities.
 */
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();

  // Length limits per RFC 5321
  if (trimmed.length === 0 || trimmed.length > 254) return false;

  const atIndex = trimmed.indexOf("@");

  // Must have exactly one @ with content on both sides
  if (atIndex < 1 || atIndex !== trimmed.lastIndexOf("@")) return false;

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  // Local part validation
  if (local.length > 64 || /\s/.test(local)) return false;

  // Domain validation: must have content, no spaces, and a valid TLD
  if (domain.length === 0 || domain.length > 253 || /\s/.test(domain)) {
    return false;
  }

  // Domain must have at least one dot with content on both sides
  const lastDotIndex = domain.lastIndexOf(".");
  if (lastDotIndex < 1 || lastDotIndex >= domain.length - 1) return false;

  return true;
}

/**
 * Parses a comma-separated email string into an array of trimmed emails.
 */
export function parseEmailList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Validates a comma-separated email string.
 * Returns true if empty/null or if all emails are valid and unique.
 */
export function isValidEmailList(value: string | null | undefined): boolean {
  if (!value) return true;
  const emails = parseEmailList(value);

  if (!emails.every((email) => isValidEmail(email))) return false;

  const uniqueEmails = new Set(emails.map((e) => e.toLowerCase()));
  return uniqueEmails.size === emails.length;
}

function readNonEmptyEnv(env: Record<string, string | undefined>, key: string) {
  const value = env[key]?.trim();
  return value ? value : undefined;
}

export function isDevelopmentEmailMode(
  env: Record<string, string | undefined> = process.env,
) {
  const mode =
    readNonEmptyEnv(env, "PLOTKEYS_ENV_MODE") ??
    readNonEmptyEnv(env, "AFTERSERVICE_ENV_MODE");

  if (mode) {
    return mode !== "production" && mode !== "prod";
  }

  return env.NODE_ENV !== "production";
}

export function resolveEmailRecipients(
  recipients: string | string[],
  env: Record<string, string | undefined> = process.env,
): EmailRecipientResolution {
  const originalRecipients = (
    Array.isArray(recipients) ? recipients : [recipients]
  )
    .map((recipient) => recipient.trim())
    .filter(Boolean);
  const rawRoutes = readNonEmptyEnv(env, "EMAIL_QA_DOMAIN_ROUTES");
  let parsedRoutes: unknown = {};
  if (rawRoutes) {
    try {
      parsedRoutes = JSON.parse(rawRoutes);
    } catch {
      throw new Error("EMAIL_QA_DOMAIN_ROUTES must be valid JSON.");
    }
  }
  if (
    !parsedRoutes ||
    typeof parsedRoutes !== "object" ||
    Array.isArray(parsedRoutes)
  ) {
    throw new Error("EMAIL_QA_DOMAIN_ROUTES must be a JSON object.");
  }
  const qaRoutes = new Map(
    Object.entries(parsedRoutes).map(([domain, destination]) => {
      const normalizedDomain = domain.trim().toLowerCase();
      if (
        !normalizedDomain.endsWith(".test") ||
        typeof destination !== "string" ||
        !isValidEmail(destination) ||
        destination.toLowerCase().endsWith(".test")
      ) {
        throw new Error("EMAIL_QA_DOMAIN_ROUTES contains an invalid route.");
      }
      return [normalizedDomain, destination.trim()] as const;
    }),
  );
  const routes = originalRecipients.map((originalRecipient) => {
    const domain = originalRecipient.toLowerCase().split("@").pop() ?? "";
    const destination = qaRoutes.get(domain);
    if (!destination && domain.endsWith(".test")) {
      throw new Error(
        `QA email delivery blocked unmatched recipient domain "${domain}".`,
      );
    }
    return {
      originalRecipient,
      qaRouted: Boolean(destination),
      recipient: destination ?? originalRecipient,
    };
  });

  return {
    isOverridden: routes.some((route) => route.qaRouted),
    originalRecipients,
    recipients: routes.map((route) => route.recipient),
    routes,
  };
}
