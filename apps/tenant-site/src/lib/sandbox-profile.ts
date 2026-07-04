import {
  createPrismaClient,
  getTemplateSandboxProfileByShareId,
} from "@plotkeys/db";
import type {
  LiveAgentItem,
  LiveBlogPostItem,
  LiveListingItem,
  TenantContentRecord,
  TenantThemeRecord,
} from "@plotkeys/section-registry";

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

export async function resolveSandboxProfileRenderData(
  shareId: string,
  routeSlug?: string | null,
  options: { useLiveSnapshot?: boolean } = {},
): Promise<SandboxProfileRenderData | null> {
  const prisma = createPrismaClient().db;
  if (!prisma) return null;

  const profile = await getTemplateSandboxProfileByShareId(prisma, shareId);
  if (!profile) return null;

  const liveSnapshot = options.useLiveSnapshot
    ? getLiveSnapshot(profile.profileJson)
    : null;
  const sampleData = toObjectRecord(
    liveSnapshot?.sampleDataJson ?? profile.sampleDataJson,
  );
  const liveBlogPosts = mapBlogPosts(sampleData);
  const currentBlogPost = routeSlug
    ? (liveBlogPosts.find((post) => post.slug === routeSlug) ?? null)
    : null;
  const companyName = asText(liveSnapshot?.companyName, profile.companyName);
  const market = asText(liveSnapshot?.market, profile.market ?? companyName);
  const subdomain = asText(
    liveSnapshot?.subdomainLabel,
    profile.subdomainLabel ?? "sandbox",
  );
  const templateKey = asText(liveSnapshot?.templateKey, profile.templateKey);

  return {
    companyName,
    content: toStringRecord(liveSnapshot?.contentJson ?? profile.contentJson),
    currentBlogPost,
    liveAgents: mapAgents(sampleData),
    liveBlogPosts,
    liveListings: mapListings(sampleData),
    market,
    profileId: profile.id,
    sampleData,
    shareId: profile.shareId,
    subdomain,
    templateKey,
    theme: toStringRecord(liveSnapshot?.themeJson ?? profile.themeJson),
  };
}
