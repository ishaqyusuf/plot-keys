import "server-only";

import type { SubscriptionTier } from "@plotkeys/utils";
import { getBaseUrl } from "@/lib/get-base-url";
import { getQueryClient, trpc } from "@/trpc/server";
import { BuilderPreviewPanel } from "./builder-preview-panel";
import { BuilderWorkspaceLayout } from "./builder-workspace-layout";
import {
  type BuilderWorkspaceNoticeState,
  BuilderWorkspaceNotices,
} from "./builder-workspace-notices";
import { resolveBuilderWorkspacePreviewData } from "./builder-workspace-preview-data";
import { BuilderWorkspaceSidebar } from "./builder-workspace-sidebar";
import {
  countChangedBuilderContentFields,
  resolveBuilderWorkspaceTemplateAccess,
} from "./builder-workspace-state";
import { BuilderWorkspaceToolbar } from "./builder-workspace-toolbar";
import { BuilderWorkspaceUnavailable } from "./builder-workspace-unavailable";

type Props = {
  companyName: string;
  companySlug: string;
  mode?: "dashboard" | "page";
  notices?: BuilderWorkspaceNoticeState;
  pageKey?: string;
  /** Active page path from ?path= query param (e.g. "/about", "/listings"). */
  previewPath?: string;
};

export async function BuilderWorkspace({
  companyName,
  companySlug,
  mode = "page",
  notices,
  pageKey,
  previewPath,
}: Props) {
  const currentOrigin = await getBaseUrl();
  const queryClient = getQueryClient();
  const builderData = await queryClient
    .fetchQuery(trpc.website.builder.queryOptions())
    .catch(() => null);

  if (!builderData) {
    return (
      <BuilderWorkspaceUnavailable
        description="We could not load this workspace right now."
        title="Builder is unavailable"
      />
    );
  }

  if (builderData.status === "company-not-found") {
    return (
      <BuilderWorkspaceUnavailable
        description="We could not find this workspace right now."
        title="Builder is unavailable"
      />
    );
  }

  if (builderData.status === "draft-not-found") {
    return (
      <BuilderWorkspaceUnavailable
        description="No template configuration exists for this tenant yet."
        title="No template configuration yet"
      />
    );
  }

  const {
    activeDraft: resolvedActiveDraft,
    company,
    publishedVersion,
    featuredProperties,
    agents,
    blogPosts,
    licensedTemplateKeys,
    onboarding,
  } = builderData;

  const configId = resolvedActiveDraft.id;
  const planTier = company.planTier as SubscriptionTier;
  const changedFieldCount = countChangedBuilderContentFields({
    draftContent: resolvedActiveDraft.contentJson,
    liveContent: publishedVersion?.contentJson,
  });
  const {
    activeTemplateLabel,
    isTemplateLocked,
    lockedTemplateMessage,
    requiredPlan,
  } = resolveBuilderWorkspaceTemplateAccess({
    licensedTemplateKeys,
    planTier,
    templateKey: resolvedActiveDraft.templateKey,
  });
  const {
    availablePages,
    currentPageLiveSiteUrl,
    liveSiteUrl,
    preview,
    sectionTypes,
    selectedPageKey,
    selectedPageLabel,
    selectedPageSlug,
    templateConfig,
  } = resolveBuilderWorkspacePreviewData({
    agents,
    blogPosts,
    companyName,
    companySlug,
    content: resolvedActiveDraft.contentJson,
    currentOrigin,
    featuredProperties,
    pageKey,
    previewPath,
    templateKey: resolvedActiveDraft.templateKey,
    theme: resolvedActiveDraft.themeJson,
  });
  const isEmbedded = mode === "dashboard";

  return (
    <BuilderWorkspaceLayout
      isEmbedded={isEmbedded}
      notices={
        <BuilderWorkspaceNotices
          activeTemplateLabel={activeTemplateLabel}
          isTemplateLocked={isTemplateLocked}
          lockedTemplateMessage={lockedTemplateMessage}
          notices={notices}
        />
      }
      sidebar={
        <BuilderWorkspaceSidebar
          activeConfigName={resolvedActiveDraft.name}
          activePageKey={selectedPageKey}
          configId={configId}
          configStatus={resolvedActiveDraft.status}
          currentPageKey={selectedPageKey}
          currentTemplateKey={resolvedActiveDraft.templateKey}
          editableFieldCount={preview.editableFields.length}
          isEmbedded={isEmbedded}
          licensedTemplateKeys={licensedTemplateKeys}
          onboarding={onboarding}
          planTier={planTier}
          readOnly={isTemplateLocked}
          readOnlyMessage={lockedTemplateMessage}
          requiredPlan={requiredPlan}
          sectionCount={preview.page.sections.length}
          sectionTypes={sectionTypes}
          templateConfig={templateConfig}
          versionNumber={resolvedActiveDraft.versionNumber}
        />
      }
    >
      <BuilderWorkspaceToolbar
        activeConfigName={resolvedActiveDraft.name}
        activePageKey={selectedPageKey}
        changedFieldCount={changedFieldCount}
        configId={configId}
        configStatus={resolvedActiveDraft.status}
        currentName={resolvedActiveDraft.name}
        currentPageKey={selectedPageKey}
        currentPageLiveSiteUrl={currentPageLiveSiteUrl}
        currentTemplateKey={resolvedActiveDraft.templateKey}
        disabled={isTemplateLocked}
        disabledReason={lockedTemplateMessage}
        editableFieldCount={preview.editableFields.length}
        isEmbedded={isEmbedded}
        isOnboardingStep={Boolean(notices?.onboarding)}
        licensedTemplateKeys={licensedTemplateKeys}
        liveSiteUrl={liveSiteUrl}
        planTier={planTier}
        requiredPlan={requiredPlan}
        sectionCount={preview.page.sections.length}
        sectionTypes={sectionTypes}
        selectedPageLabel={selectedPageLabel}
        templateConfig={templateConfig}
        templateLabel={activeTemplateLabel}
        totalConfigurations={resolvedActiveDraft.versionNumber ?? 1}
      />

      <BuilderPreviewPanel
        activePageKey={selectedPageKey}
        availablePages={availablePages}
        companyName={companyName}
        companySlug={companySlug}
        configId={configId}
        defaultContent={preview.template.defaultContent}
        editableFields={preview.editableFields}
        readOnly={isTemplateLocked}
        readOnlyMessage={lockedTemplateMessage}
        pageKey={selectedPageKey}
        pageLabel={selectedPageLabel}
        pageSlug={selectedPageSlug}
        sections={preview.page.sections.map(
          ({ component: _component, ...rest }) => rest,
        )}
        templateConfig={templateConfig}
        templateKey={resolvedActiveDraft.templateKey}
        theme={resolvedActiveDraft.themeJson}
        visibleSections={templateConfig.visibleSections}
      />
    </BuilderWorkspaceLayout>
  );
}
