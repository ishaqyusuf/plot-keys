import {
  createPrismaClient,
  findCompanyById,
  findLicensedTemplateKeys,
  findTenantOnboardingByUserId,
  getOrCreateDraftVersion,
  listAgentsForCompany,
  listBlogPostsForCompany,
  listFeaturedProperties,
  upsertDraftWebsiteVersion,
} from "@plotkeys/db";
import {
  resolveActiveDraftForCompany,
  resolvePublishedForCompany,
} from "@plotkeys/db/queries/website";
import {
  createInitialSiteConfigurationInput,
  deserializeTemplateConfig,
  getTemplateDefinition,
  getTemplatePageInventory,
  resolveWebsitePresentation,
  templateCatalog,
} from "@plotkeys/section-registry";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent } from "@plotkeys/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@plotkeys/ui/empty";
import { Separator } from "@plotkeys/ui/separator";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import {
  buildTenantSiteUrl,
  describeTemplateAccess,
  type SubscriptionTier,
  tierLabels,
} from "@plotkeys/utils";
import Link from "next/link";

import {
  createTemplateDraftSilentAction,
  publishSiteConfigurationAction,
  smartFillFieldAction,
  updateSiteFieldAction,
  updateSiteThemeFieldAction,
  updateSiteThemeFieldSilentAction,
} from "../../app/actions";
import { getBaseUrl } from "../../lib/get-base-url";
import { BuilderPreviewPanel } from "./builder-preview-panel";
import { BuilderSidebarControls } from "./builder-sidebar-controls";
import { BuilderSidebarDrawer } from "./builder-sidebar-drawer";
import { FloatingConfigPanel } from "./floating-config-panel";
import {
  AiContentBootstrapButton,
  GeneratePageContentButton,
  RecommendTemplatePanel,
} from "./onboarding-tools";
import { PublishConfirmationDialog } from "./publish-confirmation-dialog";

type PageNavItem = {
  label: string;
  pageKey: string;
  slug: string;
};

type BuilderWorkspaceProps = {
  companyId: string;
  companyName: string;
  companySlug: string;
  mode?: "dashboard" | "page";
  notices?: {
    error?: string;
    generated?: string;
    onboarding?: string;
    published?: string;
    saved?: string;
  };
  pageKey?: string;
  /** Active page path from ?path= query param (e.g. "/about", "/listings"). */
  previewPath?: string;
  userId: string;
};

