export * from "./cn";
export * from "./phone";
export * from "./tenant-domains";
export * from "./tiers";
export * from "./vercel-domains";

export function createTenantUrl(slug: string) {
  return `${slug}.plotkeys.com`;
}
