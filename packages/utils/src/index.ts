export * from "./cn";
export * from "./paystack";
export * from "./phone";
export * from "./pricing";
export * from "./tenant-domains";
export * from "./tiers";
export * from "./vercel-domains";

export function createTenantUrl(slug: string) {
  return `${slug}.plotkeys.com`;
}
