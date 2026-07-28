import type { TemplateConfig } from "@plotkeys/section-registry";
import { Separator } from "@plotkeys/ui/separator";
import type { SubscriptionTier } from "@plotkeys/utils";

import { BuilderSidebarConfigurationSummary } from "@/components/builder/builder-sidebar-configuration-summary";
import { BuilderSidebarControls } from "@/components/builder/builder-sidebar-controls";
import { BuilderSidebarEditableFieldsNote } from "@/components/builder/builder-sidebar-editable-fields-note";

type Props = {
  activeConfigName: string;
  activePageKey?: string;
  configId: string;
  configStatus: string;
  currentPageKey: string;
  currentTemplateKey: string;
  editableFieldCount: number;
  licensedTemplateKeys: Set<string>;
  planTier: SubscriptionTier;
  readOnly?: boolean;
  readOnlyMessage?: string;
  requiredPlan?: SubscriptionTier;
  sectionCount: number;
  sectionTypes?: string[];
  templateConfig: TemplateConfig;
  totalConfigurations: number;
};

export function BuilderSidebarDrawerContent({
  activeConfigName,
  activePageKey,
  configId,
  configStatus,
  currentPageKey,
  currentTemplateKey,
  editableFieldCount,
  licensedTemplateKeys,
  planTier,
  readOnly,
  readOnlyMessage,
  requiredPlan,
  sectionCount,
  sectionTypes,
  templateConfig,
  totalConfigurations,
}: Props) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <section className="flex flex-col gap-3">
        <BuilderSidebarConfigurationSummary
          activeConfigName={activeConfigName}
          configStatus={configStatus}
          totalConfigurations={totalConfigurations}
        />

        <BuilderSidebarControls
          activePageKey={activePageKey}
          configId={configId}
          currentPageKey={currentPageKey}
          currentTemplateKey={currentTemplateKey}
          licensedTemplateKeys={licensedTemplateKeys}
          planTier={planTier}
          readOnly={readOnly}
          readOnlyMessage={readOnlyMessage}
          requiredPlan={requiredPlan}
          sectionTypes={sectionTypes}
          templateConfig={templateConfig}
        />
      </section>

      <Separator />

      <BuilderSidebarEditableFieldsNote
        editableFieldCount={editableFieldCount}
        sectionCount={sectionCount}
      />
    </div>
  );
}
