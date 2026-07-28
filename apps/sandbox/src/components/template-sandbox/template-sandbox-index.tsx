"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import {
  buildTemplateSandboxProductionUrl,
  buildTemplateSandboxUrl,
  normalizeSubdomainLabel,
} from "@plotkeys/utils";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useTransition } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useTRPC } from "@/trpc/client";

type Props = {
  administrator: {
    email: string;
    name: string | null;
  };
  currentOrigin: string;
};

const planOptions = ["starter", "plus", "pro"] as const;

export function TemplateSandboxIndex({ administrator, currentOrigin }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isCreating, startCreateTransition] = useTransition();
  const { data: profiles } = useSuspenseQuery(
    trpc.templateSandbox.list.queryOptions(),
  );
  const { data: catalog } = useSuspenseQuery(
    trpc.templateSandbox.catalog.queryOptions(),
  );
  const invalidateProfiles = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.templateSandbox.list.queryKey(),
    });
  const createMutation = useMutation(
    trpc.templateSandbox.create.mutationOptions({
      onSuccess: async (profile) => {
        await invalidateProfiles();
        router.push(`/profiles/${profile.id}`);
      },
    }),
  );
  const cloneMutation = useMutation(
    trpc.templateSandbox.clone.mutationOptions({
      onSuccess: async (profile) => {
        await invalidateProfiles();
        router.push(`/profiles/${profile.id}`);
      },
    }),
  );
  const archiveMutation = useMutation(
    trpc.templateSandbox.archive.mutationOptions({
      onSuccess: async () => {
        await invalidateProfiles();
        router.refresh();
      },
    }),
  );
  const archivingProfileId = archiveMutation.isPending
    ? archiveMutation.variables?.profileId
    : null;
  const cloningProfileId = cloneMutation.isPending
    ? cloneMutation.variables?.profileId
    : null;

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startCreateTransition(async () => {
      await createMutation.mutateAsync({
        companyName: String(formData.get("companyName") ?? "Sandbox Homes"),
        market: String(formData.get("market") ?? "Lagos"),
        name: String(formData.get("name") ?? "").trim() || undefined,
        planTier: String(formData.get("planTier") ?? "starter") as
          | "starter"
          | "plus"
          | "pro",
        subdomainLabel: normalizeSubdomainLabel(
          String(formData.get("subdomainLabel") ?? "sandbox"),
        ),
        templateKey: String(formData.get("templateKey") ?? "riwaq-starter"),
      });
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-start">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-foreground">Sandbox</h1>
            <Badge variant="secondary">
              {currentOrigin.includes("localhost") ? "Local" : "Hosted"}
            </Badge>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Generate mock template profiles, configure them like tenant sites,
            and open stable preview URLs without creating production records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs sm:block">
            <p className="font-medium text-foreground">
              {administrator.name ?? "Platform administrator"}
            </p>
            <p className="text-muted-foreground">{administrator.email}</p>
          </div>
          <SignOutButton />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 border bg-background p-4">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Configure template
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a saved sandbox profile from any registered template.
            </p>
          </div>
          <form onSubmit={handleCreate}>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input name="name" placeholder="Riwaq Lagos test" />
              </Field>
              <Field>
                <FieldLabel>Template</FieldLabel>
                <Select defaultValue={catalog[0]?.key} name="templateKey">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalog.map((template) => (
                      <SelectItem key={template.key} value={template.key}>
                        {template.name} ({template.tier})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select defaultValue="starter" name="planTier">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {planOptions.map((plan) => (
                      <SelectItem key={plan} value={plan}>
                        {plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <SubmitButton
                className="w-full"
                isSubmitting={isCreating || createMutation.isPending}
              >
                Generate sandbox
              </SubmitButton>
              {createMutation.error ? (
                <p className="text-sm text-destructive" role="alert">
                  {createMutation.error.message}
                </p>
              ) : null}
            </FieldGroup>
          </form>
        </div>

        <section className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-foreground">
                Generated websites
              </h2>
              <p className="text-sm text-muted-foreground">
                Open, clone, archive, and debug saved sandbox profiles.
              </p>
            </div>
            <Badge variant="outline">{profiles.length} profiles</Badge>
          </div>

          <div className="grid gap-3">
            {profiles.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center bg-background px-6 py-10 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  No sandbox websites yet
                </h3>
                <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                  Generate one from the form to preview, clone, archive, and
                  debug a saved sandbox profile.
                </p>
              </div>
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
                  <article
                    className="grid gap-4 border bg-background p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
                    key={profile.id}
                  >
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
                      <p className="mt-1 text-xs text-muted-foreground">
                        Updated {new Date(profile.updatedAt).toLocaleString()}
                      </p>
                      <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                        <a
                          className="truncate hover:text-foreground"
                          href={localUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Preview: {localUrl}
                        </a>
                        <a
                          className="truncate hover:text-foreground"
                          href={productionUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Canonical hosted URL: {productionUrl}
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <Button size="sm" asChild>
                        <Link href={`/profiles/${profile.id}`}>Configure</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={localUrl} rel="noreferrer" target="_blank">
                          Preview
                        </a>
                      </Button>
                      <SubmitButton
                        disabled={cloneMutation.isPending}
                        isSubmitting={cloningProfileId === profile.id}
                        onClick={() =>
                          cloneMutation.mutate({ profileId: profile.id })
                        }
                        variant="outline"
                        size="sm"
                      >
                        Clone
                      </SubmitButton>
                      <SubmitButton
                        disabled={archiveMutation.isPending}
                        isSubmitting={archivingProfileId === profile.id}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Archive “${profile.name}”? Existing preview links will stop resolving.`,
                            )
                          ) {
                            archiveMutation.mutate({ profileId: profile.id });
                          }
                        }}
                        variant="destructive"
                        size="sm"
                      >
                        Archive
                      </SubmitButton>
                      {cloneMutation.error &&
                      cloneMutation.variables?.profileId === profile.id ? (
                        <p className="w-full text-xs text-destructive">
                          {cloneMutation.error.message}
                        </p>
                      ) : null}
                      {archiveMutation.error &&
                      archiveMutation.variables?.profileId === profile.id ? (
                        <p className="w-full text-xs text-destructive">
                          {archiveMutation.error.message}
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
