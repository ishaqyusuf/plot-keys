"use client";

import { Button } from "@plotkeys/ui/button";
import { CurrencyInput } from "@plotkeys/ui/currency-input";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@plotkeys/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { Textarea } from "@plotkeys/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { FormBody, FormFooter } from "@/components/forms/form-layout";
import {
  createPricingPlanDraft,
  getInitialPricingPlans,
  normalizePricingPlan,
  type PricingPlanDraft,
  PropertyPricingPlanFields,
} from "@/components/forms/property-pricing-plan-fields";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

type ListingTypeValue =
  | ""
  | "residential"
  | "commercial"
  | "land"
  | "industrial"
  | "mixed_use";

type Property = {
  id: string;
  estateId?: string | null;
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
  quantityAvailable?: number | null;
  paymentPlanMonths?: number | null;
  paymentPlanAmount?: string | null;
  paymentPlanInitialDepositPercent?: number | null;
  paymentPlanMonthlyAmount?: string | null;
  paymentPlansJson?: unknown;
  status: string;
  featured: boolean;
};

type Props = {
  onCancel?: () => void;
  onSuccess?: () => void;
} & (
  | {
      mode: "create";
      defaults?: {
        estateId?: string;
        location?: string | null;
        type?: ListingTypeValue;
      };
      label?: string;
    }
  | { mode: "edit"; property: Property }
);

