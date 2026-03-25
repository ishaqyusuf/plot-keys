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
import { useRef, useState } from "react";
import { DevFormQuickFillButton } from "../dev/dev-form-quick-fill-button";

type PublishConfirmationDialogProps = {
  changedFieldCount?: number;
  configId: string;
  currentLiveName?: string;
  currentName: string;
  onPublish: (formData: FormData) => Promise<void>;
  templateLabel?: string;
};

export function PublishConfirmationDialog({
  changedFieldCount,
  configId,
  currentLiveName,
  currentName,
  onPublish,
  templateLabel,
}: PublishConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("configId", configId);
      formData.set("nextName", name);
      await onPublish(formData);
      setOpen(false);
    } finally {
      setPending(false);
    }
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

        <form
          data-dev-quick-fill-label="Publish configuration"
          data-dev-quick-fill-profile="publish-configuration"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <FieldGroup className="py-2">
            <Field>
              <FieldLabel>Configuration name</FieldLabel>
              <Input
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. March refresh"
                value={name}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DevFormQuickFillButton profile="publish-configuration" />
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
