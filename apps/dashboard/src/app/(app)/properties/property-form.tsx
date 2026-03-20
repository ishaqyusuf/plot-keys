"use client";

import { Button } from "@plotkeys/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plotkeys/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useState, useTransition } from "react";
import { createPropertyAction, updatePropertyAction } from "../../actions";

type Property = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  location: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  specs: string | null;
  imageUrl: string | null;
  status: string;
  featured: boolean;
};

type PropertyFormProps =
  | { mode: "create" }
  | { mode: "edit"; property: Property };

export function PropertyForm(props: PropertyFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const property = props.mode === "edit" ? props.property : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (props.mode === "edit") {
        await updatePropertyAction(formData);
      } else {
        await createPropertyAction(formData);
      }
      setOpen(false);
    });
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant={props.mode === "create" ? "default" : "outline"}>
          {props.mode === "create" ? "Add property" : "Edit"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "Add property" : "Edit property"}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {property && (
            <input name="propertyId" type="hidden" value={property.id} />
          )}

          <FieldGroup>
            <Field>
              <FieldLabel>Title *</FieldLabel>
              <Input
                defaultValue={property?.title ?? ""}
                name="title"
                placeholder="e.g. 3-Bedroom Detached, Lekki Phase 1"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Price</FieldLabel>
              <Input
                defaultValue={property?.price ?? ""}
                name="price"
                placeholder="e.g. ₦45,000,000"
              />
            </Field>

            <Field>
              <FieldLabel>Location</FieldLabel>
              <Input
                defaultValue={property?.location ?? ""}
                name="location"
                placeholder="e.g. Lekki Phase 1, Lagos"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Bedrooms</FieldLabel>
                <Input
                  defaultValue={property?.bedrooms ?? ""}
                  min={0}
                  name="bedrooms"
                  placeholder="3"
                  type="number"
                />
              </Field>
              <Field>
                <FieldLabel>Bathrooms</FieldLabel>
                <Input
                  defaultValue={property?.bathrooms ?? ""}
                  min={0}
                  name="bathrooms"
                  placeholder="2"
                  type="number"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Specs / highlights</FieldLabel>
              <Input
                defaultValue={property?.specs ?? ""}
                name="specs"
                placeholder="e.g. 3 bed · 2 bath · 200sqm"
              />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input
                defaultValue={property?.description ?? ""}
                name="description"
                placeholder="Short property description…"
              />
            </Field>

            <Field>
              <FieldLabel>Image URL</FieldLabel>
              <Input
                defaultValue={property?.imageUrl ?? ""}
                name="imageUrl"
                placeholder="https://…"
                type="url"
              />
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={property?.status ?? "active"}
                name="status"
              >
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="off_market">Off market</option>
              </select>
            </Field>

            <Field>
              <FieldLabel>Featured</FieldLabel>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={property?.featured ? "true" : "false"}
                name="featured"
              >
                <option value="false">No</option>
                <option value="true">Yes — show on homepage</option>
              </select>
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={() => setOpen(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={pending} type="submit">
              {pending
                ? props.mode === "create"
                  ? "Adding…"
                  : "Saving…"
                : props.mode === "create"
                  ? "Add property"
                  : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
