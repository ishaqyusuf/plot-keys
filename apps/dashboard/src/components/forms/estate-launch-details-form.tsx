"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Textarea } from "@plotkeys/ui/textarea";
import type { inferRouterOutputs } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { DevFormQuickFillButton } from "@/components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "@/components/dev/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type EstateLaunchDetailsFormRecord = NonNullable<
  RouterOutputs["workspace"]["getEstateDetail"]
>;

type EstateLaunchDetailsFormProps = {
  estate: EstateLaunchDetailsFormRecord;
  onSuccess?: () => void;
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

function getFormDefaults(
  estate: EstateLaunchDetailsFormRecord,
): EstateLaunchDetailsValues {
  return {
    amenities: estate.amenities ?? "",
    approvals: estate.approvals ?? "",
    brochureUrl: estate.brochureUrl ?? "",
    description: estate.description ?? "",
    heroImageUrl: estate.heroImageUrl ?? "",
    landmarks: estate.landmarks ?? "",
    location: estate.location ?? "",
    phaseLabel: estate.phaseLabel ?? "",
    publishState: estate.publishState,
    specialPurposeUses: estate.specialPurposeUses ?? "",
    title: estate.title,
  };
}

export function EstateLaunchDetailsForm({
  estate,
  onSuccess,
}: EstateLaunchDetailsFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [uploadingField, setUploadingField] = useState<
    "heroImageUrl" | "brochureUrl" | null
  >(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const form = useZodForm(estateLaunchDetailsSchema, {
    defaultValues: getFormDefaults(estate),
  });
  const updateEstateMutation = useMutation(
    trpc.workspace.updateEstate.mutationOptions({
      async onSuccess(updatedEstate) {
        form.reset({
          ...getFormDefaults(estate),
          amenities: updatedEstate.amenities ?? "",
          approvals: updatedEstate.approvals ?? "",
          brochureUrl: updatedEstate.brochureUrl ?? "",
          description: updatedEstate.description ?? "",
          heroImageUrl: updatedEstate.heroImageUrl ?? "",
          landmarks: updatedEstate.landmarks ?? "",
          location: updatedEstate.location ?? "",
          phaseLabel: updatedEstate.phaseLabel ?? "",
          publishState: updatedEstate.publishState,
          specialPurposeUses: updatedEstate.specialPurposeUses ?? "",
          title: updatedEstate.title,
        });
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.workspace.getEstateDetail.queryKey({
              slug: estate.slug,
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.workspace.listEstates.queryKey(),
          }),
        ]);
        onSuccess?.();
      },
    }),
  );
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
    await updateEstateMutation.mutateAsync({
      amenities: values.amenities?.trim() || null,
      approvals: values.approvals?.trim() || null,
      brochureUrl: values.brochureUrl.trim() || null,
      description: values.description?.trim() || null,
      estateId: estate.id,
      heroImageUrl: values.heroImageUrl.trim() || null,
      landmarks: values.landmarks?.trim() || null,
      location: values.location?.trim() || null,
      phaseLabel: values.phaseLabel?.trim() || null,
      publishState: values.publishState,
      specialPurposeUses: values.specialPurposeUses?.trim() || null,
      title: values.title.trim(),
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <DashboardFormBody>
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
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
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

          {updateEstateMutation.error ? (
            <Alert variant="destructive">
              <AlertDescription>
                {updateEstateMutation.error.message}
              </AlertDescription>
            </Alert>
          ) : null}
        </FieldGroup>
      </DashboardFormBody>

      <DashboardFormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <DevFormQuickFillButton onFill={() => quickFill.newEstate()} />
        <Button disabled={updateEstateMutation.isPending} type="submit">
          {updateEstateMutation.isPending ? "Saving..." : "Save launch"}
        </Button>
      </DashboardFormFooter>
    </form>
  );
}
