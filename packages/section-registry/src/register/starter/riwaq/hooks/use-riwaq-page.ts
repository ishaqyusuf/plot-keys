import { useRegistry } from "../../../../runtime-context";
import { createTemplateUiResolver } from "../../../../template-ui";

export function useRiwaqPage() {
  const registry = useRegistry();
  const ui = createTemplateUiResolver(registry.templateConfig);

  function content(key: string, fallback = "") {
    const value = registry.content[key];
    return value && value.trim() ? value : fallback;
  }

  function sectionVisible(sectionType: string) {
    return registry.templateConfig.visibleSections?.[sectionType] !== false;
  }

  return {
    commitContent: registry.commitContent,
    content,
    isActive: (pageKey: string) => registry.page.pageKey === pageKey,
    isDevMode: registry.isDevMode,
    page: registry.page,
    rawContent: registry.content,
    section: (sectionType: string) =>
      registry.sections.find((section) => section.type === sectionType),
    sectionVisible,
    tenant: registry.tenant,
    theme: registry.theme,
    templateKey: registry.templateKey,
    ui,
  };
}
