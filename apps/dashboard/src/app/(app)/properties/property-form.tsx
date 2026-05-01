"use client";

import { Button } from "@plotkeys/ui/button";
import { CurrencyInput } from "@plotkeys/ui/currency-input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@plotkeys/ui/input-group";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import { Textarea } from "@plotkeys/ui/textarea";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
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

type PropertyFormProps =
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
  | { mode: "edit"; property: Property };

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

type PricingPlanDraft = {
  id: string;
  amount: string;
  initialDepositPercent: string;
  months: string;
};

function parseCurrencyValue(value?: string | null) {
  if (!value) return 0;
  const normalized = value.replace(/[^\d.-]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function formatNaira(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "";
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function createPricingPlanDraft(
  overrides: Partial<Omit<PricingPlanDraft, "id">> = {},
): PricingPlanDraft {
  return {
    amount: overrides.amount ?? "",
    id: crypto.randomUUID(),
    initialDepositPercent: overrides.initialDepositPercent ?? "",
    months: overrides.months ?? "",
  };
}

function normalizePricingPlan(plan: Omit<PricingPlanDraft, "id">) {
  const amount = parseCurrencyValue(plan.amount);
  const depositPercentValue = Number(plan.initialDepositPercent || 0);
  const depositPercent = Number.isFinite(depositPercentValue)
    ? Math.min(Math.max(depositPercentValue, 0), 100)
    : 0;
  const months = Number(plan.months || 0);
  const initialDepositAmount = amount * (depositPercent / 100);
  const monthlyAmount =
    amount > 0 && months > 0
      ? formatNaira((amount - initialDepositAmount) / months)
      : "";

  return {
    amount: plan.amount.trim(),
    initialDepositAmount: formatNaira(initialDepositAmount),
    initialDepositPercent: plan.initialDepositPercent.trim(),
    monthlyAmount,
    months: plan.months.trim(),
  };
}

function getInitialPricingPlans(property: Property | null): PricingPlanDraft[] {
  if (Array.isArray(property?.paymentPlansJson)) {
    const plans = property.paymentPlansJson
      .map((plan) => {
        if (!plan || typeof plan !== "object") return null;
        const entry = plan as Record<string, unknown>;
        return createPricingPlanDraft({
          amount: String(entry.amount ?? ""),
          initialDepositPercent: String(entry.initialDepositPercent ?? ""),
          months: String(entry.months ?? ""),
        });
      })
      .filter((plan): plan is PricingPlanDraft => Boolean(plan));

    if (plans.length > 0) return plans;
  }

  return [
    createPricingPlanDraft({
      amount: property?.paymentPlanAmount ?? "",
      initialDepositPercent:
        property?.paymentPlanInitialDepositPercent?.toString() ?? "",
      months: property?.paymentPlanMonths?.toString() ?? "",
    }),
  ];
}

export function PropertyForm(props: PropertyFormProps) {
  const [open, setOpen] = useState(false);
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
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant={props.mode === "create" ? "default" : "outline"}
        >
          {props.mode === "create" ? (props.label ?? "Add listing") : "Edit"}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          description={
            props.mode === "create"
              ? "Add a home or land listing using fields that match the listing type."
              : "Update pricing, details, and publish state without leaving the inventory view."
          }
          title={props.mode === "create" ? "Add listing" : "Edit listing"}
        />

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <DashboardSheetBody>
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

              <FieldSet>
                <FieldLegend>Pricing plan</FieldLegend>
                <FieldDescription>
                  Add the payment timeline and deposit terms for this listing.
                </FieldDescription>
                <div className="max-w-full overflow-hidden">
                  <Table className="min-w-[41rem] table-fixed">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-24 px-0 pr-3">Months</TableHead>
                        <TableHead className="w-36 px-0 pr-3">Amount</TableHead>
                        <TableHead className="w-56 px-0 pr-3">
                          Initial Deposit
                        </TableHead>
                        <TableHead className="w-36 px-0 pr-3">
                          Monthly
                        </TableHead>
                        <TableHead className="w-12 px-0 text-right">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pricingPlans.map((plan) => {
                        const normalizedPlan = normalizePricingPlan(plan);

                        return (
                          <TableRow
                            className="hover:bg-transparent"
                            key={plan.id}
                          >
                            <TableCell className="w-24 px-0 pr-3">
                              <Input
                                aria-label="Payment plan months"
                                className="w-full"
                                min={1}
                                onChange={(event) =>
                                  updatePricingPlan(
                                    plan.id,
                                    "months",
                                    event.target.value,
                                  )
                                }
                                placeholder="12"
                                type="number"
                                value={plan.months}
                              />
                            </TableCell>
                            <TableCell className="w-36 px-0 pr-3">
                              <CurrencyInput
                                allowLeadingZeros={false}
                                aria-label="Payment plan amount"
                                className="w-full"
                                onValueChange={(values) =>
                                  updatePricingPlan(
                                    plan.id,
                                    "amount",
                                    values.value,
                                  )
                                }
                                placeholder="₦45,000,000"
                                value={plan.amount}
                              />
                            </TableCell>
                            <TableCell className="w-56 px-0 pr-3">
                              <InputGroup>
                                <InputGroupAddon align="inline-start">
                                  <InputGroupText className="text-xs">
                                    (
                                    {normalizedPlan.initialDepositAmount ||
                                      "₦0"}
                                    )
                                  </InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                  aria-label="Initial deposit percent"
                                  className="text-right"
                                  max={100}
                                  min={0}
                                  onChange={(event) =>
                                    updatePricingPlan(
                                      plan.id,
                                      "initialDepositPercent",
                                      event.target.value,
                                    )
                                  }
                                  placeholder="20"
                                  step="0.1"
                                  type="number"
                                  value={plan.initialDepositPercent}
                                />
                                <InputGroupAddon align="inline-end">
                                  <InputGroupText>%</InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                            </TableCell>
                            <TableCell className="w-36 px-0 pr-3">
                              <Input
                                aria-label="Generated monthly payment"
                                className="w-full"
                                readOnly
                                value={normalizedPlan.monthlyAmount}
                              />
                            </TableCell>
                            <TableCell className="w-12 px-0 text-right">
                              <Button
                                aria-label="Remove pricing plan"
                                disabled={pricingPlans.length <= 1}
                                onClick={() => removePricingPlan(plan.id)}
                                size="icon-sm"
                                type="button"
                                variant="ghost"
                              >
                                <Trash2Icon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  className="w-fit"
                  onClick={addPricingPlan}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <PlusIcon data-icon="inline-start" />
                  Add pricing
                </Button>
              </FieldSet>

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
          </DashboardSheetBody>

          <DashboardSheetFooter className="sm:flex-row sm:items-center sm:justify-between">
            <DevFormQuickFillButton onFill={handleQuickFill} />
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
                    ? "Adding..."
                    : "Saving..."
                  : props.mode === "create"
                    ? "Add listing"
                    : "Save changes"}
              </Button>
            </div>
          </DashboardSheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
