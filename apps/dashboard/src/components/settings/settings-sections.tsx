"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@plotkeys/ui/form";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { z } from "zod";

import { LogoUploadForm } from "@/components/settings/logo-upload-form";
import {
  SettingsDangerAction,
  SettingsPlanCell,
  SettingsReadOnlyField,
} from "@/components/settings/settings-cells";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const companyNameFormSchema = z.object({
  name: z.string().trim().min(2).max(32),
});

const companyMarketFormSchema = z.object({
  market: z.string().max(120),
});

function useCompanySettings() {
  const trpc = useTRPC();
  const { data: company } = useSuspenseQuery(trpc.team.current.queryOptions());

  return company;
}

function useUpdateCompanyProfileMutation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.team.update.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: trpc.team.current.queryKey(),
        });
      },
    }),
  );
}

function SettingsCompanyNameCard({ canEdit }: { canEdit: boolean }) {
  const company = useCompanySettings();
  const updateProfileMutation = useUpdateCompanyProfileMutation();
  const form = useZodForm(companyNameFormSchema, {
    defaultValues: {
      name: company?.name ?? "",
    },
  });

  if (!company) {
    return null;
  }

  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company name</CardTitle>
          <CardDescription>
            This is your company's visible name within PlotKeys. For example,
            the name of your company or department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsReadOnlyField label="Company name">
            {company.name}
          </SettingsReadOnlyField>
        </CardContent>
        <CardFooter>Only owners and admins can edit this.</CardFooter>
      </Card>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateProfileMutation.mutate({ name: data.name });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Company name</CardTitle>
            <CardDescription>
              This is your company's visible name within PlotKeys. For example,
              the name of your company or department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="max-w-[300px]"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      maxLength={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>Please use 32 characters at maximum.</div>
            <SubmitButton isSubmitting={updateProfileMutation.isPending}>
              Save
            </SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function SettingsCompanyMarketCard({ canEdit }: { canEdit: boolean }) {
  const company = useCompanySettings();
  const updateProfileMutation = useUpdateCompanyProfileMutation();
  const form = useZodForm(companyMarketFormSchema, {
    defaultValues: {
      market: company?.market ?? "",
    },
  });

  if (!company) {
    return null;
  }

  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Primary market</CardTitle>
          <CardDescription>
            This is the market used as the default context across your
            workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsReadOnlyField label="Primary market">
            {company.market ?? "-"}
          </SettingsReadOnlyField>
        </CardContent>
        <CardFooter>Only owners and admins can edit this.</CardFooter>
      </Card>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateProfileMutation.mutate({ market: data.market.trim() || null });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Primary market</CardTitle>
            <CardDescription>
              This is the market used as the default context across your
              workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="max-w-[300px]"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton isSubmitting={updateProfileMutation.isPending}>
              Save
            </SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export function SettingsProfileCard({ canEdit }: { canEdit: boolean }) {
  return (
    <>
      <SettingsCompanyNameCard canEdit={canEdit} />
      <SettingsCompanyMarketCard canEdit={canEdit} />
    </>
  );
}

export function SettingsSections({ canEdit }: { canEdit: boolean }) {
  return (
    <div className="space-y-12">
      <SettingsProfileCard canEdit={canEdit} />
      <SettingsWorkspaceCard />
      <SettingsBrandingCard />
      {canEdit ? <SettingsDangerZone /> : null}
    </div>
  );
}

export function SettingsWorkspaceCard() {
  const company = useCompanySettings();

  if (!company) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
        <CardDescription>
          Read-only information about your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SettingsReadOnlyField label="Subdomain">
          {company.slug}
          <span className="font-normal text-muted-foreground">
            .plotkeys.com
          </span>
        </SettingsReadOnlyField>
        <SettingsPlanCell company={company} />
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Used when routing public tenant sites and billing entitlements.
        </p>
      </CardFooter>
    </Card>
  );
}

export function SettingsBrandingCard() {
  const company = useCompanySettings();

  if (!company) {
    return null;
  }

  return (
    <LogoUploadForm
      companyName={company.name}
      currentLogoUrl={company.logoUrl}
    />
  );
}

export function SettingsDangerZone() {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Delete workspace</CardTitle>
        <CardDescription>
          Permanently remove your workspace and all of its contents from
          PlotKeys. This action is not reversible, so please continue with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div />
        <SettingsDangerAction />
      </CardFooter>
    </Card>
  );
}
