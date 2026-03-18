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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { type ReactNode, useState } from "react";

type PropertyData = {
  bathrooms?: number | null;
  bedrooms?: number | null;
  description?: string | null;
  featured?: boolean;
  id?: string;
  imageUrl?: string | null;
  location: string;
  price?: string | null;
  specs?: string | null;
  status?: string;
  title: string;
};

type PropertyFormProps = {
  initialData?: PropertyData | null;
  onSave: (formData: FormData) => Promise<void>;
  trigger?: ReactNode;
};

export function PropertyForm({ initialData, onSave, trigger }: PropertyFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const isEdit = Boolean(initialData?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      if (initialData?.id) fd.set("propertyId", initialData.id);
      await onSave(fd);
      setOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">Add property</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit property" : "Add property"}</DialogTitle>
          <DialogDescription>
            Properties are shown in the featured listings section of your website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {isEdit && (
            <input type="hidden" name="_method" value="update" />
          )}
          <FieldGroup className="space-y-4 py-2">
            <Field>
              <FieldLabel>Title *</FieldLabel>
              <Input
                defaultValue={initialData?.title ?? ""}
                name="title"
                placeholder="3-bed family home in Ikoyi"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Location *</FieldLabel>
              <Input
                defaultValue={initialData?.location ?? ""}
                name="location"
                placeholder="Ikoyi, Lagos"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Price</FieldLabel>
                <Input
                  defaultValue={initialData?.price ?? ""}
                  name="price"
                  placeholder="NGN 450M"
                />
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  defaultValue={initialData?.status ?? "active"}
                  name="status"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="off_market">Off market</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Bedrooms</FieldLabel>
                <Input
                  defaultValue={initialData?.bedrooms ?? ""}
                  min="0"
                  name="bedrooms"
                  placeholder="3"
                  type="number"
                />
              </Field>
              <Field>
                <FieldLabel>Bathrooms</FieldLabel>
                <Input
                  defaultValue={initialData?.bathrooms ?? ""}
                  min="0"
                  name="bathrooms"
                  placeholder="2"
                  type="number"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Specs summary</FieldLabel>
              <Input
                defaultValue={initialData?.specs ?? ""}
                name="specs"
                placeholder="3 bed · 2 bath · pool · 450sqm"
              />
            </Field>
            <Field>
              <FieldLabel>Image URL</FieldLabel>
              <Input
                defaultValue={initialData?.imageUrl ?? ""}
                name="imageUrl"
                placeholder="https://..."
                type="url"
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
              {pending ? "Saving…" : isEdit ? "Save changes" : "Add property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
