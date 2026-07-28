"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plotkeys/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";
import { PublishConfirmationActions } from "./publish-confirmation-actions";
import { PublishConfirmationDisabled } from "./publish-confirmation-disabled";
import { PublishConfirmationLiveNote } from "./publish-confirmation-live-note";
import { PublishConfirmationSummary } from "./publish-confirmation-summary";

type Props = {
  changedFieldCount?: number;
  configId: string;
  currentLiveName?: string;
  currentName: string;
  disabled?: boolean;
  disabledReason?: string;
  templateLabel?: string;
};

const publishConfirmationSchema = z.object({
  nextName: z.string().trim().min(1, "Configuration name is required."),
});

type PublishConfirmationValues = z.infer<typeof publishConfirmationSchema>;

export function PublishConfirmationDialog({
  changedFieldCount,
  configId,
  currentLiveName,
  currentName,
  disabled = false,
  disabledReason,
  templateLabel,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const publishMutation = useMutation(trpc.website.publish.mutationOptions());
  const form = useZodForm(publishConfirmationSchema, {
    defaultValues: {
      nextName: currentName,
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setErrorMessage(null);
      form.reset({
        nextName: currentName,
      });
    }

    setOpen(nextOpen);
  }

  async function handleSubmit(values: PublishConfirmationValues) {
    setErrorMessage(null);

    try {
      const result = await publishMutation.mutateAsync({
        configId,
        nextName: values.nextName,
      });
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("configId", result.configId);
      nextParams.delete("error");
      nextParams.delete("published");
      router.replace(`/builder?${nextParams.toString()}`);
      router.refresh();
      setOpen(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to publish template configuration.",
      );
    }
  }

  if (disabled) {
    return <PublishConfirmationDisabled disabledReason={disabledReason} />;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Publish current configuration</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[455px]">
        <div className="p-4 space-y-4">
          <DialogHeader>
            <DialogTitle>Publish configuration</DialogTitle>
            <DialogDescription>
              This will replace the currently live site with this configuration.
              The current live version will be archived.
            </DialogDescription>
          </DialogHeader>
          <PublishConfirmationSummary
            changedFieldCount={changedFieldCount}
            currentName={currentName}
            templateLabel={templateLabel}
          />
          <PublishConfirmationLiveNote currentLiveName={currentLiveName} />
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup className="py-2">
              <Field>
                <FieldLabel>Configuration name</FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="e.g. March refresh"
                  {...form.register("nextName")}
                />
              </Field>
            </FieldGroup>
            <PublishConfirmationActions
              form={form}
              onCancel={() => setOpen(false)}
              pending={publishMutation.isPending}
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
