import type { TemplateConfig } from "@plotkeys/section-registry";
import type { SubscriptionTier } from "@plotkeys/utils";
import { BuilderSidebarDrawer } from "@/components/sheets/builder-sidebar-drawer";

type Props = {
  activeConfigName: string;
  activePageKey: string;
  configId: string;
  configStatus: string;
  currentPageKey: string;
  currentTemplateKey: string;
  disabled?: boolean;
  disabledReason?: string;
  editableFieldCount: number;
  isEmbedded: boolean;
  licensedTemplateKeys: Set<string>;
  planTier: SubscriptionTier;
  requiredPlan?: SubscriptionTier;
  sectionCount: number;
  sectionTypes?: string[];
  selectedPageLabel: string;
  templateConfig: TemplateConfig;
  totalConfigurations: number;
};

export function BuilderWorkspaceToolbarContext({
  activeConfigName,
  activePageKey,
  configId,
  configStatus,
  currentPageKey,
  currentTemplateKey,
  disabled,
  disabledReason,
  editableFieldCount,
  isEmbedded,
  licensedTemplateKeys,
  planTier,
  requiredPlan,
  sectionCount,
  sectionTypes,
  selectedPageLabel,
  templateConfig,
  totalConfigurations,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <BuilderSidebarDrawer
        activeConfigName={activeConfigName}
        activePageKey={activePageKey}
        configId={configId}
        configStatus={configStatus}
        currentPageKey={currentPageKey}
        currentTemplateKey={currentTemplateKey}
        editableFieldCount={editableFieldCount}
        licensedTemplateKeys={licensedTemplateKeys}
        planTier={planTier}
        readOnly={disabled}
        readOnlyMessage={disabledReason}
        requiredPlan={requiredPlan}
        sectionCount={sectionCount}
        sectionTypes={sectionTypes}
        templateConfig={templateConfig}
        totalConfigurations={totalConfigurations}
      />
      <span className="text-sm text-muted-foreground">{selectedPageLabel}</span>
      {isEmbedded ? (
        <span className="text-sm text-muted-foreground">Website builder</span>
      ) : null}
    </div>
  );
}
