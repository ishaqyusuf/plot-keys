import { createPrismaClient } from "@plotkeys/db";
import {
  deserializeTemplateConfig,
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
import Link from "next/link";

import { ThemeToggle } from "@plotkeys/ui/theme-toggle";

import { BuilderPreviewPanel } from "../../components/builder/builder-preview-panel";
import { BuilderSidebarControls } from "../../components/builder/builder-sidebar-controls";
import { BuilderSidebarDrawer } from "../../components/builder/builder-sidebar-drawer";
import { PublishConfirmationDialog } from "../../components/builder/publish-confirmation-dialog";
import { requireOnboardedSession } from "../../lib/session";
import {
  createTemplateDraftAction,
  publishSiteConfigurationAction,
  smartFillFieldAction,
  updateSiteFieldAction,
  updateSiteThemeFieldAction,
  updateSiteThemeFieldSilentAction,
} from "../actions";

type BuilderPageProps = {
  searchParams?: Promise<{
    configId?: string;
    generated?: string;
    published?: string;
    saved?: string;
  }>;
};

export default async function BuilderPage({ searchParams }: BuilderPageProps) {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  if (!prisma) {
    return (
      <main className="min-h-screen p-8">
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
      </main>
    );
  }

  const params = (await searchParams) ?? {};
  const configurations = await prisma.siteConfiguration.findMany({
    orderBy: [
      {
        status: "asc",
      },
      {
        updatedAt: "desc",
      },
    ],
    where: {
      companyId: session.activeMembership.companyId,
      deletedAt: null,
    },
  });

  const activeConfiguration =
    configurations.find(
      (configuration) => configuration.id === params.configId,
    ) ??
    configurations.find(
      (configuration) => configuration.status === "published",
    ) ??
    configurations[0];

  if (!activeConfiguration) {
    return (
      <main className="min-h-screen p-8">
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
      </main>
    );
  }

  const publishedConfiguration = configurations.find(
    (c) => c.status === "published" && c.id !== activeConfiguration.id,
  );

  // Count fields that differ between this draft and the currently-published config.
  const changedFieldCount = (() => {
    if (!publishedConfiguration) return undefined;
    const draftContent = activeConfiguration.contentJson as Record<
      string,
      string
    >;
    const liveContent = publishedConfiguration.contentJson as Record<
      string,
      string
    >;
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
    templateCatalog.find((t) => t.key === activeConfiguration.templateKey)
      ?.name ?? activeConfiguration.templateKey;

  const preview = resolveWebsitePresentation({
    companyName: session.activeMembership.companyName,
    content: activeConfiguration.contentJson as Record<string, string>,
    market: session.activeMembership.companyName,
    renderMode: "draft",
    subdomain:
      activeConfiguration.subdomain ?? session.activeMembership.companySlug,
    templateKey: activeConfiguration.templateKey,
    theme: activeConfiguration.themeJson as Record<string, string>,
  });

  return (
    <main className="min-h-screen bg-background px-2 py-2 md:px-3 md:py-3">
      <div className="mx-auto grid max-w-464 gap-3 xl:grid-cols-[14rem_minmax(0,1fr)]">
        {(params.saved || params.generated || params.published) && (
          <Alert className="xl:col-start-2 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>
              {params.published
                ? "The selected template is now published."
                : params.generated
                  ? "A smart-fill suggestion was applied to the field."
                  : "Your field update was saved."}
            </AlertDescription>
          </Alert>
        )}

        <aside className="hidden xl:sticky xl:top-3 xl:block xl:h-[calc(100svh-1.5rem)]">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-(--shadow-soft)">
            <div className="border-b border-border/70 bg-[linear-gradient(180deg,hsl(var(--primary)/0.14),transparent)] px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
                  Builder setup
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
                      {activeConfiguration.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {configurations.length} saved configurations
                    </p>
                  </div>
                  <Badge
                    variant={
                      activeConfiguration.status === "published"
                        ? "default"
                        : "outline"
                    }
                  >
                    {activeConfiguration.status}
                  </Badge>
                </div>

                <BuilderSidebarControls
                  configId={activeConfiguration.id}
                  currentTemplateKey={activeConfiguration.templateKey}
                  sectionTypes={preview.page.sections.map(
                    ({ component: _c, ...rest }) => rest.type,
                  )}
                  templateConfig={deserializeTemplateConfig(
                    activeConfiguration.themeJson as Record<string, string>,
                  )}
                  onCreateDraft={createTemplateDraftAction}
                  onUpdateTheme={updateSiteThemeFieldAction}
                  onUpdateThemeSilent={updateSiteThemeFieldSilentAction}
                />
              </section>

              <Separator />

              <section className="flex flex-col gap-1.5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Editable fields
                </p>
                <p className="text-xs text-muted-foreground leading-5">
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
            </div>
          </div>
        </aside>

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex flex-wrap items-center gap-2">
              <BuilderSidebarDrawer
                activeConfigName={activeConfiguration.name}
                activeTemplateLabel={activeTemplateLabel}
                configId={activeConfiguration.id}
                configStatus={activeConfiguration.status}
                currentTemplateKey={activeConfiguration.templateKey}
                editableFieldCount={preview.editableFields.length}
                sectionCount={preview.page.sections.length}
                sectionTypes={preview.page.sections.map(
                  ({ component: _c, ...rest }) => rest.type,
                )}
                templateConfig={deserializeTemplateConfig(
                  activeConfiguration.themeJson as Record<string, string>,
                )}
                totalConfigurations={configurations.length}
                onCreateDraft={createTemplateDraftAction}
                onUpdateTheme={updateSiteThemeFieldAction}
                onUpdateThemeSilent={updateSiteThemeFieldSilentAction}
              />
              <Badge variant="outline">{preview.page.pageKey}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <PublishConfirmationDialog
                changedFieldCount={changedFieldCount}
                configId={activeConfiguration.id}
                currentName={activeConfiguration.name}
                onPublish={publishSiteConfigurationAction}
              />
              <Button asChild variant="secondary">
                <Link href="/">Back to dashboard</Link>
              </Button>
              <Button asChild>
                <Link
                  href={`/live?subdomain=${session.activeMembership.companySlug}`}
                >
                  Open live site
                </Link>
              </Button>
            </div>
          </div>

          <BuilderPreviewPanel
            companySlug={session.activeMembership.companySlug}
            configId={activeConfiguration.id}
            defaultContent={preview.template.defaultContent}
            editableFields={preview.editableFields}
            sections={preview.page.sections.map(
              ({ component: _c, ...rest }) => rest,
            )}
            theme={activeConfiguration.themeJson as Record<string, string>}
            visibleSections={
              deserializeTemplateConfig(
                activeConfiguration.themeJson as Record<string, string>,
              ).visibleSections
            }
            onSmartFill={smartFillFieldAction}
            onUpdateField={updateSiteFieldAction}
          />
        </section>
      </div>
    </main>
  );
}
