/**
 * Domain service abstraction.
 *
 * Separates deployment-facing concerns (Vercel) from registrar-facing concerns
 * (domain search, purchase, renewal). The registrar layer supports pluggable
 * providers so both mainstream TLDs and .com.ng can be covered.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DomainAvailabilityResult = {
  domain: string;
  available: boolean;
  /** Human-readable note, e.g. "Premium domain" or "Check with registrar" */
  note?: string;
};

export type DnsRecord = {
  type: "A" | "AAAA" | "CNAME" | "TXT";
  name: string;
  value: string;
  ttl?: number;
};

export type DomainVerificationInstruction = {
  hostname: string;
  records: DnsRecord[];
  message: string;
};

// ─── Supported TLDs ───────────────────────────────────────────────────────────

/**
 * TLDs that the platform can search and eventually sell.
 * Grouped so the UI can present them logically.
 */
export const SUPPORTED_TLDS = {
  global: [".com", ".net", ".org", ".info", ".biz"],
  nigeria: [".com.ng", ".ng", ".org.ng", ".net.ng"],
} as const;

export const ALL_SUPPORTED_TLDS = [
  ...SUPPORTED_TLDS.global,
  ...SUPPORTED_TLDS.nigeria,
] as const;

// ─── Domain validation ────────────────────────────────────────────────────────

const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

/**
 * Returns true when `value` looks like a syntactically valid domain name.
 * Does not verify DNS resolution or ownership.
 */
export function isValidDomainName(value: string): boolean {
  if (!value || value.length > 253) return false;
  return DOMAIN_REGEX.test(value);
}

/**
 * Extracts the registrable apex from a hostname.
 * Handles two-part ccTLDs like `.com.ng` correctly.
 *
 * Examples:
 *   "www.example.com"    → "example.com"
 *   "shop.example.com.ng" → "example.com.ng"
 *   "example.ng"         → "example.ng"
 */
export function extractApexDomain(hostname: string): string {
  const parts = hostname.toLowerCase().replace(/\.$/, "").split(".");
  if (parts.length <= 2) return parts.join(".");

  // Two-part ccTLDs where the second-level is generic
  const twoPartCcTlds = new Set([
    "com.ng",
    "org.ng",
    "net.ng",
    "com.uk",
    "co.uk",
    "org.uk",
    "com.au",
    "co.za",
    "co.ke",
    "com.gh",
  ]);

  const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  if (twoPartCcTlds.has(lastTwo)) {
    // apex = label.com.ng
    return parts.slice(-3).join(".");
  }

  return parts.slice(-2).join(".");
}

// ─── DNS instruction builder ──────────────────────────────────────────────────

/**
 * Default Vercel CNAME target for custom domains.
 */
const VERCEL_CNAME_TARGET = "cname.vercel-dns.com";

/**
 * Builds the DNS records a tenant needs to configure for a custom domain
 * pointing to Vercel-hosted apps.
 *
 * For an apex domain (example.com) → A record to Vercel IP + optional www CNAME.
 * For a subdomain (shop.example.com) → CNAME to cname.vercel-dns.com.
 */
export function buildDnsInstructions(
  hostname: string,
  verificationChallenges?: Array<{
    type: string;
    domain: string;
    value: string;
  }>,
): DomainVerificationInstruction {
  const apex = extractApexDomain(hostname);
  const isApex = hostname === apex;

  const records: DnsRecord[] = [];

  if (isApex) {
    // Vercel recommends A record for apex domains
    records.push({
      type: "A",
      name: "@",
      value: "76.76.21.21",
      ttl: 300,
    });
  } else {
    // Subdomain — CNAME to Vercel
    const label = hostname.slice(0, hostname.length - apex.length - 1) || hostname;
    records.push({
      type: "CNAME",
      name: label,
      value: VERCEL_CNAME_TARGET,
      ttl: 300,
    });
  }

  // Add Vercel verification TXT records if provided
  if (verificationChallenges?.length) {
    for (const challenge of verificationChallenges) {
      if (challenge.type === "TXT") {
        records.push({
          type: "TXT",
          name: challenge.domain.startsWith("_vercel")
            ? challenge.domain.split(".")[0] ?? challenge.domain
            : challenge.domain,
          value: challenge.value,
        });
      }
    }
  }

  const message = isApex
    ? `Add an A record for your root domain (${hostname}) pointing to 76.76.21.21, then add any TXT verification records shown below.`
    : `Add a CNAME record for ${hostname} pointing to ${VERCEL_CNAME_TARGET}, then add any TXT verification records shown below.`;

  return { hostname, records, message };
}

// ─── Domain availability checking ─────────────────────────────────────────────

/**
 * Checks domain availability using DNS resolution as a heuristic.
 *
 * This is a best-effort check — a domain that resolves is almost certainly
 * taken, but a domain that does not resolve might still be registered
 * (parked with no DNS records). For authoritative results the platform should
 * eventually call a registrar WHOIS/RDAP API.
 *
 * Works for all TLDs including .com.ng.
 */
export async function checkDomainAvailability(
  domain: string,
): Promise<DomainAvailabilityResult> {
  if (!isValidDomainName(domain)) {
    return { domain, available: false, note: "Invalid domain name" };
  }

  try {
    // Use the DNS-over-HTTPS service from Cloudflare (public, no API key needed)
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`,
      {
        headers: { Accept: "application/dns-json" },
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      return { domain, available: false, note: "DNS lookup failed" };
    }

    const data = (await response.json()) as {
      Status: number;
      Answer?: Array<{ type: number; data: string }>;
    };

    // Status 3 = NXDOMAIN → domain doesn't exist → likely available
    if (data.Status === 3) {
      return { domain, available: true };
    }

    // If we got answers, domain is taken
    if (data.Answer && data.Answer.length > 0) {
      return { domain, available: false };
    }

    // NOERROR with no answers could mean parked with no records
    return { domain, available: true, note: "No DNS records found — verify with registrar" };
  } catch {
    return { domain, available: false, note: "DNS lookup timed out" };
  }
}

/**
 * Searches for availability across all supported TLD variants for a given
 * second-level label. For example, searching "luxuryproperties" would check
 * luxuryproperties.com, luxuryproperties.com.ng, luxuryproperties.ng, etc.
 */
export async function searchDomainAvailability(
  label: string,
  tlds?: string[],
): Promise<DomainAvailabilityResult[]> {
  const cleanLabel = label
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/(^-|-$)/g, "");

  if (!cleanLabel) {
    return [];
  }

  const targetTlds = tlds?.length ? tlds : [...ALL_SUPPORTED_TLDS];
  const domains = targetTlds.map((tld) =>
    tld.startsWith(".") ? `${cleanLabel}${tld}` : `${cleanLabel}.${tld}`,
  );

  // Run all checks in parallel (Cloudflare DoH handles concurrency well)
  const results = await Promise.all(
    domains.map((domain) => checkDomainAvailability(domain)),
  );

  return results;
}
