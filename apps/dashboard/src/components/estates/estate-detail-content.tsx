"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { EstateDetailHeader } from "@/components/estates/estate-detail-header";
import { EstateDetailStats } from "@/components/estates/estate-detail-stats";
import { getEstatePublishVariant } from "@/components/estates/estate-launch-card";
import { EstateSection } from "@/components/estates/estate-section";
import { EstatePlanUploadForm } from "@/components/forms/estate-plan-upload-form";
import { OpenPropertySheet } from "@/components/open-property-sheet";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type EstateDetail = NonNullable<RouterOutputs["estates"]["get"]>;
type EstateProperty = EstateDetail["properties"][number];

type Props = {
  slug: string;
};

const statusVariant: Record<
  string,
  "default" | "outline" | "secondary" | "destructive"
> = {
  active: "default",
  off_market: "secondary",
  rented: "outline",
  sold: "outline",
};

function splitList(value?: string | null) {
  return (value ?? "")
    .split(/[,;\n]+/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

type PaymentPlanRow = {
  amount: string;
  initialDepositAmount: string;
  initialDepositPercent: string;
  monthlyAmount: string;
  months: string;
};

type PaymentPlanSource = {
  paymentPlanAmount: string | null;
  paymentPlanInitialDepositPercent: number | null;
  paymentPlanMonthlyAmount: string | null;
  paymentPlanMonths: number | null;
  paymentPlansJson: unknown;
};

function parsePaymentPlans(property: PaymentPlanSource): PaymentPlanRow[] {
  if (Array.isArray(property.paymentPlansJson)) {
    const rows = property.paymentPlansJson
      .map((plan) => {
        if (!plan || typeof plan !== "object") return null;
        const entry = plan as Record<string, unknown>;
        const row = {
          amount: String(entry.amount ?? "").trim(),
          initialDepositAmount: String(entry.initialDepositAmount ?? "").trim(),
          initialDepositPercent: String(
            entry.initialDepositPercent ?? "",
          ).trim(),
          monthlyAmount: String(entry.monthlyAmount ?? "").trim(),
          months: String(entry.months ?? "").trim(),
        };

        return Object.values(row).some(Boolean) ? row : null;
      })
      .filter((plan): plan is PaymentPlanRow => Boolean(plan));

    if (rows.length > 0) return rows;
  }

  const fallbackRow = {
    amount: property.paymentPlanAmount ?? "",
    initialDepositAmount: "",
    initialDepositPercent:
      property.paymentPlanInitialDepositPercent?.toString() ?? "",
    monthlyAmount: property.paymentPlanMonthlyAmount ?? "",
    months: property.paymentPlanMonths?.toString() ?? "",
  };

  return Object.values(fallbackRow).some(Boolean) ? [fallbackRow] : [];
}

function formatPaymentSummary(property: PaymentPlanSource) {
  const plans = parsePaymentPlans(property);
  const firstPlan = plans[0];

  if (!firstPlan) return "No payment plan yet";

  const details = [
    firstPlan.amount ? `Plan amount ${firstPlan.amount}` : null,
    firstPlan.initialDepositPercent
      ? `${firstPlan.initialDepositPercent}% deposit`
      : null,
    firstPlan.monthlyAmount ? `${firstPlan.monthlyAmount} monthly` : null,
    firstPlan.months ? `${firstPlan.months} months` : null,
  ].filter(Boolean);

  return plans.length > 1
    ? `${details.join(" - ")} + ${plans.length - 1} more`
    : details.join(" - ");
}

function PaymentPlanTable({ plans }: { plans: PaymentPlanRow[] }) {
  if (plans.length === 0) {
    return (
      <p className="mt-1 text-sm text-muted-foreground">No payment plan yet</p>
    );
  }

  return (
    <div className="mt-3 overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8 px-2 text-[0.68rem]">Amount</TableHead>
            <TableHead className="h-8 px-2 text-[0.68rem]">Initial</TableHead>
            <TableHead className="h-8 px-2 text-[0.68rem]">Monthly</TableHead>
            <TableHead className="h-8 px-2 text-right text-[0.68rem]">
              Months
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow
              className="hover:bg-transparent"
              key={[
                plan.amount,
                plan.initialDepositAmount,
                plan.initialDepositPercent,
                plan.monthlyAmount,
                plan.months,
              ].join("-")}
            >
              <TableCell className="px-2 py-2 text-xs font-medium">
                {plan.amount || "-"}
              </TableCell>
              <TableCell className="px-2 py-2 text-xs">
                {[
                  plan.initialDepositAmount,
                  plan.initialDepositPercent
                    ? `${plan.initialDepositPercent}%`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
              </TableCell>
              <TableCell className="px-2 py-2 text-xs">
                {plan.monthlyAmount || "-"}
              </TableCell>
              <TableCell className="px-2 py-2 text-right text-xs">
                {plan.months || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function EstateDetailContent({ slug }: Props) {
  const trpc = useTRPC();
  const { data: estate } = useSuspenseQuery(
    trpc.estates.get.queryOptions({ slug }),
  );

  if (!estate) {
    return (
      <div className="flex min-h-56 items-center justify-center px-5 py-10">
        <div className="flex max-w-sm flex-col items-center text-center">
          <h3 className="font-medium text-foreground">
            Estate launch not found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This estate launch may have been deleted, archived, or opened from
            an old link.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/estates">Back to launches</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const amenities = splitList(estate.amenities);
  const landmarks = splitList(estate.landmarks);
  const approvals = splitList(estate.approvals);
  const specialPurposeUses = splitList(estate.specialPurposeUses);
  const activeListings = estate.properties.filter(
    (property) => property.status === "active",
  );
  const estateReturnPath = `/estates/${estate.slug}`;

  return (
    <div className="flex flex-col gap-6">
      <EstateDetailHeader estate={estate} estateReturnPath={estateReturnPath} />
      <EstateDetailStats estate={estate} />

      <EstateSection
        description="Buyer-facing estate context: location, landmarks, title trust, and the presale promise."
        title="Launch brief"
      >
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="overflow-hidden border bg-background">
            {estate.heroImageUrl ? (
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: `url(${estate.heroImageUrl})` }}
              />
            ) : null}
            <div className="space-y-5 px-6 py-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getEstatePublishVariant(estate.publishState)}>
                    {estate.publishState}
                  </Badge>
                  {estate.phaseLabel ? (
                    <Badge variant="secondary">{estate.phaseLabel}</Badge>
                  ) : null}
                  {approvals.map((approval) => (
                    <Badge key={approval} variant="outline">
                      {approval}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {estate.description ||
                    "Add a presale description covering the deal, payment plan, title, location, and buyer promise."}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="border border-border bg-card p-4 transition-all duration-300">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Icon.Globe className="size-4" />
                    Location
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {estate.location ?? "No location added"}
                  </p>
                </div>
                <div className="border border-border bg-card p-4 transition-all duration-300">
                  <p className="text-sm font-medium text-foreground">
                    Landmarks
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {landmarks.length > 0
                      ? landmarks.join(" - ")
                      : "No landmarks added"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border bg-background p-5">
            <p className="text-sm font-medium text-foreground">Launch assets</p>
            <div className="mt-4 space-y-3">
              {estate.brochureUrl ? (
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <a href={estate.brochureUrl} rel="noreferrer" target="_blank">
                    Open brochure
                    <Icon.ExternalLink className="size-4" />
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Upload a brochure or flyer from Edit launch.
                </p>
              )}
              {estate.layouts[0]?.sourceUrl ? (
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <a
                    href={estate.layouts[0].sourceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Latest estate plan
                    <Icon.Download className="size-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </EstateSection>

      <EstateFeatureSection
        amenities={amenities}
        approvals={approvals}
        specialPurposeUses={specialPurposeUses}
      />
      <EstatePlanSection estate={estate} />
      <EstateOfferCards
        activeListings={activeListings}
        estate={estate}
        estateReturnPath={estateReturnPath}
      />
      <EstateInventoryTable
        estate={estate}
        estateReturnPath={estateReturnPath}
      />
      <EstatePurchasePipeline reservations={estate._count.reservations} />
    </div>
  );
}

function EstateFeatureSection({
  amenities,
  approvals,
  specialPurposeUses,
}: {
  amenities: string[];
  approvals: string[];
  specialPurposeUses: string[];
}) {
  return (
    <EstateSection
      description="The flyer details buyers scan before comparing plot sizes and payment options."
      title="Estate features"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            empty: "No amenities added",
            items: amenities,
            title: "Amenities",
          },
          {
            empty: "No approvals added",
            items: approvals,
            title: "Approvals / title",
          },
          {
            empty: "No special-purpose land added",
            items: specialPurposeUses,
            title: "Special-purpose land",
          },
        ].map((group) => (
          <div className="border bg-background p-5" key={group.title}>
            <p className="text-base font-medium text-foreground">
              {group.title}
            </p>
            <div className="mt-4">
              {group.items.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{group.empty}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </EstateSection>
  );
}

function EstatePlanSection({ estate }: { estate: EstateDetail }) {
  return (
    <EstateSection
      description="Layout upload and visual mapping will attach estate plan versions to the land listings in this launch."
      title="Plan import"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-dashed bg-background p-5">
          <p className="text-base font-medium text-foreground">
            {estate.layouts.length === 0
              ? "Upload estate plan"
              : "Upload new version"}
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <EstatePlanUploadForm
              estateId={estate.id}
              estateSlug={estate.slug}
            />
          </div>
        </div>
        {estate.layouts.map((layout) => (
          <div className="border bg-background p-5" key={layout.id}>
            <p className="text-base font-medium text-foreground">
              Version {layout.version}
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <Badge variant="outline">{layout.status}</Badge>
              <p className="line-clamp-2 break-all">{layout.sourceUrl}</p>
            </div>
          </div>
        ))}
      </div>
    </EstateSection>
  );
}

function EstateOfferCards({
  activeListings,
  estate,
  estateReturnPath,
}: {
  activeListings: EstateProperty[];
  estate: EstateDetail;
  estateReturnPath: string;
}) {
  return (
    <EstateSection
      actions={
        <OpenPropertySheet
          defaults={{
            estateId: estate.id,
            location: estate.location,
            returnTo: estateReturnPath,
            type: "land",
          }}
        />
      }
      description="Flyer-style cards for the active listings buyers compare by size, price, quantity, and payment terms."
      title="Offer cards"
    >
      {activeListings.length === 0 ? (
        <div className="border bg-background px-5 py-8 text-center text-sm text-muted-foreground">
          No active offers yet. Add estate listings to generate offer cards.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeListings.map((property) => (
            <EstateOfferCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </EstateSection>
  );
}

function EstateOfferCard({ property }: { property: EstateProperty }) {
  const paymentPlans = parsePaymentPlans(property);

  return (
    <article className="overflow-hidden border bg-background">
      {property.imageUrl ? (
        <div
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${property.imageUrl})` }}
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-muted text-sm text-muted-foreground">
          No image
        </div>
      )}
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-warning">
              Estate land price
            </p>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {property.price ?? "-"}
            </p>
          </div>
          {property.specs ? (
            <Badge variant="secondary">{property.specs}</Badge>
          ) : null}
        </div>
        <div>
          <Link
            className="font-medium underline-offset-2 hover:underline"
            href={`/properties?propertyId=${property.id}&details=true`}
          >
            {property.title}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            {property.subType ?? property.type ?? "Estate listing"}
          </p>
        </div>
        <div className="border border-border bg-card p-4 text-sm transition-all duration-300">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-foreground">Payment plan</p>
            {paymentPlans.length > 1 ? (
              <Badge variant="outline">{paymentPlans.length} options</Badge>
            ) : null}
          </div>
          <PaymentPlanTable plans={paymentPlans} />
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">Qty available</span>
          <span className="font-medium text-foreground">
            {property.quantityAvailable != null
              ? `${property.quantityAvailable} units`
              : "-"}
          </span>
        </div>
      </div>
    </article>
  );
}

function EstateInventoryTable({
  estate,
  estateReturnPath,
}: {
  estate: EstateDetail;
  estateReturnPath: string;
}) {
  return (
    <EstateSection
      actions={
        <OpenPropertySheet
          defaults={{
            estateId: estate.id,
            location: estate.location,
            returnTo: estateReturnPath,
            type: "land",
          }}
        />
      }
      description="The operational table for every listing connected to this launch."
      title="Grouped land inventory"
    >
      <div className="overflow-hidden border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estate.properties.length === 0 ? (
              <TableRow>
                <TableCell
                  className="px-5 py-8 text-center text-sm text-muted-foreground"
                  colSpan={6}
                >
                  No land listings or mapped plots have been added yet.
                </TableCell>
              </TableRow>
            ) : (
              estate.properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <Link
                      className="underline-offset-2 hover:underline"
                      href={`/properties?propertyId=${property.id}&details=true`}
                    >
                      {property.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {[property.subType, property.specs]
                      .filter(Boolean)
                      .join(" - ") || "-"}
                  </TableCell>
                  <TableCell>
                    {property.quantityAvailable != null
                      ? `${property.quantityAvailable} units`
                      : "-"}
                  </TableCell>
                  <TableCell>{formatPaymentSummary(property)}</TableCell>
                  <TableCell>{property.price ?? "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant[property.status] ?? "outline"}
                    >
                      {property.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </EstateSection>
  );
}

function EstatePurchasePipeline({ reservations }: { reservations: number }) {
  return (
    <EstateSection
      description="Reservation workflow scaffold for enquiries, deposits, allocation, and document follow-up."
      title="Purchase pipeline"
    >
      <div className="grid gap-3 md:grid-cols-5">
        {[
          { label: "Enquiry", value: 0 },
          { label: "Reserved", value: reservations },
          { label: "Deposit", value: 0 },
          { label: "Allocated", value: 0 },
          { label: "Closed", value: 0 },
        ].map((stage) => (
          <div className="border border-border bg-card p-4" key={stage.label}>
            <p className="text-xs text-muted-foreground">{stage.label}</p>
            <p className="mt-2 text-xl font-medium text-foreground">
              {stage.value}
            </p>
          </div>
        ))}
      </div>
    </EstateSection>
  );
}
