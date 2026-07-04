import { useRegistry } from "../../../../runtime-context";

export function useRiwaqPage() {
  const registry = useRegistry();

  return {
    isActive: (pageKey: string) => registry.page.pageKey === pageKey,
    isDevMode: registry.isDevMode,
    page: registry.page,
    tenant: registry.tenant,
    templateKey: registry.templateKey,
  };
}
