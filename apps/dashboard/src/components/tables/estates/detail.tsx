"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import type { inferRouterOutputs } from "@trpc/server";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DownloadIcon, ExternalLinkIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";
import { EstatePlanUploadForm } from "@/components/forms/estate-plan-upload-form";
import { EstateLaunchDetailsSheet } from "@/components/sheets/estate-launch-details-sheet";
import { PropertySheet } from "@/components/sheets/property-sheet";
import { useTRPC } from "@/trpc/client";
import { getEstatePublishVariant } from "./columns";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type EstateDetail = NonNullable<RouterOutputs["workspace"]["getEstateDetail"]>;
type EstateProperty = EstateDetail["properties"][number];

type EstateDetailTableProps = {
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
    <div className="mt-3 overflow-hidden rounded-md border border-border/60">
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
          {plans.map((plan, index) => (
            <TableRow
              className="hover:bg-transparent"
              key={`${plan.months}-${index}`}
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

export function EstateDetailTable({ slug }: EstateDetailTableProps) {
  const trpc = useTRPC();
  const { data: estate } = useSuspenseQuery(
    trpc.workspace.getEstateDetail.queryOptions({ slug }),
  );

  if (!estate) {
    return (
      <DashboardEmptyState
        actions={
          <Button asChild>
            <Link href="/estates">Back to launches</Link>
          </Button>
        }
        description="This estate launch may have been deleted, archived, or opened from an old link."
        icon={<MapPinIcon className="size-5" />}
        title="Estate launch not found"
      />
    );
  }

  const statusCounts = estate.properties.reduce<Record<string, number>>(
    (counts, property) => {
      counts[property.status] = (counts[property.status] ?? 0) + 1;
      return counts;
    },
    {},
  );
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
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Estate launch</DashboardPageEyebrow>
            <DashboardPageTitle>{estate.title}</DashboardPageTitle>
            <DashboardPageDescription>
              {[estate.location, estate.phaseLabel].filter(Boolean).join(" - ")}
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Badge variant={getEstatePublishVariant(estate.publishState)}>
              {estate.publishState}
            </Badge>
            <Button asChild size="sm" variant="outline">
              <Link href="/estates">Back to launches</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/properties?type=land">Land listings</Link>
            </Button>
            <EstateLaunchDetailsSheet estate={estate} />
            <PropertySheet
              defaults={{
                estateId: estate.id,
                location: estate.location,
                returnTo: estateReturnPath,
                type: "land",
              }}
              label="Add listing"
              mode="create"
            />
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-4">
        {[
          { label: "Listings", value: estate.properties.length },
          { label: "Active offers", value: statusCounts.active ?? 0 },
          {
            label: "Sold / Off-market",
            value: (statusCounts.sold ?? 0) + (statusCounts.off_market ?? 0),
          },
          { label: "Purchase requests", value: estate._count.reservations },
        ].map((stat) => (
          <Card className="border-border/70 bg-card/82" key={stat.label}>
            <CardContent className="px-5 py-5">
              <p className="text-xs uppercase text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </DashboardStatGrid>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Launch brief</DashboardSectionTitle>
            <DashboardSectionDescription>
              Buyer-facing estate context: location, landmarks, title trust, and
              the presale promise.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className="overflow-hidden border-border/70 bg-card/82">
            {estate.heroImageUrl ? (
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: `url(${estate.heroImageUrl})` }}
              />
            ) : null}
            <CardContent className="space-y-5 px-6 py-6">
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
                <div className="rounded-lg border border-border/60 bg-background/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <MapPinIcon className="size-4" />
                    Location
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {estate.location ?? "No location added"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/50 p-4">
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
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/82">
            <CardHeader>
              <CardTitle className="text-base">Launch assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {estate.brochureUrl ? (
                <Button
                  asChild
                  className="w-full justify-between"
                  variant="outline"
                >
                  <a href={estate.brochureUrl} rel="noreferrer" target="_blank">
                    Open brochure
                    <ExternalLinkIcon className="size-4" />
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
                  className="w-full justify-between"
                  variant="outline"
                >
                  <a
                    href={estate.layouts[0].sourceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Latest estate plan
                    <DownloadIcon className="size-4" />
                  </a>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </DashboardSection>

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
      <EstateInventoryTable estate={estate} estateReturnPath={estateReturnPath} />
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
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Estate features</DashboardSectionTitle>
          <DashboardSectionDescription>
            The flyer details buyers scan before comparing plot sizes and
            payment options.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
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
          <Card className="border-border/70 bg-card/82" key={group.title}>
            <CardHeader>
              <CardTitle className="text-base">{group.title}</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardSection>
  );
}

function EstatePlanSection({ estate }: { estate: EstateDetail }) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Plan import</DashboardSectionTitle>
          <DashboardSectionDescription>
            Layout upload and visual mapping will attach estate plan versions to
            the land listings in this launch.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-dashed border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle className="text-base">
              {estate.layouts.length === 0
                ? "Upload estate plan"
                : "Upload new version"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <EstatePlanUploadForm
              estateId={estate.id}
              estateSlug={estate.slug}
            />
          </CardContent>
        </Card>
        {estate.layouts.map((layout) => (
          <Card className="border-border/70 bg-card/82" key={layout.id}>
            <CardHeader>
              <CardTitle className="text-base">
                Version {layout.version}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <Badge variant="outline">{layout.status}</Badge>
              <p className="line-clamp-2 break-all">{layout.sourceUrl}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardSection>
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
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Offer cards</DashboardSectionTitle>
          <DashboardSectionDescription>
            Flyer-style cards for the active listings buyers compare by size,
            price, quantity, and payment terms.
          </DashboardSectionDescription>
        </div>
        <PropertySheet
          defaults={{
            estateId: estate.id,
            location: estate.location,
            returnTo: estateReturnPath,
            type: "land",
          }}
          label="Add offer"
          mode="create"
        />
      </DashboardSectionHeader>
      {activeListings.length === 0 ? (
        <Card className="border-border/70 bg-card/82">
          <CardContent className="px-5 py-8 text-center text-sm text-muted-foreground">
            No active offers yet. Add estate listings to generate offer cards.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeListings.map((property) => (
            <EstateOfferCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </DashboardSection>
  );
}

function EstateOfferCard({ property }: { property: EstateProperty }) {
  const paymentPlans = parsePaymentPlans(property);

  return (
    <Card className="overflow-hidden border-border/70 bg-card/82">
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
      <CardContent className="space-y-4 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-amber-600">
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
            href={`/properties/${property.id}`}
          >
            {property.title}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            {property.subType ?? property.type ?? "Estate listing"}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/50 p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-foreground">Payment plan</p>
            {paymentPlans.length > 1 ? (
              <Badge variant="outline">{paymentPlans.length} options</Badge>
            ) : null}
          </div>
          <PaymentPlanTable plans={paymentPlans} />
        </div>
        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm">
          <span className="text-muted-foreground">Qty available</span>
          <span className="font-medium text-foreground">
            {property.quantityAvailable != null
              ? `${property.quantityAvailable} units`
              : "-"}
          </span>
        </div>
      </CardContent>
    </Card>
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
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Grouped land inventory</DashboardSectionTitle>
          <DashboardSectionDescription>
            The operational table for every listing connected to this launch.
          </DashboardSectionDescription>
        </div>
        <PropertySheet
          defaults={{
            estateId: estate.id,
            location: estate.location,
            returnTo: estateReturnPath,
            type: "land",
          }}
          label="Add land listing"
          mode="create"
        />
      </DashboardSectionHeader>
      <Card className="overflow-hidden border-border/70 bg-card/82">
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
                      href={`/properties/${property.id}`}
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
      </Card>
    </DashboardSection>
  );
}

function EstatePurchasePipeline({ reservations }: { reservations: number }) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Purchase pipeline</DashboardSectionTitle>
          <DashboardSectionDescription>
            Reservation workflow scaffold for enquiries, deposits, allocation,
            and document follow-up.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <div className="grid gap-3 md:grid-cols-5">
        {[
          { label: "Enquiry", value: 0 },
          { label: "Reserved", value: reservations },
          { label: "Deposit", value: 0 },
          { label: "Allocated", value: 0 },
          { label: "Closed", value: 0 },
        ].map((stage) => (
          <Card className="border-border/70 bg-card/82" key={stage.label}>
            <CardContent className="px-4 py-4">
              <p className="text-xs uppercase text-muted-foreground">
                {stage.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {stage.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardSection>
  );
}