export async function BuilderWorkspace({
  companyId,
  companyName,
  companySlug,
  mode = "page",
  notices,
  pageKey,
  previewPath,
  userId,
}: BuilderWorkspaceProps) {
  const prisma = createPrismaClient().db;
  const currentOrigin = await getBaseUrl();

  if (!prisma) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardContent className="p-8">
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>Builder is unavailable</EmptyTitle>
              <EmptyDescription>
                `DATABASE_URL` is not configured for the builder flow.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  const [
    company,
    activeDraft,
    publishedVersion,
    featuredProperties,
    agents,
    blogPosts,
    licensedTemplateKeys,
    onboarding,
  ] = await Promise.all([
    findCompanyById(prisma, companyId),
    resolveActiveDraftForCompany(prisma, companyId),
    resolvePublishedForCompany(prisma, companyId),
    listFeaturedProperties(prisma, companyId),
    listAgentsForCompany(prisma, companyId, { limit: 10 }),
    listBlogPostsForCompany(prisma, companyId, {
      limit: 24,
      status: "published",
    }),
    findLicensedTemplateKeys(prisma, companyId),
    findTenantOnboardingByUserId(prisma, userId),
  ]);

  if (!company) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardContent className="p-8">
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>Builder is unavailable</EmptyTitle>
              <EmptyDescription>
                We could not find this workspace right now.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  let resolvedActiveDraft = activeDraft;

  if (!resolvedActiveDraft) {
    const latestConfiguration = await prisma.siteConfiguration.findFirst({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      where: {
        companyId,
        deletedAt: null,
      },
    });

    if (publishedVersion) {
      await getOrCreateDraftVersion(prisma, {
        contentJson: publishedVersion.contentJson,
        createdById: userId,
        themeJson: publishedVersion.themeJson,
        websiteId: publishedVersion.websiteId,
      });
    } else if (latestConfiguration) {
      await upsertDraftWebsiteVersion(prisma, {
        companyId,
        contentJson: latestConfiguration.contentJson as Record<string, string>,
        createdById: userId,
        name: latestConfiguration.name,
        subdomain: companySlug,
        templateKey: latestConfiguration.templateKey,
        themeJson: latestConfiguration.themeJson as Record<string, string>,
        updatedById: userId,
      });
    } else {
      const starterTemplate = getTemplateDefinition("template-1");
      const initialSiteConfiguration = createInitialSiteConfigurationInput({
        companyName,
        market: companyName,
        subdomain: companySlug,
        templateKey: starterTemplate.key,
      });

      await upsertDraftWebsiteVersion(prisma, {
        ...initialSiteConfiguration,
        companyId,
        createdById: userId,
        updatedById: userId,
      });
    }

    resolvedActiveDraft = await resolveActiveDraftForCompany(prisma, companyId);
  }

  if (!resolvedActiveDraft) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardContent className="p-8">
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No template configuration yet</EmptyTitle>
              <EmptyDescription>
                No template configuration exists for this tenant yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  const configId = resolvedActiveDraft.id;
  const changedFieldCount = (() => {
    if (!publishedVersion) return undefined;
    const draftContent = resolvedActiveDraft.contentJson;
    const liveContent = publishedVersion.contentJson;
    const allKeys = new Set([
      ...Object.keys(draftContent),
      ...Object.keys(liveContent),
    ]);
    let count = 0;
    for (const key of allKeys) {
      if ((draftContent[key] ?? "") !== (liveContent[key] ?? "")) count++;
    }
    return count;
  })();

  const activeTemplateLabel =
    templateCatalog.find((t) => t.key === resolvedActiveDraft.templateKey)
      ?.name ?? resolvedActiveDraft.templateKey;
  const activeTemplate = getTemplateDefinition(resolvedActiveDraft.templateKey);
  const templateAccess = describeTemplateAccess(
    company.planTier as SubscriptionTier,
    activeTemplate.tier,
  );
  const currentTemplateLicensed = licensedTemplateKeys.has(
    resolvedActiveDraft.templateKey,
  );
  const isTemplateLocked = !currentTemplateLicensed && !templateAccess.allowed;
  const requiredPlanLabel = tierLabels[templateAccess.requiredTier];
  const lockedTemplateMessage = `${templateAccess.message} Upgrade to the ${requiredPlanLabel} plan before editing or publishing this template.`;
  const liveSiteUrl = buildTenantSiteUrl(companySlug, {
    currentOrigin,
  });
  const pageInventory = getTemplatePageInventory(
    resolvedActiveDraft.templateKey,
  );
  const availablePages: PageNavItem[] = pageInventory.pages.map((page) => ({
    label: page.label,
    pageKey: page.pageKey,
    slug: page.slug,
  }));
  const resolvedPageKey =
    pageKey ??
    (() => {
      if (!previewPath || previewPath === "/") return "home";
      const matched = pageInventory.pages.find(
        (page) => page.slug === previewPath,
      );
      return matched?.pageKey ?? "home";
    })();
  const selectedPage =
    availablePages.find((page) => page.pageKey === resolvedPageKey) ??
    availablePages[0];
  const selectedPageKey = selectedPage?.pageKey ?? "home";
  const selectedPageLabel = selectedPage?.label ?? "Home";
  const selectedPageSlug = selectedPage?.slug ?? "/";
  const currentPageLiveSiteUrl = selectedPageSlug.includes("[")
    ? liveSiteUrl
    : buildTenantSiteUrl(companySlug, {
        currentOrigin,
        pathname: selectedPageSlug,
      });

  const preview = resolveWebsitePresentation({
    companyName,
    content: resolvedActiveDraft.contentJson,
    liveAgents: agents.map((a) => ({
      bio: a.bio,
      id: a.id,
      imageUrl: a.imageUrl,
      name: a.name,
      title: a.title,
    })),
    liveBlogPosts: blogPosts.map((post) => ({
      content: post.content,
      excerpt: post.excerpt,
      featuredImageUrl: post.featuredImage,
      id: post.id,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      slug: post.slug,
      title: post.title,
    })),
    liveListings: featuredProperties.map((p) => ({
      id: p.id,
      imageUrl: p.imageUrl,
      location: p.location,
      price: p.price,
      specs: p.specs,
      title: p.title,
    })),
    market: companyName,
    pageKey: selectedPageKey,
    renderMode: "draft",
    subdomain: companySlug,
    templateKey: resolvedActiveDraft.templateKey,
    theme: resolvedActiveDraft.themeJson,
  });

  const templateConfig = deserializeTemplateConfig(
    resolvedActiveDraft.themeJson,
  );
  const sectionTypes = Array.from(
    new Set(
      preview.page.sections.map(
        ({ component: _component, ...rest }) => rest.type,
      ),
    ),
  );
  const isEmbedded = mode === "dashboard";

  return (
    <div className={isEmbedded ? "space-y-4" : "grid gap-3"}>
      {notices?.error ? (
        <Alert className="border-destructive/30 bg-destructive/10 text-foreground">
          <AlertDescription>{notices.error}</AlertDescription>
        </Alert>
      ) : null}

      {isTemplateLocked ? (
        <Alert className="border-amber-500/30 bg-amber-500/10 text-foreground">
          <AlertDescription className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span>
              <strong className="font-medium text-foreground">
                {activeTemplateLabel} is locked on your current plan.
              </strong>{" "}
              {lockedTemplateMessage}
            </span>
            <Button asChild size="sm">
              <Link href="/billing">Upgrade plan</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {(notices?.saved ||
        notices?.generated ||
        notices?.published ||
        notices?.onboarding) && (
        <Alert className="border-primary/20 bg-primary/10 text-foreground">
          <AlertDescription>
            {notices?.onboarding
              ? "Step 06 continues here. Configure your website look and text, then use Publish current configuration when you are ready to launch the live site."
              : notices?.published
                ? "The selected template is now published."
                : notices?.generated
                  ? "A smart-fill suggestion was applied to the field."
                  : "Your field update was saved."}
          </AlertDescription>
        </Alert>
      )}

      <div
        className={
          isEmbedded
            ? "grid gap-3 xl:grid-cols-[15rem_minmax(0,1fr)]"
            : "relative min-h-screen"
        }
      >
        {isEmbedded ? (
          <aside className="hidden xl:block">
            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
              <div className="border-b border-border/70 bg-[linear-gradient(180deg,hsl(var(--primary)/0.14),transparent)] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
                    Website config
                  </p>
                  <Badge variant="outline">Studio</Badge>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                <section className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2 rounded-lg border border-border/70 bg-muted/30 p-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        Active configuration
                      </p>
                      <p className="mt-1.5 text-sm font-semibold text-foreground">
                        {resolvedActiveDraft.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Version {resolvedActiveDraft.versionNumber ?? 1}
                      </p>
                    </div>
                    <Badge
                      variant={
                        resolvedActiveDraft.status === "published"
                          ? "default"
                          : "outline"
                      }
                    >
                      {resolvedActiveDraft.status}
                    </Badge>
                  </div>

                  <BuilderSidebarControls
                    activePageKey={selectedPageKey}
                    configId={configId}
                    currentTemplateKey={resolvedActiveDraft.templateKey}
                    licensedTemplateKeys={licensedTemplateKeys}
                    planTier={company.planTier as SubscriptionTier}
                    currentPageKey={selectedPageKey}
                    readOnly={isTemplateLocked}
                    readOnlyMessage={lockedTemplateMessage}
                    requiredPlan={templateAccess.requiredTier}
                    sectionTypes={sectionTypes}
                    templateConfig={templateConfig}
                    onCreateDraft={createTemplateDraftSilentAction}
                    onUpdateTheme={updateSiteThemeFieldAction}
                    onUpdateThemeSilent={updateSiteThemeFieldSilentAction}
                  />
                </section>

                <Separator />

                <section className="flex flex-col gap-1.5">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Editable fields
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Click any section in the preview to reveal its inline field
                    editor. Changes are saved per field.
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="outline">
                      {preview.editableFields.length} fields
                    </Badge>
                    <Badge variant="outline">
                      {preview.page.sections.length} sections
                    </Badge>
                  </div>
                </section>

                <Separator />

                <section className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    AI content
                  </p>
                  <GeneratePageContentButton
                    disabled={isTemplateLocked}
                    pageKey={selectedPageKey}
                  />
                </section>

                <Separator />

                <section className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Onboarding tools
                  </p>
                  <AiContentBootstrapButton disabled={isTemplateLocked} />
                  <RecommendTemplatePanel
                    currentBusinessType={onboarding?.businessType}
                    currentPrimaryGoal={onboarding?.primaryGoal}
                    currentStylePreference={onboarding?.stylePreference}
                    currentTone={onboarding?.tone}
                  />
                </section>
              </div>
            </div>
          </aside>
        ) : (
          <FloatingConfigPanel>
            <section className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2 rounded-lg border border-border/70 bg-muted/30 p-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Active configuration
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">
                    {resolvedActiveDraft.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Version {resolvedActiveDraft.versionNumber ?? 1}
                  </p>
                </div>
                <Badge
                  variant={
                    resolvedActiveDraft.status === "published"
                      ? "default"
                      : "outline"
                  }
                >
                  {resolvedActiveDraft.status}
                </Badge>
              </div>

              <BuilderSidebarControls
                activePageKey={selectedPageKey}
                configId={configId}
                currentTemplateKey={resolvedActiveDraft.templateKey}
                licensedTemplateKeys={licensedTemplateKeys}
                planTier={company.planTier as SubscriptionTier}
                currentPageKey={selectedPageKey}
                readOnly={isTemplateLocked}
                readOnlyMessage={lockedTemplateMessage}
                requiredPlan={templateAccess.requiredTier}
                sectionTypes={sectionTypes}
                templateConfig={templateConfig}
                onCreateDraft={createTemplateDraftSilentAction}
                onUpdateTheme={updateSiteThemeFieldAction}
                onUpdateThemeSilent={updateSiteThemeFieldSilentAction}
              />
            </section>

            <Separator />

            <section className="flex flex-col gap-1.5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Editable fields
              </p>
              <p className="text-xs leading-5 text-muted-foreground">
                Click any section in the preview to reveal its inline field
                editor. Changes are saved per field.
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge variant="outline">
                  {preview.editableFields.length} fields
                </Badge>
                <Badge variant="outline">
                  {preview.page.sections.length} sections
                </Badge>
              </div>
            </section>

            <Separator />

            <section className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                AI content
              </p>
              <GeneratePageContentButton
                disabled={isTemplateLocked}
                pageKey={selectedPageKey}
              />
            </section>

            <Separator />

            <section className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Onboarding tools
              </p>
              <AiContentBootstrapButton disabled={isTemplateLocked} />
              <RecommendTemplatePanel
                currentBusinessType={onboarding?.businessType}
                currentPrimaryGoal={onboarding?.primaryGoal}
                currentStylePreference={onboarding?.stylePreference}
                currentTone={onboarding?.tone}
              />
            </section>
          </FloatingConfigPanel>
        )}

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex flex-wrap items-center gap-2">
              <BuilderSidebarDrawer
                activeConfigName={resolvedActiveDraft.name}
                activePageKey={selectedPageKey}
                activeTemplateLabel={activeTemplateLabel}
                configId={configId}
                configStatus={resolvedActiveDraft.status}
                currentTemplateKey={resolvedActiveDraft.templateKey}
                editableFieldCount={preview.editableFields.length}
                licensedTemplateKeys={licensedTemplateKeys}
                planTier={company.planTier as SubscriptionTier}
                currentPageKey={selectedPageKey}
                readOnly={isTemplateLocked}
                readOnlyMessage={lockedTemplateMessage}
                requiredPlan={templateAccess.requiredTier}
                sectionCount={preview.page.sections.length}
                sectionTypes={sectionTypes}
                templateConfig={templateConfig}
                totalConfigurations={resolvedActiveDraft.versionNumber}
                onCreateDraft={createTemplateDraftSilentAction}
                onUpdateTheme={updateSiteThemeFieldAction}
                onUpdateThemeSilent={updateSiteThemeFieldSilentAction}
              />
              <Badge variant="outline">{selectedPageLabel}</Badge>
              {isEmbedded ? (
                <Badge variant="outline">Website builder</Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <PublishConfirmationDialog
                changedFieldCount={changedFieldCount}
                configId={configId}
                currentName={resolvedActiveDraft.name}
                disabled={isTemplateLocked}
                disabledReason={lockedTemplateMessage}
                onPublish={publishSiteConfigurationAction}
                templateLabel={activeTemplateLabel}
              />
              {notices?.onboarding ? (
                <Badge
                  className="border-primary/30 bg-primary/10 text-primary"
                  variant="outline"
                >
                  Final onboarding step
                </Badge>
              ) : null}
              {isEmbedded ? (
                <Button asChild variant="secondary">
                  <Link href="/builder">Open full builder</Link>
                </Button>
              ) : (
                <Button asChild variant="secondary">
                  <Link href="/">Back to dashboard</Link>
                </Button>
              )}
              <Button asChild>
                <Link
                  href={currentPageLiveSiteUrl || liveSiteUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open live site
                </Link>
              </Button>
            </div>
          </div>

          <BuilderPreviewPanel
            activePageKey={selectedPageKey}
            availablePages={availablePages}
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
            templateKey={resolvedActiveDraft.templateKey}
            theme={resolvedActiveDraft.themeJson}
            visibleSections={templateConfig.visibleSections}
            onSmartFill={smartFillFieldAction}
            onUpdateField={updateSiteFieldAction}
          />
        </section>
      </div>
    </div>
  );
}
