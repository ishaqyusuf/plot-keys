type VerificationChallenge = {
  domain: string;
  reason: string;
  type: string;
  value: string;
};

export type TenantDomainKindValue =
  | "dashboard_custom_domain"
  | "dashboard_subdomain"
  | "sitefront_custom_domain"
  | "sitefront_subdomain";

export type TenantDomainStatusValue =
  | "active"
  | "detached"
  | "failed"
  | "pending"
  | "provisioning";

type ProjectDomainResponse = {
  apexName: string;
  createdAt: number;
  name: string;
  projectId: string;
  verification?: VerificationChallenge[];
  verified: boolean;
};

type TenantDomainRecord = Pick<
  {
    hostname: string;
    kind: TenantDomainKindValue;
    status: TenantDomainStatusValue;
    verificationJson: unknown;
    vercelDomainName: string | null;
    vercelProjectKey: string;
  },
  | "hostname"
  | "kind"
  | "status"
  | "verificationJson"
  | "vercelProjectKey"
  | "vercelDomainName"
>;

type VercelProjectKey = "dashboard" | "sitefront";

function getEnv(name: string) {
  return process.env[name]?.trim() || null;
}

function getProjectIdOrName(projectKey: VercelProjectKey) {
  return projectKey === "dashboard"
    ? getEnv("VERCEL_DASHBOARD_PROJECT_ID")
    : getEnv("VERCEL_SITEFRONT_PROJECT_ID");
}

function getTeamQuery() {
  const teamId = getEnv("VERCEL_TEAM_ID");
  const slug = getEnv("VERCEL_TEAM_SLUG");
  const params = new URLSearchParams();

  if (teamId) {
    params.set("teamId", teamId);
  }

  if (slug) {
    params.set("slug", slug);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function getVercelToken() {
  return getEnv("VERCEL_API_TOKEN");
}

export function isVercelDomainProvisioningConfigured() {
  return Boolean(
    getVercelToken() &&
      getProjectIdOrName("sitefront") &&
      getProjectIdOrName("dashboard"),
  );
}

function resolveProjectKey(kind: TenantDomainKindValue) {
  return kind === "dashboard_subdomain" || kind === "dashboard_custom_domain"
    ? "dashboard"
    : "sitefront";
}

async function vercelRequest<TResponse>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<TResponse> {
  const token = getVercelToken();

  if (!token) {
    throw new Error("VERCEL_API_TOKEN is not configured.");
  }

  const response = await fetch(input, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Vercel request failed with ${response.status}.`);
  }

  return (await response.json()) as TResponse;
}

async function getProjectDomain(
  projectIdOrName: string,
  hostname: string,
): Promise<ProjectDomainResponse> {
  return vercelRequest<ProjectDomainResponse>(
    `https://api.vercel.com/v9/projects/${projectIdOrName}/domains/${hostname}${getTeamQuery()}`,
  );
}

async function addProjectDomain(
  projectIdOrName: string,
  hostname: string,
): Promise<ProjectDomainResponse> {
  return vercelRequest<ProjectDomainResponse>(
    `https://api.vercel.com/v10/projects/${projectIdOrName}/domains${getTeamQuery()}`,
    {
      body: JSON.stringify({
        name: hostname,
      }),
      method: "POST",
    },
  );
}

export async function syncTenantDomainWithVercel(
  domain: TenantDomainRecord,
): Promise<{
  lastError: string | null;
  provisionedAt: Date | null;
  status: TenantDomainStatusValue;
  verificationJson: VerificationChallenge[] | null;
  vercelDomainName: string | null;
}> {
  const projectKey = resolveProjectKey(domain.kind);
  const projectIdOrName = getProjectIdOrName(projectKey);

  if (!projectIdOrName) {
    throw new Error(
      projectKey === "dashboard"
        ? "VERCEL_DASHBOARD_PROJECT_ID is not configured."
        : "VERCEL_SITEFRONT_PROJECT_ID is not configured.",
    );
  }

  let result: ProjectDomainResponse;

  if (domain.status === "pending" || domain.status === "failed") {
    try {
      result = await addProjectDomain(projectIdOrName, domain.hostname);
    } catch {
      result = await getProjectDomain(projectIdOrName, domain.hostname);
    }
  } else {
    result = await getProjectDomain(projectIdOrName, domain.hostname);
  }

  return {
    lastError: null,
    provisionedAt: result.verified ? new Date() : null,
    status: result.verified ? "active" : "provisioning",
    verificationJson: result.verification ?? null,
    vercelDomainName: result.name,
  };
}
