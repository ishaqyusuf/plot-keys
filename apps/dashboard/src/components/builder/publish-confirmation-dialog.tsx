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

type PublishConfirmationDialogProps = {
  configId: string;
  currentName: string;
  onPublish: (formData: FormData) => Promise<void>;
};

export function PublishConfirmationDialog({
  configId,
  currentName,
  onPublish,
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
        <form onSubmit={handleSubmit} ref={formRef}>
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
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              {pending ? "Publishing…" : "Publish now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
