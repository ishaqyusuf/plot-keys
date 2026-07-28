"use client";

import type { TemplateConfig } from "@plotkeys/section-registry";
import { Sheet, SheetContent, SheetHeader } from "@plotkeys/ui/sheet";
import type { SubscriptionTier } from "@plotkeys/utils";

import { BuilderSidebarDrawerContent } from "@/components/builder/builder-sidebar-drawer-content";
import { BuilderSidebarDrawerTrigger } from "@/components/builder/builder-sidebar-drawer-trigger";
import { useBuilderParams } from "@/hooks/use-builder-params";

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

export function BuilderSidebarDrawer({
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
  const { builderSettings, setParams } = useBuilderParams();
  const isOpen = Boolean(builderSettings);

  return (
    <>
      <BuilderSidebarDrawerTrigger
        onOpen={() => setParams({ builderSettings: true })}
      />
      <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
        <SheetContent
          side="left"
          className="w-72 overflow-y-auto border-border bg-background p-0 sm:w-80"
        >
          <SheetHeader className="border-b border-border bg-background px-4 py-4">
            <h2 className="text-sm font-medium">Builder setup</h2>
          </SheetHeader>

          <BuilderSidebarDrawerContent
            activeConfigName={activeConfigName}
            activePageKey={activePageKey}
            configId={configId}
            configStatus={configStatus}
            currentPageKey={currentPageKey}
            currentTemplateKey={currentTemplateKey}
            editableFieldCount={editableFieldCount}
            licensedTemplateKeys={licensedTemplateKeys}
            planTier={planTier}
            readOnly={readOnly}
            readOnlyMessage={readOnlyMessage}
            requiredPlan={requiredPlan}
            sectionCount={sectionCount}
            sectionTypes={sectionTypes}
            templateConfig={templateConfig}
            totalConfigurations={totalConfigurations}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
