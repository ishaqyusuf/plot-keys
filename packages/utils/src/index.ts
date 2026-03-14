export * from "./cn";

export function createTenantUrl(slug: string) {
  return `${slug}.plotkeys.app`;
}
