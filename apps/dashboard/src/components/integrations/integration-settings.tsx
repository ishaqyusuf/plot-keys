"use client";

import { CardContent, CardFooter } from "@plotkeys/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@plotkeys/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@plotkeys/ui/form";
import { Input } from "@plotkeys/ui/input";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { z } from "zod";

import { integrationSettings } from "@/components/integrations/integration-catalog";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const integrationFields = [
  "google-analytics",
  "facebook-pixel",
  "whatsapp",
  "calendly",
];

const integrationSettingsFormSchema = z.object({
  calendlyUrl: z.string(),
  facebookPixelId: z.string(),
  googleAnalyticsId: z.string(),
  whatsappPhone: z.string(),
});

export function IntegrationSettingsSkeleton() {
  return (
    <>
      <CardContent className="space-y-6">
        {integrationFields.map((field) => (
          <div className="border-b pb-5 last:border-b-0 last:pb-0" key={field}>
            <div className="flex items-start gap-3">
              <Skeleton className="mt-1 size-4 shrink-0" />
              <div className="grid flex-1 gap-2">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full max-w-md" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-9 w-36" />
      </CardFooter>
    </>
  );
}

export function IntegrationSettings() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: integration } = useSuspenseQuery(
    trpc.integrations.get.queryOptions(),
  );
  const form = useZodForm(integrationSettingsFormSchema, {
    defaultValues: {
      calendlyUrl: integration?.calendlyUrl ?? "",
      facebookPixelId: integration?.facebookPixelId ?? "",
      googleAnalyticsId: integration?.googleAnalyticsId ?? "",
      whatsappPhone: integration?.whatsappPhone ?? "",
    },
  });
  const updateIntegrationMutation = useMutation(
    trpc.integrations.update.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: trpc.integrations.get.queryKey(),
        });
      },
    }),
  );
  const onSubmit = form.handleSubmit((values) => {
    updateIntegrationMutation.mutate({
      calendlyUrl: values.calendlyUrl.trim() || null,
      facebookPixelId: values.facebookPixelId.trim() || null,
      googleAnalyticsId: values.googleAnalyticsId.trim() || null,
      whatsappPhone: values.whatsappPhone.trim() || null,
    });
  });

  return (
    <Form {...form}>
      <form className="contents" onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          {integrationSettings.map((item) => (
            <Field
              className="border-b pb-5 last:border-b-0 last:pb-0"
              key={item.field}
            >
              <div className="flex items-start gap-3">
                <item.icon className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <FieldContent className="gap-2">
                  <div className="space-y-1">
                    <FieldLabel htmlFor={item.field}>{item.name}</FieldLabel>
                    <FieldDescription>{item.description}</FieldDescription>
                  </div>
                  <FormField
                    control={form.control}
                    name={item.field}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect="off"
                            id={item.field}
                            placeholder={item.placeholder}
                            spellCheck="false"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FieldContent>
              </div>
            </Field>
          ))}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Leave a field blank to disconnect it from your public site.
          </p>
          <SubmitButton
            className="w-full shrink-0 sm:w-auto"
            isSubmitting={updateIntegrationMutation.isPending}
          >
            Save integrations
          </SubmitButton>
        </CardFooter>
      </form>
    </Form>
  );
}
