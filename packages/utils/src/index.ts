import { buildTenantDashboardUrl } from "./tenant-domains";

export * from "./cn";
export * from "./domain-service";
export * from "./email";
export * from "./paystack";
export * from "./phone";
export * from "./pricing";
export * from "./query-response";
export * from "./app-urls";
export * from "./runtime-url";
export * from "./tenant-domains";
export * from "./template-sandbox-url";
export * from "./tiers";
export * from "./vercel-domains";
export * from "./work-role";

export function createTenantUrl(slug: string) {
  return buildTenantDashboardUrl(slug);
}
