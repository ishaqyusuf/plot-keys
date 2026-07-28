"use client";

import {
  type TemplateConfig,
  templateCatalog,
} from "@plotkeys/section-registry";
import type { SubscriptionTier } from "@plotkeys/utils";

import {
  BuilderSidebarControlItem,
  BuilderSidebarControlStack,
} from "@/components/builder/builder-sidebar-control-stack";
import { BuilderSidebarReadOnlyNotice } from "@/components/builder/builder-sidebar-read-only-notice";
import {
  ImageSlotsSection,
  SectionVisibilityToggles,
  SeoSection,
} from "@/components/builder/builder-sidebar-sections";
import {
  PagePicker,
  TemplatePicker,
} from "@/components/builder/builder-sidebar-template-page-pickers";
import {
  ColorSystemMenu,
  FontMenu,
  StylePresetMenu,
} from "@/components/builder/builder-sidebar-theme-pickers";
import { useBuilderSidebarThemeActions } from "@/components/builder/use-builder-sidebar-theme-actions";

type Props = {
  /** The currently previewed page key (e.g. "home", "about"). */
  activePageKey?: string;
  configId: string;
  currentPageKey: string;
  currentTemplateKey: string;
  licensedTemplateKeys: Set<string>;
  planTier: SubscriptionTier;
  readOnly?: boolean;
  readOnlyMessage?: string;
  requiredPlan?: SubscriptionTier;
  /** Section types present in the current template page inventory. */
  sectionTypes?: string[];
  templateConfig: TemplateConfig;
};

export function BuilderSidebarControls({
  activePageKey = "home",
  configId,
  currentPageKey,
  currentTemplateKey,
  licensedTemplateKeys,
  planTier,
  readOnly = false,
  readOnlyMessage,
  requiredPlan,
  sectionTypes,
  templateConfig,
}: Props) {
  const { errorMessage, handleUpdateTheme, handleUpdateThemeSilent } =
    useBuilderSidebarThemeActions();
  const currentTemplate = templateCatalog.find(
    (t) => t.key === currentTemplateKey,
  );
  const namedImageSlots = currentTemplate?.namedImageSlots ?? {};

  return (
    <BuilderSidebarControlStack>
      <BuilderSidebarControlItem>
        <TemplatePicker
          currentTemplateKey={currentTemplateKey}
          licensedTemplateKeys={licensedTemplateKeys}
          planTier={planTier}
        />
      </BuilderSidebarControlItem>

      <BuilderSidebarControlItem>
        <PagePicker
          currentPageKey={currentPageKey}
          currentTemplateKey={currentTemplateKey}
        />
      </BuilderSidebarControlItem>

      {readOnly ? (
        <BuilderSidebarReadOnlyNotice
          planTier={planTier}
          readOnlyMessage={readOnlyMessage}
          requiredPlan={requiredPlan}
        />
      ) : null}

      {errorMessage ? (
        <p className="text-xs text-destructive">{errorMessage}</p>
      ) : null}

      <BuilderSidebarControlItem>
        <StylePresetMenu
          configId={configId}
          disabled={readOnly}
          onSave={handleUpdateTheme}
          onSaveSilent={handleUpdateThemeSilent}
          value={templateConfig.stylePreset ?? "vega"}
        />
      </BuilderSidebarControlItem>

      <BuilderSidebarControlItem>
        <ColorSystemMenu
          configId={configId}
          disabled={readOnly}
          onSave={handleUpdateTheme}
          onSaveSilent={handleUpdateThemeSilent}
          value={templateConfig.colorSystem ?? "slate"}
        />
      </BuilderSidebarControlItem>

      <BuilderSidebarControlItem>
        <FontMenu
          configId={configId}
          disabled={readOnly}
          label="Body font"
          onSave={handleUpdateTheme}
          onSaveSilent={handleUpdateThemeSilent}
          themeKey="fontFamily"
          value={templateConfig.fontFamily ?? "Inter"}
        />
      </BuilderSidebarControlItem>

      <BuilderSidebarControlItem>
        <FontMenu
          configId={configId}
          disabled={readOnly}
          label="Heading font"
          onSave={handleUpdateTheme}
          onSaveSilent={handleUpdateThemeSilent}
          themeKey="headingFontFamily"
          value={templateConfig.headingFontFamily ?? "Inter"}
        />
      </BuilderSidebarControlItem>

      {Object.keys(namedImageSlots).length > 0 && (
        <BuilderSidebarControlItem>
          <ImageSlotsSection
            configId={configId}
            disabled={readOnly}
            namedImageSlots={namedImageSlots}
            namedImages={templateConfig.namedImages}
            onSave={handleUpdateTheme}
          />
        </BuilderSidebarControlItem>
      )}

      {sectionTypes && sectionTypes.length > 0 && (
        <BuilderSidebarControlItem>
          <SectionVisibilityToggles
            configId={configId}
            disabled={readOnly}
            onSave={handleUpdateTheme}
            sectionTypes={sectionTypes}
            visibleSections={templateConfig.visibleSections}
          />
        </BuilderSidebarControlItem>
      )}

      <BuilderSidebarControlItem>
        <SeoSection
          configId={configId}
          disabled={readOnly}
          onSave={handleUpdateTheme}
          pageKey={activePageKey}
          seoValues={templateConfig.seo?.[activePageKey]}
        />
      </BuilderSidebarControlItem>
    </BuilderSidebarControlStack>
  );
}
