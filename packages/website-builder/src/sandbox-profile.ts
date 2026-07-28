import {
  getTemplatePageInventoryStrict,
  type LiveAgentItem,
  type LiveBlogPostItem,
  type LiveListingItem,
  type TenantContentRecord,
  type TenantThemeRecord,
} from "@plotkeys/section-registry";

export type SandboxProfileSource = {
  companyName: string;
  contentJson: unknown;
  id: string;
  market: string | null;
  profileJson: unknown;
  sampleDataJson: unknown;
  shareId: string;
  subdomainLabel: string | null;
  templateKey: string;
  themeJson: unknown;
};

export type SandboxPreviewRoute = {
  canonicalPath: string;
  pageKey: string;
  routeSlug: string | null;
};

export type SandboxProfileRenderData = {
  companyName: string;
  content: TenantContentRecord;
  currentBlogPost: LiveBlogPostItem | null;
  liveAgents: LiveAgentItem[];
  liveBlogPosts: LiveBlogPostItem[];
  liveListings: LiveListingItem[];
  market: string;
  profileId: string;
  sampleData: Record<string, unknown>;
  shareId: string;
  subdomain: string;
  templateKey: string;
  theme: TenantThemeRecord;
};

type SandboxLiveSnapshot = {
  companyName?: unknown;
  contentJson?: unknown;
  market?: unknown;
  sampleDataJson?: unknown;
  subdomainLabel?: unknown;
  templateKey?: unknown;
  themeJson?: unknown;
};

function toStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      typeof item === "string" ? item : String(item ?? ""),
    ]),
  );
}

function toObjectRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item),
      )
    : [];
}

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeLegacyRiwaqTheme(
  templateKey: string,
  theme: TenantThemeRecord,
): TenantThemeRecord {
  if (templateKey !== "riwaq-starter") return theme;

  const hasLegacyBackgroundOverride =
    theme.backgroundColor?.toLowerCase() === "#ececec";
  const isLegacyDefault =
    theme.colorSystem === "taupe" &&
    theme.accentColor === "orange" &&
    (!theme.chartColor || theme.chartColor === "orange") &&
    (!theme.backgroundColor || hasLegacyBackgroundOverride);
  const patch: TenantThemeRecord = {};

  if (isLegacyDefault) {
    patch.accentColor = "#522C1F";
    patch.chartColor = "#907762";
    patch.colorSystem = "rubbait";
  }

  if (hasLegacyBackgroundOverride) {
    patch.backgroundColor = "";
  }

  return Object.keys(patch).length > 0 ? { ...theme, ...patch } : theme;
}

function getLiveSnapshot(profileJson: unknown): SandboxLiveSnapshot | null {
  const json = toObjectRecord(profileJson);
  const live = json.live;
  if (!live || typeof live !== "object" || Array.isArray(live)) return null;
  return live as SandboxLiveSnapshot;
}

function mapListings(sampleData: Record<string, unknown>): LiveListingItem[] {
  return toArray(sampleData.listings).map((item, index) => ({
    id: asText(item.id, `listing-${index + 1}`),
    imageUrl: asText(item.imageUrl) || null,
    location: asText(item.location, "Sandbox market"),
    price: asText(item.price),
    slug: asText(item.slug, `listing-${index + 1}`),
    specs: asText(item.specs),
    title: asText(item.title, `Listing ${index + 1}`),
  }));
}

function mapAgents(sampleData: Record<string, unknown>): LiveAgentItem[] {
  return toArray(sampleData.agents).map((item, index) => ({
    bio: asText(item.bio),
    id: asText(item.id, `agent-${index + 1}`),
    imageUrl: asText(item.imageUrl) || asText(item.photoUrl) || null,
    name: asText(item.name, `Agent ${index + 1}`),
    slug: asText(item.slug, `agent-${index + 1}`),
    title: asText(item.title) || asText(item.role),
  }));
}

function mapBlogPosts(sampleData: Record<string, unknown>): LiveBlogPostItem[] {
  return toArray(sampleData.blogPosts).map((item, index) => ({
    content: asText(item.content),
    excerpt: asText(item.excerpt),
    featuredImageUrl: asText(item.featuredImageUrl) || null,
    id: asText(item.id, `post-${index + 1}`),
    publishedAt: asText(item.publishedAt),
    slug: asText(item.slug, `post-${index + 1}`),
    title: asText(item.title, `Post ${index + 1}`),
  }));
}

function normalizePathname(pathname: string) {
  const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
}

function matchPageSlug(pattern: string, pathname: string) {
  if (!pattern.includes("[slug]")) {
    return pattern === pathname ? { routeSlug: null } : null;
  }

  const [prefix, suffix = ""] = pattern.split("[slug]");
  if (!pathname.startsWith(prefix ?? "") || !pathname.endsWith(suffix)) {
    return null;
  }

  const rawSlug = pathname.slice(
    (prefix ?? "").length,
    suffix ? -suffix.length : undefined,
  );
  if (!rawSlug || rawSlug.includes("/")) return null;

  return { routeSlug: decodeURIComponent(rawSlug) };
}

export function resolveSandboxPreviewRoute(
  templateKey: string,
  pathname: string,
): SandboxPreviewRoute | null {
  const normalizedPathname = normalizePathname(pathname || "/");
  const inventory = getTemplatePageInventoryStrict(templateKey);

  for (const page of inventory.pages) {
    const match = matchPageSlug(page.slug, normalizedPathname);
    if (!match) continue;

    return {
      canonicalPath: normalizedPathname,
      pageKey: page.pageKey,
      routeSlug: match.routeSlug,
    };
  }

  return null;
}

export function normalizeSandboxProfileRenderData(
  profile: SandboxProfileSource,
  options: {
    routeSlug?: string | null;
    useLiveSnapshot?: boolean;
  } = {},
): SandboxProfileRenderData {
  const liveSnapshot = options.useLiveSnapshot
    ? getLiveSnapshot(profile.profileJson)
    : null;
  const sampleData = toObjectRecord(
    liveSnapshot?.sampleDataJson ?? profile.sampleDataJson,
  );
  const liveBlogPosts = mapBlogPosts(sampleData);
  const companyName = asText(liveSnapshot?.companyName, profile.companyName);
  const templateKey = asText(liveSnapshot?.templateKey, profile.templateKey);

  return {
    companyName,
    content: toStringRecord(liveSnapshot?.contentJson ?? profile.contentJson),
    currentBlogPost: options.routeSlug
      ? (liveBlogPosts.find((post) => post.slug === options.routeSlug) ?? null)
      : null,
    liveAgents: mapAgents(sampleData),
    liveBlogPosts,
    liveListings: mapListings(sampleData),
    market: asText(liveSnapshot?.market, profile.market ?? companyName),
    profileId: profile.id,
    sampleData,
    shareId: profile.shareId,
    subdomain: asText(
      liveSnapshot?.subdomainLabel,
      profile.subdomainLabel ?? "sandbox",
    ),
    templateKey,
    theme: normalizeLegacyRiwaqTheme(
      templateKey,
      toStringRecord(liveSnapshot?.themeJson ?? profile.themeJson),
    ),
  };
}
