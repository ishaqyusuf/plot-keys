import { buildTenantDashboardUrl } from "./tenant-domains";

export * from "./cn";
export * from "./domain-service";
export * from "./paystack";
export * from "./phone";
export * from "./pricing";
export * from "./tenant-domains";
export * from "./tiers";
export * from "./vercel-domains";
export * from "./work-role";

export function createTenantUrl(slug: string) {
  return buildTenantDashboardUrl(slug);
}
