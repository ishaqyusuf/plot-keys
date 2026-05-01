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
} from "../../../../components/dashboard/dashboard-sheet-layout";
import { DevFormQuickFillButton } from "../../../../components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "../../../../components/dev/quick-fill";
import { useZodForm } from "../../../../hooks/use-zod-form";
import { updateEstateAction } from "../../../actions";

type EstateLaunchDetailsFormProps = {
  estate: {
    id: string;
    slug: string;
    title: string;
    location: string | null;
    landmarks: string | null;
    phaseLabel: string | null;
    heroImageUrl: string | null;
    brochureUrl: string | null;
    description: string | null;
    amenities: string | null;
    approvals: string | null;
    specialPurposeUses: string | null;
    publishState: string;
  };
};

const estateLaunchDetailsSchema = z.object({
  amenities: z.string().optional(),
  approvals: z.string().optional(),
  brochureUrl: z.string().url("Enter a valid URL.").or(z.literal("")),
  description: z.string().optional(),
  heroImageUrl: z.string().url("Enter a valid URL.").or(z.literal("")),
  landmarks: z.string().optional(),
  location: z.string().optional(),
  phaseLabel: z.string().optional(),
  publishState: z.enum(["draft", "published", "archived"]),
  specialPurposeUses: z.string().optional(),
  title: z.string().trim().min(1, "Estate name is required."),
});

type EstateLaunchDetailsValues = z.infer<typeof estateLaunchDetailsSchema>;

async function uploadLaunchAsset(file: File, folder: string) {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("folder", folder);

  const response = await fetch("/api/upload", {
    body: formData,
    method: "POST",
  });
  const payload = (await response.json().catch(() => null)) as {
    error?: string;
    publicUrl?: string;
  } | null;

  if (!response.ok || !payload?.publicUrl) {
    throw new Error(payload?.error ?? "Upload failed.");
  }

  return payload.publicUrl;
}

export function EstateLaunchDetailsForm({
  estate,
}: EstateLaunchDetailsFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [uploadingField, setUploadingField] = useState<
    "heroImageUrl" | "brochureUrl" | null
  >(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const form = useZodForm(estateLaunchDetailsSchema, {
    defaultValues: {
      amenities: estate.amenities ?? "",
      approvals: estate.approvals ?? "",
      brochureUrl: estate.brochureUrl ?? "",
      description: estate.description ?? "",
      heroImageUrl: estate.heroImageUrl ?? "",
      landmarks: estate.landmarks ?? "",
      location: estate.location ?? "",
      phaseLabel: estate.phaseLabel ?? "",
      publishState:
        estate.publishState as EstateLaunchDetailsValues["publishState"],
      specialPurposeUses: estate.specialPurposeUses ?? "",
      title: estate.title,
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function handleFileUpload(
    file: File | null,
    field: "heroImageUrl" | "brochureUrl",
    folder: string,
  ) {
    setUploadError(null);
    if (!file) return;

    setUploadingField(field);
    try {
      const publicUrl = await uploadLaunchAsset(file, folder);
      form.setValue(field, publicUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Unable to upload file.",
      );
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSubmit(values: EstateLaunchDetailsValues) {
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("estateId", estate.id);
      formData.set("estateSlug", estate.slug);
      formData.set("title", values.title.trim());
      formData.set("location", values.location?.trim() ?? "");
      formData.set("landmarks", values.landmarks?.trim() ?? "");
      formData.set("phaseLabel", values.phaseLabel?.trim() ?? "");
      formData.set("heroImageUrl", values.heroImageUrl.trim());
      formData.set("brochureUrl", values.brochureUrl.trim());
      formData.set("description", values.description?.trim() ?? "");
      formData.set("amenities", values.amenities?.trim() ?? "");
      formData.set("approvals", values.approvals?.trim() ?? "");
      formData.set(
        "specialPurposeUses",
        values.specialPurposeUses?.trim() ?? "",
      );
      formData.set("publishState", values.publishState);
      await updateEstateAction(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">Edit launch</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <DashboardSheetHeader
          title="Edit estate launch"
          description="Manage the flyer-style launch content buyers use to understand location, trust, amenities, and the presale deal."
        />

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <DashboardSheetBody>
            <FieldGroup>
              <Field>
                <FieldLabel>Estate name *</FieldLabel>
                <Input required {...form.register("title")} />
              </Field>

              <div className="grid gap-3 md:grid-cols-2">
                <Field>
                  <FieldLabel>Location</FieldLabel>
                  <Input {...form.register("location")} />
                </Field>
                <Field>
                  <FieldLabel>Phase label</FieldLabel>
                  <Input {...form.register("phaseLabel")} />
                </Field>
              </div>

              <Field>
                <FieldLabel>Landmarks</FieldLabel>
                <Input
                  placeholder="Airport Road, Centenary City, NIPCO Filling Station"
                  {...form.register("landmarks")}
                />
              </Field>

              <Field>
                <FieldLabel>Hero image</FieldLabel>
                <Input
                  accept="image/png,image/jpeg,image/webp"
                  disabled={uploadingField === "heroImageUrl"}
                  onChange={(event) =>
                    handleFileUpload(
                      event.target.files?.[0] ?? null,
                      "heroImageUrl",
                      "estate-hero",
                    )
                  }
                  type="file"
                />
                <Input
                  className="mt-2"
                  placeholder="https://..."
                  type="url"
                  {...form.register("heroImageUrl")}
                />
              </Field>

              <Field>
                <FieldLabel>Brochure / flyer</FieldLabel>
                <Input
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  disabled={uploadingField === "brochureUrl"}
                  onChange={(event) =>
                    handleFileUpload(
                      event.target.files?.[0] ?? null,
                      "brochureUrl",
                      "estate-brochures",
                    )
                  }
                  type="file"
                />
                <Input
                  className="mt-2"
                  placeholder="https://..."
                  type="url"
                  {...form.register("brochureUrl")}
                />
              </Field>

              {uploadError ? (
                <p className="text-xs text-destructive">{uploadError}</p>
              ) : null}

              <Field>
                <FieldLabel>Launch description</FieldLabel>
                <Textarea rows={5} {...form.register("description")} />
              </Field>

              <Field>
                <FieldLabel>Amenities</FieldLabel>
                <Textarea rows={3} {...form.register("amenities")} />
              </Field>

              <Field>
                <FieldLabel>Approvals / title</FieldLabel>
                <Input {...form.register("approvals")} />
              </Field>

              <Field>
                <FieldLabel>Special-purpose land</FieldLabel>
                <Textarea rows={3} {...form.register("specialPurposeUses")} />
              </Field>

              <Field>
                <FieldLabel>Publish state</FieldLabel>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("publishState")}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
            </FieldGroup>
          </DashboardSheetBody>

          <DashboardSheetFooter className="sm:flex-row sm:items-center sm:justify-between">
            <DevFormQuickFillButton onFill={() => quickFill.newEstate()} />
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setOpen(false)}
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                disabled={pending || uploadingField !== null}
                type="submit"
              >
                {pending ? "Saving..." : "Save launch"}
              </Button>
            </div>
          </DashboardSheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
