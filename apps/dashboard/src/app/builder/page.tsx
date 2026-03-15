import { createPrismaClient } from "@plotkeys/db";
import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import {
  resolveWebsitePresentation,
  templateCatalog,
} from "@plotkeys/section-registry";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@plotkeys/ui/empty";
import { Input } from "@plotkeys/ui/input";
import { Textarea } from "@plotkeys/ui/textarea";
import Link from "next/link";
import type { JSX } from "react";
import { requireOnboardedSession } from "../../lib/session";
import {
  createTemplateDraftAction,
  publishSiteConfigurationAction,
  smartFillFieldAction,
  switchBuilderConfigurationAction,
  updateSiteFieldAction,
} from "../actions";

function renderPreviewSection(
  section: HomeSectionDefinition,
  theme: ReturnType<typeof resolveWebsitePresentation>["theme"],
) {
  const SectionComponent = section.component as (props: {
    config: HomeSectionDefinition["config"];
    theme: typeof theme;
  }) => JSX.Element;

  return (
    <SectionComponent key={section.id} config={section.config} theme={theme} />
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
    <main className="min-h-screen px-6 py-10 md:px-8">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">
              Template builder
            </p>
            <h1 className="mt-2 font-serif text-4xl text-foreground">
              Edit, switch, and publish tenant templates.
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
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

        {(params.saved || params.generated || params.published) && (
          <Alert className="mb-6 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>
              {params.published
                ? "The selected template is now published."
                : params.generated
                  ? "A smart-fill suggestion was applied to the field."
                  : "Your field update was saved."}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 xl:grid-cols-[18rem_1fr_23rem]">
          <Card className="bg-card">
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 px-6 pb-6">
              <div className="grid gap-3">
                {templateCatalog.map((template) => (
                  <form action={createTemplateDraftAction} key={template.key}>
                    <input
                      name="templateKey"
                      type="hidden"
                      value={template.key}
                    />
                    <button
                      className={`w-full rounded-md border px-4 py-4 text-left transition-colors ${
                        activeConfiguration.templateKey === template.key
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                      type="submit"
                    >
                      <p className="font-semibold text-foreground">
                        {template.name}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {template.description}
                      </p>
                    </button>
                  </form>
                ))}
              </div>

              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                Configurations
              </p>
              <div className="grid gap-3">
                {configurations.map((configuration) => (
                  <form
                    action={switchBuilderConfigurationAction}
                    key={configuration.id}
                  >
                    <input
                      name="configId"
                      type="hidden"
                      value={configuration.id}
                    />
                    <button
                      className={`w-full rounded-md border px-4 py-4 text-left transition-colors ${
                        activeConfiguration.id === configuration.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-foreground hover:bg-muted/50"
                      }`}
                      type="submit"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{configuration.name}</p>
                        <Badge
                          variant={
                            configuration.status === "published"
                              ? "default"
                              : "outline"
                          }
                        >
                          {configuration.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm opacity-80">
                        {configuration.templateKey}
                      </p>
                    </button>
                  </form>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-card">
            <CardHeader className="border-b px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                    Previewing
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {activeConfiguration.name}
                  </p>
                </div>
                <Badge variant="default">{preview.template.name}</Badge>
              </div>
            </CardHeader>
            <CardContent className="max-h-[80vh] overflow-auto bg-muted/40 p-4">
              <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-background shadow-[var(--shadow-soft)]">
                {preview.page.sections.map((section) =>
                  renderPreviewSection(section, preview.theme),
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                Content editor
              </CardTitle>
              <CardDescription>
                Update editable fields and publish a new tenant site version
                when the copy is ready.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 px-6 pb-6">
              <div className="grid gap-4">
                {preview.editableFields.map((field) => (
                  <div
                    key={field.contentKey}
                    className="rounded-[var(--radius-sm)] border border-border bg-muted/40 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">
                        {field.label}
                      </p>
                      <Badge variant="outline">{field.fieldType}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {field.shortDetail}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {field.longDetail}
                    </p>
                    {field.preferredLength ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        Preferred length: {field.preferredLength}
                      </p>
                    ) : null}
                    <form action={updateSiteFieldAction} className="mt-4">
                      <input
                        name="configId"
                        type="hidden"
                        value={activeConfiguration.id}
                      />
                      <input
                        name="contentKey"
                        type="hidden"
                        value={field.contentKey}
                      />
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor={`${field.contentKey}-value`}>
                            {field.label}
                          </FieldLabel>
                          {field.fieldType === "textarea" ? (
                            <Textarea
                              className="min-h-28"
                              defaultValue={
                                (
                                  activeConfiguration.contentJson as Record<
                                    string,
                                    string
                                  >
                                )[field.contentKey] ?? ""
                              }
                              id={`${field.contentKey}-value`}
                              name="value"
                            />
                          ) : (
                            <Input
                              defaultValue={
                                (
                                  activeConfiguration.contentJson as Record<
                                    string,
                                    string
                                  >
                                )[field.contentKey] ?? ""
                              }
                              id={`${field.contentKey}-value`}
                              name="value"
                            />
                          )}
                          <FieldDescription>
                            {field.shortDetail}
                          </FieldDescription>
                        </Field>
                        <Button type="submit">Save field</Button>
                      </FieldGroup>
                    </form>
                    {field.aiEnabled ? (
                      <form action={smartFillFieldAction} className="mt-2">
                        <input
                          name="configId"
                          type="hidden"
                          value={activeConfiguration.id}
                        />
                        <input
                          name="contentKey"
                          type="hidden"
                          value={field.contentKey}
                        />
                        <input
                          name="shortDetail"
                          type="hidden"
                          value={field.shortDetail}
                        />
                        <Button type="submit" variant="ghost">
                          Smart-fill from guidance
                        </Button>
                      </form>
                    ) : null}
                  </div>
                ))}
              </div>

              <form action={publishSiteConfigurationAction}>
                <input
                  name="configId"
                  type="hidden"
                  value={activeConfiguration.id}
                />
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="publish-name">
                      New template name before publish
                    </FieldLabel>
                    <Input
                      defaultValue={activeConfiguration.name}
                      id="publish-name"
                      name="nextName"
                      placeholder="Template launch name"
                    />
                    <FieldDescription>
                      This name becomes the new live configuration label after
                      publishing.
                    </FieldDescription>
                  </Field>
                  <Button type="submit">
                    Publish and replace current live site
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
