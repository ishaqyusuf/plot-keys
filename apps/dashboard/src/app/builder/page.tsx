import { createPrismaClient } from "@plotkeys/db";
import { resolveWebsitePresentation } from "@plotkeys/section-registry";
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

import { BuilderPreviewPanel } from "../../components/builder/builder-preview-panel";
import { BuilderSidebarControls } from "../../components/builder/builder-sidebar-controls";
import { PublishConfirmationDialog } from "../../components/builder/publish-confirmation-dialog";
import { requireOnboardedSession } from "../../lib/session";
import {
  publishSiteConfigurationAction,
  smartFillFieldAction,
  updateSiteFieldAction,
} from "../actions";

type BuilderPageProps = {
  searchParams?: Promise<{
    configId?: string;
    generated?: string;
    /** Present when landing directly from onboarding completion. */
    onboarded?: string;
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
    <main className="min-h-screen bg-background px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto grid max-w-[118rem] gap-4 xl:grid-cols-[15.5rem_minmax(0,1fr)]">
        {params.onboarded && (
          <div className="xl:col-start-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
            <p className="font-semibold">Your workspace is ready 🎉</p>
            <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">
              Your first website draft has been created using your onboarding preferences.
              Browse sections, edit copy, and publish when you&apos;re happy.
            </p>
          </div>
        )}
        {!params.onboarded && (params.saved || params.generated || params.published) && (
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

        <aside className="xl:sticky xl:top-4 xl:h-[calc(100svh-2rem)]">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
            <div className="border-b border-border/70 bg-[linear-gradient(180deg,hsl(var(--primary)/0.14),transparent)] px-6 py-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
                  Builder setup
                </p>
                <Badge variant="outline">Studio</Badge>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Active configuration
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {activeConfiguration.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
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
                  currentTemplateKey={activeConfiguration.templateKey}
                />
              </section>

              <Separator />

              <section className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Editable fields
                </p>
                <p className="text-xs text-muted-foreground leading-5">
                  Click any section in the preview to reveal its inline field
                  editor. Changes are saved per field.
                </p>
                <div className="mt-2 flex items-center gap-2">
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

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{preview.page.page}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PublishConfirmationDialog
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
            editableFields={preview.editableFields}
            onSmartFill={smartFillFieldAction}
            onUpdateField={updateSiteFieldAction}
            preview={preview}
          />
        </section>
      </div>
    </main>
  );
}
