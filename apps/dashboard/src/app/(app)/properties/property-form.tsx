"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { Textarea } from "@plotkeys/ui/textarea";
import { useState } from "react";
import { z } from "zod";
import {
  DashboardSheetBody,
  DashboardSheetFooter,
  DashboardSheetHeader,
} from "../../../components/dashboard/dashboard-sheet-layout";
import { DevFormQuickFillButton } from "../../../components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "../../../components/dev/quick-fill";
import { useZodForm } from "../../../hooks/use-zod-form";
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
  type: string | null;
  subType: string | null;
  status: string;
  featured: boolean;
};

type PropertyFormProps =
  | { mode: "create" }
  | { mode: "edit"; property: Property };

const propertyFormSchema = z.object({
  bathrooms: z.string().optional(),
  bedrooms: z.string().optional(),
  description: z.string().optional(),
  featured: z.enum(["false", "true"]),
  imageUrl: z.string().url("Enter a valid URL.").or(z.literal("")),
  location: z.string().optional(),
  price: z.string().optional(),
  specs: z.string().optional(),
  status: z.enum(["active", "sold", "rented", "off_market"]),
  subType: z.string().optional(),
  title: z.string().trim().min(1, "Title is required."),
  type: z.enum([
    "",
    "residential",
    "commercial",
    "land",
    "industrial",
    "mixed_use",
  ]),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export function PropertyForm(props: PropertyFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const property = props.mode === "edit" ? props.property : null;
  const form = useZodForm(propertyFormSchema, {
    defaultValues: {
      bathrooms: property?.bathrooms?.toString() ?? "",
      bedrooms: property?.bedrooms?.toString() ?? "",
      description: property?.description ?? "",
      featured: property?.featured ? "true" : "false",
      imageUrl: property?.imageUrl ?? "",
      location: property?.location ?? "",
      price: property?.price ?? "",
      specs: property?.specs ?? "",
      status: (property?.status ?? "active") as PropertyFormValues["status"],
      subType: property?.subType ?? "",
      title: property?.title ?? "",
      type: (property?.type ?? "") as PropertyFormValues["type"],
    },
  });

  async function handleSubmit(values: PropertyFormValues) {
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("title", values.title.trim());
      formData.set("price", values.price?.trim() ?? "");
      formData.set("location", values.location?.trim() ?? "");
      formData.set("bedrooms", values.bedrooms?.trim() ?? "");
      formData.set("bathrooms", values.bathrooms?.trim() ?? "");
      formData.set("specs", values.specs?.trim() ?? "");
      formData.set("description", values.description?.trim() ?? "");
      formData.set("imageUrl", values.imageUrl.trim());
      formData.set("type", values.type);
      formData.set("subType", values.subType?.trim() ?? "");
      formData.set("status", values.status);
      formData.set("featured", values.featured);

      if (props.mode === "edit") {
        formData.set("propertyId", property!.id);
        await updatePropertyAction(formData);
      } else {
        await createPropertyAction(formData);
      }
    } finally {
      setPending(false);
    }
  }

  const quickFill = new QuickFill(createQuickFillAdapter(form));

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant={props.mode === "create" ? "default" : "outline"}
        >
          {props.mode === "create" ? "Add property" : "Edit"}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          description={
            props.mode === "create"
              ? "Add a new listing using the standardized dashboard editing flow."
              : "Update pricing, metadata, and publish state without leaving the inventory view."
          }
          title={props.mode === "create" ? "Add property" : "Edit property"}
        />

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <DashboardSheetBody>
            <FieldGroup>
              <Field>
                <FieldLabel>Title *</FieldLabel>
                <Input
                  placeholder="e.g. 3-Bedroom Detached, Lekki Phase 1"
                  required
                  {...form.register("title")}
                />
              </Field>

              <Field>
                <FieldLabel>Price</FieldLabel>
                <Input
                  placeholder="e.g. ₦45,000,000"
                  {...form.register("price")}
                />
              </Field>

              <Field>
                <FieldLabel>Location</FieldLabel>
                <Input
                  placeholder="e.g. Lekki Phase 1, Lagos"
                  {...form.register("location")}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Bedrooms</FieldLabel>
                  <Input
                    min={0}
                    placeholder="3"
                    type="number"
                    {...form.register("bedrooms")}
                  />
                </Field>
                <Field>
                  <FieldLabel>Bathrooms</FieldLabel>
                  <Input
                    min={0}
                    placeholder="2"
                    type="number"
                    {...form.register("bathrooms")}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>Specs / highlights</FieldLabel>
                <Input
                  placeholder="e.g. 3 bed · 2 bath · 200sqm"
                  {...form.register("specs")}
                />
              </Field>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  placeholder="Short property description…"
                  rows={4}
                  {...form.register("description")}
                />
              </Field>

              <Field>
                <FieldLabel>Image URL</FieldLabel>
                <Input
                  placeholder="https://…"
                  type="url"
                  {...form.register("imageUrl")}
                />
              </Field>

              <Field>
                <FieldLabel>Property type</FieldLabel>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("type")}
                >
                  <option value="">Select type…</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="industrial">Industrial</option>
                  <option value="mixed_use">Mixed use</option>
                </select>
              </Field>

              <Field>
                <FieldLabel>Sub-type</FieldLabel>
                <Input
                  placeholder="e.g. Detached, Bungalow, Flat, Office…"
                  {...form.register("subType")}
                />
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("status")}
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
                  {...form.register("featured")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes — show on homepage</option>
                </select>
              </Field>
            </FieldGroup>
          </DashboardSheetBody>

          <DashboardSheetFooter className="sm:flex-row sm:items-center sm:justify-between">
            <DevFormQuickFillButton onFill={() => quickFill.newProperty()} />
            <div className="flex justify-end gap-3">
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
          </DashboardSheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
