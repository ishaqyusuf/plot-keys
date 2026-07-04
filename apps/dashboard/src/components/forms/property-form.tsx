"use client";

import { Button } from "@plotkeys/ui/button";
import { CurrencyInput } from "@plotkeys/ui/currency-input";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@plotkeys/ui/input-group";
import { Textarea } from "@plotkeys/ui/textarea";
import { useEffect, useState } from "react";
import { z } from "zod";
import { createPropertyAction, updatePropertyAction } from "@/app/actions";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { DevFormQuickFillButton } from "@/components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "@/components/dev/quick-fill";
import {
  createPricingPlanDraft,
  getInitialPricingPlans,
  normalizePricingPlan,
  type PricingPlanDraft,
  PropertyPricingPlanFields,
} from "@/components/forms/property-pricing-plan-fields";
import { useZodForm } from "@/hooks/use-zod-form";

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

type PropertyFormBaseProps = {
  onCancel?: () => void;
};

export type PropertyFormProps = PropertyFormBaseProps &
  (
    | {
        mode: "create";
        defaults?: {
          estateId?: string;
          location?: string | null;
          returnTo?: string;
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

export function PropertyForm(props: PropertyFormProps) {
  const [pending, setPending] = useState(false);
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

  useEffect(() => {
    if (!estateDefaultLocation) return;
    form.setValue("location", estateDefaultLocation, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: true,
    });
  }, [estateDefaultLocation, form]);

  async function handleSubmit(values: PropertyFormValues) {
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("title", values.title.trim());
      formData.set("price", values.price?.trim() ?? "");
      formData.set("location", values.location?.trim() ?? "");
      formData.set("quantityAvailable", values.quantityAvailable?.trim() ?? "");
      formData.set(
        "bedrooms",
        values.type === "land" ? "" : (values.bedrooms?.trim() ?? ""),
      );
      formData.set(
        "bathrooms",
        values.type === "land" ? "" : (values.bathrooms?.trim() ?? ""),
      );
      formData.set("specs", values.specs?.trim() ?? "");
      formData.set("description", values.description?.trim() ?? "");
      formData.set("imageUrl", values.imageUrl.trim());
      formData.set("type", values.type);
      formData.set("subType", values.subType?.trim() ?? "");
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
      formData.set("paymentPlanMonths", firstPricingPlan?.months ?? "");
      formData.set("paymentPlanAmount", firstPricingPlan?.amount ?? "");
      formData.set(
        "paymentPlanInitialDepositPercent",
        firstPricingPlan?.initialDepositPercent ?? "",
      );
      formData.set(
        "paymentPlanMonthlyAmount",
        firstPricingPlan?.monthlyAmount ?? "",
      );
      formData.set("paymentPlansJson", JSON.stringify(normalizedPricingPlans));
      formData.set("status", values.status);
      formData.set("featured", values.featured);

      if (props.mode === "edit") {
        formData.set("propertyId", property!.id);
        formData.set("estateId", property!.estateId ?? "");
        await updatePropertyAction(formData);
      } else {
        formData.set("estateId", defaults?.estateId ?? "");
        formData.set("returnTo", defaults?.returnTo ?? "");
        await createPropertyAction(formData);
      }
    } finally {
      setPending(false);
    }
  }

  const quickFill = new QuickFill(createQuickFillAdapter(form));

  function handleQuickFill() {
    quickFill.newProperty();
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

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <DashboardFormBody>
        <FieldGroup>
              <Field>
                <FieldLabel>Listing type</FieldLabel>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("type")}
                >
                  <option value="">Select type...</option>
                  <option value="residential">Home</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial (legacy)</option>
                  <option value="industrial">Industrial (legacy)</option>
                  <option value="mixed_use">Mixed use (legacy)</option>
                </select>
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
                  placeholder="e.g. ₦45,000,000"
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
                    isLandListing
                      ? "e.g. 500sqm"
                      : "e.g. 3 bed · 2 bath · 200sqm"
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
      </DashboardFormBody>

      <DashboardFormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <DevFormQuickFillButton onFill={handleQuickFill} />
        <div className="flex justify-end gap-3">
          <Button onClick={props.onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending
              ? props.mode === "create"
                ? "Adding..."
                : "Saving..."
              : props.mode === "create"
                ? "Add listing"
                : "Save changes"}
          </Button>
        </div>
      </DashboardFormFooter>
    </form>
  );
}
