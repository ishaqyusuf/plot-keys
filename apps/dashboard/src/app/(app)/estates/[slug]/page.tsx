import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { DownloadIcon, ExternalLinkIcon, MapPinIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DashboardPage,
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
} from "../../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../../lib/session";
import { PropertyForm } from "../../properties/property-form";
import { EstateLaunchDetailsForm } from "./estate-launch-details-form";
import { EstatePlanUploadForm } from "./estate-plan-upload-form";

type EstateDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ error?: string }>;
};

const publishVariant: Record<string, "default" | "outline" | "secondary"> = {
  archived: "secondary",
  draft: "outline",
  published: "default",
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
    ? `${details.join(" · ")} + ${plans.length - 1} more`
    : details.join(" · ");
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

export default async function EstateDetailPage({
  params,
  searchParams,
}: EstateDetailPageProps) {
  const session = await requireOnboardedSession();
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const prisma = createPrismaClient().db;

  if (!prisma) return notFound();

  const estate = await prisma.estate.findFirst({
    include: {
      layouts: {
        orderBy: [{ version: "desc" }, { createdAt: "desc" }],
        take: 3,
      },
      properties: {
        orderBy: [{ createdAt: "desc" }],
        take: 200,
        where: { deletedAt: null },
      },
      plots: {
        orderBy: [{ plotCode: "asc" }, { createdAt: "asc" }],
        take: 200,
        where: { deletedAt: null },
      },
      _count: {
        select: {
          reservations: true,
        },
      },
    },
    where: {
      companyId: session.activeMembership.companyId,
      deletedAt: null,
      slug,
    },
  });

  if (!estate) return notFound();

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

  return (
    <DashboardPage>
      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Estate launch</DashboardPageEyebrow>
            <DashboardPageTitle>{estate.title}</DashboardPageTitle>
            <DashboardPageDescription>
              {[estate.location, estate.phaseLabel].filter(Boolean).join(" · ")}
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Badge variant={publishVariant[estate.publishState] ?? "outline"}>
              {estate.publishState}
            </Badge>
            <Button asChild size="sm" variant="outline">
              <Link href="/estates">Back to launches</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/properties?type=land">Land listings</Link>
            </Button>
            <EstateLaunchDetailsForm estate={estate} />
            <PropertyForm
              mode="create"
              label="Add listing"
              defaults={{
                estateId: estate.id,
                location: estate.location,
                returnTo: `/estates/${estate.slug}`,
                type: "land",
              }}
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
          <Card key={stat.label} className="border-border/70 bg-card/82">
            <CardContent className="px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
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
                  <Badge
                    variant={publishVariant[estate.publishState] ?? "outline"}
                  >
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
                      ? landmarks.join(" · ")
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
            <Card key={group.title} className="border-border/70 bg-card/82">
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

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Plan import</DashboardSectionTitle>
            <DashboardSectionDescription>
              Layout upload and visual mapping will attach estate plan versions
              to the land listings in this launch.
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
            <Card key={layout.id} className="border-border/70 bg-card/82">
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

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Offer cards</DashboardSectionTitle>
            <DashboardSectionDescription>
              Flyer-style cards for the active listings buyers compare by size,
              price, quantity, and payment terms.
            </DashboardSectionDescription>
          </div>
          <PropertyForm
            mode="create"
            label="Add offer"
            defaults={{
              estateId: estate.id,
              location: estate.location,
              returnTo: `/estates/${estate.slug}`,
              type: "land",
            }}
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
            {activeListings.map((property) => {
              const paymentPlans = parsePaymentPlans(property);

              return (
                <Card
                  key={property.id}
                  className="overflow-hidden border-border/70 bg-card/82"
                >
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
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
                          Estate land price
                        </p>
                        <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                          {property.price ?? "-"}
                        </p>
                      </div>
                      {property.specs ? (
                        <Badge variant="secondary">{property.specs}</Badge>
                      ) : null}
                    </div>
                    <div>
                      <Link
                        href={`/properties/${property.id}`}
                        className="font-medium underline-offset-2 hover:underline"
                      >
                        {property.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {property.subType ?? property.type ?? "Estate listing"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-background/50 p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-foreground">
                          Payment plan
                        </p>
                        {paymentPlans.length > 1 ? (
                          <Badge variant="outline">
                            {paymentPlans.length} options
                          </Badge>
                        ) : null}
                      </div>
                      <PaymentPlanTable plans={paymentPlans} />
                    </div>
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm">
                      <span className="text-muted-foreground">
                        Qty available
                      </span>
                      <span className="font-medium text-foreground">
                        {property.quantityAvailable != null
                          ? `${property.quantityAvailable} units`
                          : "-"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>
              Grouped land inventory
            </DashboardSectionTitle>
            <DashboardSectionDescription>
              The operational table for every listing connected to this launch.
            </DashboardSectionDescription>
          </div>
          <PropertyForm
            mode="create"
            label="Add land listing"
            defaults={{
              estateId: estate.id,
              location: estate.location,
              returnTo: `/estates/${estate.slug}`,
              type: "land",
            }}
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
                    colSpan={6}
                    className="px-5 py-8 text-center text-sm text-muted-foreground"
                  >
                    No land listings or mapped plots have been added yet.
                  </TableCell>
                </TableRow>
              ) : (
                estate.properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/properties/${property.id}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {property.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {[property.subType, property.specs]
                        .filter(Boolean)
                        .join(" · ") || "-"}
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
            { label: "Reserved", value: estate._count.reservations },
            { label: "Deposit", value: 0 },
            { label: "Allocated", value: 0 },
            { label: "Closed", value: 0 },
          ].map((stage) => (
            <Card key={stage.label} className="border-border/70 bg-card/82">
              <CardContent className="px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
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
    </DashboardPage>
  );
}
