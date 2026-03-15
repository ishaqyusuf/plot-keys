import { createPrismaClient } from "@plotkeys/db";
import type { HomeSectionDefinition } from "@plotkeys/section-registry";
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
import type { JSX } from "react";

import { BuilderSidebarControls } from "../../components/builder/builder-sidebar-controls";
import { requireOnboardedSession } from "../../lib/session";
import { publishSiteConfigurationAction } from "../actions";

function renderPreviewSection(
  section: HomeSectionDefinition,
  theme: ReturnType<typeof resolveWebsitePresentation>["theme"],
) {
  const SectionComponent = section.component as (props: {
    config: HomeSectionDefinition["config"];
    theme: typeof theme;
  }) => JSX.Element;

  return (
    <section className="group/section relative">
      <div className="pointer-events-none absolute inset-x-5 top-5 z-20 flex items-center justify-between gap-3 opacity-0 transition-opacity duration-200 group-hover/section:opacity-100">
        <div className="rounded-md border border-border/80 bg-background/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground shadow-sm backdrop-blur">
          Editable surface
        </div>
        <div className="rounded-md border border-border/80 bg-background/95 px-3 py-1 text-xs text-foreground shadow-sm backdrop-blur">
          Click to edit {"->"}
        </div>
      </div>
      <div className="transition-all duration-200 group-hover/section:ring-1 group-hover/section:ring-primary/25">
        <SectionComponent config={section.config} theme={theme} />
      </div>
    </section>
  );
}

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

  const preview = resolveWebsitePresentation({
    companyName: session.activeMembership.companyName,
    content: activeConfiguration.contentJson as Record<string, string>,
    market: session.activeMembership.companyName,
    subdomain:
      activeConfiguration.subdomain ?? session.activeMembership.companySlug,
    templateKey: activeConfiguration.templateKey,
    theme: activeConfiguration.themeJson as Record<string, string>,
  });

  return (
    <main className="min-h-screen bg-background px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto grid max-w-[118rem] gap-4 xl:grid-cols-[15.5rem_minmax(0,1fr)]">
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
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{preview.page.page}</Badge>
              <Badge variant="outline">
                {preview.page.sections.length} sections
              </Badge>
              <Badge variant="outline">
                {preview.editableFields.length} editable fields
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <form action={publishSiteConfigurationAction}>
                <input
                  name="configId"
                  type="hidden"
                  value={activeConfiguration.id}
                />
                <input
                  name="nextName"
                  type="hidden"
                  value={activeConfiguration.name}
                />
                <Button type="submit">Publish current configuration</Button>
              </form>
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

          <div className="mx-auto overflow-hidden rounded-xl border border-border/70 bg-background shadow-[0_30px_70px_-35px_hsl(var(--foreground)/0.45)]">
            <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-foreground/20" />
                <span className="size-2.5 rounded-full bg-foreground/20" />
                <span className="size-2.5 rounded-full bg-foreground/20" />
              </div>
              <p className="truncate text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {session.activeMembership.companySlug}.plotkeys.app /
                builder-preview
              </p>
            </div>

            <div className="max-h-[78vh] overflow-auto bg-muted/20 p-3 md:p-4">
              <div className="overflow-hidden rounded-lg border border-border/70 bg-background">
                {preview.page.sections.map((section) =>
                  renderPreviewSection(section, preview.theme),
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
