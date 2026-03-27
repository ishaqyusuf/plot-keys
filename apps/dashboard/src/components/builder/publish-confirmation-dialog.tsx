"use client";

import { Button } from "@plotkeys/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plotkeys/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useZodForm } from "../../hooks/use-zod-form";
import { DevFormQuickFillButton } from "../dev/dev-form-quick-fill-button";
import { createQuickFillAdapter, QuickFill } from "../dev/quick-fill";

type PublishConfirmationDialogProps = {
  changedFieldCount?: number;
  configId: string;
  currentLiveName?: string;
  currentName: string;
  disabled?: boolean;
  disabledReason?: string;
  onPublish: (formData: FormData) => Promise<void>;
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
  onPublish,
  templateLabel,
}: PublishConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const form = useZodForm(publishConfirmationSchema, {
    defaultValues: {
      nextName: currentName,
    },
  });

  async function handleSubmit(values: PublishConfirmationValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("configId", configId);
      formData.set("nextName", values.nextName);
      await onPublish(formData);
      setOpen(false);
    } finally {
      setPending(false);
    }
  }

  const quickFill = new QuickFill(createQuickFillAdapter(form));

  if (disabled) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled>Publish current configuration</Button>
        <Button asChild variant="outline">
          <Link href="/billing">Upgrade plan</Link>
        </Button>
        {disabledReason ? (
          <p className="basis-full text-xs text-muted-foreground">
            {disabledReason}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>Publish current configuration</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish configuration</DialogTitle>
          <DialogDescription>
            This will replace the currently live site with this configuration.
            The current live version will be archived.
          </DialogDescription>
        </DialogHeader>

        {/* What goes live */}
        <div className="rounded-md border border-border bg-muted/30 p-4 text-sm space-y-2">
          <p className="font-medium text-foreground">What goes live</p>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
            <span className="text-foreground">Configuration</span>
            <span>{currentName || "Untitled draft"}</span>
            {templateLabel && (
              <>
                <span className="text-foreground">Template</span>
                <span>{templateLabel}</span>
              </>
            )}
            {changedFieldCount !== undefined && (
              <>
                <span className="text-foreground">Changes</span>
                <span>
                  {changedFieldCount === 0
                    ? "No fields changed since last publish"
                    : `${changedFieldCount} field${changedFieldCount !== 1 ? "s" : ""} changed since last publish`}
                </span>
              </>
            )}
          </div>
        </div>

        {currentLiveName && (
          <p className="text-xs text-muted-foreground">
            Currently live:{" "}
            <span className="font-medium text-foreground">
              {currentLiveName}
            </span>{" "}
            — it will be archived and can be re-published from the configuration
            list.
          </p>
        )}

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
          <DialogFooter className="mt-4 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DevFormQuickFillButton
              onFill={() => quickFill.publishConfiguration()}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={pending} type="submit">
                {pending ? "Publishing…" : "Publish now"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
