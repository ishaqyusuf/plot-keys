import { createPrismaClient } from "@plotkeys/db";
import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import {
  resolveWebsitePresentation,
  templateCatalog,
} from "@plotkeys/section-registry";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
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
        <Card className="mx-auto max-w-3xl p-8">
          <p className="text-lg text-slate-700">
            DATABASE_URL is not configured for the builder flow.
          </p>
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
        <Card className="mx-auto max-w-3xl p-8">
          <p className="text-lg text-slate-700">
            No template configuration exists for this tenant yet.
          </p>
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
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Template builder
            </p>
            <h1 className="mt-2 font-serif text-4xl text-slate-950">
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
          <Alert className="mb-6" variant="success">
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
          <Card className="bg-white/90">
            <div className="p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                Templates
              </p>
              <div className="mt-4 grid gap-3">
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
                          ? "border-teal-300 bg-teal-50"
                          : "border-[color:var(--border)] bg-white hover:bg-slate-50"
                      }`}
                      type="submit"
                    >
                      <p className="font-semibold text-slate-950">
                        {template.name}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {template.description}
                      </p>
                    </button>
                  </form>
                ))}
              </div>

              <p className="mt-6 text-sm uppercase tracking-[0.28em] text-slate-500">
                Configurations
              </p>
              <div className="mt-4 grid gap-3">
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
                          ? "border-slate-900 bg-slate-950 text-white"
                          : "border-[color:var(--border)] bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                      type="submit"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{configuration.name}</p>
                        <Badge
                          variant={
                            configuration.status === "published"
                              ? "success"
                              : "neutral"
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
            </div>
          </Card>

          <Card className="overflow-hidden bg-white/82">
            <div className="border-b border-[color:var(--border)] px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                    Previewing
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    {activeConfiguration.name}
                  </p>
                </div>
                <Badge variant="primary">{preview.template.name}</Badge>
              </div>
            </div>
            <div className="max-h-[80vh] overflow-auto bg-slate-50/70 p-4">
              <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-white shadow-[var(--shadow-soft)]">
                {preview.page.sections.map((section) =>
                  renderPreviewSection(section, preview.theme),
                )}
              </div>
            </div>
          </Card>

          <Card className="bg-white/90">
            <div className="p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                Content editor
              </p>
              <div className="mt-4 grid gap-4">
                {preview.editableFields.map((field) => (
                  <div
                    key={field.contentKey}
                    className="rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-slate-50/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-950">
                        {field.label}
                      </p>
                      <Badge variant="neutral">{field.fieldType}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {field.shortDetail}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {field.longDetail}
                    </p>
                    {field.preferredLength ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                        Preferred length: {field.preferredLength}
                      </p>
                    ) : null}
                    <form
                      action={updateSiteFieldAction}
                      className="mt-4 grid gap-3"
                    >
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
                          name="value"
                        />
                      )}
                      <div className="flex flex-col gap-2">
                        <Button type="submit">Save field</Button>
                      </div>
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

              <form
                action={publishSiteConfigurationAction}
                className="mt-6 grid gap-3"
              >
                <input
                  name="configId"
                  type="hidden"
                  value={activeConfiguration.id}
                />
                <div className="grid gap-2">
                  <Label htmlFor="publish-name">
                    New template name before publish
                  </Label>
                  <Input
                    defaultValue={activeConfiguration.name}
                    id="publish-name"
                    name="nextName"
                    placeholder="Template launch name"
                  />
                </div>
                <Button type="submit">
                  Publish and replace current live site
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
