"use client";

import {
  buildTemplateSandboxProductionUrl,
  buildTemplateSandboxUrl,
} from "@plotkeys/utils";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  archiveTemplateSandboxProfileAction,
  cloneTemplateSandboxProfileAction,
  createTemplateSandboxProfileAction,
} from "../../app/actions";
import {
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "../dashboard/dashboard-page";
import { useTRPC } from "../../trpc/client";

type TemplateSandboxIndexProps = {
  currentOrigin: string;
};

const planOptions = ["starter", "plus", "pro"] as const;

export function TemplateSandboxIndex({
  currentOrigin,
}: TemplateSandboxIndexProps) {
  const trpc = useTRPC();
  const { data: profiles } = useSuspenseQuery(
    trpc.templateSandbox.list.queryOptions(),
  );
  const { data: catalog } = useSuspenseQuery(
    trpc.templateSandbox.catalog.queryOptions(),
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Template lab</DashboardPageEyebrow>
            <DashboardPageTitle>Sandbox websites</DashboardPageTitle>
            <DashboardPageDescription>
              Generate mock template profiles, configure them like tenant sites,
              and open stable preview URLs without publishing anything.
            </DashboardPageDescription>
          </DashboardPageIntro>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <div className="grid gap-4 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <Card className="border-border/65 bg-card/78">
          <CardHeader>
            <CardTitle>Configure template</CardTitle>
            <CardDescription>
              Create a saved sandbox profile from any registered template.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createTemplateSandboxProfileAction}>
              <FieldGroup className="space-y-4">
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input name="name" placeholder="Riwaq Lagos test" />
                </Field>
                <Field>
                  <FieldLabel>Template</FieldLabel>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    defaultValue={catalog[0]?.key}
                    name="templateKey"
                  >
                    {catalog.map((template) => (
                      <option key={template.key} value={template.key}>
                        {template.name} ({template.tier})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <FieldLabel>Mock company</FieldLabel>
                  <Input
                    defaultValue="Sandbox Estates"
                    name="companyName"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Market</FieldLabel>
                  <Input defaultValue="Lagos" name="market" />
                </Field>
                <Field>
                  <FieldLabel>Subdomain label</FieldLabel>
                  <Input defaultValue="sandbox-estates" name="subdomainLabel" />
                </Field>
                <Field>
                  <FieldLabel>Plan context</FieldLabel>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    defaultValue="starter"
                    name="planTier"
                  >
                    {planOptions.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </Field>
                <Button className="w-full" type="submit">
                  Generate sandbox
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <DashboardSection className="min-w-0">
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Generated websites</DashboardSectionTitle>
              <DashboardSectionDescription>
                Open, clone, archive, and debug saved sandbox profiles.
              </DashboardSectionDescription>
            </div>
            <Badge variant="outline">{profiles.length} profiles</Badge>
          </DashboardSectionHeader>

          <div className="grid gap-3">
            {profiles.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="px-6 py-10 text-sm text-muted-foreground">
                  No sandbox websites yet. Generate one from the form.
                </CardContent>
              </Card>
            ) : (
              profiles.map((profile) => {
                const template = catalog.find(
                  (item) => item.key === profile.templateKey,
                );
                const localUrl = buildTemplateSandboxUrl(profile.shareId, {
                  currentOrigin,
                });
                const productionUrl = buildTemplateSandboxProductionUrl(
                  profile.shareId,
                );

                return (
                  <Card
                    className="border-border/65 bg-card/78"
                    key={profile.id}
                  >
                    <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-base font-semibold text-foreground">
                            {profile.name}
                          </h2>
                          <Badge variant="outline">{profile.planTier}</Badge>
                          <Badge variant="secondary">
                            {template?.name ?? profile.templateKey}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {profile.companyName}
                          {profile.market ? ` · ${profile.market}` : ""}
                        </p>
                        <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                          <a
                            className="truncate hover:text-foreground"
                            href={localUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Local: {localUrl}
                          </a>
                          <a
                            className="truncate hover:text-foreground"
                            href={productionUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Production: {productionUrl}
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <Button asChild size="sm">
                          <Link href={`/template-sandbox/${profile.id}`}>
                            Configure
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <a href={localUrl} rel="noreferrer" target="_blank">
                            Preview
                          </a>
                        </Button>
                        <form action={cloneTemplateSandboxProfileAction}>
                          <input
                            name="profileId"
                            type="hidden"
                            value={profile.id}
                          />
                          <Button size="sm" type="submit" variant="outline">
                            Clone
                          </Button>
                        </form>
                        <form action={archiveTemplateSandboxProfileAction}>
                          <input
                            name="profileId"
                            type="hidden"
                            value={profile.id}
                          />
                          <Button
                            size="sm"
                            type="submit"
                            variant="destructive"
                          >
                            Archive
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}