const propertyFormSchema = z.object({
  bathrooms: z.string().optional(),
  bedrooms: z.string().optional(),
  description: z.string().optional(),
  featured: z.enum(["false", "true"]),
  imageUrl: z.string().url("Enter a valid URL.").or(z.literal("")),
  location: z.string().optional(),
  price: z.string().optional(),
  quantityAvailable: z.string().optional(),
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
type PropertyListingType = Exclude<ListingTypeValue, "">;

const emptyListingTypeValue = "none";

function getListingTypeOrNull(value: ListingTypeValue) {
  return value ? (value as PropertyListingType) : null;
}

function optionalInt(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalNumber(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function PropertyForm(props: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const property = props.mode === "edit" ? props.property : null;
  const defaults = props.mode === "create" ? props.defaults : undefined;
  const [pricingPlans, setPricingPlans] = useState(() =>
    getInitialPricingPlans(property),
  );
  const form = useZodForm(propertyFormSchema, {
    defaultValues: {
      bathrooms: property?.bathrooms?.toString() ?? "",
      bedrooms: property?.bedrooms?.toString() ?? "",
      description: property?.description ?? "",
      featured: property?.featured ? "true" : "false",
      imageUrl: property?.imageUrl ?? "",
      location: property?.location ?? defaults?.location ?? "",
      price: property?.price ?? "",
      quantityAvailable: property?.quantityAvailable?.toString() ?? "",
      specs: property?.specs ?? "",
      status: (property?.status ?? "active") as PropertyFormValues["status"],
      subType: property?.subType ?? "",
      title: property?.title ?? "",
      type: (property?.type ??
        defaults?.type ??
        "") as PropertyFormValues["type"],
    },
  });
  const selectedType = form.watch("type");
  const isLandListing = selectedType === "land";
  const estateDefaultLocation = defaults?.estateId ? defaults.location : null;
  const createPropertyMutation = useMutation(
    trpc.properties.create.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to create property.");
      },
      async onSuccess() {
        setError(null);
        form.reset();
        await queryClient.invalidateQueries({
          queryKey: trpc.properties.list.infiniteQueryKey(),
        });
        props.onSuccess?.();
      },
    }),
  );
  const updatePropertyMutation = useMutation(
    trpc.properties.update.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to update property.");
      },
      async onSuccess(_, input) {
        setError(null);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.properties.list.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.properties.get.queryKey({
              propertyId: input.propertyId,
            }),
          }),
        ]);
        props.onSuccess?.();
      },
    }),
  );

  useEffect(() => {
    if (!estateDefaultLocation) return;
    form.setValue("location", estateDefaultLocation, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: true,
    });
  }, [estateDefaultLocation, form]);

  function handleSubmit(values: PropertyFormValues) {
    setError(null);
    const normalizedPricingPlans = pricingPlans
      .map(({ id: _id, ...plan }) => normalizePricingPlan(plan))
      .filter(
        (plan) =>
          plan.months ||
          plan.amount ||
          plan.initialDepositPercent ||
          plan.monthlyAmount,
      );
    const firstPricingPlan = normalizedPricingPlans[0];
    const payload = {
      bathrooms: values.type === "land" ? null : optionalInt(values.bathrooms),
      bedrooms: values.type === "land" ? null : optionalInt(values.bedrooms),
      description: values.description?.trim() || null,
      estateId:
        props.mode === "edit"
          ? (property?.estateId ?? null)
          : (defaults?.estateId ?? null),
      featured: values.featured === "true",
      imageUrl: values.imageUrl.trim() || null,
      location: values.location?.trim() || null,
      paymentPlanAmount: firstPricingPlan?.amount || null,
      paymentPlanInitialDepositPercent: optionalNumber(
        firstPricingPlan?.initialDepositPercent,
      ),
      paymentPlanMonthlyAmount: firstPricingPlan?.monthlyAmount || null,
      paymentPlanMonths: optionalInt(firstPricingPlan?.months),
      paymentPlansJson: normalizedPricingPlans,
      price: values.price?.trim() || null,
      quantityAvailable: optionalInt(values.quantityAvailable),
      specs: values.specs?.trim() || null,
      status: values.status,
      subType: values.subType?.trim() || null,
      title: values.title.trim(),
      type: getListingTypeOrNull(values.type),
    };

    if (props.mode === "edit") {
      updatePropertyMutation.mutate({
        propertyId: property!.id,
        ...payload,
      });
      return;
    }

    createPropertyMutation.mutate(payload);
  }

  const isPending =
    createPropertyMutation.isPending || updatePropertyMutation.isPending;

  function handlePropertyQuickFilled() {
    setPricingPlans([
      createPricingPlanDraft({
        amount: "45000000",
        initialDepositPercent: "20",
        months: "12",
      }),
    ]);
    if (defaults?.type) {
      form.setValue("type", defaults.type, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    if (estateDefaultLocation) {
      form.setValue("location", estateDefaultLocation, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }

  function updatePricingPlan(
    id: string,
    field: keyof Omit<PricingPlanDraft, "id">,
    value: string,
  ) {
    setPricingPlans((plans) =>
      plans.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              [field]: value,
            }
          : plan,
      ),
    );
  }

  function addPricingPlan() {
    setPricingPlans((plans) => [...plans, createPricingPlanDraft()]);
  }

  function removePricingPlan(id: string) {
    setPricingPlans((plans) =>
      plans.length <= 1 ? plans : plans.filter((plan) => plan.id !== id),
    );
  }

  function pricingPlanHasValue(plan: PricingPlanDraft) {
    return Boolean(
      plan.amount.trim() ||
        plan.initialDepositPercent.trim() ||
        plan.months.trim(),
    );
  }

  function sortPricingPlans(first: PricingPlanDraft, second: PricingPlanDraft) {
    return Number(first.months || 0) - Number(second.months || 0);
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Listing type</FieldLabel>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === emptyListingTypeValue ? "" : value)
                  }
                  value={field.value || emptyListingTypeValue}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={emptyListingTypeValue}>
                      Select type...
                    </SelectItem>
                    <SelectItem value="residential">Home</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="mixed_use">Mixed use</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Title *</FieldLabel>
            <Input
              placeholder={
                isLandListing
                  ? "e.g. 500sqm Plot, Oakfield Estate"
                  : "e.g. 3-Bedroom Detached, Lekki Phase 1"
              }
              required
              {...form.register("title")}
            />
          </Field>

          <Field>
            <FieldLabel>Price</FieldLabel>
            <CurrencyInput
              allowLeadingZeros={false}
              allowNegative={false}
              decimalScale={0}
              placeholder="e.g. ₦45,000,000"
              prefix="₦"
              value={form.watch("price")}
              onValueChange={(values) => {
                form.setValue("price", values.value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
            />
          </Field>

          <PropertyPricingPlanFields
            onAdd={addPricingPlan}
            onRemove={removePricingPlan}
            onUpdate={updatePricingPlan}
            pricingPlans={pricingPlans}
            quickFill={
              <QuickFill
                args={{
                  createRow: createPricingPlanDraft,
                  hasValue: pricingPlanHasValue,
                  rows: pricingPlans,
                  setRows: (updater) =>
                    setPricingPlans((plans) => updater(plans)),
                  sortRows: sortPricingPlans,
                }}
                name="pricing-plans"
              />
            }
          />

          <Field>
            <FieldLabel>Qty available</FieldLabel>
            <InputGroup>
              <InputGroupInput
                min={0}
                placeholder={isLandListing ? "24" : "1"}
                type="number"
                {...form.register("quantityAvailable")}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>units</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel>Location</FieldLabel>
            <Input
              placeholder={
                isLandListing
                  ? "e.g. Ibeju-Lekki, Lagos"
                  : "e.g. Lekki Phase 1, Lagos"
              }
              {...form.register("location")}
            />
          </Field>

          {isLandListing ? null : (
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
          )}

          <Field>
            <FieldLabel>
              {isLandListing ? "Land size" : "Specs / highlights"}
            </FieldLabel>
            <Input
              placeholder={
                isLandListing ? "e.g. 500sqm" : "e.g. 3 bed · 2 bath · 200sqm"
              }
              {...form.register("specs")}
            />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              placeholder={
                isLandListing
                  ? "Describe the land, title, access, estate context, and presale deal..."
                  : "Short listing description..."
              }
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
            <FieldLabel>
              {isLandListing ? "Land category" : "Home category"}
            </FieldLabel>
            <Input
              placeholder={
                isLandListing
                  ? "e.g. Residential plot, commercial plot, mixed-use plot"
                  : "e.g. Detached, bungalow, flat, terrace"
              }
              {...form.register("subType")}
            />
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="off_market">Off market</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Featured</FieldLabel>
            <Controller
              control={form.control}
              name="featured"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select featured status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes — show on homepage</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </FieldGroup>
      </FormBody>

      <FormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="new-property"
            onFilled={handlePropertyQuickFilled}
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={props.onCancel} type="button">
            Cancel
          </Button>
          <SubmitButton isSubmitting={isPending}>
            {props.mode === "create" ? "Add listing" : "Save changes"}
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
