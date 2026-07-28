import type { TemplateConfig } from "@plotkeys/section-registry";
import type { SubscriptionTier } from "@plotkeys/utils";
import { BuilderWorkspaceToolbarActions } from "./builder-workspace-toolbar-actions";
import { BuilderWorkspaceToolbarContext } from "./builder-workspace-toolbar-context";

type Props = {
  activeConfigName: string;
  activePageKey: string;
  changedFieldCount?: number;
  configId: string;
  configStatus: string;
  currentName: string;
  currentPageKey: string;
  currentPageLiveSiteUrl: string;
  currentTemplateKey: string;
  disabled?: boolean;
  disabledReason?: string;
  editableFieldCount: number;
  isEmbedded: boolean;
  isOnboardingStep?: boolean;
  licensedTemplateKeys: Set<string>;
  liveSiteUrl: string;
  planTier: SubscriptionTier;
  requiredPlan?: SubscriptionTier;
  sectionCount: number;
  sectionTypes?: string[];
  selectedPageLabel: string;
  templateConfig: TemplateConfig;
  templateLabel: string;
  totalConfigurations: number;
};

export function BuilderWorkspaceToolbar({
  activeConfigName,
  activePageKey,
  changedFieldCount,
  configId,
  configStatus,
  currentName,
  currentPageKey,
  currentPageLiveSiteUrl,
  currentTemplateKey,
  disabled,
  disabledReason,
  editableFieldCount,
  isEmbedded,
  isOnboardingStep,
  licensedTemplateKeys,
  liveSiteUrl,
  planTier,
  requiredPlan,
  sectionCount,
  sectionTypes,
  selectedPageLabel,
  templateConfig,
  templateLabel,
  totalConfigurations,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border bg-background px-3 py-2">
      <BuilderWorkspaceToolbarContext
        activeConfigName={activeConfigName}
        activePageKey={activePageKey}
        configId={configId}
        configStatus={configStatus}
        currentPageKey={currentPageKey}
        currentTemplateKey={currentTemplateKey}
        disabled={disabled}
        disabledReason={disabledReason}
        editableFieldCount={editableFieldCount}
        isEmbedded={isEmbedded}
        licensedTemplateKeys={licensedTemplateKeys}
        planTier={planTier}
        requiredPlan={requiredPlan}
        sectionCount={sectionCount}
        sectionTypes={sectionTypes}
        selectedPageLabel={selectedPageLabel}
        templateConfig={templateConfig}
        totalConfigurations={totalConfigurations}
      />

      <BuilderWorkspaceToolbarActions
        changedFieldCount={changedFieldCount}
        configId={configId}
        currentName={currentName}
        currentPageLiveSiteUrl={currentPageLiveSiteUrl}
        disabled={disabled}
        disabledReason={disabledReason}
        isEmbedded={isEmbedded}
        isOnboardingStep={isOnboardingStep}
        liveSiteUrl={liveSiteUrl}
        templateLabel={templateLabel}
      />
    </div>
  );
}
