import type { TemplateConfig } from "@plotkeys/section-registry";
import { cn } from "@plotkeys/ui/cn";
import { Separator } from "@plotkeys/ui/separator";
import type { SubscriptionTier } from "@plotkeys/utils";
import { RecommendTemplatePanel } from "@/components/modals/recommend-template-panel-modal";
import { BuilderSidebarConfigurationSummary } from "./builder-sidebar-configuration-summary";
import { BuilderSidebarControls } from "./builder-sidebar-controls";
import { BuilderSidebarEditableFieldsNote } from "./builder-sidebar-editable-fields-note";
import { BuilderSidebarSectionGroup } from "./builder-sidebar-section-group";
import {
  AiContentBootstrapButton,
  GeneratePageContentButton,
} from "./onboarding-tools";

type Props = {
  activeConfigName: string;
  activePageKey?: string;
  configId: string;
  configStatus: string;
  currentPageKey: string;
  currentTemplateKey: string;
  editableFieldCount: number;
  isEmbedded: boolean;
  licensedTemplateKeys: Set<string>;
  onboarding?: {
    businessType?: string | null;
    primaryGoal?: string | null;
    stylePreference?: string | null;
    tone?: string | null;
  } | null;
  planTier: SubscriptionTier;
  readOnly?: boolean;
  readOnlyMessage?: string;
  requiredPlan?: SubscriptionTier;
  sectionCount: number;
  sectionTypes?: string[];
  templateConfig: TemplateConfig;
  versionNumber?: number | null;
};

export function BuilderWorkspaceSidebar({
  activeConfigName,
  activePageKey,
  configId,
  configStatus,
  currentPageKey,
  currentTemplateKey,
  editableFieldCount,
  isEmbedded,
  licensedTemplateKeys,
  onboarding,
  planTier,
  readOnly,
  readOnlyMessage,
  requiredPlan,
  sectionCount,
  sectionTypes,
  templateConfig,
  versionNumber,
}: Props) {
  return (
    <aside
      className={cn(
        "hidden xl:block",
        !isEmbedded && "xl:sticky xl:top-3 xl:h-[calc(100svh-1.5rem)]",
      )}
    >
      <div className="flex h-full flex-col overflow-hidden border bg-background">
        <div className="border-b border-border bg-background px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Website config
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <section className="flex flex-col gap-3">
            <BuilderSidebarConfigurationSummary
              activeConfigName={activeConfigName}
              className="p-3.5"
              configStatus={configStatus}
              statusDisplay="badge"
              statusVariant={
                configStatus === "published" ? "default" : "outline"
              }
              versionNumber={versionNumber ?? 1}
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
            countDisplay="badge"
            editableFieldCount={editableFieldCount}
            sectionCount={sectionCount}
          />

          <Separator />

          <BuilderSidebarSectionGroup title="AI content">
            <GeneratePageContentButton
              disabled={readOnly}
              pageKey={currentPageKey}
            />
          </BuilderSidebarSectionGroup>

          <Separator />

          <BuilderSidebarSectionGroup title="Onboarding tools">
            <AiContentBootstrapButton disabled={readOnly} />
            <RecommendTemplatePanel
              currentBusinessType={onboarding?.businessType}
              currentPrimaryGoal={onboarding?.primaryGoal}
              currentStylePreference={onboarding?.stylePreference}
              currentTone={onboarding?.tone}
            />
          </BuilderSidebarSectionGroup>
        </div>
      </div>
    </aside>
  );
}
