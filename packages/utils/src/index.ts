export * from "./cn";
export * from "./tenant-domains";
export * from "./vercel-domains";

export function createTenantUrl(slug: string) {
  return `${slug}.plotkeys.com`;
}
